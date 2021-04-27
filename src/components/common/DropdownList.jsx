import React from 'react';

const DrowdownList = (props) => {
    const { options, onSelect } = props;
    return ( 
        <select className="dropdown-list">
            <option value=""></option>
            {
                options.map(option => {
                    return <option
                    className="dropdown-list__option" 
                    key={option}
                    value={option} 
                    onClick={() => onSelect(option)}>{ option }</option>
                })
            }
        </select>
     );
}
 
export default DrowdownList;