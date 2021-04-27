import React, { useContext } from 'react'
import ProfilePic from './ProfilePic';
import UserContext from '../../context/UserContext';
import { toast } from 'react-toastify';


export default function ContentDetails({
    profilePicSrc,
    onProfileClick,
    username,
    date
}) {
    const { currentUser} = useContext(UserContext);

    return (
        <div className="content-details">
            <ProfilePic src={profilePicSrc} onClick={() => {
                currentUser ? onProfileClick() :
                toast('Log in to view user profiles')
            }}/>
            <span className="inline-block user-date">
                <span className="username">{ username }</span> <br/>
                <span className="date">{ date.toDateString() }</span>
            </span>
        </div>
    )
}