import { combineReducers } from 'redux'
import userReducer from './user'
import authorizedReducer from './authorized'

export default combineReducers({
    user: userReducer,
    auth: authorizedReducer
})