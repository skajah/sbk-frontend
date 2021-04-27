import React, { Component } from 'react';

class Media extends Component {
    
    renderImage(src, alt) {
        return <img src={src} alt={alt} className="media" />;
    }

    renderVideo(src, alt) {
        return <video src={src} controls alt={alt} className="media"  />;
    }

    renderAudio(src, alt){
        return <audio src={src} controls alt={alt} className="media"  />;
    }
    renderMedia(type, src, alt) {
        let media = null;

        switch (type) {
            case 'image':
            case 'gif':
                media = this.renderImage(src, alt);
                break;
            case 'video':
                media = this.renderVideo(src, alt);
                break;
            case 'audio':
                media = this.renderAudio(src, alt);
                break;
            default:
                break;
        }

        return media;
    }

    render() {
        const { type, src, alt } = this.props;
 
        return this.renderMedia(type, src, alt);
    }
}
 
export default Media;
