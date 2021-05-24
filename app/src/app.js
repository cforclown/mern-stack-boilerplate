import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { toast, ToastContainer } from "react-toastify";

const Login = React.lazy(() => import("./pages/login"));
const Home = React.lazy(() => import("./pages/home"));
const Page404 = React.lazy(() => import("./pages/error/404"));

import { Loader } from "./components/loader";
import { SetSession } from "./reducer/actions.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";



const cookies = new Cookies();

function App(props) {
    //#region COMPONENT STATEs
    const isMounted=useRef(false);
    
    const dispatch = useDispatch();
    const session = useSelector((state) => state.session);

    const [state, _setState] = useState({
        isLoading: false,
        isError: false,
    });
    function setState(newState){
        if(!isMounted.current) return;
        _setState(newState);
    }
    //#endregion


    //#region DIDMOUNT
    useEffect(async () => {
        isMounted.current=true;

        if (!session) {
            if (cookies.get(process.env.SESSION_TAG)) {
                try {
                    const cookieSession = cookies.get(process.env.SESSION_TAG);
                    dispatch(SetSession(cookieSession))
                    setState({ ...state, isLoading: false, isError:false });
                }
                catch (error) {
                    console.log(error.message)
                    toast.error(error.message)
                    setState({ ...state, isLoading: false });
                    const redirectPath = props.location ? props.location.pathname : "/";
                    props.history.push({
                        pathname: "/login",
                        state: { redirectPath: redirectPath },
                    });
                }
            }
            else {
                setState({ ...state, isLoading: false });
                const redirectPath = props.location ? props.location.pathname : "/";
                props.history.push({
                    pathname: "/login",
                    state: { redirectPath: redirectPath },
                });
            }
        }
        else
            setState({ ...state, isLoading: false });

        // UNMOUNT
        return ()=>{ isMounted.current=false; }
    }, []);
    //#endregion



    if (state.isLoading)
        return Loader;
    return (
        <>
            <React.Suspense fallback={Loader}>
                <Switch>
                    <Redirect exact from="/" to="/dashboard" />
                    <Route exact path="/login" name="Login" render={(props) => <Login {...props} />} />
                    <Route exact path="/404" name="404" render={(props) => <Page404 {...props} />} />
                    <Route path="/" name="Home" render={(props) => <Home {...props} />} />
                </Switch>
            </React.Suspense>
            <ToastContainer autoClose={3000} hideProgressBar />
        </>
    );
}

App.propTypes = {
    location: PropTypes.any,
    history: PropTypes.any,
};

export default withRouter(App);
