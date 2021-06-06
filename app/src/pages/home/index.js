import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import Loader from "../../components/loader";
import UserAvatar from "../../components/user-avatar";
import Request from "../../request";
import { SetUserAvatar } from "../../reducer/actions";

import "./index.scss";

function Home(props) {
    //#region COMPONENT STATEs
    const dispatch = useDispatch();
    const userData = useSelector((state) => (state.session ? state.session.userData : null));
    const [isLoading, setIsLoading] = useState(false);
    const [onEdit, setOnEdit] = useState(null);
    const [profile, setProfile] = useState(null);
    const [avatar, setAvatar] = useState(userData.avatar);

    const avatarInputRef = useRef();

    useEffect(() => {
        getUserProfile(userData.userId);
        setAvatar(userData.avatar);
    }, [userData]);

    async function getUserProfile(userId) {
        try {
            setIsLoading(true);
            const profile = await Request("/user/profile/" + userId);

            setProfile({
                ...profile,
                userId: profile._id,
            });
            setIsLoading(false);
        } catch (err) {
            if (err.isUnauthorized) return history.push("/login");

            toast.error(err.message);
            setIsLoading(false);
        }
    }
    async function updateUserProfile(newProfile) {
        try {
            setIsLoading(true);
            await Request("/user/profile", {
                method: "PUT",
                body: JSON.stringify(newProfile),
            });

            toast.success("Profile updated");

            setOnEdit(null);
            getUserProfile(userData.userId);
        } catch (err) {
            if (err.isUnauthorized) return history.push("/login");

            toast.error(err.message);
            setIsLoading(false);
        }
    }
    async function changeAvatar(avatarData) {
        try {
            setIsLoading(true);
            const avatar = await Request("/user/profile/avatar", {
                method: "PUT",
                body: JSON.stringify(avatarData),
            });

            toast.success("Avatar updated");

            dispatch(SetUserAvatar(avatar));
            setIsLoading(false);
        } catch (err) {
            if (err.isUnauthorized) {
                history.push("/login");
                return;
            }

            toast.error(err.message);
            setIsLoading(false);
        }
    }

    function onSaveProfileClick() {
        if (!onEdit.email || onEdit.email === "") return toast.error("Email is empty");
        if (!onEdit.fullname || onEdit.fullname === "") return toast.error("Fullname is empty");

        updateUserProfile({
            // _id: profile._id,
            email: onEdit.email,
            fullname: onEdit.fullname,
        });
    }
    function onBrowseAvatarClick() {
        avatarInputRef.current.click();
    }
    function onAvatarFileSelected(e) {
        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const bstr = e.target.result;

                    const avatarData = {
                        file: bstr,
                        filename: files[0].name,
                    };

                    changeAvatar(avatarData);
                } catch (err) {
                    console.log(err.message);
                    toast.error(err.message);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    }
    function onLogoutClick() {
        if (!props.history) return;
        props.history.push("/login");
    }

    return (
        <div id="ha-home">
            <div id="ha-home-navbar">
                <div className="ha-home-navbar-left"></div>
                <div className="ha-home-navbar-center"></div>
                <div className="ha-home-navbar-right">
                    <UserAvatar fullname={profile ? profile.fullname : ""} avatar={avatar ? avatar : null} size={32} />
                </div>
            </div>

            <div id="ha-home-content">
                <div className="ha-profile mb-4">
                    <div className="ha-profile-avatar">
                        <UserAvatar
                            fullname={profile ? profile.fullname : ""}
                            avatar={avatar ? avatar : null}
                            size={120}
                        />
                        <div className="ha-profile-avatar-camera-btn">
                            <button type="button" className="btn btn-secondary" onClick={onBrowseAvatarClick}>
                                <FontAwesomeIcon icon={faCamera} />
                            </button>
                        </div>

                        {/* INPUT FILE (CHANGE AVATAR)*/}
                        <div className="d-flex flex-row">
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
                        <h2 className="ha-profile-details-username mb-4">@{profile ? profile.username : ""}</h2>

                        <h6>Email</h6>
                        <input
                            type="text"
                            value={onEdit ? onEdit.email : profile ? profile.email : ""}
                            onChange={(e) => {
                                if (!onEdit) return;

                                setOnEdit({
                                    ...onEdit,
                                    email: e.target.value,
                                });
                            }}
                            disabled={onEdit ? false : true}
                        />

                        <h6>Fullname</h6>
                        <input
                            type="text"
                            value={onEdit ? onEdit.fullname : profile ? profile.fullname : ""}
                            onChange={(e) => {
                                if (!onEdit) return;

                                setOnEdit({
                                    ...onEdit,
                                    fullname: e.target.value,
                                });
                            }}
                            disabled={onEdit ? false : true}
                        />

                        {onEdit ? (
                            <div className="d-flex flex-row align-items-center">
                                <input
                                    type="submit"
                                    value="SAVE"
                                    onClick={onSaveProfileClick}
                                    style={{ margin: "0 16px 0 0" }}
                                />
                                <input
                                    className="ha-home-cancel-btn"
                                    type="submit"
                                    value="CANCEL"
                                    onClick={() => setOnEdit(null)}
                                />
                            </div>
                        ) : (
                            <div className="d-flex flex-row justify-content-center align-items-center">
                                <input
                                    type="submit"
                                    value="EDIT"
                                    onClick={() => {
                                        if (!profile) return;
                                        setOnEdit({
                                            email: profile.email,
                                            fullname: profile.fullname,
                                        });
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {isLoading || !profile ? (
                        <div className="ha-home-loader-container">
                            <Loader />
                        </div>
                    ) : null}
                </div>

                <div className="ha-actions">
                    <input className="ha-home-cancel-btn" type="submit" value="LOGOUT" onClick={onLogoutClick} />
                </div>
            </div>
        </div>
    );
}

const photoFormats = ["jpg", "jpeg", "png"].map((x) => "." + x).join(",");

export default Home;
