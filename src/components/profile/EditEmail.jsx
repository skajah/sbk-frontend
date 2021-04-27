import React from 'react';
import _ from 'lodash';
import Form from '../common/Form';
import UserContext from '../../context/UserContext';
import Joi from 'joi-browser';
import { updateMe } from '../../services/userService';
import { makeAlert } from '../../utils/alert';

class EditEmail extends Form {
    static contextType = UserContext;

    state = {
        errors: {},
        alert: null
    }

    data = {}

    schema = {
        email: Joi.string().email()
    }

    componentDidMount() {
        this.data.email = this.context.currentUser.email;
    }

    doSubmit = async () => {
        try {
            const { email } = this.data;
            const { data: newEmail } = await updateMe({ email });
            const alert = makeAlert('accent', 'Email updated');
            this.setState({ alert });
            this.context.updateUser('email', newEmail);
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const errors = { email: ex.response.data };
                this.setState({ errors })
            }
        }
    }

    render() { 
        const { email } = this.context.currentUser;
        const { errors, alert } = this.state;

        return ( 
            <div className="page page-form">
                <form onSubmit={this.handleSubmit} className="form">
                    <h2>Edit Email</h2>
                    { _.isEmpty(errors) && alert }
                    {this.renderInput('email', '', { defaultValue: email })}
                    {this.renderButton('Save')}
                </form>
            </div>
         );
    }
}
 
export default EditEmail;