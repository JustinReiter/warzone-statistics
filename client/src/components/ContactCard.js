import React from 'react';
import { Card as MaterialCard, CardContent, Container, Typography, Link} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Card.css';

const useStyles = makeStyles({
	header: {
		marginBottom: 12
	},
	body: {
		marginTop: 12
	},
	profile : {
		marginTop: 24
	}
});

function ContactCard() {
    const classes = useStyles();
    return (
        <Container maxWidth="sm">
            <MaterialCard className="card-div">
                <CardContent>
                    <Typography variant="h4" component="h2">
                        Warzone Statistics by JustinR17
                    </Typography>

                    <Typography className={classes.body} variant="body1" component="p">
                        The purpose of this site is to summarize and display various statistics covering all of the ladders found on Warzone. It is intended to be an easier way in navigating and exploring the Seasonal.
                    </Typography>
                    <Typography className={classes.body} variant="body1" component="p">
                        If you have any questions or find bugs, feel free to send mail to me or to ping me on discord.
                    </Typography>

                    <Typography className={classes.profile} variant="body1" component="p">
                        <Link href="https://www.warzone.com/Profile?p=1277277659"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            JustinR17 WZ Profile
                        </Link>
                    </Typography>
                </CardContent>
            </MaterialCard>
        </Container>
    );
}

export default ContactCard;