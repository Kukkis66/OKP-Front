import '../styles/ConfirmEmailPage.css';
import { ConfirmEmailError } from './ConfirmEmailError';
import { useState, useEffect } from 'react';
import { Notification } from './Notification';

export const ConfirmEmailPage = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [showPopup, setShowPopUp] = useState(false);
    const [showResendEmail, setShowResendEmail] = useState(false);
    const [resendErrorMessage, setResendErrorMessage] = useState(null);

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
          }, 4000);
        } else {
          let errorMessageText = await response.text();
          setErrorMessage(errorMessageText); 
          setShowResendEmail(true);
          
        }
    }
    
    const ResendEmailConformation = async (e) => {
      e.preventDefault();
      console.log(e.target.email.value);
      let response = await fetch(`http://localhost:5143/api/Account/resend-email-confirmation-link/${e.target.email.value}`, {
        method:'POST',
        headers: {
          'Accept': '*/*'
        },
        body: ''
      });

      if (response.ok) {
        setResendErrorMessage("Sähköposti viesti lähetetty.")
        setTimeout(() => {
          setResendErrorMessage(null);
        }, 5000);
        console.log("new link was sent");
      } else {
        let data = await response.text();
        console.log(data);
        setResendErrorMessage(data);
        setTimeout(() => {
          setResendErrorMessage(null);
        }, 10000);
      }
    }
    
    return (
      <div className='cofirm-email-upper-container'>

        <div className='cofirm-email-middle-container'>
            {showPopup && <div className="popup1">
              <h2>Onnistui!</h2>
              <div className='popup1-message'>
                <h1 className='p'>Olet vahvistanut sähköpostiosoitteesi, voit nyt kirjautua sisään!</h1>
                <p className='p'>Sinut uudelleenohjataan automaattisesti kotisivulle.</p>
              </div>
            </div>}
            {showResendEmail && 
            <div className='resend-email-container'>
              <form onSubmit={ResendEmailConformation} className='resend-email-form'>
                <ConfirmEmailError message={errorMessage} />
                <div className='resend-email-form-container'>
                  <label htmlFor="email" typeof='text' className='p'>Email:</label>
                  <input type="text" name='email'/>
                </div>
                <Notification message={resendErrorMessage} />
                <div className='buttonContainer'>
                  <button type='submit' className='resend-email-btn'>Lähetä</button>
                </div>
              </form>
            </div>}
            {!showResendEmail && 

              <div className="cofirm-email-lower-container">
                  <p className='vahvistaViesti p'>Vahvista sähköpostiosoitteesi</p>
                  <button className='confirm-email-btn' onClick={confirmEmail}>Vahvista</button>
                  
              </div>
            }
        </div>
            
      </div>

    );
}