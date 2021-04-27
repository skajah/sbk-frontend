import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Posts  from '../posts/Posts';
import ProfileDetails from './ProfileDetails';
import TabNav from '../common/TabNav';
import UserContext from '../../context/UserContext';

import { getPosts, deletePost } from '../../services/postService';
import { getUser, getFollowers, getFollowing, updateMe, checkFollowing } from '../../services/userService';
import { decompressPosts, decompressUser, decompressUsers } from '../../utils/media';
import './ProfilePage.css';
import ProfileList from './ProfileList';
import config from '../../config';

const loadLimit = config.loadLimit;

class ProfilePage extends Component {
    static contextType = UserContext;

    state = {
        currentTab: 'Posts',
        posts: null,
        user: null,
        following: null,
        followers: null,
    }   

    tabs = ['Posts', 'Following', 'Followers']

    componentDidMount(){
        this.unlisten = this.props.history.listen((location, action) => {
            let path = location.pathname;
            if (path.startsWith('/profile')){
                path = location.pathname.endsWith('/') ?
                location.pathname.substring(1, location.pathname.length) : 
                location.pathname.substring(1);
                const parts = path.split('/');
                if (parts.length === 2 && parts[1] !== 'edit')
                    this.setUser(parts[1]);
            }
        });
        this.setUser(this.props.match.params.id);
    }
    
    componentWillUnmount(){
        this.unlisten();
    }

    handleTabChange = tab => {
        const {  posts, following, followers } = this.state;
        const { id } = this.props.match.params;
        
        if (tab === 'Posts' && !posts) this.setPosts(id);
        else if (tab === 'Following' && !following) this.setFollowing(id);
        else if (tab === 'Followers' && !followers) this.setFollowers(id);
        this.setState({ currentTab: tab });

    }

