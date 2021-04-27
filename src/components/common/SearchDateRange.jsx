import React, { Component } from 'react'
import withAlert from '../hoc/withAlert';

class SearchDateRange extends Component {

    // Not in state because no need to rerender on these changes
    dateRange = { start: null, end: null }

    handleStartDate = e => {
        const dateString = e.target.value.replaceAll('-', '/');
        this.dateRange.start = new Date(dateString);
        this.handleDateChange();
    }
    
    handleEndDate = e => {
        const dateString = e.target.value.replaceAll('-', '/');
        this.dateRange.end = new Date(dateString);
        this.handleDateChange();
    }

    handleDateChange = () => {
        const { start, end } = this.dateRange;
        if ((start && end) && 
        (start.toString() !== 'Invalid Date' && end.toString() !== 'Invalid Date'))
            this.props.onDateRange(start, end);
    }

    render() { 

        return (
            <div className="search-date-range">
                <span className="label">From</span>
                <input 
                type="date" 
                name="start-date" 
                className="search-date-range__input"
                onChange={this.handleStartDate}/>
                
                <span className="label">To</span>
                <input 
                type="date" 
                name="start-end" 
                className="search-date-range__input"
                onChange={this.handleEndDate}/>
            </div>
        );
    }
}
 
export default withAlert(SearchDateRange);