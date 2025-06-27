import { useState, useEffect } from 'react'
import axios from 'axios'
import Formfield from './components/formfield'
import Country from './components/country'
import Countrydata from './components/countrydata'

function App() {
  const [searchFilter, setSearchFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
        console.log('Fetched countries:', response.data.length)
       })
   }, [])

  const countriesToShow = searchFilter === '' 
    ? countries
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(searchFilter.toLowerCase())
      ) 

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value)
  }

  const handleShowCountry = (countryName) => {
    setSearchFilter(countryName)
  }

  const handleCountriesShow = () => {
    if (countriesToShow.length > 10) {
      return <div>Too many matches, please specify filter</div>
    }
    else if (countriesToShow.length !== 1 && countriesToShow.length > 0) {
      return (
        countriesToShow.map(country => 
            <Country 
              key={country.name.common} 
              country={country} 
              show={() => handleShowCountry(country.name.common)} 
            />)
    )}
    else if (countriesToShow.length === 1) {
      const country = countriesToShow[0]
      return (
        <Countrydata
          country={country} 
        />
      )
    }
    return <div>No countries match the defined filter</div>
  }

  return (
    <div>
      <Formfield text='find countries ' value={searchFilter} onChange={handleSearchFilterChange}/>
      {handleCountriesShow()}
    </div>
  )
}

export default App
