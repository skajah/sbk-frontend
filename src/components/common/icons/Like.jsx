import React, { useEffect, useState} from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';


export default function Like({
    initialLike,
    onLike
}) {
    const [liked, setLiked] = useState(false);
    
    useEffect(() => {
        setLiked(initialLike);
    }, [initialLike]);

    const icon = liked ? <BsHeartFill /> : <BsHeart />;

    return (
        <span 
        className="icon clickable" 
        onClick={() => {
            setLiked(!liked);
            onLike(!liked)
        }}>{ icon }</span>
    );
}