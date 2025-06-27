const Formfield = ({text, value, onChange}) => {
  return (
    <div>
      <form>
        <div>
          {text}<input 
            value = {value}
            onChange = {onChange}
          />
        </div>
      </form>
    </div>
  )
}

export default Formfield