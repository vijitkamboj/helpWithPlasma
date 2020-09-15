import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button';
import { createMuiTheme, ThemeProvider ,responsiveFontSizes,withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from 'next/link';
import firebase from "../config/fbConfig";

let theme = createMuiTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h5:{
          fontWeight: 500
      }
    },palette:{
        secondary:{
            main : "rgb(234,73,73)"
        }
    }
  });
theme = responsiveFontSizes(theme);

const Style = (theme) => ({
    gridItem: {
        height: "auto"
    },
    paper: {
        minHeight: 400,
        textAlign: "center"
    },
    buttonGoup:{
        marginTop:"8rem",
        marginBottom:"3rem"
    }
});

class Home extends Component {

    state={
        donorSize : 0,
        patientSize: 0
    }

    componentDidMount(){
        const db = firebase.firestore()
        db.collection(`donors`).get().then(
            snap => {
                this.setState({
                    donorSize : snap.size
                })
            }
        )
        db.collection(`patients`).get().then(
            snap => {
                this.setState({
                    patientSize : snap.size
                })
            }
        )
    }


    render() {
        const {classes} = this.props
        return (
            <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
            spacing = {1}
          >
            <Grid item className={classes.gridItem} >
                
                <Grid 
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                spacing = {0}
                >
                    <Grid item>
                        <Paper className = {classes.paper} elevation={0}>
                            <Link href="/">
                                <a>
                                    <div id = "logo" style={{marginTop:"1rem",marginLeft:"3rem"}}>
                                        <img src="untitled-1.png" height="auto" width="100%"/>
                                    </div>
                                </a>
                            </Link>
                            <ThemeProvider theme={theme}>
                                
                                <ButtonGroup elevation={10} variant="text"  aria-label="primary button group" className={classes.buttonGoup}>
            
                                    <Button color="secondary" className={classes.button} >
                                        <Typography variant="h5">
                                            <Link href="/donor">
                                                <a>
                                                Register as Donor
                                                </a>
                                            </Link>
                                        </Typography>
                                    </Button>

                                    <Button color="primary" className={classes.button}> 
                                        <Typography variant="h5">
                                            <Link href="/patient">
                                                <a>
                                                Patient Registration
                                                </a>
                                            </Link>
                                        </Typography>
                                    </Button>
                                
                                </ButtonGroup>

                                <Typography variant = "h6">
                                   
                                    {this.state.donorSize} {this.state.donorSize < 2 ? "donor" : "donors"} available 
                                 
                                </Typography>
                                <Typography variant = "h6">
                                   
                                    {this.state.patientSize} {this.state.patientSize < 2 ? "patient is" : "patients are"} waiting 
                                 
                                </Typography>
            
                            </ThemeProvider>
                        </Paper>
                    </Grid>

                    <Grid>
                        
                    </Grid>

                </Grid>
                <Divider variant="middle" />

            </Grid>
            

            <Grid item className={classes.gridItem} >
                <Paper className = {classes.paper} elevation={0}>

                </Paper>
            </Grid>
            <Grid item className={classes.gridItem} >
                <Paper className = {classes.paper} elevation={0}>

                </Paper>
            </Grid>
          </Grid>

        )
    }
}


export default withStyles(Style)(Home)