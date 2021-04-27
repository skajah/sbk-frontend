import React, { Component } from 'react'

class ListGroup extends Component {
    render() { 
        const { items, selectedItem, onClick } = this.props;
        return ( 
            <ul className="list-group">
                {
                    items.map(item => {
                        return <li 
                        key={item}
                        className={"list-group__item clickable" + (item === selectedItem ? ' list-group__item--active' : '')}
                        onClick={() => onClick(item)}>{item}</li>;
                    })
                }
            </ul>
         );
    }
}
 
export default ListGroup;