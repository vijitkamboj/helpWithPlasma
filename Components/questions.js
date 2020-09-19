import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MomentUtils from '@date-io/moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';


class Questions extends Component {

    showField = (q,value) =>{
        console.log(this.props)
        const {handleChange,handleCheck,handleDate,questions} = this.props
        const ques = questions[q]
        switch (ques[1]) {
            case "text":
                return(<TextField 
                        value={value ? value : ""} 
                        required={ques[4]} 
                        placeholder={ques[3]} 
                        label={ques[4] ? "Required" : "Optional"} 
                      
                        color="secondary" 
                        variant="outlined" 
                        onChange={(e)=>{handleChange(e,q)}}
                            
                        />)
            case "option":
                return(
                    <FormControl required variant="outlined" style={{minWidth:"150px"}} >
                        <InputLabel >{ques[3]}</InputLabel>
                        <Select
                        value={value ? value : ""}
                        onChange={(e)=>{handleChange(e,q)}}
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
                        
                        variant="inline"
                        format="MM/DD/yyyy"
                        margin="normal"
                    
                        value={value ? value : new date()}
                        onChange={(date) => handleDate(date,q)}
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
                                                onChange={(e) => handleCheck(e,q,symp)}
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
        const {q,value} = this.props
        return(
            this.showField(q,value)
        )
    }
}

export default (Questions)

