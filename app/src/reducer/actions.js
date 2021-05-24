import ActionTypes from './action-types'



export function SetSession(session){
    return {
        type:ActionTypes.SET_SESSION,
        param:{session}
    }
}
export function DeleteSession(){
    return {
        type:ActionTypes.DELETE_SESSION,
        param:null,
    }
}
export function SetUserAvatar(avatar){
    return {
        type:ActionTypes.SET_USER_AVATAR,
        param:{avatar}
    }
}
export function SetUserData(userData){
    return {
        type:ActionTypes.SET_USER_DATA,
        param:{userData}
    }
}
export function SetUserRole(roleData){
    return {
        type:ActionTypes.SET_USER_ROLE,
        param:{roleData}
    }
}