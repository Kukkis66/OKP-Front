import { useState } from 'react';
import close from '../assets/close.png'
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Login.css'
import { Notification } from './Notification.jsx';


export const Login = ({loginForm, handleLoginForm}) => {
    const [newUser, setNewUser] = useState(false)
    const { login, loginUser, error, registerUser } = useAuth();
    const [email, setEmail] = useState();
    



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
                <div className='loginContainer'>
                  <h2 className='loginHeader'>UUSI KÄYTTÄJÄ</h2>
                  <div className='LoginInputFieldsContainer'>
                    <form onSubmit={registerUser}>
                      <div className='inputs inputsLogin'>
                        <p>Sähköposti</p>
                        <input
                        className="inputField inputFieldLogin"
                        type="text"
                        placeholder="nimi"
                        name="email"/>
                      </div>
                      <div className='inputs inputsLogin'>
                        <p>Käyttäjätunnus:</p>
                        <input
                        className="inputField inputFieldLogin"
                        type="text"
                        placeholder="nimi"
                        name="username"/>
                      </div>
                      <div className='inputs inputsLogin'>
                        <p>Salasana:</p>
                        <input
                        className="inputField inputFieldLogin"
                        type="text"
                        placeholder="salasana"
                        name="password"/>
                      </div>
                      <div className='inputs inputsLogin'>
                      <p>Vahvista salasana:</p>
                      <input
                      className="inputField inputFieldLogin"
                      type="text"
                      placeholder="vahvista salasana"
                      name="confirmPassword"/>
                      </div>
                      <input type="submit" value="submitForm" />
                    </form>
                  </div>
                    <div className='loginCenter'>
                      <button className='button buttonLogin'>LUO KÄYTTÄJÄTILI</button>
                    </div>
                  <div className='newUser'>
                    <span>Onko sinulla jo käyttäjätili?</span>
                    <a href='#' onClick={handleNewUser}>KIRJAUDU SISÄÄN</a>
                  </div>
                
                </div>
                ) : (
                <div className='loginContainer'>
    
                <h2 className='loginHeader'>KIRJAUDU SISÄÄN</h2>
                <form onSubmit={loginUser}>

                  <div className='LoginInputFieldsContainer'>
                    <div className='inputs inputsLogin'>
                      <p>Käyttäjätunnus:</p>
                      <input
                      className="inputField inputFieldLogin"
                      type="text"
                      placeholder="nimi"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className='inputs inputsLogin'>
                      <p>Salasana:</p>
                      <input
                      className="inputField inputFieldLogin"
                      type="text"
                      placeholder="salasana"
                      name="password"
                      />
                    </div>
                    <Notification message={error} />
                  </div>
                  <div className='loginCenter'>
                    {/* <button className='button buttonLogin' onClick={() => { login(); handleLoginForm();  }}>KIRJAUDU SISÄÄN</button> */}
                    <input className='login-input-submit' disabled={!email} type="submit" />
                  </div>
                  <div className='newUser'>
                    <span>Oletko uusi käyttäjä?</span>
                    <a href='#' onClick={handleNewUser}>LUO KÄYTTÄJÄTILI</a>
                  </div>
                </form>
                </div>)}
              </div>
            </div>
          )}
        </div>
      );


}