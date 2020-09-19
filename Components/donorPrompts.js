import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {``
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

class DonorPrompts extends Component{
    
    render(){
        const {agree,empty,confirm,success,handleAgree,handleDisagree,handleClose,handleSubmission} = this.props
        return(
            <React.Fragment>
                <Dialog
                    open={empty}
                    onClose={handleClose}
                  
                >
                    <DialogTitle id="alert-dialog-title">{"Please fill all of the required information."}</DialogTitle>
                    
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={confirm}
                    onClose={handleClose}
                    
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm the submission ?"}</DialogTitle>
                    
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Disagree
                        </Button>
                        <Button onClick={handleSubmission} color="primary">
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={!agree}
                    onClose={handleClose}
                 
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
                    <Button onClick={handleDisagree} color="secondary">
                        No
                    </Button>
                    <Button onClick={handleAgree} color="primary">
                        Yes
                    </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                            You are successfully registered.
                    </Alert>
                </Snackbar>
            </React.Fragment>
        )
    }
}

export default DonorPrompts