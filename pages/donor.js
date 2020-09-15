import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';
import Router from 'next/router'
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MomentUtils from '@date-io/moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

let theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Roboto'
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
        marginTop:"3rem",
    },
    buttons:{
        fontWeight:600
    }

}));

const questions = {
    0: ["What is the donor's name ?","text","","Name",true],
    1: ["What is the donor's age ?","text","","Age",true],
    2: ["What is the gender of the donor ? ","option",["Male","Female"],"Gender",true],
    3: ["What is the blood group of the patient ?","option",["A+","A-","B+","B-","O+","O-","AB+","AB-"],"Blood Group",true],
    4: ["Have you tested positive COVID-19 ?","option",["Yes","No"],"Test",true],
    5: ["What was your date of recovery","date","","Recovery Date",true],
    6: ["Did you test NEGATIVE in last 2 weeks?","option",["Yes","No"],"Result",true],
    7: ["Which of the following difficulties you have faced while being COVID-19 positive","multiple",["Severe Cough","High Fever","Shortness of breath","Loss of taste or smell","Chest Pain","Diarrhoea","Pneumonia"],true],
    8: ["BMI","text","","BMI",true,],
    9: ["Email Address","text","","Email",false],
    10: ["Phone Number","text","","Phone Number",true,],
    11:["City you are curretly in ","text","","City",true]
    
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const defaultState = {0:"",1:"",2:"",3:"",4:"",5:new Date(),6:"",7:{"Severe Cough":0,"High Fever":0,"Shortness of breath":0,"Loss of taste or smell":0,"Chest Pain":0,"Diarrhoea":0,"Pneumonia":0},8:"",9:"",10:"",11:""}

class Donor extends Component {
    state={
      ques:0,
      response:defaultState,
      end:false,
      start:true,
      value: null,
      empty:false,
      confirm: false,
      success: false,
      agree:false
    }


    handleAgree = () => {
        
        this.setState({
            agree : true
        })
    }

    handleDisagree = ()=>{
        Router.push({
            pathname: `/`,
        })
    }

    handleNext = (q) => {
        if (q===10){
            this.setState({
                ques : q + 1,
                value: this.state.response[q+1],
                end:true
            })
            return 0
        }
        if (q == 11){
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
        const new_response = this.state.response
        new_response[q] = e.target.value
        this.setState({
            response: new_response,
            value: new_response[q],
            empty : false
        })
    }

    handleDate = (date,q) => {
        
        const new_response = this.state.response
        new_response[q] =  date
        this.setState({
            response: new_response,
            value: date,
            empty : false
        })
    }

    handleCheck = (e,q,name) => {
        let new_response = this.state.response
        new_response[q][name] = Number(e.target.checked)
        this.setState({
            response: new_response,
            value: new_response[q],
            empty : false
        })
    }

    handleConfirm = () => {
        const {response} = this.state
        for (let i=0;i<12;i++){
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
        const current_date = new Date()

        response[5] = Math.abs(Math.ceil((current_date - response[5]) / (1000 * 60 * 60 * 24)))
        response[7] = Object.values(response[7])

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(response)
          };  
        fetch("http://localhost:5000/", requestOptions).then((data)=> data.json()).then(d => console.log(d))

        this.setState({
            ques:0,
            response:defaultState,
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
        switch (ques[1]) {
            case "text":
                return(<TextField 
                        value={value ? value : ""} 
                        required={ques[4]} 
                        placeholder={ques[3]} 
                        label={ques[4] ? "Required" : "Optional"} 
                        id="outlined-required" 
                        color="secondary" 
                        variant="outlined" 
                        onChange={(e)=>{this.handleChange(e,q)}}
                            
                        />)
            case "option":
                return(
                    <FormControl required variant="outlined" style={{minWidth:"150px"}} >
                        <InputLabel >{ques[3]}</InputLabel>
                        <Select
                        value={value ? value : ""}
                        onChange={(e)=>{this.handleChange(e,q)}}
                        label={ques[3]}
                        color="secondary"
                        >
                        {
                            ques[2].map((option) => <MenuItem value={option}>{option}</MenuItem>)
                        }
                        </Select>
                        
                    </FormControl>
                )
            case 'date':
                return(
                    <MuiPickersUtilsProvider utils={MomentUtils}>
     
                        <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/DD/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={value ? value : new date()}
                        onChange={(date) => this.handleDate(date,q)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                    </MuiPickersUtilsProvider>
                )
            case "multiple":
                    return(
                        <FormGroup row style={{margin:"5px"}}>
                            {
                                ques[2].map((symp)=>{
                                    return(
                                        <FormControlLabel
                                            control={
                                            <Checkbox
                                                checked={!!value[symp]}
                                                onChange={(e) => this.handleCheck(e,q,symp)}
                                                name={symp}
                                                color="primary"
                                            />
                                            }
                                            label={symp}
                                        />
                                    )
                                })
                            }

                        </FormGroup>
                    )
        
            default:
                break;
        }
    }
    
    render() {
        console.log(this.state)
        const {classes} = this.props
        const {ques,start,end,value,empty,confirm,success,agree} = this.state
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
                                <img src="/logo.png" height="auto" width="100%"/>
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
                                        Donor registration
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
                                                <Button className={classes.buttons}  color="secondary" disabled={start} onClick={()=>this.handlePrevious(ques)} >Previous</Button>
                                                {end 
                                                ? <Button className={classes.buttons}  color="primary" onClick={this.handleConfirm} >Confirm</Button> 
                                                : <Button className={classes.buttons}  color="primary" onClick={()=>this.handleNext(ques)} >Next</Button> }
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
                            We are grateful to you for being a superhero! Not much, but we highly request you to fill this form with accurate information as per your best knowledge. 
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

                        <Dialog
                            open={!agree}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Am I a donor ?"}</DialogTitle>
                            <DialogContent>
                            1. I should have tested positive for COVID-19.<br />
                            2. I do not have any children (women only).<br />
                            3. I do not have diabetes.<br />
                            4. I do not have high blood pressure.<br />
                            5. I am not over the age of 65 or under the age of 18.<br />
 
                            </DialogContent>
                            
                            <DialogActions>
                            <Button onClick={this.handleDisagree} color="secondary">
                                No
                            </Button>
                            <Button onClick={this.handleAgree} color="primary">
                                Yes
                            </Button>
                            </DialogActions>
                        </Dialog>

                        <Snackbar open={success} autoHideDuration={6000} onClose={this.handleClose}>
                            <Alert onClose={this.handleClose} severity="success">
                                    You are successfully registered.
                            </Alert>
                        </Snackbar>
                </ThemeProvider>
                
            </Grid>

        )
    }
}

export default withStyles(Style)(Donor)

