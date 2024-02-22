// AuthContext.js
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const login = () => {
    // Implement your login logic here
    setLoggedIn(true);
  };

  const logout = () => {
    // Implement your logout logic here
    setLoggedIn(false);
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
    } else {
      let errormessage = await response.text();
      console.log(errormessage);
    }
    
  };

  // const loginUser = (e) => {
  //   let loginObject = {"email": e.target.email.value, "password": e.target.password.value};

  //   let data = axios.post('http://localhost:5143/api/Account/login', loginObject).then(response => response.data);
  //   console.log(data);
  // };

  // let contextData = {
  //   loginUser:loginUser
  // };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loginUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
