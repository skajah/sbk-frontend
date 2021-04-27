import React from 'react';
import Form from '../common/Form';
import _ from 'lodash';
import UserContext from '../../context/UserContext';
import { makeAlert } from '../../utils/alert';
import { updateMe } from '../../services/userService';
import Joi  from 'joi-browser';

class EditUsername extends Form {
    static contextType = UserContext;

    state = {
        errors: {},
        alert: null
    }

    schema = {
        username: Joi.string()
    }

    data = {}

    componentDidMount() {
        this.data.username = this.context.currentUser.username;
    }

    doSubmit = async () => {
        try {
            const { username } = this.data;
            const { data: newUsername } = await updateMe({ username });
            // console.log('newUsername: ', newUsername);
            const alert = makeAlert('accent', 'Username updated');
            this.setState({ alert })
            this.context.updateUser('username', newUsername);
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const errors = { username: ex.response.data };
                this.setState({ errors })
            }
        }
    }

    render() { 
        const { username } = this.context.currentUser;
        const { alert, errors } = this.state;

        return ( 
            <div className="page page-form">
                <form onSubmit={this.handleSubmit} className="form">
                    <h2>Edit Username</h2>
                    { _.isEmpty(errors) && alert }
                    {this.renderInput('username', '', { defaultValue: username })}
                    {this.renderButton('Save')}
                </form>
            </div>
         );
    }
}
 
export default EditUsername;