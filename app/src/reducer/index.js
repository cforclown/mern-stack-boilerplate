import Cookies from 'universal-cookie'

import ActionTypes from "./action-types";
import { SetUserSession } from "../request/auth";



const cookies = new Cookies()

const initialState = {
    session: null,
    role: null,
};

const Reducer = (state = initialState, action) => {
    if (action.type === ActionTypes.SET_SESSION) {
        SetUserSession(action.param.session);
        cookies.set(process.env.SESSION_TAG, JSON.stringify(action.param.session), { 
            path: process.env.SESSION_PATH, 
            maxAge: action.param.session.expiredIn?action.param.session.expiredIn:5400, 
        })

        return { 
            ...state, 
            session: action.param.session 
        };
    }
    else if (action.type === ActionTypes.DELETE_SESSION) {
        cookies.remove(process.env.SESSION_TAG, { path: process.env.SESSION_PATH });
        return { 
            ...state, 
            session: null 
        };
    }
    else if (action.type === ActionTypes.SET_USER_DATA) {
        if(!state.session)
            return state;
        if(!state.session.userData)
            return state;
        if(!action.param || !action.param.userData)
            return state;

        const session=JSON.parse(JSON.stringify(state.session));
        const userData=session.userData;
        userData.username=action.param.userData.username;
        userData.email=action.param.userData.email;
        userData.fullname=action.param.userData.fullname;
        
        cookies.set(process.env.SESSION_TAG, JSON.stringify(session), { 
            path: process.env.SESSION_PATH, 
            maxAge: session.expiredIn?session.expiredIn:5400, 
        })
        
        return { ...state, session };
    }
    else if (action.type === ActionTypes.SET_USER_AVATAR) {
        if(!state.session)
            return state;
        if(!state.session.userData)
            return state;

        const session=JSON.parse(JSON.stringify(state.session));
        session.userData.avatar=action.param.avatar
        
        cookies.set(process.env.SESSION_TAG, JSON.stringify(session), { 
            path: process.env.SESSION_PATH, 
            maxAge: session.expiredIn?session.expiredIn:5400, 
        })
        
        return { ...state, session };
    }
    else if (action.type === ActionTypes.SET_USER_ROLE) {
        if(!state.session)
            return state;
        if(!action.param || !action.param.roleData)
            return state;

        const session=JSON.parse(JSON.stringify(state.session));
        session.role=action.param.roleData;
        
        cookies.set(process.env.SESSION_TAG, JSON.stringify(session), { 
            path: process.env.SESSION_PATH, 
            maxAge: session.expiredIn?session.expiredIn:5400, 
        })
        
        return { ...state, session };
    }
    else
        return state;
};

export default Reducer;
