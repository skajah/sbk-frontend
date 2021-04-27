import React from 'react';
import { Redirect } from 'react-router-dom';

import _ from 'lodash';
import Joi from 'joi-browser';
import Form from './common/Form';
import { register } from '../services/userService';
import auth from '../services/authService';
import UserContext from '../context/UserContext';
import { makeAlert } from '../utils/alert';
import sbkImage from '../images/sbk_image.svg'

class Register extends Form {
    static contextType = UserContext;
    
    state = {
        errors: {},
        data: {},
        alert: null
    }

    data = { username: '', email: '', password: '' }

    schema = {
        username: Joi.string().min(5).max(255).required().label('Username'),
        email: Joi.string().min(8).max(255).email().required().label('Email'),
        password: Joi.string().min(8).max(255).required().label('Password'),
        // password_confirmation: Joi.string().required().valid(Joi.ref('password'))
    }

    doSubmit = async () => {
        try {
            // const data = {...this.data, profilePic: compress(profilePic)};
            const response = await register(this.data);
            auth.loginWithJwt(response.headers['x-auth-token']);
            await this.context.onLogin(); // notify App that jwt is set
            window.location = '/';
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = makeAlert('primary', ex.response.data);
                this.setState({ alert });
            }
        }
    }

    render() {
        if (auth.hasCurrentUser()) return <Redirect to='/' />;

        const { alert, errors } = this.state;
        // console.log(errors);
        return (
            <div 
            className="page register-page page-form">
                <img src={sbkImage} alt=""/>
                <form onSubmit={this.handleSubmit} className="form">
                    <h2>Register</h2>
                    { _.isEmpty(errors) && alert }
                    {this.renderInput('username', 'Username', { autoFocus: true })}
                    {this.renderInput('email', 'Email')}
                    {this.renderInput('password', 'Password', { type: 'password' })}
                    {//this.renderInput('confirmPassword', 'Confirm Password', 'password')
                    }
                    {this.renderButton('Register')}
                </form>
            </div>
        )
    }

}

export default Register;