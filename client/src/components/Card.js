import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import { Link } from '@material-ui/core';
import './Card.css';

function Card(props) {
    return (
        <BootstrapCard className="card-div">
            { props.header && <BootstrapCard.Header>{props.header}</BootstrapCard.Header> }
            <BootstrapCard.Body>
                <BootstrapCard.Title>{props.title}</BootstrapCard.Title>
                <BootstrapCard.Text>{props.body}</BootstrapCard.Text>
                { props.showContact && 
                    <BootstrapCard.Text>
                        <Link href="https://www.warzone.com/Profile?p=1277277659"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            JustinR17 WZ Profile
                        </Link>
                    </BootstrapCard.Text>
                }
            </BootstrapCard.Body>
            { props.footer && <BootstrapCard.Footer>{props.footer}</BootstrapCard.Footer> }
        </BootstrapCard>
    );
}

export default Card;
