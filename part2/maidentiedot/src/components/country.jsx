const Country = ({ country, show }) => {
    return(
        <div>
            {country.name.common} <button onClick={show}>show</button>
        </div>
    )
}

export default Country