import React, { Component } from 'react'

class TabNav extends Component {

    render() { 
        const { tabs, currentTab, onClick } = this.props;

        return ( 
            <div className="tabnav">
                {
                    tabs.map(tab => {
                        return <p 
                        key={tab}
                        className={"tabnav__item clickable" + (tab === currentTab ? " tabnav__item--active" : '')}
                        onClick={() => onClick(tab)}>{tab}</p>
                    })
                }
            </div>
         );
    }
}
 
export default TabNav;