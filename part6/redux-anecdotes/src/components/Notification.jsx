import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  const visibility = { display: notification ? '' : 'none' }
  return (
    <div style={visibility}>
      <div style={style}>
        {notification}
      </div>
    </div>
  )
}

export default Notification