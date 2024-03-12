// AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
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
  const [userRegistered, setUserRegistered] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState({ data: { product: [] } });
  const [heartFilled, setHeartFilled] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    const getUserFavorites = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(`http://localhost:5143/api/Favorites/user-favorites/${currentUser.Id}`);
          console.log(userFavorites);
          setUserFavorites(response.data);
          
        }
      } catch (error) {
        console.error('Something went wrong:', error.message);
      }
    };

    getUserFavorites();

    // Clean up function to clear data when component unmounts or currentUser becomes null
    return () => setUserFavorites([]);

  }, [currentUser, heartFilled, favorites]);


  const fetchFavorites = async () => {
    try {
      const backendRes = await fetch(`http://localhost:5143/api/DataHub/GetUserFavorites/${currentUser.Id}`);
      const backendData = await backendRes.json();
      console.log(backendData);
      setFavorites(backendData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const logoutOnTokenExpiration = () => {
    if (authToken) {
      const decodeToken = jwtDecode(authToken);
      const expirationTime = decodeToken.exp * 1000
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        logout();
      }
    }
  }

  useEffect(() => {
    logoutOnTokenExpiration();
  }, []);

  useEffect(() => {
    const interval = setInterval(logoutOnTokenExpiration, 60000); // Check token expiration every minute
    return () => clearInterval(interval); // Clean up interval
  }, [authToken]); // Re-run effect when authToken changes


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
    navigateToNewPage();
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
      }, 5000);
    }
    
  };

  const registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch('http://localhost:5143/api/Account/register', {
      method:'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({'email':e.target.email.value, 'username':e.target.username.value, 'password':e.target.password.value, 'confirmPassword': e.target.confirmPassword.value})
    });
    
    if (response.status == 200) {
      let data = await response.json()
      console.log(data);
      console.log(data.value);
      setUserRegistered(true);
      setTimeout(() => {
        setUserRegistered(false);
      }, 30000);
    } else {
      let error = await response.text();
      console.log(error);
      setError(error);
      setTimeout(() => {
        setError(null)
      }, 7000);
    }
  };

  const toggleFavorite = async (buildingId, userId) => {
    // Toggle favorite status locally
    if (!currentUser) {
      console.log("user is not logged in!");
      return;
    }
    

    try {
      // Make POST request to backend API to save favorite status
      const response = await axios.post('http://localhost:5143/api/Favorites', { "key":buildingId, "userId": userId });
      console.log("Succeeded favorite", response);
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };


  let contextData = {
    isLoggedIn:isLoggedIn,
    login:login,
    logout:logout,
    loginUser:loginUser,
    error:error,
    registerUser:registerUser,
    currentUser:currentUser,
    authToken:authToken,
    userRegistered:userRegistered,
    setShowFavorites:setShowFavorites,
    showFavorites:showFavorites,
    toggleFavorite:toggleFavorite,
    fetchFavorites:fetchFavorites,
    favorites:favorites,
    setFavorites:setFavorites,
    heartFilled:heartFilled,
    setHeartFilled:setHeartFilled,
    userFavorites:userFavorites,
    setUserFavorites:setUserFavorites
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
