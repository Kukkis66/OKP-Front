import '../styles/ResetPasswordPage.css';
import { useState, useEffect } from 'react';
import { Notification } from './Notification';

export const ResetPasswordPage = () => {

    const [errorMessageText, setErrorMessageText] = useState(null);

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
                    <input type="password" name='newPassword'/>
                    <label htmlFor="confirmPassword">Vahvista Salasana</label>
                    <input type="password" name='confirmPassword'/>
                    <button type='submit' className='reset-password-button'>Vahvista</button>
                    <Notification message={errorMessageText} />
                </form>
            </div>
        </div>
    )

    
}