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
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext();
const AuthProviders = ({ children }) => {
  const auth = getAuth(app);

  const [Quser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createNewUser = (data) => {
    const { email, Name, photo, password } = data;
    return createUserWithEmailAndPassword(auth, email, password).then(
      (result) => {
        const user = result.user;
        return updateProfile(user, {
          displayName: Name,
          photoURL: photo,
        }).then(() => result);
      }
    );
  };

  const userLogin = (data) => {
    const { email, password } = data;
    return signInWithEmailAndPassword(auth, email, password).then(
      (result) => result
    );
  };

  const GoogleProvider = new GoogleAuthProvider();

  const GoogleLogin = () => {
    return signInWithPopup(auth, GoogleProvider)
      .then((res) => res)
      .catch((err) => {
        console.log("error", err.message);
      });
  };

  const Logout = () => {
    return signOut(auth).then((res) => res);
  };

  useEffect(() => {
    const Unsubsribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        const user = { email: currentUser?.email };
        axiosPublic.post("/jwt", user).then((res) => {
          if (res?.data?.token) {
            localStorage.setItem("access-token", res.data.token);
          }
        });
      } else {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });
    return () => {
      Unsubsribe();
    };
  }, []);

  //   All Funtion keeping in here to provide them one at a time
  const AuthInfo = {
    createNewUser,
    userLogin,
    GoogleLogin,
    setUser,
    Quser,
    loading,
    setLoading,
    Logout,
  };
  return (
    <AuthContext.Provider value={AuthInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
