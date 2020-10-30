import React from 'react';
import logo from './logo.svg';
import { Card, CardContent, Container, Typography, Link} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './LandingPage.css';

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

function LandingPage() {
  const classes = useStyles();

  return (
    <div className="App">
      
      <header className="App-header">
      <Container maxWidth="sm">
					<Card>
						<CardContent>
							<Typography variant="h4" component="h2">
								Warzone Statistics by JustinR17
							</Typography>

							<Typography className={classes.body} variant="body1" component="p">
								The purpose of this site is to summarize and display various statistics covering all of the ladders found on Warzone
							</Typography>
							<Typography className={classes.body} variant="body1" component="p">
								If you have any questions, feel free to write mail to me with suggestions
							</Typography>

							<Typography className={classes.profile} variant="body1" component="p">
								<Link href="https://www.warzone.com/Profile?p=1277277659"
									target="_blank"
									rel="noopener noreferrer"
								>
									JustinR17 Warzone Profile
								</Link>
							</Typography>
						</CardContent>
					</Card>
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
