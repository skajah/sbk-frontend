import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Posts from './Posts';

import { getPost, deletePost } from '../../services/postService';
import { decompressPost, decompressComments } from '../../utils/media';
import './PostsPage.css';
import { getComments } from '../../services/commentService';
import UserContext from '../../context/UserContext';

class PostPage extends Component {

    static contextType = UserContext

    state = {
        post: null,
    }

    componentDidMount(){
        // console.log('postPage componentDidMount()');
        this.setPost();
    }

    async setPost() {
        try {
            const { id: postId } = this.props.match.params;
            const { data: post } = await getPost(postId);
            const { data: comments } = await getComments(postId);
            post.comments = comments;
            await decompressPost(post);
            await decompressComments(post.comments);
            
            this.setState({ post });
        } catch (ex) { 
            if (ex.response && ex.response.status === 404)
                this.props.history.replace('/not-found'); // don't want to be able to go back to invalid post
        } 
    }

    handleDelete = async (id) => {
        try {
            await deletePost(id);
            this.props.history.replace('/');
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warn("You can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Post not found. Try refresshing");
            }
        }
    }

    handleProfileClick = id => {
        this.props.history.push(`/profile/${id}`);
    }

    render() { 
        const { post } = this.state;
        const { currentUser } = this.context;

        if (!post) return null;
        
        return (
            <div className="page post-page">
                <div className="posts-container">
                    <Posts 
                    posts={[post]}
                    showComments={true}
                    onProfileClick={this.handleProfileClick}
                    onDelete={this.handleDelete}
                    hideOptions={!currentUser}
                    />
                </div>
            </div>
        );
    }
}
 
export default PostPage;