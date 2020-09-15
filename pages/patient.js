import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider ,responsiveFontSizes,withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import firebase from "../config/fbConfig";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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
      h4:{
          fontWeight: 700,
          padding:"1rem",
          color:"rgb(90, 90, 90)",
          textAlign:"center"
      },
      h5:{
        fontWeight: 600,
        padding:"1rem",
        color:"rgb(90, 90, 90)",
        textAlign:"center",
        margin : "2rem"
    }
    },palette:{
        secondary:{
            main : "rgb(234,73,73)"
        }
    }
  })
theme = responsiveFontSizes(theme);

const Style = ((theme) => ({
    container: {
        height: "100%",
        width: "100%"
    },
    gridItem:{
        flexGrow: 1,
        width: "100%"
    },
    paper:{
        height: "100%",
        width: "100%", 
    },
    buttonGroup:{
        marginTop:"4rem",
    },
    buttons:{
        fontWeight:600
    }

}));

const questions = {
    0: ["Has the patient contracted COVID-19 recently?","option",["Yes","No"] ,"Contraction",true],
    1: ["What is the patient's name ?","text","","Name",true],
    2: ["What is the age of patient ? ","text","","Age",true],
    3: ["What is the gender of the patient ?","option",["Male","Female"],"Gender",true],
    4: ["What is the blood group of the patient ?","option",["A+","A-","B+","B-","O+","O-","AB+","AB-"],"Blood Group",true],
    5: ["Mobile Number","text","","Mobile Number",true],
    6: ["Email Address","text","","Email",false],
    7:["City you are curretly in ","text","","City",true],
    8: ["Where is the patient hospitalised ?","text","","Hospital",true],
    9: ["Do you have case sheet from doctor?","option",["Yes","No"],"Case Sheet",true]
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }



class Patient extends Component {
    state={
      ques:0,
      response:{0:"",1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:"",9:""},
      end:false,
      start:true,
      value: null,
      empty:false,
      confirm: false,
      success: false
    }

    handleNext = (q) => {
        if (q===8){
            this.setState({
                ques : q + 1,
                value: this.state.response[q+1],
                end:true
            })
            return 0
        }
        if (q == 9){
            this.handleConfirm
            return 0
        }
        this.setState({
            ques : q + 1,
            start : false,
            value: this.state.response[q+1] ? this.state.response[q+1] : null,
            
        })
    }

    handlePrevious = (q) =>{
        if (q===1){
            this.setState({
                ques : q -1 ,
                value: this.state.response[q-1] ,
                start:true
            })
            return 0
        }
        this.setState({
            ques : q -1 ,
            value: this.state.response[q-1],
            end: false
        })
    }

    handleChange = (e,q) => {
        e.preventDefault();
        const new_response = this.state.response
        new_response[q] = e.target.value
        this.setState({
            response: new_response,
            value: new_response[q],
            empty : false
        })
    }

    handleConfirm = () => {
        const {response} = this.state
        for (let i=0;i<9;i++){
            if (questions[i][4] === true && response[i] === ""){
                this.setState({
                    empty:true
                })
                return 0
            }
        }
        this.setState({
            confirm: true
        })
    }

    handleSubmission = () => {
        
        const {response} = this.state
        const db = firebase.firestore()
        db.collection(`patients`).add(response)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        this.setState({
            ques:0,
            response:{0:"",2:"",3:"",4:"",5:"",6:"",7:"",8:"",9:""},
            end:false,
            start:true,
            value: null,
            open:false,
            confirm: false,
            success: true
        })
    }
    
    handleClose = () => {
        this.setState({
            empty:false,
            confirm: false,
            success:false
        })
    };
    
    showField = (q,value) =>{
        const ques = questions[q]
        switch (questions[q][1]) {
            case "text":
                return(<TextField value={value ? value : ""} required={ques[4]} placeholder={ques[3]} label={ques[4] ? "Required" : "Optional"} id="outlined-required" color="secondary" variant="outlined" onChange={(e)=>{this.handleChange(e,q)}}/>)
            case "option":
                return(
                    <FormControl required variant="outlined" style={{minWidth:"150px"}} >
                        <InputLabel >{questions[q][3]}</InputLabel>
                        <Select
                        value={value ? value : ""}
                        onChange={(e)=>{this.handleChange(e,q)}}
                        label={questions[q][3]}
                        color="secondary"
                        >
                        {
                            questions[q][2].map((option) => <MenuItem value={option}>{option}</MenuItem>)
                        }
                        </Select>
                        
                    </FormControl>
                )
        
            default:
                break;
        }
    }
    
    render() {
        
        const {classes} = this.props
        const {ques,start,end,value,empty,confirm,success} = this.state
        return (
            <Grid 
            style={{height:"100vh",padding:"24px"}}
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            spacing = {4}
            >

                <Grid item >
                    <Link href="/">
                        <a>
                            <div id = "logo">
                                <img src="untitled-1.png" height="auto" width="100%"/>
                            </div>
                        </a>
                    </Link>
                </Grid>

                <ThemeProvider theme={theme}>
                    <Grid item className = {classes.gridItem}>
                            <Paper elevation={10} className = {classes.paper}>
                                <Grid 
                                    container 
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="stretch"
                                    className={classes.container}
                                >
                                    <Typography variant="h4" >
                                        Patient Registration
                                    </Typography>

                                    <Divider variant="middle" />

                                    <Grid 
                                        item
                                     >
                                        <Paper elevation= {0} style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center"}}>
                                            <Typography variant="h5">
                                                {questions[ques][0]}
                                            </Typography>
                                            {this.showField(ques,value)}
                                            
                                          
                                            <ButtonGroup color="primary" elevation={10} variant="text"  className={classes.buttonGroup} aria-label="primary button group" >
                                                <Button className={classes.buttons} color="secondary" disabled={start} onClick={()=>this.handlePrevious(ques)} >Previous</Button>
                                                {end 
                                                ? <Button className={classes.buttons} color="primary" onClick={this.handleConfirm} >Confirm</Button> 
                                                : <Button className={classes.buttons} color="primary" onClick={()=>this.handleNext(ques)} >Next</Button> }
                                            </ButtonGroup>
                                            
                                        </Paper>
                                        
                                    </Grid>
                                    
                                </Grid>
                            </Paper>
                        </Grid>

                        <Dialog
                            open={empty}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Please fill all of the required information."}</DialogTitle>
                            
                            <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Close
                            </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={confirm}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirm the submission ?"}</DialogTitle>
                            <DialogContent>
                            As we try to match a donor for you, we hope that the information that you have provided here is complete and accurate to the best of your knowledge. 
                            </DialogContent>
                            
                            <DialogActions>
                            <Button onClick={this.handleClose} color="secondary">
                                Disagree
                            </Button>
                            <Button onClick={this.handleSubmission} color="primary">
                                Agree
                            </Button>
                            </DialogActions>
                        </Dialog>

                        <Snackbar open={success} autoHideDuration={4000} onClose={this.handleClose}>
                            <Alert onClose={this.handleClose} severity="success">
                                    The patient is successfully registered.
                            </Alert>
                        </Snackbar>
                </ThemeProvider>
                
            </Grid>

        )
    }
}

export default withStyles(Style)(Patient)
