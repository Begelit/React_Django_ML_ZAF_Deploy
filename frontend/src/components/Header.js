import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Header = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="p-3">
              <h1>Our Header</h1>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>

  )
}

export default Header