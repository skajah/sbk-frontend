import React from 'react';
import { toast } from 'react-toastify';
import { likeComment, unlikeComment } from '../../services/commentService';
import { checkLiked } from '../../services/userService';
import UserContext from '../../context/UserContext';
import ContentDetails from '../common/ContentDetails';
import Card from '../common/Card';
import Dropdown from '../common/Dropdown';
import IconCount from '../common/icons/IconCount';
import Like from '../common/icons/Like';

class Comment extends Card {
    static contextType = UserContext;

    state = {
        date: new Date(),
        text: '',
        user: {}
    }

    componentDidMount() {
        this.populateState();
    }

    async populateState() {
        const { _id, user, date, text, likes } = this.props.comment;
        
        let initialLike;
        
        if (this.context.currentUser)
            initialLike = (await checkLiked(_id, 'comment')).data;

        this.setState({ 
            _id, 
            user, 
            date, 
            text, 
            likes, 
            initialLike,
        });
    }

    handleLike = async (liked) => {
        if (!this.context.currentUser){
            toast('Log in to save liked content');
            return
        }

        try {
            const id = this.state._id;

            const { data: likeObj } = liked ? 
            await likeComment(id) :
            await unlikeComment(id);
            
            const { likes } = likeObj;
            // this.context.onLike(comment._id, 'comment', liked);
            this.setState({ likes });
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 400)
                    console.log(`Error liking comment: ${ex.response.data}`);
                else if (status === 404)
                    toast.error("Comment not found. Refresh to get latest content");
            }
        }
    }

    handleOptionSelected = option => {
        const { onProfileClick, onDelete, onFollow } = this.props;
        const { user, _id } = this.state;

        if (option === 'Profile')
            onProfileClick(user._id);
        else if (option === 'Follow' || option === 'Unfollow')
            onFollow(user._id);
        else if (option === 'Delete')
            onDelete(_id);
    }

    render() { 
        const { text, user, likes, date, initialLike } = this.state;
        const { 
            onProfileClick, 
            following,
            optionMenu,
            hideOptions 
        } = this.props;
        const followingUser = following[user._id];
        const { currentUser } = this.context;
        const options = optionMenu || ['Profile'];
        if (!optionMenu && !hideOptions)  {
            currentUser &&
            (currentUser._id === user._id ?
                options.push('Delete'):
                options.push(followingUser ? 'Unfollow' : 'Follow')
            )
        }

        return (
        <div className="card comment">
            <header className="card__header post__header">
                <ContentDetails 
                profilePicSrc={user.profilePic}
                onProfileClick={() => onProfileClick(user._id)} 
                username={user.username} 
                date={date}/>
                {
                    !hideOptions &&
                    <Dropdown options={options} onOptionSelected={this.handleOptionSelected}/>
                }
            </header>
            <div className="card__body comment__body">
                <p>
                    { text }
                </p> 
                <div className="comment__details">
                    <IconCount count={likes}>
                      <Like onLike={this.handleLike} initialLike={initialLike}/>
                    </IconCount>
                </div>
            </div>
        </div>
        );
    }
}
 
export default Comment;