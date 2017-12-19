import React from 'react';
import PropTypes from 'prop-types';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import SearchResults from './components/SearchResults';
import { search } from './search';
import { mainCSS, dropdownCSS } from './css';

const propTypes = {
  dropdown: PropTypes.bool,
  handleResults: PropTypes.func,
  handleSearchingState: PropTypes.func,
  handleSearchTerm: PropTypes.func,
  placeholder: PropTypes.string
};

const defaultProps = {
  dropdown: false,
  handleResults: () => {},
  handleSearchTerm: () => {},
  placeholder: 'What would you like to know?',
  handleSearchingState: () => {}
};

class FCCSearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    let previousSearchTerm = '';
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.provideFeedback = this.provideFeedback.bind(this);
    this.reset = this.reset.bind(this);
    this.setState = this.setState.bind(this);
    this.state = {
      isSearching: false,
      results: [],
      searchTerm: ''
    };
    this.input = new Subject();
    this.stream$ = merge(
      this.input.pipe(debounceTime(500)),
      this.input.pipe(throttleTime(500), distinctUntilChanged())
    ).subscribe(() => {
      const { searchTerm } = this.state;
      if (searchTerm.length > 2 && searchTerm !== previousSearchTerm) {
        previousSearchTerm = searchTerm.slice(0);
        this.getSearchResults();
      }
      previousSearchTerm = searchTerm.slice(0);
      return;
    });
  }

  componentDidUpdate() {
    this.provideFeedback();
  }

  getSearchResults() {
    const { searchTerm } = this.state;
    this.setState(
      state => ({
        ...state,
        isSearching: true
      }),
      () => {
        search({
          update: this.setState,
          searchTerm
        });
      }
    );
  }

  handleBlur() {
    const { dropdown } = this.props;
    if (dropdown) {
      // Allow the dropdown to handle a click before we reset
      return setTimeout(() => this.reset(), 200);
    }
    return this.reset();
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState(
      state => ({
        ...state,
        searchTerm: value
      }),
      () => this.input.next()
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.input.next();
  }

  provideFeedback() {
    const {
      handleResults,
      handleSearchingState,
      handleSearchTerm
    } = this.props;
    const { results, isSearching, searchTerm } = this.state;
    handleResults(results);
    handleSearchingState(isSearching);
    handleSearchTerm(searchTerm);
    return;
  }

  reset() {
    return this.setState(state => ({
      ...state,
      results: [],
      searchTerm: ''
    }));
  }

  render() {
    const { dropdown, placeholder } = this.props;
    const { searchTerm, results } = this.state;
    return (
      <div className="fcc_searchBar">
        <style dangerouslySetInnerHTML={{ __html: mainCSS + dropdownCSS }} />
        <form onSubmit={this.handleSubmit} className="fcc_searchForm">
          <ControlLabel htmlFor="fcc_searchInput" srOnly={true}>
            Search
          </ControlLabel>
          <FormControl
            className="fcc_input"
            id="fcc_searchInput"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            placeholder={typeof placeholder === 'string' ? placeholder : ''}
            type="text"
            value={searchTerm}
          />
        </form>
        {dropdown && results.length ? (
          <SearchResults reset={this.reset} results={results} />
        ) : null}
      </div>
    );
  }
}

FCCSearchBar.defaultProps = defaultProps;
FCCSearchBar.displayName = 'FCCSearchBar';
FCCSearchBar.propTypes = propTypes;

export default FCCSearchBar;
