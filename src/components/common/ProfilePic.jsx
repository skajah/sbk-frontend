import React from 'react';
import profileDefault from '../../images/profileDefault.jpg';

export default function ProfilePic({
    src,
    onClick
}) {
    return (
        <img 
        src={src || profileDefault} 
        alt="Profile Pic" 
        className="profile-pic clickable" 
        onClick={ () => {
            onClick && onClick()
        }}
        style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '100%',
            marginRight: '10px'
        }}/>
    );
}
