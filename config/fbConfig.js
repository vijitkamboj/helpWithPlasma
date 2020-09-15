import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

var firebaseConfig = {
    apiKey: "AIzaSyA5WdvWVCZm2pXU85z9mC0J53sZu5W-hkk",
    authDomain: "helpwithplasma.firebaseapp.com",
    databaseURL: "https://helpwithplasma.firebaseio.com",
    projectId: "helpwithplasma",
    storageBucket: "helpwithplasma.appspot.com",
    messagingSenderId: "1029807398693",
    appId: "1:1029807398693:web:b6c216f8577a1bbdb704cc",
    measurementId: "G-PKVZGSTFK9"
  };


// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

firebase.firestore();
firebase.functions();

export default firebase;