import USER_ACCOUNT_ACTION_TYPE from '../constants/userAccount-action-types';

const initialState = {
  isSavedPasswordModalOpen: false,
  isResetPasswordModalOpen: false,
  productDetails: {},
  usageInfo: {},
  userAccountInfo: {}, // User aa=ccount information for Account setting page
};

function userAccountReducer(state = initialState, action) {
  switch (action.type) {
    case USER_ACCOUNT_ACTION_TYPE.GET_USER_ACCOUNT_INFO: {
      return { ...state, userAccountInfo: action.payload.userAccountData };
    }
    case USER_ACCOUNT_ACTION_TYPE.SET_IS_OPEN_SAVED_PASSWORD_MODAL: {
      return { ...state, isSavedPasswordModalOpen: action.payload.isOpen };
    }
    case USER_ACCOUNT_ACTION_TYPE.SET_IS_OPEN_RESET_PASSWORD_MODAL: {
      return { ...state, isResetPasswordModalOpen: action.payload.isOpen };
    }
    case USER_ACCOUNT_ACTION_TYPE.GET_PRODUCT_DETAILS: {
      return { ...state, productDetails: action.payload.productDetails };
    }
    case USER_ACCOUNT_ACTION_TYPE.GET_STATISTICS: {
      return { ...state, usageInfo: action.payload.usageInfo };
    }
    default: {
      return state;
    }
  }
  return state;
}

export default userAccountReducer;
