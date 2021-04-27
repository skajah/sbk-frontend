import React, { useState, useEffect, useContext } from 'react';
import Post from './Post';
import Button from '../common/Button';
import { updateMe } from '../../services/userService';
import { getFollowings } from '../../utils/following';
import UserContext from '../../context/UserContext'

const Posts = ({
    posts,
    onFollow,
    onLike,
    onPostClick,
    onProfileClick,
    onDelete,
    onLoadMore,
    loadMore,
    showComments,
    optionMenu,
    hideOptions
}) => {
    const [following, setFollowing] = useState({});
    const  { currentUser } = useContext(UserContext)

    useEffect(() => {
        async function doGetFollowings(){
            let following = await getFollowings(posts);
            if (showComments){
                following = {
                    ...following, 
                    ...await getFollowings(posts[0].comments)
                };
            }
            setFollowing(following);
        }

        currentUser && doGetFollowings();

    }, [posts, showComments, currentUser]);

    const handleFollow = async (userId) => {
        const newFollowing = {...following};
        const isFollowing = following[userId];
        await updateMe({ following: { id: userId, follow: !isFollowing } });
        if (isFollowing)
            delete newFollowing[userId];
        else
            newFollowing[userId] = 1;

        setFollowing(newFollowing);
    }

    return (
        <div className="posts">
            {
                posts.map(post => {
                    return (
                        <Post 
                        key={post._id}
                        post={post}
                        onPostClick={onPostClick}
                        onProfileClick={onProfileClick}
                        onDelete={onDelete}
                        onFollow={ 
                            (userId) => {
                                handleFollow(userId);
                                onFollow && onFollow(userId);
                            }
                        }
                        onLike={onLike}
                        following={following}
                        showComments={showComments}
                        optionMenu={optionMenu}
                        hideOptions={hideOptions}/>
                    )
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
}

export default Posts;