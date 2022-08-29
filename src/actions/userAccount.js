import USER_ACCOUNT_ACTION_TYPE from '../constants/userAccount-action-types';

export function setIsSavedPasswordModalOpen(isOpen) {
  return function (dispatch) {
    dispatch({
      type: USER_ACCOUNT_ACTION_TYPE.SET_IS_OPEN_SAVED_PASSWORD_MODAL,
      payload: { isOpen },
    });
  };
}

export function setIsResetPasswordModalOpen(isOpen) {
  return function (dispatch) {
    dispatch({
      type: USER_ACCOUNT_ACTION_TYPE.SET_IS_OPEN_RESET_PASSWORD_MODAL,
      payload: { isOpen },
    });
  };
}

export function getProductDetails(productDetails) {
  return {
    type: USER_ACCOUNT_ACTION_TYPE.GET_PRODUCT_DETAILS,
    payload: { productDetails },
  };
}

export function getStatistics(usageInfo) {
  return {
    type: USER_ACCOUNT_ACTION_TYPE.GET_STATISTICS,
    payload: { usageInfo },
  };
}

export function getUserAccountDat(userAccountData) {
  return {
    type: USER_ACCOUNT_ACTION_TYPE.GET_USER_ACCOUNT_INFO,
    payload: { userAccountData },
  };
}

export default {
  setIsSavedPasswordModalOpen,
  setIsResetPasswordModalOpen,
  getProductDetails,
  getStatistics,
  getUserAccountDat,
};
