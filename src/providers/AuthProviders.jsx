import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../Firebase/firebase.config";
import axios from 'axios';
import {doc,setDoc,getDoc,getFirestore} from 'firebase/firestore';
import { Firestore } from "firebase/firestore";
export const AuthContext = createContext();
const AuthProviders = ({ children }) => {
  const auth = getAuth(app);
  // User saving 
  const [Quser,setUser] = useState(null);

  // loading while user isn't fetch yet
  const [loading,setLoading]=useState(true);

//   Register New User 

  const createNewUser = (data) => {
     const {email, Name, photo, password}=data;
     console.log("register new user",Name);
     return createUserWithEmailAndPassword(auth, email, password).then(
       (result) => {
         const user = result.user;
         return updateProfile(user, {
           displayName: Name,
           photoURL: photo,
         }).then(()=>result);
       }
     );
   };

  // login Funtion

  const userLogin = (data)=>{
    const {email,password}=data;
    return signInWithEmailAndPassword(auth,email,password)
    .then(result=>result);
  }

  // Login With Google
  const GoogleProvider = new GoogleAuthProvider;

  const GoogleLogin = ()=>{
    return signInWithPopup(auth,GoogleProvider)
    .then(res=>res)
    .catch(err=>
      {console.log('error',err.message);}
    )
  }

  // Logout Functionality

  const Logout=()=>{
    return signOut(auth).then(res=>res);
  }





  // 
  useEffect(()=>{
    const Unsubsribe = onAuthStateChanged(auth,async (currentUser)=>{
      setUser(currentUser);
      
      if(currentUser?.email){
        
        const user = {email:currentUser?.email};
        axios.post('http://localhost:5000/login',user,{withCredentials:true})
      .then(res=>{res.data})
      }
      else{
        axios.post('http://localhost:5000/logout',{},{withCredentials:true})
      .then(res=>{res.data})
      }
      setLoading(false);

    })
    return ()=>{
      Unsubsribe(); 
    }
  },[])



//   All Funtion keeping in here to provide them one at a time
  const AuthInfo = {
    createNewUser,
    userLogin,
    GoogleLogin,
    setUser,
    Quser,
    loading,
    setLoading,
    Logout
  }
  return <AuthContext.Provider value={AuthInfo}>{children}</AuthContext.Provider>;
};
  


export default AuthProviders;
