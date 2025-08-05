import { useNotificationValue } from "../NotificationContext"

const Notification = () => {

  const { notification } = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const visibility = notification ? {} : { display: 'none' }

  return (
    <div style={{ ...style, ...visibility }}>
      {notification}
    </div>
  )
}

export default Notification
