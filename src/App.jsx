import { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx';
import { Maps } from './components/Maps.jsx';
import { List } from './components/List.jsx';
import { Input } from './components/Input.jsx';
import { Login } from './components/Login.jsx';
import axios from 'axios';
import './styles/App.css';
import { markers } from './components/Maps.jsx';

function App() {
  const [data, setData] = useState([]);
  const [hubData, setHubData] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [loginForm, setLoginForm] = useState(false);

  useEffect(() => {
    getAll();
    fetchData();
  }, []);

  const handleSearch = event => {
    setSearchField(event.target.value);
  };

  const handleLoginForm = () => {
    setLoginForm(!loginForm);
  };

  const getAll = async () => {
    try {
      const response = await axios.get('https://www.hel.fi/palvelukarttaws/rest/v4/unit/?ontologyword=473');
      setData(response.data);
    } catch (error) {
      console.error('Something went wrong:', error.message);
    }
  };

  const fetchData = async () => {
    try {
      const backendRes = await fetch('http://localhost:5143/api/DataHub');
      const backendData = await backendRes.json();
      setHubData(backendData);
      console.log(hubData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <>
      <Header handleLoginForm={handleLoginForm} />
      {/* Передача маркеров в компонент Input */}
      <Input handleSearch={handleSearch} searchField={searchField} markers={markers} />
      <Login loginForm={loginForm} handleLoginForm={handleLoginForm} />
      <Maps searchField={searchField} handleSearch={handleSearch} buildings={hubData.data?.groupedProducts || []}/>
      <List hubData={hubData} searchField={searchField}/>
      <Footer />
    </>
  );
}

export default App;
