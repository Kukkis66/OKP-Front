// AuthContext.js
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigateToNewPage = () => {
    window.location.href = '/';
  };

  localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null

  const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem("authToken") ? true : false);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("authToken") ? jwtDecode(localStorage.getItem("authToken")) : null);

  const login = () => {
    // Implement your login logic here
    setLoggedIn(true);
  };

  const logout = () => {
    // Implement your logout logic here
    setLoggedIn(false);
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("authToken");
  };

  const loginUser = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    let response = await fetch('http://localhost:5143/api/Account/login', {
      method:'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({'email':e.target.email.value, 'password':e.target.password.value})
    });
    if (response.status === 200)
    {
      let data = await response.json()
      console.log(data);
      console.log(data.jwtToken);
      setAuthToken(data.jwtToken);
      setCurrentUser(jwtDecode(data.jwtToken));
      console.log(jwtDecode(data.jwtToken));
      console.log(authToken);
      localStorage.setItem("authToken", JSON.stringify(data.jwtToken));
      setLoggedIn(true);
      navigateToNewPage();

    } else {
      let errormessage = await response.text();
      setError(errormessage);
      console.log(errormessage);
      setTimeout(() => {
        setError(null)
      }, 3000);
    }
    
  };

  const registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch('http://localhost:5143/api/Account/register', {
      method:'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({'email':e.target.email.value, 'username':e.target.username.value, 'password':e.target.password.value, 'confirmPassword': e.target.confirmPassword.value, 'roles': ["Reader"]})
    });
    
    if (response.status == 200) {
      let data = await response.json()
      console.log(data);
      console.log(data.value);
    } else {
      let error = await response.text();
      console.log(error);
    }
  };

  // const loginUser = (e) => {
  //   let loginObject = {"email": e.target.email.value, "password": e.target.password.value};

  //   let data = axios.post('http://localhost:5143/api/Account/login', loginObject).then(response => response.data);
  //   console.log(data);
  // };

  let contextData = {
    isLoggedIn:isLoggedIn,
    login:login,
    logout:logout,
    loginUser:loginUser,
    error:error,
    registerUser:registerUser,
    currentUser:currentUser,
    authToken:authToken
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
