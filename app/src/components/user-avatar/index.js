import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import defaultAvatar from '../../assets/images/default-avatar.png'



const Container = styled.div`
    display: block;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    border-radius: 50%;
    padding: 0;
    img {
        width: ${(props) => props.size}px;
        height: ${(props) => props.size}px;
        border-radius: 50%;
        border: none;
        object-fit: cover;
    }
    svg {
        position: absolute;
        left: 0;
        top: 0;
    }
    h6 {
        margin: 0;
        font-size: ${(props) => props.size / 2}px;
    }
`;
const DefaultAvatar = styled.div`
    position: relative;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
`;
const DefaultAvatarUserInitial = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

function Avatar({ 
    className, 
    fullname, 
    avatar, 
    bg, 
    size 
}) {
    function isColorValid(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }
    function invertColor(hex, bw) {
        if (hex.indexOf("#") === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error("Invalid HEX color.");
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // http://stackoverflow.com/a/3943023/112731
            return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }
    function padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join("0");
        return (zeros + str).slice(-len);
    }



    function getAvatarUrl(avatarId){
        if(!avatarId)
            return null;

        return `${process.env.API_URL}/api/avatar/${avatarId}`;
    }



    return (
        <Container className={className ? className : ""} size={size}>
        {
            avatar ?
            <img src={getAvatarUrl(avatar)} onError={(e)=>{e.target.onerror = null; e.target.src=defaultAvatar}}/>
            :
            <DefaultAvatar size={size}>
                <svg width={size} height={size}>
                    <circle cx={size / 2} cy={size / 2} r={size / 2} fill={bg && isColorValid(bg) ? bg : "aqua"} />
                </svg>

                <DefaultAvatarUserInitial>
                    <h6 style={{ color: bg && isColorValid(bg) ? invertColor(bg) : "#3a3a3a" }}>
                        {fullname.split(" ").map((s) => s.charAt(0).toUpperCase())}
                    </h6>
                </DefaultAvatarUserInitial>
            </DefaultAvatar>
        }
        </Container>
    );
}

Avatar.propTypes = {
    fullname: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    bg: PropTypes.string,
    size: PropTypes.number.isRequired,
};
Avatar.defaultProps = {
    size: 48,
    bg: '#48dbfb',
};

export default Avatar;
