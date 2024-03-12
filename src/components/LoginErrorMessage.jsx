import '../styles/Login.css'

export const LoginErrorMessage = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="login-error-message">
        {message}
      </div>
    )
}