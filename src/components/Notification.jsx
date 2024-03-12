import '../styles/ConfirmEmailPage.css';

export const Notification = ({ message }) => {
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