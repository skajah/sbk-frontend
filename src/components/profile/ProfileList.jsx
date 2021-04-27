import React from 'react';
import Button from '../common/Button';
import ProfileSimple from './ProfileSimple';

const ProfileList = ({
    loadMore,
    onLoadMore,
    users,
    onProfileClick
}) => {
    return (<div className="profile-list">
        {
            users.map(user => {
            return <ProfileSimple 
                    key={user._id} 
                    user={user} 
                    onClick={onProfileClick}/>
            })
        }
        {
            loadMore &&
            <div className="load-more-container">
                <Button
                color="secondary"
                size="small"
                onClick={onLoadMore}>
                    Load More
                </Button>
            </div>
        }
    </div>
    )
};

export default ProfileList;