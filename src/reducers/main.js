import MAIN_ACTION_TYPES from '../constants/main-action-types';

const initialState = {
  windowSizes: {
    width: window.screen.width,
    height: window.screen.height,
  },
};

function mainReducer(state = initialState, action) {
  switch (action.type) {
    case MAIN_ACTION_TYPES.SET_WINDOW_SIZES: {
      return { ...state, windowSizes: action.payload };
    }
    default: {
      // console.warn('Unhandled or System action fired: ', action.type);
    }
  }
  return state;
}

export default mainReducer;
