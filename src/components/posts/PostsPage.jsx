import React, { Component } from 'react';
import { toast } from 'react-toastify';

import PostSearch from './PostSearch';
import CreatePostBox from './CreatePostBox';

import { getPosts, deletePost, createPost } from '../../services/postService';

import { makeDate } from '../../utils/makeDate';

import UserContext from '../../context/UserContext';
import { readMedia, compress, decompressPosts } from '../../utils/media';
import './PostsPage.css';
import Posts from './Posts';
import config from '../../config';

const loadLimit = config.loadLimit;

class PostsPage extends Component {
    static contextType = UserContext;

    state = {
        posts: null,
        emptyPost: false,
    }

    relativeDates = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']

    filterMap = {
        username: 'Username',
        likedPosts: 'Liked Posts',
        following: 'Following',
        daysAgo: 'Date (Day)',
        dateRange: 'Date Range'
    }

    componentDidMount() {
        // console.log('postsPage componentDidMount()');
        window.addEventListener('resize', this.resize);
        this.resize();
        this.populatePosts();
    }

    resize = () => {
        const mobile = window.innerWidth < 1000;
        if (this.state.mobile !== mobile) 
            this.setState({ mobile });
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.resize);
    }

    populatePosts = async () => {
        try {
            const { data: posts } = await getPosts({});
            await decompressPosts(posts);

            this.setState({ posts, loadMore: posts.length >= loadLimit });
        } catch (ex) {
            // Axios will catch any unexpected erros
        }
    }

    handleLoadMore = async () => {
        const { filter, filterData, posts } = this.state;
        let { data: morePosts } = await getPosts({ 
            filter,
            filterData,
            maxDate: posts[posts.length -1 ].date
        });

        await decompressPosts(morePosts);

        const combinedPosts = posts.concat(morePosts);
      
        this.setState({ 
            posts: combinedPosts, 
            loadMore: morePosts.length >= loadLimit
         });

    }   

    handleLike = async (postId) => { 
        if (this.state.filter !== 'likedPosts') return;
        // At this point, the filter is likedPosts and one of them must have been unliked
        const { filter, filterData, posts: oldPosts } = this.state;

        const { data: replacement } = await getPosts({ 
            filter, 
            filterData, 
            maxDate: oldPosts[oldPosts.length - 1 ].date,
            limit: 1
        });

        await decompressPosts(replacement);

        const posts = oldPosts
        .filter(post => post._id !== postId)
        .concat(replacement);
        

        this.setState({
            posts,
            loadMore: replacement.length !== 0
        });
    }

    handleFollow = async (userId) => {
        if (this.state.filter !== 'following') return;
        // At this point, the filter is following and one of them must have been unfollowed
        let { filter, filterData, posts: oldPosts } = this.state;
        const oldLength = oldPosts.length;

        const filteredPosts = oldPosts.filter(post => post.user._id !== userId);

        const { data: replacement } = await getPosts({ 
            filter, 
            filterData, 
            maxDate: oldPosts[oldPosts.length - 1 ].date,
            limit: oldLength - filteredPosts.length
        });

        await decompressPosts(replacement);

        const posts = filteredPosts.concat(replacement);

        this.setState({
            posts,
            loadMore: replacement.length !== 0
        });
    }

    handleDelete = async id => {
        try {
            const { filter, filterData, posts: oldPosts } = this.state;
            await deletePost(id);
            const { data: replacement } = await getPosts({ 
                filter, 
                filterData, 
                maxDate: oldPosts[oldPosts.length - 1 ].date, 
                limit: 1
            });

            await decompressPosts(replacement);

            const posts = oldPosts
            .filter(post => post._id !== id)
            .concat(replacement);

            this.setState({ posts, loadMore: replacement.length !== 0 });
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

    handleCreate = async (text, media) => {
        const { currentUser } = this.context;
        
        if (!currentUser){
            toast('Log in to post');
            return
        }

        if ( !(text.trim() || media) ) {
            if (!this.state.emptyPost)
                this.setState({ 
                    alert: { type: 'secondary', message : "Post can't be empty" }
                 }); // avoid rerender of posts
            return;
        }

        if (text.length > 3000){
            this.setState({ 
                alert: { type: 'secondary', message: "Text can be at most 3,000 characters" }
            });
            return;
        }

        const newPost = {
            text
        };

        let mediaData;
        let compressedData;

        if (media){
            mediaData =  await readMedia(media.src);
            compressedData = await compress(mediaData);
            newPost.media = { 
                mediaType: media.type, 
                data: compressedData
            };
        }

        try {
            const { data: post } = await createPost(newPost);
            makeDate(post);

            if (media)
                post.media.data = mediaData;
            post.user.profilePic = currentUser.profilePic;
            const posts = [...this.state.posts];
            posts.unshift(post);

            this.setState({ 
                posts, 
                alert: null
                });
        } catch (ex) {
            // REVISIT
            if (ex.response && ex.response.status === 400)
                toast.error('Something went wrong creating post');
        }
    }

    handleSearchByUsername = async text => { 
        const trimmed = text.trim().toLowerCase();
        const filter = trimmed ? 'username' : undefined;
        const { data: posts } = await getPosts({
            filter,
            filterData: trimmed,
        });
        await decompressPosts(posts);
        this.setState({
            posts,
            filter,
            filterData: trimmed,
            loadMore: posts.length >= loadLimit,
            relativeDate: null,
        });
    }

    handlePostType = async type => {
        let filter;
        const { _id } = this.context.currentUser;
        if (type === 'Liked Posts')
            filter = 'likedPosts';
        else if (type === 'Following')
            filter = 'following';

        const { data: posts } = await getPosts({ 
            filter, 
            filterData: _id,
        });

        await decompressPosts(posts);

        this.setState({
            posts,
            filter,
            filterData: _id,
            loadMore: posts.length >= loadLimit,
            relativeDate: null
        })
    }

    handleDateSelected = async date => {
        let daysAgo;
        const filter = 'daysAgo';

        if (date === 'Today')
            daysAgo = 0;
        else if (date === 'Yesterday')
            daysAgo = 1;
        else if (date.match(/Last \d+ Days/i))
            daysAgo = date.split(' ')[1];

        const { data: posts } = await getPosts({ 
            filter,
            filterData: daysAgo,
        });

        await decompressPosts(posts);

        this.setState({
            posts,
            filter,
            filterData: daysAgo,
            loadMore: posts.length >= loadLimit,
            relativeDate: date
        });
    }

    handleDateRange = async (start, end) => {
       const filter = 'dateRange';
       const filterData = start + ',' + end;

       const { data: posts } = await getPosts({
           filter,
           filterData,
       });
       await decompressPosts(posts);
       this.setState({
            posts,
            filter,
            filterData,
            loadMore: posts.length >= loadLimit,
            relativeDate: null
       });
    }

    handlePostClick = id => {
        this.props.history.push(`/posts/${id}`);
    }

    handleProfileClick = id => {
        this.props.history.push(`/profile/${id}`);
    }

    handleShowSearch = () => {
        this.setState({ showSearch: !this.state.showSearch });
    }

    handleClearFilter = async () => {
        const { data: posts } = await getPosts({ });
        await decompressPosts(posts);
        this.setState({
            posts,
            filter: null,
            filterData: null,
            loadMore: posts.length >= loadLimit,
            relativeDate: null,
        });
    }

    clearFilterComponent = filter => {
    return (
        <div>
            <span 
            className="clickable"
            onClick={() => this.handleClearFilter()}>
                Clear Filter: 
            </span>
            <span 
            style={{ 
                color: 'var(--color-accent)',
                marginLeft: '5px'
            }}>
                { this.filterMap[filter] }
            </span>
        </div>
    )
    }


    filterComponent = text => {
        return <span className="clickable" onClick={this.handleShowSearch}>{ text }</span>;
    }

    render() {  
        const { 
            posts, 
            mobile, 
            showSearch,
            loadMore,
            filter,
            relativeDate,
            alert } = this.state;
        
        const { currentUser } = this.context;

        if (!posts) 
            return (
                <p style={{ 
                    textAlign: 'center',
                    paddingTop: 'calc(var(--nav-height) * 2)'  
                }}>Loading posts...</p>
            );
        return (
            <div className="page posts-page">
                {
                    mobile &&
                    <div
                    style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '500px',
                    justifyContent: showSearch ? 'flex-end' : (filter ? 'space-between' : 'flex-end'),
                    padding: '10px 20px',
                    }}>
                    {
                    showSearch ? 
                    this.filterComponent('See results') :
                    <React.Fragment>
                        { filter && this.clearFilterComponent(filter) }
                        { this.filterComponent('Filter') }
                    </React.Fragment>
                    }
                </div>
                }
                <div 
                className={ "post-search-container " + 
                (mobile ?
                    (showSearch ? 
                    'animate__animated animate__fadeIn' : 
                    'hide' 
                    ) :
                    ''
                )
                }>
                    {
                    <PostSearch 
                    searchByUsername={this.handleSearchByUsername}
                    dates={this.relativeDates} 
                    selectedDate={relativeDate}
                    onDateSelected={this.handleDateSelected}
                    onDateRange={this.handleDateRange}
                    onPostType={this.handlePostType}
                    />
                    }
                </div>
                <div 
                className={
                    "posts-container " + 
                    (mobile ?
                        (!showSearch ? 
                        'animate__animated animate__fadeIn' : 
                        'hide' 
                        ) :
                        ''
                    )
                    }>
                        {
                            !mobile && filter && this.clearFilterComponent(filter)
                        }
                        {
                            !filter &&
                            <CreatePostBox 
                            onCreate={this.handleCreate}
                            alert={alert}/>
                        }
                    
                    {
                    !posts.length ? 
                    <p style={{ textAlign: 'center' }}>No posts found</p> :
                    <Posts
                    posts={posts}
                    onPostClick={this.handlePostClick}
                    onProfileClick={this.handleProfileClick}
                    onDelete={this.handleDelete}
                    onLoadMore={this.handleLoadMore}
                    loadMore={loadMore}
                    onLike={this.handleLike}
                    onFollow={this.handleFollow}
                    hideOptions={!currentUser}
                    />
                    }
                </div>
            </div>
        );
  
    }
}
 
export default PostsPage;
