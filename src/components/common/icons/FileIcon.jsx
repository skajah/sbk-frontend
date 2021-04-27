import React from 'react';
import withFileChooser from '../../hoc/withFileChooser';

function FileIcon(props) {
    return (
        <span className="file-icon clickable" onClick={props.onClick}>
            { props.children }
        </span>
    )
}

export default withFileChooser(FileIcon);
