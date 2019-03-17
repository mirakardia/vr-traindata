import React from 'react';
import '../style/SearchBar.css'

const SearchBar = (props) => {

    function onFormSubmit(event) {
        event.preventDefault();
        props.onSubmit(props.query);
    }
    
    return (
        <div>
            <form onSubmit = {onFormSubmit} className = "searchForm"> 
                <div className = "field">
                    <label className = "formLabel">Hae aseman nimellä</label>
                    <input
                        type = "text"
                        value = {props.query}
                        onChange = {(e) => props.onFieldWrite(e.target.value)}>
                    </input>
                </div>
            </form>
            <button 
                className = "clearButton" 
                onClick = {() => props.onFieldWrite('')}>
            </button>
        </div>
    );
}
 
export default SearchBar;