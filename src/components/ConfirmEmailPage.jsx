import '../styles/ConfirmEmailPage.css';
import { ErrorMessage } from './ErrorMessage';
import { useState } from 'react';

export const ConfirmEmailPage = () => {

    const [errorMessage, setErrorMessage] = useState(null);

    const navigateToNewPage = () => {
        window.location.href = '/';
      };


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
          navigateToNewPage();
        } else {
          let x = await response.json();
          console.log(x);
          setErrorMessage(x);
          
        }
    }    
    
    return (
        <div className='upper-container'>
            <div className="container-55">
                <button className='hello' onClick={confirmEmail}>click here to confirm your email</button>
                <ErrorMessage message={errorMessage} />
            </div>
        </div>
            

    );
}