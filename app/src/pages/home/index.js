import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';

import UserAvatar from '../../components/user-avatar'
import Request from '../../request'
import { SetUserAvatar } from '../../reducer/actions'

import './index.scss'



function Home(props) {
    //#region COMPONENT STATEs
    const dispatch = useDispatch();
    const userData = useSelector((state)=>state.session?state.session.userData:null);
    const [avatar, setAvatar]=useState(userData.avatar);

    const avatarInputRef=useRef();



    useEffect(() => {
        setAvatar(userData.avatar);
    }, [userData])



    async function changeAvatar(avatarData){
        try{
            const avatar=await Request("/user/avatar", {
                method: 'PUT',
                body: JSON.stringify({avatarData}),
            });

            dispatch(SetUserAvatar(avatar));
        }
        catch(err){
            if(err.isUnauthorized){
                history.push('/login');
                return;
            }

            toast.error(err.message);
        }
    }



    function onBrowseAvatarClick(){
        avatarInputRef.current.click();
    }
    function onAvatarFileSelected(e) {
        const files = e.target.files;
        if (files && files[0]){
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const bstr = e.target.result;

                    const avatarData = {
                        file: bstr,
                        filename: files[0].name,
                    };
                    
                    changeAvatar(avatarData);
                }
                catch (err) {
                    console.log(err.message);
                    toast.error(err.message);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    }
    function onLogoutClick(){
        if(!props.history)
            return;
        props.history.push("/login");
    }



    return (
        <div id="ha-home">
            <div id="ha-home-navbar">
                <div className='ha-home-navbar-left'>

                </div>
                <div className='ha-home-navbar-center'>
                    
                </div>
                <div className='ha-home-navbar-right'>
                    <UserAvatar 
                        fullname={userData?userData.fullname:""}
                        avatar={userData?userData.avatar:null}
                        size={32}
                    />
                </div>
            </div>

            <div id="ha-home-content">
                <div className="ha-profile mb-4">
                    <div className="ha-profile-avatar" >
                        <UserAvatar 
                            fullname={userData?userData.fullname:""}
                            avatar={avatar?avatar:null}
                            size={120}
                        />
                        <div className="ha-profile-avatar-camera-btn">
                            <button type="button" className="btn btn-secondary" onClick={onBrowseAvatarClick} >
                                <FontAwesomeIcon icon={faCamera} />
                            </button>
                        </div>

                        {/* INPUT FILE (CHANGE AVATAR)*/}
                        <div className='d-flex flex-row'>
                            <input
                                type="file"
                                className="form-control"
                                style={{ visibility: "collapse", width: 0, height: 0 }}
                                accept={photoFormats}
                                onChange={onAvatarFileSelected}
                                multiple={false}
                                ref={avatarInputRef}
                            />
                        </div>
                    </div>

                    <div className="ha-profile-details">
                        <h6>Username</h6>
                        <input value={userData?userData.username:""} type="text" disabled />

                        <h6>Fullname</h6>
                        <input value={userData?userData.fullname:""} type="text" disabled />

                        <h6>Email</h6>
                        <input value={userData?userData.email:""} type="text" disabled />
                    </div>
                </div>

                <div className="ha-actions">
                    <input className="ha-home-cancel-btn" type='submit' value='LOGOUT' onClick={onLogoutClick} />
                </div>
            </div>
        </div>
    );
}

const photoFormats = ["jpg", "jpeg", "png"].map((x) => "." + x).join(",");

export default Home;
