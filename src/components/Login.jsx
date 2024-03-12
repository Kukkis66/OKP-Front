import { useState } from 'react';
import close from '../assets/close.png'
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Login.css'
import { LoginErrorMessage } from './LoginErrorMessage.jsx';
import { RegisterErrorMessage } from './RegisterErrorMessage.jsx';
import PasswordChecklist from "react-password-checklist"
import { Link } from "react-router-dom";


export const Login = ({loginForm, handleLoginForm}) => {
    const [newUser, setNewUser] = useState(false)
    const { login, loginUser, error, registerUser, userRegistered } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = ({target}) => {
      setPassword(target.value);
    }

    const handlePasswordConfirmChange = ({target}) => {
      setConfirmPassword(target.value);
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

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
                        type={showPassword ? "text" : "password"}
                        placeholder="salasana"
                        name="password" value={password} onChange={handlePasswordChange}/>
                      </div>
                      <div className='inputs inputsLogin'>
                      <p>Vahvista salasana:</p>
                      <input
                      className="inputField inputFieldLogin"
                      type={showPassword ? "text" : "password"}
                      placeholder="vahvista salasana"
                      name="confirmPassword" value={confirmPassword} onChange={handlePasswordConfirmChange}/>
                      </div>
                      <div className='password-checklist-container'>

                      <div className='show-password-btn'>
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                        />
                        Näytä Salasana
                      </div>
                        <RegisterErrorMessage message={error} />
                        <PasswordChecklist
                          rules={["minLength","specialChar","number","capital","match"]}
                          minLength={6}
                          value={password}
                          valueAgain={confirmPassword}
                          className='passwordChecklist'
                          messages={{
                            minLength: "Salasana on vähintään 6 merkkiä pitkä",
                            specialChar: "Salasanassa on vähintään 1 erikoismerkki",
                            number: "Salasanassa on vähintään 1 numero",
                            capital: "Salasanassa on vähintään 1 isokirjain",
                            match: "Salasanat täsmäävät",
                          }}
                        />
                      </div>
                      {userRegistered && <p className='user-registered-success'>Käyttäjä on luotu! Vahvista sähköposti osoitteesi</p>}
                      <div className='loginCenter'>
                        <button type='submit' className='button buttonLogin buttonCreateUser'>LUO KÄYTTÄJÄTILI</button>
                      </div>
                    </form>
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
                      type={showPassword ? "text" : "password"}
                      placeholder="salasana"
                      name="password"
                      />
                    </div>
                    <div className='show-password-btn'>
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                        />
                        Näytä Salasana
                      </div>
                    <LoginErrorMessage message={error} />
                  </div>
                  <div className='loginCenter'>
                    <button type='submit' className='button buttonLogin' disabled={!email}>KIRJAUDU SISÄÄN</button>
                    {/* <input className='login-input-submit' disabled={!email} type="submit" value="KIRJAUDU SISÄÄN" /> */}
                  </div>
                  <div className='newUser'>
                    <span>Oletko uusi käyttäjä?</span>
                    <a href='#' onClick={handleNewUser}>LUO KÄYTTÄJÄTILI</a>
                  </div>
                  <div className="forgot-password-link">
                    <span>Unohtuiko salasana?</span>
                    <Link to="/forgot-password" className='link33'>VAIHDA SALASANA</Link>
                  </div>
                </form>
                </div>)}
              </div>
            </div>
          )}
        </div>
      );


}