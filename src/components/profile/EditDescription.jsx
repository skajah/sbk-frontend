import React from 'react';
import _ from 'lodash';
import Form from '../common/Form';
import UserContext from '../../context/UserContext';
import Joi from 'joi-browser';
import { updateMe } from '../../services/userService';
import { makeAlert } from '../../utils/alert';

class EditDescription extends Form {
    static contextType = UserContext;

    state = {
        errors: {},
        alert: null
    }
    
    data = {}

    schema = {
        description: Joi.string().allow('')
    }

    componentDidMount(){
        this.data.description = this.context.currentUser.description;
    }

    doSubmit = async () => {
        try {
            const { description } = this.data;
            const { data: newDescription } = await updateMe({ description });
            const alert = makeAlert('accent', 'Description updated');
            this.setState({ alert });
            this.context.updateUser('description', newDescription);
        } catch (ex) {
            if (ex.response && ex.response.status === 400){
                const alert = makeAlert('primary', ex.response.data);
                this.setState({ alert })
            }
        }
    }

    render() { 
        const { description } = this.context.currentUser;
        const { alert, errors } = this.state;

        return ( 
            <div className="page page-form">
                <form 
                onSubmit={this.handleSubmit} 
                className="form"
                >
                    <h2>Edit Description</h2>
                    { _.isEmpty(errors) && alert }
                    {this.renderInput(
                        'description', 
                        '', 
                        { inputType: 'textarea',  defaultValue: description })}
                    {this.renderButton('Save')}
                </form>
            </div>
         );
    }
}
 
export default EditDescription;