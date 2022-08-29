import firebase from 'firebase/app';
import 'firebase/remote-config';

const firebaseConfig = {
  apiKey: 'AIzaSyBYr7oDq5DZFvR-QkDFYWyiUl-h-Nl0Yh4',
  authDomain: 'chessfimee-31ab3.firebaseapp.com',
  databaseURL: 'https://chessfimee-31ab3.firebaseio.com',
  projectId: 'chessfimee-31ab3',
  storageBucket: 'chessfimee-31ab3.appspot.com',
  messagingSenderId: '220064788883',
  appId: '1:220064788883:web:2c5e02bf42b44a29297866',
  measurementId: 'G-XCG3GMLS4X',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
