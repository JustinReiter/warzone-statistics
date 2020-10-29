import React from 'react';
import logo from './logo.svg';
import { Button, Card, CardContent, Container, Typography} from '@material-ui/core';
import './ContactPage.css';

function ContactPage() {
  return (
    <div className="App">
        <header className="App-header">
        <Container maxWidth="sm">
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h2">
                        Warzone Statistics
                    </Typography>
                    <Typography variant="body1" component="p">
                        The purpose of this site is to summarize and display various statistics covering all of the ladders found on Warzone
                    </Typography>
                </CardContent>

            </Card>
        </Container>
        <img src={logo} className="App-logo" alt="logo" />
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

export default ContactPage;
