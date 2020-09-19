import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';
import Router from 'next/router'
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider ,responsiveFontSizes,withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Questions from "../Components/questions";
import DonorPrompts from "../Components/donorPrompts"

let theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Roboto'
      ].join(','),
      h4:{
          fontWeight: 700,
          padding:"1rem",
          color:"rgb(90, 90, 90)",
          textAlign:"center",
      },
      h5:{
        fontSize:"1.5rem",
        fontWeight: 400,
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
      agree:false,
      questions:questions
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

    handleClose = () => {
        this.setState({
            empty:false,
            confirm: false,
            success:false
        })
    };

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
            confirm: false,
            success: true
        })
    }
    

    
    render() {
        console.log(this.state)
        const {classes} = this.props
        const {ques,start,end,empty,confirm,value,success,agree,questions} = this.state
        console.log(questions)
        return (
            <Grid 
            style={{height:"100vh",padding:"24px"}}
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            spacing = {4}
            className={classes.container}
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
                                            
                                            <Questions 
                                            handleDate={this.handleDate} 
                                            handleCheck={this.handleCheck}
                                            handleChange={this.handleChange}
                                            questions={questions}
                                            q={ques}
                                            value={value}
                                            />
                                          
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

                        <DonorPrompts 
                            success = {success}
                            confirm = {confirm}
                            empty = {empty}
                            agree = {agree}
                            handleClose = {this.handleClose}
                            handleDisagree = {this.handleDisagree}
                            handleAgree = {this.handleAgree}
                            handleSubmission = {this.handleSubmission}
                        />

                </ThemeProvider>
                
            </Grid>

        )
    }
}

export default withStyles(Style)(Donor)

