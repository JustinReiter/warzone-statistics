import React from 'react';
import { Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './LadderCard.css';

const formatDateString = (date) => {
    return new Date(date).toLocaleString().slice(0, 10);
};

const formatDateTimeString = (date) => {
    return new Date(date).toLocaleString().slice(0, 17).replace(",", "");
};

function LadderCard(props) {
    console.log(props);
    const history = useHistory();

    return (
        <Card onClick={() => {props.clickable && history.push("/ladder?ladder=" + props.ladder.lid)}}>
            <Card.Header>{props.ladder.ladder_name}</Card.Header>
            <Card.Body>
                <Card.Text>Games: {props.ladder.game_count}</Card.Text>
                <Card.Text>Template: {props.ladder.template_name}</Card.Text>
                <Card.Text>Start Date: {formatDateString(props.ladder.start_date)}</Card.Text>
                <Card.Text>End Date: {formatDateString(props.ladder.end_date)}</Card.Text>
                <Card.Subtitle>{props.ladder.active ? "Active" : "Inactive"}</Card.Subtitle>
            </Card.Body>
            <Card.Footer>Last Updated: {formatDateTimeString(props.ladder.last_updated)}</Card.Footer>
        </Card>
    );
}

export default LadderCard;