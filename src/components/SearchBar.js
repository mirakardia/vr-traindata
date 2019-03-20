import React from 'react';
import '../style/SearchBar.css';

const SearchBar = props => {

  const onFormSubmit = event => {
    event.preventDefault();
    props.onSubmit(props.query);
  };

  return (
    <div>
      <form onSubmit={onFormSubmit} className='searchForm'>
        <div className='field'>
          <label className='formLabel'>Hae aseman nimellä</label>
          <input
            type='text'
            value={props.query}
            onChange={event => props.handleQueryChange(event.target.value)}
          />
        </div>
      </form>
      <button
        className='clearButton'
        onClick={() => props.handleQueryChange('')}
      />
    </div>
  );
};

export default SearchBar;
