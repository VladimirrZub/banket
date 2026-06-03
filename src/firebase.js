import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyAwJFLZ0i-yxSYcASk5GOw2UeUFbhofK10',
	authDomain: 'banketa-fd151.firebaseapp.com',
	projectId: 'banketa-fd151',
	storageBucket: 'banketa-fd151.firebasestorage.app',
	messagingSenderId: '930446994850',
	appId: '1:930446994850:web:bff4f0c9d36810cbdd96fb',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
