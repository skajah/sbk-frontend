import React, { Component } from 'react'
import Joi from 'joi-browser';
import FormInput from './FormInput';
import Button from './Button';
import './Form.css';

class Form extends Component {
    state = { 
        errors: {},
        data: {}
     }

    data = {}



     renderButton = label => {
        return (
            <Button
            styles={['rounded', 'block']}
            color="primary">
                {label}
            </Button>
        );
     }

     renderInput = (name, label, options={}) => {
        const { errors } = this.state;
        // console.log(options)

        const alert = !errors[name] ? null : { type: 'primary', message: errors[name]};

        // console.log('renderInput(): data: ', data);

        // console.log('option: ', options);

        return <FormInput 
        {...options}
        name={name}
        label={label}
        onChange={this.handleChange}
        className="text-box"
        alert={alert}/>;
     }

     validate = () => {
        // const options = { abortEarly: false };
        const { error } = Joi.validate(this.data, this.schema);

        if (!error)
            return null;

        const errors = {};

        for (let item of error.details){
            errors[item.path[0]] = item.message;
        }

        // console.log(errors);

        return errors;
    }

    handleSubmit = e => {
        e.preventDefault(); // to prevent reloading

        const errors = this.validate();

        this.setState({ errors: errors || {} });

        if (errors) return; // don't want to call server

        this.doSubmit();
    }

    doSubmit = () => {
        // console.log('doSubmit() in base class called');
    }

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value} ;
        const schema = { [name]: this.schema[name]};
        const { error } = Joi.validate(obj, schema);

        return error ? error.details[0].message : null;
        
    }

    handleChange = ({ currentTarget: input }) => { // e.currentTarget
        this.data[input.name] = input.value;
        /*
        const errors = {...this.state.errors};

        
        const data = {...this.state.data}; 
        data[input.name] = input.value;

        // console.log(errors);
        this.setState({ data, errors });
        */
    }

}
 
export default Form;