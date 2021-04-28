import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import './Navbar.css';
import { FiMenu } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import favicon from '../images/favicon.svg'

function NavBar() {
    const { currentUser } = useContext(UserContext);
    const [clicked, setClicked] = useState(false);

    const handleClick = (val) => setClicked(val);

    return ( 
        <nav className="nav">
            <div className="nav__container">
                <NavLink 
                className="nav__brand" 
                to="/posts"
                onClick={() => handleClick(false)}
                >
                    <img src={favicon} alt="" className="nav__logo"/>
                    SBKonnect
                </NavLink>
                <ul className={"nav__menu " + (clicked ? 'active' : '')}>
                {
                currentUser ?
                <React.Fragment>
                    <li onClick={() => handleClick(false)} className="nav__item">
                        <NavLink className="nav__link" activeClassName="active" to={"/profile/" + currentUser._id}>Profile</NavLink>
                    </li>
                    <li onClick={() => handleClick(false)} className="nav__item">
                        <NavLink className="nav__link" activeClassName="active" to="/logout">Logout</NavLink>
                    </li>
                    <li onClick={() => handleClick(false)} className="nav__item">
                        <NavLink className="nav__link" activeClassName="active" to="/posts">Posts</NavLink>
                    </li>
                </React.Fragment> :
                <React.Fragment>
                    <li onClick={() => handleClick(false)} className="nav__item">
                        <NavLink className="nav__link" activeClassName="active" to="/login">Login</NavLink>
                    </li>
                    <li onClick={() => handleClick(false)} className="nav__item">
                        <NavLink className="nav__link" activeClassName="active" to="/register">Register</NavLink>
                    </li>
                    <li onClick={() => handleClick(false)} className="nav__item">
                        <NavLink className="nav__link" activeClassName="active" to="/posts">Posts</NavLink>
                    </li>
                </React.Fragment>
                }
                </ul>
                <div 
                className="nav__menu-icon clickable icon--medium" 
                onClick={() => handleClick(!clicked)}>
                    {
                        clicked ? <FaTimes /> : <FiMenu />
                    }
                </div>
            </div>
        </nav>
    )
}
 
export default NavBar;
