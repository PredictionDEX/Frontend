import React from 'react'
import { Col, Form, ListGroup, Row, Offcanvas } from 'react-bootstrap'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import PrimaryButton from 'src/components/button/PrimaryButton'

const StyledSidebar = styled(Offcanvas)`
  width: 276px;
  background: rgba(15, 12, 41, 0.95);
  color: ${props => props.theme.reverse};
  .offcanvas-body {
    font-size: 120%;
    background: rgba(15, 12, 41, 0.95) !important;
    margin-bottom: 70px;
    color: ${props => props.theme.reverse};
  }
  .offcanvas-body .list-group {
    background: ${props => props.theme.background} !important;
    color: ${props => props.theme.reverse};
  }
  .list-group-item {
    color: ${props => props.theme.reverse};
    background: transparent;
  }
  .btn {
    position: fixed;
    bottom: 5px;
    right: 10px;
    border: 0px;
    border-radius: 5px;

    font-size: 14px;
    background: #9b1617;
    color: white;
    width: 250px;
    font-weight: 500;
    margin: auto;
    height: 45px;
  }
`
const Sidebar = ({
  show,
  onClose,
  leagueArray,
  handleSelectedLeagues,
  handleFilterLeagues,
  selectedLeagues
}) => (
  <StyledSidebar show={show} onHide={() => onClose()} placement="end">
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Choose Leagues to Filter</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body className="p-0">
      <ListGroup variant="flush">
        {leagueArray.map(league => (
          <ListGroup.Item
            key={league._id}
            className="border-0"
            onClick={() => {
              handleSelectedLeagues(league._id)
            }}
          >
            <Row>
              <Col className="col-1">
                <Form.Check
                  type="checkbox"
                  onChange={() => {
                    handleSelectedLeagues(league._id)
                  }}
                  checked={selectedLeagues?.some(id => id === league._id)}
                />
              </Col>
              <Col className="col-2">
                <img
                  src={league.imgSrc}
                  alt="league"
                  height="25"
                  className="mx-2"
                  width="25
"
                />
              </Col>
              <Col className="col-8">{league.name} </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <PrimaryButton onClick={() => handleFilterLeagues(selectedLeagues)}>
        Filter Now
      </PrimaryButton>
    </Offcanvas.Body>
  </StyledSidebar>
)
Sidebar.propTypes = {
  show: PropTypes.bool.isRequired,
  leagueArray: PropTypes.array.isRequired,
  selectedLeagues: PropTypes.array.isRequired,
  handleSelectedLeagues: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  handleFilterLeagues: PropTypes.func.isRequired
}
export default Sidebar
