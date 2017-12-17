import React from 'react';
import PropTypes from 'prop-types';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import {search } from './search';

const propTypes = {
  handleResults: PropTypes.func,
  handleSearchingState: PropTypes.func,
  handleSearchTerm: PropTypes.func,
  placeholder: PropTypes.string
};

class FCCSearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    let previousSearchTerm = '';
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setState = this.setState.bind(this);
    this.provideFeedback = this.provideFeedback.bind(this);
    this.state = {
      isSearching: false,
      results: [],
      searchTerm: ''
    };
    this.input = new Subject();
    this.stream$ = merge(
      this.input.pipe(debounceTime(500)),
      this.input.pipe(throttleTime(500), distinctUntilChanged())
    )
      .subscribe(() => {
        const { searchTerm } = this.state;
        if (
          searchTerm.length > 2 &&
          searchTerm.length !== previousSearchTerm.length
        ) {
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
    const { searchTerm} = this.state;
    this.setState(state => ({
      ...state,
      isSearching: true
    }),
    () => {
      console.info('SEARCH')
      search({
      update: this.setState,
      searchTerm,
    })}
  );

  }

  handleBlur() {
    this.setState(state => ({
      ...state,
      searchTerm: ''
    }));
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
  }

  provideFeedback() {
    const { handleResults, handleSearchingState, handleSearchTerm } = this.props;
    const { results, isSearching, searchTerm } = this.state;
    handleResults(results)
    handleSearchingState(isSearching)
    handleSearchTerm(searchTerm)
    return;
  }

  render() {
    const { placeholder } = this.props;
    const { searchTerm } = this.state;
    return (
      <div className="fcc_searchBar">
        <style>
          {`
          .fcc_input {
            min-width: 100%;
            width: 100%;
            height: 30px;
          }

          .fcc_searchBar {
            width: 100%;
          }

          @media (min-width: 992px) {
            .fcc_searchBar {
              width: 75%;
            }
          }
          `}
        </style>
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
      </div>
    );
  }
}

FCCSearchBar.defaultProps = {
  handleResults: () => {},
  handleSearchTerm: () => {},
  placeholder: 'What would you like to know?',
  handleSearchingState: () => {}
};
FCCSearchBar.displayName = 'FCCSearchBar';
FCCSearchBar.propTypes = propTypes;

export default FCCSearchBar;
