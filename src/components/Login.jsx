import { useState } from 'react';
import close from '../assets/close.png'
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Login.css'


export const Login = ({loginForm, handleLoginForm}) => {
    const [newUser, setNewUser] = useState(false)
    const { login } = useAuth();



    const handleNewUser = () => {
        setNewUser(!newUser)
    }

    return (
        <div>
          
    
          {loginForm && (
            <div className="overlay">
              <div className="popup">
                <span className="close" onClick={handleLoginForm}><img src={close} alt="close"/></span>
                {newUser ? (
                <div>
                <h2 className='loginHeader'>UUSI KÄYTTÄJÄ</h2>
                <div className='inputs'>
                <p>Käyttäjätunnus:</p>
                <input
                className="inputField"
                type="text"
                placeholder="nimi"
                />
                 </div>
                <div className='inputs'>
                <p>Salasana:</p>
                <input
                className="inputField"
                type="text"
                placeholder="salasana"
                />
                </div>
                <div className='inputs'>
                <p>Vahvista salasana:</p>
                <input
                className="inputField"
                type="text"
                placeholder="vahvista salasana"
                />
                </div>
                <div className='loginCenter'>
                <button>LUO KÄYTTÄJÄTILI</button>
                </div>
                <div className='newUser'>
                <span>Onko sinulla jo käyttäjätili?</span>
                <a href='#' onClick={handleNewUser}>KIRJAUDU SISÄÄN</a>
                </div>
                
                </div>
                ) : (
                <div>
    
                <h2 className='loginHeader'>KIRJAUDU SISÄÄN</h2>
                <div className='inputs'>
                <p>Käyttäjätunnus:</p>
                <input
                className="inputField"
                type="text"
                placeholder="nimi"
                />
                 </div>
                <div className='inputs'>
                <p>Salasana:</p>
                <input
                className="inputField"
                type="text"
                placeholder="salasana"
                />
                </div>
                <div className='loginCenter'>
                <button onClick={() => { login(); handleLoginForm(); }}>KIRJAUDU SISÄÄN</button>
                </div>
                <div className='newUser'>
                <span>Oletko uusi käyttäjä?</span>
                <a href='#' onClick={handleNewUser}>LUO KÄYTTÄJÄTILI</a>
                </div>
                </div>)}
              </div>
            </div>
          )}
        </div>
      );


}