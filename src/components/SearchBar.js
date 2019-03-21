import React from 'react';
import '../style/SearchBar.css';

/*
 * @author Jesse Sydänmäki
 * Github: https://github.com/Pygmicaesar
 * 
 * A simple search bar.
 * 
 */

const SearchBar = props => {

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(props.query);
  };

  return (
    <div>
      <form onSubmit = {onFormSubmit} className = 'form'>
        <label className = 'formLabel'>Hae aseman nimellä</label>
        <input
          className = 'input'
          type = 'text'
          value = {props.query}
          onChange = {event => props.handleQueryChange(event.target.value)}
        />
      </form>
      <button
        className = 'clearButton'
        onClick = {() => props.handleQueryChange('')}
      />
    </div>
  );
};

export default SearchBar;
