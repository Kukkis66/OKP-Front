import '../styles/ErrorMessage.css';

export const ErrorMessage = ({ message }) => {
    if (message === null)
    {
        return null;
    }

    return (
        <div className="error">
            <p>{message.title}</p>
            <p>{message.errors.Email}</p>
            <p>{message.errors.Token}</p>
        </div>
    )
}