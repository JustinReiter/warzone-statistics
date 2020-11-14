import React, { Fragment } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { CardActionArea } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './LadderCard.css';

const formatDateString = (date) => {
    return new Date(date).toLocaleString().slice(0, 10);
};

const formatDateTimeString = (date) => {
    return new Date(date).toLocaleString().slice(0, 17).replace(",", "");
};

// Render the card container dependent on if card should be clickable
const renderCardContainer = (props) => {
    if (props.clickable) {
        return (
            <CardActionArea>
                { renderCardText(props) }
            </CardActionArea>
        );
    } else {
        return renderCardText(props);
    }
}

// Render card text into the component
const renderCardText = (props) => {
    return (
        <Fragment>
            <Card.Header>{props.ladder.ladder_name}</Card.Header>
            <Card.Body>
                <Card.Text>Games: {props.ladder.game_count}</Card.Text>
                <Card.Text>Template: {props.ladder.template_name}</Card.Text>
                <Card.Text>Start Date: {formatDateString(props.ladder.start_date)}</Card.Text>
                <Card.Text>End Date: {formatDateString(props.ladder.end_date)}</Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted footer-row">
                <Card.Text>Last Updated: {formatDateTimeString(props.ladder.last_updated)}</Card.Text>
                <Card.Subtitle className="active-badge">{props.ladder.active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge> }</Card.Subtitle>
            </Card.Footer>
        </Fragment>
    )
};

function LadderCard(props) {
    const history = useHistory();

    return (
        <Card key={props.ladder.lid} className="ladder-card" onClick={() => {props.clickable && history.push("/ladder?ladder=" + props.ladder.lid)}}>
            { renderCardContainer(props) }
        </Card>
    );
}

export default LadderCard;