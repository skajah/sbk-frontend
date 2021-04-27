import React, { Component } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi'
import Button from './Button';
import './Dropdown.css';

class Dropdown extends Component {
    state = { 
        showOptions: false
    }

    dropdown = React.createRef();

    componentDidMount(){
        document.addEventListener("mousedown", this.handleOutsideClick)
    }

    componentWillUnmount(){
        document.removeEventListener("mousedown", this.handleOutsideClick)
    }

    handleOutsideClick = event => {
        if (this.dropdown.current && !this.dropdown.current.contains(event.target))
            this.setState({ showOptions: false });
    }

    handleDropdown = () => {
        let { showOptions } = this.state;
        showOptions = !showOptions;
        this.setState({ showOptions });
    }

    handleOption = option => {
        this.setState({ showOptions: false });
        this.props.onOptionSelected(option);
    }

    render() { 
        const { options } = this.props;
        const { showOptions } = this.state;
        return ( 
            <div 
            className="dropdown" 
            ref={this.dropdown}>
                <div className={`dropdown__content${showOptions ? ' show': ''}`}>
                    {
                        options.map(o => {
                        return <Button 
                        styles={['block', 'corner']}
                        onClick={() => this.handleOption(o)}
                        key={o}>
                            { o }
                        </Button>
                        })
                    }
                </div>
                <BiDotsVerticalRounded onClick={this.handleDropdown} className="clickable"/>
            </div>
         );
    }
}
 
export default Dropdown;