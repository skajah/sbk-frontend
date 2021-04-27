import React from 'react';
import './Button.css';

const STYLES = ['outline', 'rounded', 'block', 'corner']
const SIZES = ['small', 'medium', 'large']
const COLORS = ['primary', 'secondary', 'accent']

function Button({
    children,
    styles,
    color,
    size,
    onClick,
    ...rest
}) {
    return (
        <button 
        className={`btn ${getStyles(styles)} ${getSize(size)} ${getColor(color)}`}
        onClick={onClick}
        {...rest}>
            {children}
        </button>
    );
}

const getStyles = styles => { 
    if (!styles) return '';
    return styles.filter(s => STYLES.includes(s)).map(s => 'btn--' + s).join(' ');
}

const getSize = size => {
    return SIZES.includes(size) ? 'btn--' + size: '';
}

const getColor = color => { 
    return `btn--${COLORS.includes(color) ? color : ''}`; 
}

export default Button;

