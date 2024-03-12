import '../styles/ResetPasswordPage.css';
import { useState, useEffect } from 'react';
import { Notification } from './Notification';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [type, setType] = useState(null);

    const navigateToNewPage = () => {
        window.location.href = '/';
      };



    const sendResetPassword = async (e) => {
        e.preventDefault();
        
        let response = await fetch(`http://localhost:5143/api/Account/forgot-password/${e.target.email.value}`, {
            method:'POST',
            headers: {
              'Accept': '*/*'
            },
            body: ''
          });

        if (response.status === 200)
        {
          let data = await response.text();
          console.log(data);
          setErrorMessage(data);
          setTimeout(() => {
            setErrorMessage(null);
          }, 7000);
        } else {
          let errorMessageText = await response.text();
          console.log(errorMessageText);
          setErrorMessage(errorMessageText);
          setTimeout(() => {
            setErrorMessage(null);
          }, 7000);
          
        }
    }

    return (
        <div className='reset-password-wrapper'>
            <a className='back-to-home' href='http://localhost:5173/'>Takaisin</a>
            <div className='reset-password-container'>
                <form onSubmit={sendResetPassword} className='reset-password-form'>
                    <label htmlFor="email">Kirjoita sähköposti osoitteesi</label>
                    <input type="text" name='email'onChange={(e) => setType(e.target.value)}/>
                    <Notification message={errorMessage}/>
                    <div className='buttonContainer'>
                      <button disabled={!type} type='submit' className='reset-password-button'>Lähetä</button>
                    </div>
                </form>
            </div>
        </div>
    )

    
}