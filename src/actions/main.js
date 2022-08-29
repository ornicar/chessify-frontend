import MAIN_ACTION_TYPES from '../constants/main-action-types';

export function setWindowSizes() {
  return function (dispatch) {
    const { width, height } = window.screen;
    dispatch({
      type: MAIN_ACTION_TYPES.SET_WINDOW_SIZES,
      payload: { width, height },
    });
  };
}

export default {
  setWindowSizes,
};
