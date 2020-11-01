import React from 'react';
import logo from './logo.svg';
import { Container } from '@material-ui/core';
import './LandingPage.css';
import Card from './components/Card';

function LandingPage() {

  return (
    <div className="App">
      
      <header className="App-header">
      <Container maxWidth="sm">
		  <Card title={"HI"} body={"Test"} />
        </Container>

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload test.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default LandingPage;
