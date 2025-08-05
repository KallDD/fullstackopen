import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.message
    case 'HIDE':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  return context
}

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext)
  return context.showNotification
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  const showNotification = (message) => {
    dispatch({ type: 'SHOW', message })
    setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext