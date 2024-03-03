import '../styles/ResetPasswordPage.css';
import { useState, useEffect } from 'react';
import { Notification } from './Notification';

export const ResetPasswordPage = () => {

    const navigateToNewPage = () => {
        window.location.href = '/';
      };

    //   useEffect(() => {
    //     if (showPopup) {
    //         const timer = setTimeout(() => {
    //             setShowPopUp(false);
    //         }, 3000); // Adjust the duration as needed
    //         return () => clearTimeout(timer);
    //     }
    // }, [showPopup]);


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
        } else {
          let errorMessageText = await response.text();
          console.log(errorMessageText);
          
        }
    }

    return (
        <div className='reset-password-wrapper'>
            <div className='reset-password-container'>
                <form onSubmit={resetPassword} className='reset-password-form'>
                    <label htmlFor="newPassword">Uusi Salasana</label>
                    <input type="password" name='newPassword'/>
                    <label htmlFor="confirmPassword">Vahvista Salasana</label>
                    <input type="password" name='confirmPassword'/>
                    <button type='submit' className='reset-password-button'>Vahvista</button>
                </form>
            </div>
        </div>
    )

    
}