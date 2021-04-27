import React, { Component } from 'react';
import UserContext from '../../context/UserContext';
import ProfilePic from '../common/ProfilePic';
import { EditRow, EditRowWithFile } from './EditRow';
import { compress, readMedia } from '../../utils/media';
import { updateMe } from '../../services/userService';
import { BsChevronRight } from 'react-icons/bs';
import './ProfileEdit.css';


class ProfileEdit extends Component {
    static contextType = UserContext;

    goToUpdate = page => {
        this.props.history.push(`/profile/edit/${page}`);
    }

    handleProfilePicUpload = async file => {
        try {
            const profilePic = await readMedia(file);
            this.context.updateUser('profilePic', profilePic);
            const compressed = await compress(profilePic);
            await updateMe({ profilePic: compressed });
        } catch (ex) {
            if (ex.response)
                console.log('Error: ', ex.response);
            else
                console.log('Error: ', ex);
        }
        

    }

    render() { 
        // console.log('profileEdit render()');
        const { email, username, description, profilePic } = this.context.currentUser;
        const arrow = <BsChevronRight />
        return ( 
            <div className="page profile-edit-page">
                <div className="profile-edit__header">
                    My Profile
                </div>
                <EditRowWithFile
                label="Photo"
                text="Shown on your posts and comments"
                icon={<ProfilePic src={profilePic} onClick={() => {}}/>}
                className="edit-row profile-edit__photo clickable"
                extensions={['jpg', 'jpeg', 'gif', 'png']}
                maxFileSize={2}
                onFileChosen={this.handleProfilePicUpload}
                />
                
                <EditRow 
                label="Username"
                text={ username }
                icon={arrow}
                className="edit-row profile-edit__username clickable"
                onClick={() => this.goToUpdate('username')}
                />
                <EditRow 
                label="Email"
                text={ email }
                icon={arrow}
                className="edit-row profile-edit__email clickable"
                onClick={() => this.goToUpdate('email')}
                />
                <EditRow 
                label="Description"
                text={ description }
                icon={arrow}
                className="edit-row profile-edit__description clickable"
                onClick={() => this.goToUpdate('description')}
                />
                <EditRow 
                label="Password"
                text="Click to change"
                icon={arrow}
                className="edit-row profile-edit__password clickable"
                onClick={() => this.goToUpdate('password')}
                />
                
            </div>
         );
    }
}
 
export default ProfileEdit;