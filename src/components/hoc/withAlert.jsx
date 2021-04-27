import React from 'react';

function withAlert(Component) {
    return class WithAlert extends React.Component {

        render() {  
            const { alert, ...rest } = this.props;
    
            return (
            <React.Fragment>
                <Component {...rest}/>
                { alert && <div className={"alert alert--" + alert.type}>{ alert.message }</div> }
            </React.Fragment>);
        }
    }
} 

export default withAlert;