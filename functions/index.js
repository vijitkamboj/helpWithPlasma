const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();


const D2P = {
  "O-": ["O-", "O+"],
  "O+": ["O-", "O+"],
  "A-":["O-", "O+","A-","A+"],
  "A+": ["O-", "O+","A-","A+"],
  "B+":["O-", "O+","B-","B+"],
  "B-":["O-", "O+","B-","B+"],
  "AB+":["O-", "O+","B-","B+","A-","A+","AB+","AB-"],
  "AB-":["O-", "O+","B-","B+","A-","A+","AB+","AB-"]
}

const P2D = {
  "O+" : ["O-", "O+","B-","B+","A-","A+","AB+","AB-"],
  "O-" : ["O-", "O+","B-","B+","A-","A+","AB+","AB-"],
  "A-":["AB+","AB-","A-","A+"],
  "A+": ["AB+","AB-","A-","A+"],
  "B+":["AB+","AB-","B-","B+"],
  "B-":["AB+","AB-","B-","B+"],
  "AB-":["AB+","AB-"],
  "AB+":["AB+","AB-"]
}


exports.onPatientAdd = functions.firestore
  .document('patients/{id}')
  .onCreate((snap, context) => {
    db.collection('donors').where(4,"in",P2D[[snap.data()[4]]]).orderBy('probability','desc').limit(1).get().then(
      (data) => {
        data && db.collection('match').add({
          "donorId":data[0].keys[1],
          "patientId": context.params.id
        })
      }
    )
  });

exports.onDonorAdd = functions.firestore
.document('donors/{id}')
.onCreate((snap, context) => { /* ... */ });