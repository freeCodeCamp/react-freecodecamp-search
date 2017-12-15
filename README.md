# react-freecodecamp-search

[![Greenkeeper badge](https://badges.greenkeeper.io/Bouncey/react-freecodecamp-search.svg)](https://greenkeeper.io/)

## Install

`npm install react-freecodecamp-search -S`

## Usage

```jsx
import FCCSearchBar from 'react-freecodecamp-search';

// in your component
return (
  <FCCSearchBar
    handleResults={yourResultHandler} // arrayOf(Object)
    handleSearchTerm={yourOptionalSearchTermHandler} // input.value
    handleSearchingState={yourHandler} // isSearching ? true : false
    placeholder='This is optional'
  />
);
```

Then search for something

## Contributing

`npm run dev` and submit a PR :+1:
