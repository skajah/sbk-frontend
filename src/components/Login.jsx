import React from 'react';
import { Redirect } from 'react-router-dom';
import Joi from 'joi-browser';
import _ from 'lodash';
import Form from './common/Form';
import auth from '../services/authService';
import UserContext from '../context/UserContext';
import { makeAlert } from '../utils/alert';
import sbkImage from '../images/sbk_image.svg';

class Login extends Form {
    static contextType = UserContext;

    data = { email: '', password: ''}

    state = {
        errors: {},
        alert: null,
    }

    schema = {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().min(8).required().label('Password')
    }

    doSubmit = async () => {
        try {
            const { email, password } = this.data;

            await auth.login(email, password);

            await this.context.onLogin(); // notify App that jwt is set

            const { state } = this.props.location;
            window.location = state ? state.from.pathname : '/'; // cause full reload because app's cdm() only called once 
            // toast.info(jwt);
            
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = makeAlert('primary', ex.response.data);
                this.setState({ alert });
            }
        }
    }

    render() {
        if (auth.hasCurrentUser()) return <Redirect to="/"/>;

        const { alert, errors } = this.state;
        return (
            <div className="page login-page page-form">
                <img src={sbkImage} alt=""/>
                <form className="form" onSubmit={this.handleSubmit}>
                    <h2>Login</h2>
                    {  _.isEmpty(errors) && alert }
                    {this.renderInput('email', 'Email', { autoFocus: true })}
                    {this.renderInput('password', 'Password', { type: 'password' })}
                    {this.renderButton('Login')}
                </form>
            </div>
        )
    }

}

export default Login;