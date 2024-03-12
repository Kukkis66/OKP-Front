import '../styles/ResetPasswordPage.css';
import { useState, useEffect } from 'react';
import { Notification } from './Notification';
import PasswordChecklist from "react-password-checklist"

export const ResetPasswordPage = () => {

    const [errorMessageText, setErrorMessageText] = useState(null);
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

    const navigateToNewPage = () => {
        window.location.href = '/';
      };

    const resetPassword = async (e) => {
        e.preventDefault();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get("token");
        const email = urlParams.get("email");
        
        let response = await fetch('http://localhost:5143/api/Account/reset-password', {
          method:'PUT',
          headers: {
            'Content-Type':'application/json'
          },
          body:JSON.stringify({ "token":token, "email":email, "newPassword": e.target.newPassword.value, "confirmNewPassword": e.target.confirmPassword.value })
        });

        if (response.status === 200)
        { 
          let data = await response.text();
          console.log(data);
          setErrorMessageText(data);
          setTimeout(() => {
            setErrorMessageText(null);
          }, 7000);
        } else {
          let errorMessageText = await response.text();
          console.log(errorMessageText);
          setErrorMessageText(errorMessageText);
          setTimeout(() => {
            setErrorMessageText(null);
          }, 7000);
          
        }
    }

    return (
        <div className='reset-password-wrapper'>
            <a className='back-to-home' href='http://localhost:5173/'>Takaisin</a>
            <div className='reset-password-container'>
                <form onSubmit={resetPassword} className='reset-password-form'>
                    <label htmlFor="newPassword">Uusi Salasana</label>
                    <input type={showPassword ? "text" : "password"} name='newPassword' value={password} onChange={handlePasswordChange}/>
                    <label htmlFor="confirmPassword">Vahvista Salasana</label>
                    <input type={showPassword ? "text" : "password"} name='confirmPassword' value={confirmPassword} onChange={handlePasswordConfirmChange}/>
                    <div className='show-password-btn'>
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                        />
                        Näytä Salasana
                      </div>
                      <Notification message={errorMessageText} />
                    <PasswordChecklist
                          rules={["minLength","specialChar","number","capital","match"]}
                          minLength={6}
                          value={password}
                          valueAgain={confirmPassword}
                          messages={{
                            minLength: "Salasana on vähintään 6 merkkiä pitkä",
                            specialChar: "Salasanassa on vähintään 1 erikoismerkki",
                            number: "Salasanassa on vähintään 1 numero",
                            capital: "Salasanassa on vähintään 1 isokirjain",
                            match: "Salasanat täsmäävät",
                          }}
                        />
                      {/* <Notification message={errorMessageText} /> */}
                      <div className='buttonContainer'>
                        <button type='submit' className='reset-password-button'>Vahvista</button>    
                      </div>
                </form>
            </div>
        </div>
    )    
}