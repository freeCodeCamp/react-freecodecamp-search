import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const propsTypes = {
  reset: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
      _index: PropTypes.string,
      _source: PropTypes.shape({
        description: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string
      })
    })
  )
};

function handleEvent(fn) {
  return function eventHandler() {
    fn();
  };
}

function renderResults(reset, results) {
  return results.map(result => (
    <li className="fcc_resultItem list-group-item" key={`${result._id}`}>
      <a
        className="fcc_resultLink"
        href={result._source.url}
        onClick={handleEvent(reset)}
        target="_blank"
      >
        <Row className="fcc_resultHeading-wrap">
          <Col className="fcc_resultHeading" xs={12}>
            <h4 className="list-group-item-heading">
              {result._index.replace(/s$/, '').toUpperCase()}
            </h4>
          </Col>
        </Row>
        <Row className="fcc_resultContent">
          <Col className="fcc_resultTitle" xs={4}>
            <h5>
              <strong>{result._source.title}</strong>
            </h5>
          </Col>
          <Col className="fcc_resultDescription" xs={8}>
            <div>{result._source.description}</div>
          </Col>
        </Row>
      </a>
    </li>
  ));
}

function SearchResults({ reset, results }) {
  return (
    <div className="dropdown-content">
      <ListGroup className="fcc_resultList" componentClass="ul">
        {renderResults(reset, results)}
      </ListGroup>
    </div>
  );
}

SearchResults.displayName = 'SearchResults';
SearchResults.propsTypes = propsTypes;

export default SearchResults;
