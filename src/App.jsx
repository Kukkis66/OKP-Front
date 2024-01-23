import { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Maps } from './components/Maps.jsx'
import { List } from './components/List.jsx'
import { Input } from './components/Input.jsx'
import { Login } from './components/Login.jsx'
import axios from 'axios'
import './styles/App.css'

function App() {

const [data, setData] = useState([])
const [hubData, setHubData] = useState([])
const [searchField, setSearchField] = useState('')
const [loginForm, setLoginForm] = useState(false)

useEffect(() => {
  getAll()
  fetchData()
  
}, [])

const filteredList = hubData.data?.groupedProducts?.filter((building) =>
  building.productInformations.some(info =>
    String(info.name).toLowerCase().includes(searchField.toLowerCase())
  )
) || [];



const handleSearch = (event) => {
  setSearchField(event.target.value)
}

const handleLoginForm = () => {
  setLoginForm(!loginForm)
}

  const getAll = async () => {
    try {
    const response = await axios.get('https://www.hel.fi/palvelukarttaws/rest/v4/unit/?ontologyword=473');
    
    setData(response.data);
    
    } catch (error) {
      error.log('something went wrong: ', error.message);
      
    }
  }
  
  
 
    const fetchData = async () => {
      try {
        const backendRes = await fetch('http://localhost:5289/api/DataHub');
        const backendData = await backendRes.json();
        

        setHubData(backendData);
        console.log(hubData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

 
    

  
    
 
  

  
  return (
    <>
   
    <Header handleLoginForm={handleLoginForm}/>
    <Input handleSearch={handleSearch} searchField={searchField}/>
    
    <Login loginForm={loginForm} handleLoginForm={handleLoginForm}/>
      
      
    <Maps/>
    <List hubData={hubData}/>
    <Footer/>
    
    </>
  )
}

export default App
