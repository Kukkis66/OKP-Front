import '../styles/ConfirmEmailError.css';

export const ConfirmEmailError = ({ message }) => {
    if (message === null)
    {
        return null;
    }

    return (
        <div className="error">
            <p>{message}</p>
        </div>
    )
}