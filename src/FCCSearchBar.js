import React from 'react';
import PropTypes from 'prop-types';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import xhr from 'xhr';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import { normaliser } from './resultNormaliser';
import './fcc-search-bar.css';

const requestUrl = 'https://search.freecodecamp.org';

const propTypes = {
  handleResults: PropTypes.func.isRequired,
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
    this.handleResults = this.handleResults.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      results: [],
      searchTerm: ''
    };
    this.input = new Subject();
    this.stream$ = merge(
      this.input.pipe(debounceTime(500)),
      this.input.pipe(throttleTime(500), distinctUntilChanged())
    ).subscribe(() => {
      const { searchTerm } = this.state;
      if (
        searchTerm.length > 2 &&
        searchTerm.length !== previousSearchTerm.length
      ) {
        previousSearchTerm = searchTerm.slice(0);
        this.getSearchResults();
      }
      previousSearchTerm = searchTerm.slice(0);
      this.props.handleSearchTerm(searchTerm);
      return;
    });
  }

  getSearchResults() {
    const self = this;
    const { searchTerm } = this.state;
    xhr(
      {
        method: 'get',
        uri: `${requestUrl}/search?q=${searchTerm}`
      },
      function(err, resp, body) {
        if (resp.statusCode !== 200) {
          self.setState(
            state => ({
              ...state,
              results: []
            }),
            () => self.handleResults()
          );
          console.error('Something went wrong whilst searching');
          console.error(err);
          return;
        } else if (err) {
          self.setState(
            state => ({
              ...state,
              results: []
            }),
            () => self.handleResults()
          );
          console.error('Something went wrong');
          console.error(err);
          return;
        }
        const data = JSON.parse(body);
        const results = normaliser(data);
        self.setState(
          state => ({
            ...state,
            results
          }),
          () => self.handleResults()
        );
        return;
      }
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

  handleResults() {
    const { results } = this.state;
    this.props.handleResults(results);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const { placeholder } = this.props;
    const { searchTerm } = this.state;
    return (
      <div className="fcc_searchBar">
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
  handleResults: () => {
    console.warn(
      'Expected a "handleResults" prop in FCCSearchBar, instead we are using a default fallback'
    );
  },
  handleSearchTerm: () => {},
  placeholder: 'What would you like to know?'
};
FCCSearchBar.displayName = 'FCCSearchBar';
FCCSearchBar.propTypes = propTypes;

export default FCCSearchBar;
