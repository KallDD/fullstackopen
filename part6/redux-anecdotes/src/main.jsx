import ReactDOM from 'react-dom/client'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import reduxStore from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={reduxStore}>
    <App />
  </Provider>
)