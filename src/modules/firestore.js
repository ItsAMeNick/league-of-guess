import firebase from 'firebase/app';
import firestore from 'firebase/firestore'; // eslint-disable-line no-unused-vars

var firebaseConfig = {
    apiKey: process.env.REACT_APP_FS_API_KEY,
    authDomain: process.env.REACT_APP_FS_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FS_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FS_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FS_MESSAGE_ID,
    appId: process.env.REACT_APP_FS_APP_ID
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
