import React, { Component } from 'react';
import TextBox from '../common/TextBox';
import withAlert from '../hoc/withAlert';
import Media from '../common/Media';
import UserContext from '../../context/UserContext';
import FileIcon from '../common/icons/FileIcon';
import Button from '../common/Button';
import { AiOutlineCamera, AiOutlineVideoCamera } from 'react-icons/ai';
import { IoVolumeHighOutline } from 'react-icons/io5';
import './CreatePostBox.css';


class CreatePostBox extends Component {
    static contextType = UserContext;

    state = {
        media: null,
    }

    text = ''

    handleTextChange = text => {
        this.text = text;
        if (this.state.clear)
            this.setState({ clear: false });
    }

    handleCreate = () => {
        this.props.onCreate(this.text, this.state.media);
        this.text = '';
        this.setState({ media: null, clear: true });
    }

    handleMediaUpload = (src, type) => {
        const media = { type, src };
        this.setState({ media })
    }

    handleClearMedia = () => {
        this.setState({ media: null })
    }

    render() { 
        const { clear, media } = this.state;
        
        return ( 
            <div className="card create-post">
                <header className="card__header create-post__header">
                    {
                        media && 
                        <Button
                        size="small"
                        color="secondary"
                        onClick={this.handleClearMedia}>Clear Media
                        </Button>
                    }
                </header>
                <div className="card__body create-post__body">
                    <TextBox 
                    name="postText"
                    placeholder=" What's on your mind?"
                    clear={clear}
                    onTextChange={this.handleTextChange}
                    className="text-box create-post-text-box"
                    type="textarea"/>

                    { media && 
                    <Media 
                    type={media.type} 
                    src={URL.createObjectURL(media.src)} 
                    alt={'Post Media: ' + media.type}/> 
                    }

                </div>
                <div className="create-post__footer">
                    <FileIcon
                    extensions={['jpg', 'jpeg', 'png', 'gif']}
                    onFileChosen={src => this.handleMediaUpload(src, 'image')}
                    maxFileSize={8}>
                        <span className="icon icon--medium">
                            <AiOutlineCamera />
                        </span>
                    </FileIcon>

                    <FileIcon
                    extensions={['mp4', 'mov', 'mpg']}
                    onFileChosen={src => this.handleMediaUpload(src, 'video')}
                    maxFileSize={8}>
                        <span className="icon icon--medium">
                            <AiOutlineVideoCamera />
                        </span>
                    </FileIcon>

                    <FileIcon
                    extensions={['mp3', 'wav', 'ogg']}
                    onFileChosen={src => this.handleMediaUpload(src, 'audio')}
                    maxFileSize={8}>
                        <span className="icon icon--medium">
                            <IoVolumeHighOutline />
                        </span>
                    </FileIcon>

                    <Button
                    color="accent"
                    size="small"
                    onClick={this.handleCreate}>
                        Post
                    </Button>
                </div>
            </div>
         );
    }
}
 
export default withAlert(CreatePostBox);