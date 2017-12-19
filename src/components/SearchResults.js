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

function renderResults(reset, index, results) {
  return (
    <li className="fcc_resultItem header list-group-item" key={`${index}`}>
      <Row className="fcc_resultHeading-wrap">
        <Col className="fcc_resultHeading" xs={12}>
          <h4 className="list-group-item-heading">
            {index.replace(/s$/, '').toUpperCase()}
          </h4>
        </Col>
      </Row>
      {results.length === 0 ? (
        <ListGroup className="fcc_resultList" componentClass="ul">
          <li className="fcc_resultItem list-group-item">
            <Row className="fcc_resultContent">
              <Col className="fcc_resultTitle" xs={4}>
                <h5>
                  <strong>Nothing found for this category</strong>
                </h5>
              </Col>
            </Row>
          </li>
        </ListGroup>
      ) : (
        <ListGroup className="fcc_resultList" componentClass="ul">
          {results.map(({ _source, highlight = {} }, i) => {
            const { friendlySearchString: highlights } = highlight;
            return (
              <a
                className="fcc_resultLink"
                href={_source.url}
                key={_source.url + i}
                onClick={handleEvent(reset)}
                target="_blank"
              >
                <li
                  className="fcc_resultItem hasContent list-group-item"
                  key={`${index}`}
                >
                  <Row className="fcc_resultContent">
                    <Col className="fcc_resultTitle" xs={4}>
                      <h5>
                        <strong>{_source.title}</strong>
                      </h5>
                      {highlights && highlights.length > 1 ? (
                        <span className="fcc_resultMarker">
                          Showing top 2 of {`${highlights.length}`} matches
                        </span>
                      ) : null}
                    </Col>
                    <Col className="fcc_resultDescription" xs={8}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<p>${
                            highlights
                              ? highlights.slice(0, 2).join('</p><p>')
                              : `${_source.title}`
                          }</p>`
                        }}
                      />
                    </Col>
                  </Row>
                </li>
              </a>
            );
          })}
        </ListGroup>
      )}
    </li>
  );
}

const defaultResultsMap = {
  challenge: [],
  guides: [],
  youtube: []
};

function SearchResults({ reset, results }) {
  const sortedResults = results.reduce(
    (accu, current) => ({
      ...accu,
      [current._index]: [...accu[current._index], current]
    }),
    defaultResultsMap
  );

  return (
    <div className="dropdown-content">
      {Object.keys(sortedResults).map(index => (
        <ListGroup
          className="fcc_resultList"
          componentClass="ul"
          key={`parent-${index}`}
        >
          {renderResults(reset, index, sortedResults[index])}
        </ListGroup>
      ))}
    </div>
  );
}

SearchResults.displayName = 'SearchResults';
SearchResults.propsTypes = propsTypes;

export default SearchResults;
