import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

import * as AuthRequest from '../../request/auth'
import { SetSession } from '../../reducer/actions'

import './index.css'

function Login({ history }) {
    const isMounted=useRef(false);

    const dispatch=useDispatch()

    const [state, _setState]=useState({
        isLogin:true,
        isLoading:false,
    })
    function setState(newstate){
        if(!isMounted.current) return;
        _setState(newstate);
    }
    const [loginData, setLoginData]=useState({
        username:'',
        password:'',
    })
    const [registerData, setRegisterData]=useState({
        username: '',
        email: '',
        fullname: '',
        password: '',
        confirmPassword:'',
    })

    useEffect(()=>{
        isMounted.current=true;

        return ()=>{
            isMounted.current=false;
        }
    })



    async function onSubmitLoginClick(e){
        e.preventDefault();

        if(!loginData.username || loginData.username.trim()===''){
            toast.error('Please fill in the username field');
            return
        }
        if(!loginData.password || loginData.password.trim()===''){
            toast.error('Please fill in the password field');
            return
        }

        try{
            setState({...state, isLoading:true});

            const tokenData=await AuthRequest.Login(loginData.username, loginData.password);
            dispatch(SetSession(tokenData));

            history.push('/dashboard');

            setState({...state, isLoading:false});
        }
        catch(err){
            toast.error(err.message);
            setState({...state, isLoading:false});
        }
    }
    async function onSubmitRegisterClick(e){
        e.preventDefault();

        if(
            !registerData.username || registerData.username.trim()==='' || 
            !registerData.email || registerData.email.trim()==='' ||
            !registerData.fullname || registerData.fullname.trim()==='' ||
            !registerData.password || registerData.password.trim()==='' ||
            !registerData.confirmPassword || registerData.confirmPassword.trim()===''
        ){
            toast.error('Please complete all fields');
            return
        }

        try{
            setState({...state, isLoading:true});

            const tokenData=await AuthRequest.Register({...registerData});
            dispatch(SetSession(tokenData));

            history.push('/dashboard');
            
            setState({...state, isLoading:false});
        }
        catch(err){
            toast.error(err.message);
            setState({...state, isLoading:false});
        }
    }
    function onKeyDown(e) {
        if (e.key !== "Enter") return;
        onSubmitLoginClick(e);
    }

    function onForgotPasswordClick(e){
        e.preventDefault();
        toast.warning('COMING SOON')
    }
    function onRegisterClick(e){
        e.preventDefault();
        setRegisterData({
            ...registerData,
            username: '',
            email: '',
            fullname: '',
            password: '',
            confirmPassword:'',
        })
        setState({...state, isLogin:false,})
    }
    function onLoginClick(e){
        e.preventDefault();
        setLoginData({
            ...loginData,
            username:'',
            password:'',
        })
        setState({...state, isLogin:true,})
    }
    


    return (
        <div id="ha-login" className="ha-login-wrapper">
            <div id="form-content" className='fade-in-down'>
            {
                state.isLogin ?
                // LOGIN
                <>
                    <div className="fade-in first">
                        <h1 className='my-4'>Login</h1>
                    </div>
                    <div className="fade-in first my-4">
                        <FontAwesomeIcon className='ha-login-icon' icon={faUser} size='3x' color='#3a3a3a'/>
                    </div>

                    <div>
                        <input className="fade-in second" 
                            type="text" 
                            placeholder="login"
                            value={loginData.username}
                            onChange={e=>setLoginData({...loginData, username:e.target.value})} 
                            disabled={state.isLoading}
                        />
                        <input className="fade-in second mb-3"  
                            type="password"
                            placeholder="password" 
                            value={loginData.password} 
                            onChange={e=>setLoginData({...loginData, password:e.target.value})} 
                            onKeyDown={(e) => onKeyDown(e)}
                            disabled={state.isLoading}
                        />

                        <input  className="fade-in third"
                            type="submit" 
                            value="Log In" 
                            onChange={()=>{}}
                            onClick={e=>onSubmitLoginClick(e)} 
                            disabled={state.isLoading}
                        />
                    </div>

                    <div id="form-footer">
                        <a className="underline-hover" href="#" onClick={e=>onForgotPasswordClick(e)}>
                            Forgot Password?
                        </a>
                        <a className="underline-hover" href="#" onClick={e=>onRegisterClick(e)}>
                            Register
                        </a>
                    </div>
                </> :
                // REGISTER
                <>
                    <div className="fade-in first">
                        <h1 className='my-4'>Register</h1>
                    </div>
                    <div className="fade-in first my-4">
                        <FontAwesomeIcon className='ha-login-icon' icon={faUserPlus} size='3x' color='#3a3a3a'/>
                    </div>

                    <div>
                        <input className="fade-in" 
                            type="text" 
                            placeholder="username" 
                            value={registerData.username} 
                            onChange={e=>setRegisterData({...registerData, username:e.target.value})} 
                            disabled={state.isLoading}
                        />
                        <input className="fade-in" 
                            type="email" 
                            placeholder="email" 
                            value={registerData.email} 
                            onChange={e=>setRegisterData({...registerData, email:e.target.value})} 
                            disabled={state.isLoading}
                        />
                        <input className="fade-in" 
                            type="text" 
                            placeholder="Fullname" 
                            value={registerData.fullname} 
                            onChange={e=>setRegisterData({...registerData, fullname:e.target.value})} 
                            disabled={state.isLoading}
                        />
                        <input className="fade-in" 
                            type="password" 
                            placeholder="password" 
                            value={registerData.password} 
                            onChange={e=>setRegisterData({...registerData, password:e.target.value})} 
                            disabled={state.isLoading}
                        />
                        <input className="fade-in mb-3" 
                            type="password"
                            placeholder="confirm password" 
                            value={registerData.confirmPassword} 
                            onChange={e=>setRegisterData({...registerData, confirmPassword:e.target.value})} 
                            disabled={state.isLoading}
                        />

                        <input className="fade-in" 
                            type="submit" 
                            value="Register" 
                            onChange={()=>{}}
                            onClick={e=>onSubmitRegisterClick(e)} 
                            disabled={state.isLoading}
                        />
                    </div>

                    <div id="form-footer">
                        <a className="underline-hover" href="#"></a>
                        <a className="underline-hover" href="#" onClick={e=>onLoginClick(e)}>
                            Login
                        </a>
                    </div>
                </>
            }
            </div>
        </div>
    )
}

Login.propTypes={
    history: PropTypes.any
}

export default Login
