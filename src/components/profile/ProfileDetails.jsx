import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProfilePic from '../common/ProfilePic';
import UserContext from '../../context/UserContext';
import Button from '../common/Button';
import { FaPencilAlt } from 'react-icons/fa';


class ProfileDetails extends Component {

    static contextType = UserContext

    render() { 
        const { user, onFollow, isFollowing } = this.props;
        const { currentUser } = this.context;
        const sameUser = currentUser._id === user._id;
        return (
            <div className="profile-details">
                <div className="content-details">
                    <ProfilePic src={ user.profilePic } />
                    <span className="username">{ user.username + (sameUser ? ' (Me)' : '' )} </span>
                </div>
                {
                    sameUser ?
                    <Link to="/profile/edit"> 
                        <FaPencilAlt />
                    </Link> :
                    <Button 
                    styles={['outline']}
                    size="small"
                    onClick={() => onFollow(user._id)}>
                        { isFollowing ? 'Unfollow' : 'Follow' }
                    </Button>

                    }
            </div>
        );
    }
}
 
export default ProfileDetails;