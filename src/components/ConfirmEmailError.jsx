import '../styles/ConfirmEmailError.css';

export const ConfirmEmailError = ({ message }) => {
    if (message === null)
    {
        return null;
    }

    return (
        <>  
            <div className='back-to-home-conf-error-div'>

                <a className='back-to-home-conf-error' href='http://localhost:5173/'>Takaisin</a>
            </div>
            <div className="popup2">
                <h2>Epäonnistui!</h2>
                {/* <p className='confirm-error'>{message}</p> */}
                <div className='popup2-message'>
                    <h1 className='p'>Sähköpostin varmistaminen epäonnistui.</h1>
                    <p className='p'>Kirjoita sähköpostisi uudestaan allaolevaan kenttään ja lähetä, jotta voit varmistaa sähköpostisi uudestaan.</p>
                </div>
            </div>
        
        </>
    )
}