import React, { Component, useState } from 'react';
import { makeAlert } from '../../utils/alert';
import { BsEye, BsEyeSlash } from 'react-icons/bs'

class FormInput extends Component {
    
    render() {
        const { name, label, onChange, alert,  inputType, ...rest} = this.props;
        // console.log('Default value: ', rest);
        return ( 
            <div className="form__group">
                <label htmlFor={name} className="label">{ label }</label>
                {
                    inputType === 'textarea' ?
                    <textarea
                    {...rest}
                    id={name}
                    className="text-box"
                    name={name}
                    onChange={(e) => onChange(e)}/> :
                    {
                        ...rest.type === 'password' ?
                        <PasswordInput
                        {...rest}
                        name={name}
                        onChange={onChange}/> :
                        <input 
                        {...rest}
                        id={name}
                        className="text-box"
                        name={name}
                        onChange={(e) => onChange(e)}/>
                    }
                    
                }
                {
                    alert && makeAlert(alert.type, alert.message)
                }
                
            </div>
         );
    }
    
}

const PasswordInput = ({
    name, 
    onChange,
    type,
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (<div className="input-group">
        <input 
        {...rest}
        id={name}
        type={showPassword ? 'text' : 'password'}
        className="text-box"
        name={name}
        onChange={(e) => onChange(e)}>
            
        </input>
        
        <span className="icon icon--small clickable"
        onClick={() => setShowPassword(!showPassword)}>
            {
                showPassword ?
                <BsEye /> :
                <BsEyeSlash />
            }
        </span>

    </div>)
}
 
export default FormInput;