import React from 'react';
import withFileChooser from '../hoc/withFileChooser';

const EditRow = (props) => {
    const { label, text, icon, ...rest } = props;
    return ( 
        <div {...rest}>
            <span className="edit-row__label">{ label }</span>
            <span className="edit-row__text">{ text }</span>
            <span className="icon">{ icon }</span>
        </div>
     );
}

const EditRowWithFile = withFileChooser(EditRow);

export {
    EditRow,
    EditRowWithFile
}

