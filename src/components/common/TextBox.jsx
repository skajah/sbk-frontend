import React, { Component } from 'react'
import withAlert from '../hoc/withAlert';

class TextBox extends Component {

    handleTextChange = (e) => {
        const text = e.currentTarget.value;
        this.props.onTextChange(text);
    };

    renderInput = (options = {}) => {
        const { name, className,clear, placeholder } = options;
        return (
            <input 
            name={name}
            type="text" 
            className={className}
            value={ clear ? '' : undefined}
            placeholder={placeholder}
            onChange={this.handleTextChange}
            />
        );
    }

    renderTextArea  = (options = {}) => {
        const { name, className,clear, placeholder } = options;
        return (
            <textarea 
            name={name}
            type="text" 
            className={className}
            value={ clear ? '' : undefined}
            placeholder={placeholder}
            onChange={this.handleTextChange}
            />
        );
    }

    render() {
        const { type, ...rest } = this.props;
        if (type === 'textarea')
            return this.renderTextArea(rest);
        else
            return this.renderInput(rest);
    }

   
}
 
export default withAlert(TextBox);