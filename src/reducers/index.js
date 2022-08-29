import { combineReducers } from 'redux';
import mainReducer from './main';
import boardReducer from './board';
import cloudReducer from './cloud';
import userAccount from './userAccount';

const rootReducer = combineReducers({
  main: mainReducer,
  board: boardReducer,
  cloud: cloudReducer,
  userAccount: userAccount,
});

export default rootReducer;
