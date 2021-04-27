import React from 'react';
import numeral from 'numeral';

export default function IconCount({
    children,
    count,
    onClick,
}) {
    return (
        <span 
        className="icon-count"
        style={{ 
            display: 'flex', 
            }}>
            <span 
            className={`icon icon--small ${onClick ? 'clickable' : ''}`}
            onClick={onClick}>{ children }</span>
            
            <span style={{ marginLeft: '5px' }}>{ count ? formatCount(count) : null } </span>
        </span>
    )
}

function formatCount(count){
    return count >= 100000 ? 
    numeral(count).format('0a').replace('.0', ''):
    numeral(count).format('0.0a').replace('.0', '');
}