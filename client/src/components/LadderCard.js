import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import './LadderCard.css';

function LadderCard(props) {
    // const classes = useStyles();
    console.log(props);
    return (
        <BootstrapCard>
            { props.header && <BootstrapCard.Header>{props.header}</BootstrapCard.Header> }
            <BootstrapCard.Body>
                <BootstrapCard.Title>{props.title}</BootstrapCard.Title>
                <BootstrapCard.Text>{props.body}</BootstrapCard.Text>
                {/* <Button variant="primary">Go somewhere</Button> */}
            </BootstrapCard.Body>
            { props.footer && <BootstrapCard.Footer>{props.footer}</BootstrapCard.Footer> }
        </BootstrapCard>
    );
}

export default LadderCard;