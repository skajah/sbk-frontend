import React, { Component } from 'react';
import './Card.css';

class Card extends Component {

    render() { 
        return (
            <div className="card">
                <header className="card__header">Card Header</header>
                <div className="card__body">Card Body</div>
            </div>
        );
    }
}
 
export default Card;
