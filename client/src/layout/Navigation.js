import { Navbar, Nav, Container } from "react-bootstrap";
import React from "react";

const Navigation = () => {
  return (
    <div>
      <Navbar expand="lg" style={{ backgroundColor: "#433878" }}>
        <Container fluid>
          <Navbar.Brand href="/" style={{ color: "white" }}>
            intelligent-crawler
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/decks">My Decks</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
export default Navigation;