    handleDeletePost = async id => {
        
        try {
            const { user, posts: oldPosts } = this.state;

            await deletePost(id);

            const { data: replacement } = await getPosts({ 
                filter: 'userId', 
                filterData: user._id, 
                maxDate: oldPosts[oldPosts.length - 1].date,
                limit: 1
            });

            await decompressPosts(replacement);

            const posts = oldPosts
            .filter(post => post._id !== id)
            .concat(replacement);

            this.setState({ posts, loadMorePosts: replacement.length !== 0  });
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warn("You can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Post not found. Refresh to get latest content");
            }
        }
    }

    setFollowing = async (id) => {
        try {
            const { data: following } = await getFollowing(id);
            await decompressUsers(following);
            this.setState({ 
                following, 
                loadMoreFollowing: following.length >= loadLimit 
            });
        } catch (ex) {
            console.log('Error: ', ex);
        }
    }

    setFollowers = async (id) => {
        try {
            const { data: followers } = await getFollowers(id);
            await decompressUsers(followers);
            this.setState({ 
                followers,
                loadMoreFollowers: followers.length >= loadLimit 
             });
        } catch (ex) {
            console.log('Error: ', ex);
        }
    }

    setUser = async (id) => {
        try {
            const { data: user } = await getUser(id);
           
            await decompressUser(user);
            
            const { data: posts } = await getPosts({
                filter: 'userId',
                filterData: id,
            });    

            const { data: isFollowing } = await checkFollowing(id);

            await decompressPosts(posts);

            this.setState({ 
                user, 
                posts,
                following: null,
                followers: null,
                currentTab: 'Posts',
                loadMorePosts: posts.length >= loadLimit,
                isFollowing
            });
        } catch (ex) {
            console.log('Error: ', ex);
        }
    }

    handleLoadMorePosts = async () => {
        const { posts, user } = this.state;
        const { data: morePosts } = await getPosts({
            filter: 'userId',
            filterData: user._id, 
            maxDate: posts[posts.length - 1].date
        });
        await decompressPosts(morePosts);
        const combinedPosts = posts.concat(morePosts);

        this.setState({ posts: combinedPosts, loadMorePosts: morePosts.length >= loadLimit});

    }   

    handleLoadMoreFollowing = async () => {
        const { following, user } = this.state;
        const { data: moreFollowing } = await getFollowing(
            user._id, 
            following.length && following[following.length - 1].date
            );

        await decompressUsers(moreFollowing);

        const combinedFollowing = following.concat(moreFollowing);

        this.setState({
            following: combinedFollowing,
            loadMoreFollowing: moreFollowing.length >= loadLimit
        });
    }

    handleLoadMoreFollowers = async () => {
        const { followers, user } = this.state;
        const { data: moreFollowers } = await getFollowers(
            user._id, 
            followers.length &&
            followers[followers.length - 1].date
            );

        await decompressUsers(moreFollowers);

        const combinedFollowers = followers.concat(moreFollowers);

        this.setState({
            followers: combinedFollowers,
            loadMoreFollowers: moreFollowers.length >= loadLimit
        });
    }

    handleFollow = async (id) => {
        const { isFollowing, following: oldFollowing, followers: oldFollowers, user } = this.state;
        const { currentUser } = this.context; 
        await updateMe({ following: { id, follow: !isFollowing } });

        let followers, following, loadMoreFollowers;

        if (isFollowing){
            followers = oldFollowers && oldFollowers.filter(user => user._id !== currentUser._id);
            if (followers){
                const { data: replacement } = await getFollowers(
                    user._id,
                    oldFollowers[oldFollowers.length - 1].date,
                    1
                ); 
                followers = followers.concat(replacement);
                loadMoreFollowers = replacement.length !== 0;
            }
        }
        else {
            const { data: newFollowee } = await getUser(currentUser._id);
            await decompressUser(newFollowee);
            
            followers = oldFollowers && [newFollowee, ...oldFollowers]

            if (currentUser._id === user._id)
                following = oldFollowing && [newFollowee, ...oldFollowing];
        }

        this.setState({ 
            isFollowing: !isFollowing,
            following,
            followers,
            loadMoreFollowers
        });
    }

    handleProfileClick = (id) => {
        this.props.history.push(`/profile/${id}`);
    }

    handlePostClick = id => {
        this.props.history.push(`/posts/${id}`);
    }

    render() { 
        // console.log('profilePage render()');
        const { 
            user, 
            currentTab, 
            posts, 
            following, 
            followers,
            loadMorePosts,
            loadMoreFollowing,
            loadMoreFollowers,
            isFollowing } = this.state;

        const { currentUser } = this.context;

        if (!user) return null;

        return ( 
            <div className="page profile-page">
                <div className="profile-card">
                    <header className="card__header profile-card__header">
                        <ProfileDetails 
                        user={user} 
                        onFollow={this.handleFollow}
                        isFollowing={isFollowing}/>
    
                        <TabNav 
                        tabs={this.tabs}
                        currentTab={currentTab}
                        onClick={this.handleTabChange}/>
                    </header>
                <div className="card__body profile-card__body">
                {
                    (currentTab === 'Posts') && 
                    (
                        !posts ? <p>Loading posts...</p> :
                        (
                            <div 
                            className="posts-container animate__animated animate__fadeIn">
                                <Posts 
                                posts={posts}
                                onProfileClick={this.handleProfileClick}
                                onPostClick={this.handlePostClick}
                                onDelete={this.handleDeletePost}
                                onLoadMore={this.handleLoadMorePosts}
                                loadMore={loadMorePosts}
                                optionMenu={ (currentUser._id === user._id) && ['Delete'] }
                                hideOptions={ currentUser._id !== user._id }
                                />
                            </div>
                        )
                    )
                    
                }
                {
                    (currentTab === 'Following') && 
                    (
                        !following ? <p>Loading followings...</p> :
                        (
                            <div className="following-container animate__animated animate__fadeIn">
                                <ProfileList
                                users={following}
                                onProfileClick={this.handleProfileClick}
                                loadMore={loadMoreFollowing}
                                onLoadMore={this.handleLoadMoreFollowing}
                                />
                            </div>
                        )
                    )
                }
                {
                    (currentTab === 'Followers') && 
                    (
                        !followers ? <p>Loading followers..</p> :
                        (
                            <div className="followers-container animate__animated animate__fadeIn">
                                <ProfileList
                                users={followers}
                                onProfileClick={this.handleProfileClick}
                                loadMore={loadMoreFollowers}
                                onLoadMore={this.handleLoadMoreFollowers}/>
                            </div>
                        )
                    )
                }
                </div>
                </div>
            </div>
         );
    }
}
 
export default ProfilePage;