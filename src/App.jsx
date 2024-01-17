import { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Maps } from './components/Maps.jsx'
import { List } from './components/List.jsx'
import axios from 'axios'
import './styles/App.css'

function App() {

const [data, setData] = useState([])
const [searchField, setSearchField] = useState('')

useEffect(() => {
  getAll()

  
}, [])

const filteredList = data.filter((building) =>
    String(building.name_fi).toLowerCase().includes(searchField.toLowerCase())
    );



const handleSearch = (event) => {
  setSearchField(event.target.value)
}


  const getAll = async () => {
    try {
    const response = await axios.get('https://www.hel.fi/palvelukarttaws/rest/v4/unit/?ontologyword=473');
    
    setData(response.data);
    
    } catch (error) {
      error.log('something went wrong: ', error.message);
      
    }
  }
  

  
  return (
    <>
   
    <Header/>

    {/* this input is made for test purposes only */}
    <input
        type="text"
        placeholder="Etsi Kaupunni"
        value={searchField}
        onChange={handleSearch}
      />

      
      
    <Maps/>
    <List filteredList={filteredList}/>
    <Footer/>
    
    </>
  )
}

export default App
