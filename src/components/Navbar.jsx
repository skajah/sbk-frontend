import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import auth from '../services/authService';
import UserContext from '../context/UserContext';
import './Navbar.css';
import { GoCommentDiscussion } from 'react-icons/go';

class NavBar extends Component {
    static contextType = UserContext

    render() { 
        const { currentUser } = this.context;
        return ( 
            <nav className="navbar">
                <Link className="navbar__brand" to="/posts">
                    <span className="icon">
                        <GoCommentDiscussion />
                    </span>
                    SBKonnect
                </Link>
                <ul className="list list-inline nav__items">
                    {
                        auth.hasCurrentUser() ?
                        <React.Fragment>
                            <Link className="list__item nav__item" to={`/profile/${currentUser._id}`}>
                                Profile
                            </Link>
                            <Link className="list__item nav__item" to="/logout">
                                Logout
                            </Link>
                        </React.Fragment> :
                        <React.Fragment>
                            <Link className="list__item nav__item" to="/register">Register</Link>
                            <Link className="list__item nav__item" to="/login">Login</Link>
                        </React.Fragment> 
                    }
                    {
                        !auth.hasCurrentUser() && <Link className="list__item nav__item" to="/posts">Posts</Link>
                    }
                </ul>
            </nav>
         );
    }
}
 
export default NavBar;
