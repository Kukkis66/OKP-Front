import '../styles/Input.css'

export const Input = ({searchField, handleSearch}) => {

    return (
        <div className="inputContainer">
        <h1 className="searchInfo">HAE RAKENNUKSIA KARTALTA</h1>
        <input
        className="inputField"
        type="text"
        placeholder="Kirjoita rakennuksen nimi"
        value={searchField}
        onChange={handleSearch}
        />
       
        </div>


    );
}