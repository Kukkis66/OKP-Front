import '../styles/ConfirmEmailPage.css';
import { ConfirmEmailError } from './ConfirmEmailError';
import { useState, useEffect } from 'react';

export const ConfirmEmailPage = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [showPopup, setShowPopUp] = useState(true);

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


    const confirmEmail = async (e) => {
        e.preventDefault();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get("token");
        const email = urlParams.get("email");
        
        let response = await fetch('http://localhost:5143/api/Account/confirm-email', {
          method:'PUT',
          headers: {
            'Content-Type':'application/json'
          },
          body:JSON.stringify({ token, email })
        });

        if (response.status === 200)
        {
          let data = await response.json()
          console.log(data);
          setShowPopUp(true); // Show the pop-up first
          setTimeout(() => {
            navigateToNewPage(); // Then navigate to new page after 3 seconds
          }, 3000);
        } else {
          let errorMessageText = await response.text();
          setErrorMessage(errorMessageText); 
          
        }
    }    
    
    return (
      <div className='cofirm-email-upper-container'>

        <div className='cofirm-email-middle-container'>
            {showPopup && <div className="popup1">
              <h2>Success!</h2>
              <div className='popup1-message'>
                <h1>You have confirmed your email successfully!</h1>
                <p>You will be redirected to the homepage.</p>
              </div>
            </div>}
            <div className="cofirm-email-lower-container">
                <button className='confirm-email-btn' onClick={confirmEmail}>click here to confirm your email</button>
                <ConfirmEmailError message={errorMessage} />
            </div>
        </div>
            
      </div>

    );
}