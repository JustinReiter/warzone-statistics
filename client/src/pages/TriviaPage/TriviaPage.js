import React, { Fragment } from 'react';
import { Card } from 'react-bootstrap';
import { Grid, Container, Link } from '@material-ui/core';
import { triviaList } from '../../Constants';
import './TriviaPage.css';

function renderLinks(links) {
    return links.map((link, idx) => (<Fragment key={idx}><Link target="_blank" rel="noopener noreferrer" href={link.link}>{link.text}</Link><br/></Fragment>));
}


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
                            <Card key={idx} className="ladder-card">
                                <Card.Header><h6>{trivia.title}</h6></Card.Header>
                                <Card.Body>{trivia.desc}</Card.Body>
                                { trivia.links && <Card.Footer>{renderLinks(trivia.links)}</Card.Footer>}
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
