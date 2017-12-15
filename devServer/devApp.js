import React from 'react';
import ReactDOM from 'react-dom';
import FCCSearchBar from '../src/index.js';
import { Grid, Row, Col } from 'react-bootstrap';

ReactDOM.render(
  <Grid fluid={true} style={{ background: '#006400' }}>
    <Row>
      <Col md={3} xs={12} />
      <Col md={7} xs={12}>
        <FCCSearchBar
          handleResults={res => {
            console.log('hadleResults prop', res);
          }}
        />
      </Col>
      <Col md={2} xs={0} />
    </Row>
  </Grid>,
  document.getElementById('mount-app')
);

