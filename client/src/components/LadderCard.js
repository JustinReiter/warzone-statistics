import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import './LadderCard.css';

const formatDateString = (date) => {
    return date.slice(0, 10);
};

const formatDateTimeString = (date) => {
    return date.slice(0, 16).replace("T", " ");
};

function LadderCard(props) {
    // const classes = useStyles();
    console.log(props);
    return (
        <BootstrapCard>
            { <BootstrapCard.Header>{props.ladder.ladder_name}</BootstrapCard.Header> }
            <BootstrapCard.Body>
                <BootstrapCard.Title>{props.title}</BootstrapCard.Title>
                <BootstrapCard.Text>Games: {props.ladder.game_count}</BootstrapCard.Text>
                <BootstrapCard.Text>Template: {props.ladder.template_name}</BootstrapCard.Text>
                <BootstrapCard.Text>Start Date: {formatDateString(props.ladder.start_date)}</BootstrapCard.Text>
                <BootstrapCard.Text>End Date: {formatDateString(props.ladder.end_date)}</BootstrapCard.Text>
                <BootstrapCard.Text>{props.ladder.active ? "Active" : "Inactive"}</BootstrapCard.Text>
            </BootstrapCard.Body>
            { <BootstrapCard.Footer>Last Updated: {formatDateTimeString(props.ladder.last_updated)}</BootstrapCard.Footer> }
        </BootstrapCard>
    );
}

export default LadderCard;