import '../styles/Login.css'

export const RegisterErrorMessage = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="login-error-message">
        {message}
      </div>
    )
}