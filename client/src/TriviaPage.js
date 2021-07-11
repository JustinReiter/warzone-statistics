import React from 'react';
import { Card } from 'react-bootstrap';
import { Grid, Container, Link } from '@material-ui/core';
import { triviaList } from './Constants';
import './PlayerPage.css';

function TriviaPage(props) {

    return (
        <div className="players-page">
            <Container>
                <Grid
                    container
                    spacing={1}
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-around"
                    className="trivia-page"
                >
                    { triviaList.map((trivia, idx) => {
                        return (
                        <Grid
                            item
                            md={12} xs={12}
                        >
                            <Card key={idx} style={{color: 'black'}}>
                                <Card.Header><h6>{trivia.title}</h6></Card.Header>
                                <Card.Body>{trivia.desc}</Card.Body>
                                <Card.Footer>
                                    { trivia.links && trivia.links.map((link, idx) => {
                                        return <Link target="_blank" rel="noopener noreferrer" href={link.link} key={idx}>{link.text}</Link>
                                    })}
                                </Card.Footer>
                            </Card>
                        </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default TriviaPage;
