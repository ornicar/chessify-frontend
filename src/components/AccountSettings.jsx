import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { connect } from 'react-redux';
import {
  setIsSavedPasswordModalOpen,
  setIsResetPasswordModalOpen,
} from '../actions/userAccount';
import { CgChevronDown } from 'react-icons/cg';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
  sendResetPasswordEmail,
  logout,
  changePassword,
  updateUser,
} from '../utils/api';

const AccountSettings = ({
  userInfo,
  isSavedPasswordModalOpen,
  isResetPasswordModalOpen,
  setIsSavedPasswordModalOpen,
  setIsResetPasswordModalOpen,
}) => {
  const [isOpenEmailEditing, setOpenEmailEditing] = useState(false);
  const [isOpenPasswordEditing, setOpenPasswordEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [email, setEmail] = useState(userInfo.email);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setcurrentPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [currentPasswordShown, setCurrentPasswordShown] = useState(false);
  const [openClipboardToolTip, setOpen] = useState(false);
  const [openClipboardToolTipMobile, setOpenToolTipMobile] = useState(false);
  const [errors, setErrors] = useState({});
  const [isResetRequestSent, setResetRequestSent] = useState(false);
  const [fideTitle, setFideTitle] = useState('NONE');
  const [elo, setElo] = useState('1000');
  const newPasswordFieldEye = newPasswordShown ? <FaEye /> : <FaEyeSlash />;
  const currentPasswordFieldEye = currentPasswordShown ? (
    <FaEye />
  ) : (
    <FaEyeSlash />
  );

  useEffect(() => {
    setFirstName(userInfo.first_name);
    setLastName(userInfo.last_name);
    setFideTitle(userInfo.fide_title);
    setElo(userInfo.elo_rating);
  }, [userInfo]);

  function handleSubmit() {
    const data = {
      email: userInfo.email,
    };

    const onSucces = () => {
      setResetRequestSent(true);
    };

    const onError = (xhr) => {
      let error = {};
      if (xhr.readyState === 4) {
        error = JSON.parse(xhr.responseText);
      } else if (xhr.readyState === 0) {
        error = { common_error: 'Connection error.' };
      } else {
        error = { common_error: 'Something went wrong.' };
      }
      setErrors(error);
      setResetRequestSent(false);
    };
    sendResetPasswordEmail(data, onSucces, onError);
  }

  const changeEmailAction = function () {
    setOpenEmailEditing(!isOpenEmailEditing);
  };

  const changePasswordAction = function () {
    setOpenPasswordEditing(!isOpenPasswordEditing);
  };

  const updateNewEmailInput = function (e) {
    e.preventDefault();
    setNewEmail(e.target.value);
  };

  const updateFideTitleSelect = function (e) {
    e.preventDefault();
    setFideTitle(e.target.value);
  };

  const updateEloInput = function (e) {
    e.preventDefault();
    setElo(e.target.value);
  };

  const updateNewPasswordInput = function (e) {
    e.preventDefault();
    setNewPassword(e.target.value);
  };

  const updateCurrentPasswordInput = function (e) {
    e.preventDefault();
    setcurrentPassword(e.target.value);
  };

  const updateFirstNameInput = function (e) {
    e.preventDefault();
    setFirstName(e.target.value);
  };

  const updateLastNameInput = function (e) {
    e.preventDefault();
    setLastName(e.target.value);
  };

  const updateEmail = function () {
    let email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let newEmailField = document.getElementById('newEmail');
    if (!newEmailField.value || !newEmailField.value.match(email)) {
      newEmailField.classList.add('error');
      setTimeout(() => {
        newEmailField.classList.remove('error');
      }, 500);
    } else {
      let userData = {
        first_name: firstName,
        last_name: lastName,
        fide_title: fideTitle,
        elo_rating: elo,
        email: newEmail,
      };
      updateUser(userData, userInfo.userProfileId, userInfo.token);
      setEmail(newEmail);      
      setOpenEmailEditing(false);
    }
  };

  const updatePassword = function (e) {
    e.preventDefault();
    let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let newPasswordField = document.getElementById('newPassword');
    let oldPasswordField = document.getElementById('currentPassword');

    if (
      (!newPasswordField.value || !newPasswordField.value.match(passw)) &
      (!oldPasswordField.value || !oldPasswordField.value.match(passw))
    ) {
      newPasswordField.classList.add('error');
      oldPasswordField.classList.add('error');
      setTimeout(() => {
        newPasswordField.classList.remove('error');
        oldPasswordField.classList.remove('error');
      }, 500);
    } else if (
      !newPasswordField.value ||
      !newPasswordField.value.match(passw)
    ) {
      newPasswordField.classList.add('error');
      setTimeout(() => {
        newPasswordField.classList.remove('error');
      }, 500);
    } else if (
      !oldPasswordField.value ||
      !oldPasswordField.value.match(passw)
    ) {
      oldPasswordField.classList.add('error');
      setTimeout(() => {
        oldPasswordField.classList.remove('error');
      }, 500);
    } else {
      setOpenPasswordEditing(false);
      setIsSavedPasswordModalOpen(!isSavedPasswordModalOpen);
      const data = {
        password: newPassword,
        old_password: currentPassword,
      };
      const index = userInfo.userCode.indexOf('*');
      const id = userInfo.userCode.substr(index + 1);
      changePassword(data, id, userInfo.token);
      logout();
    }
  };

  const resetPassword = function () {
    setOpenPasswordEditing(false);
    setIsResetPasswordModalOpen(!isResetPasswordModalOpen);
    handleSubmit();
    logout();
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordShown(!newPasswordShown);
  };

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordShown(!currentPasswordShown);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleMobileTooltipClose = () => {
    setOpenToolTipMobile(false);
  };

  function copyToClipboard() {
    navigator.clipboard.writeText(
      'https://chessify.me/signin?ref=' + userInfo.userCode
    );
    setOpen(true);
  }

  function copyToClipboardMobile() {
    navigator.clipboard.writeText(
      'https://chessify.me/signin?ref=' + userInfo.userCode
    );
    setOpenToolTipMobile(true);
  }

  function submitButtonAction() {
    let userData = {
      first_name: firstName,
      last_name: lastName,
      fide_title: fideTitle,
      elo_rating: elo,
      email: newEmail ? newEmail : userInfo.email,
    };

    updateUser(userData, userInfo.userProfileId, userInfo.token);
    window.location.reload();
  }

  return (
    <div className="user-account-body" id="userAccountBody">
      <h3 className="user-account-title">Account Settings</h3>
      <div className="user-account_input-groups">
        <label htmlFor="lastName">
          Last name
          <input
            id="lastName"
            className="user-account-inputs"
            value={lastName}
            placeholder="Last name"
            onChange={updateLastNameInput}
          />
        </label>
        <label htmlFor="firstName">
          First name
          <input
            id="firstName"
            className="user-account-inputs"
            value={firstName}
            placeholder="First name"
            onChange={updateFirstNameInput}
          />
        </label>
      </div>
      <div className="user-account_input-groups">
        <label htmlFor="fide">
          FIDE title
          <select
            className="user-account-inputs"
            id="fide"
            name="fide"
            value={fideTitle}
            onChange={updateFideTitleSelect}
          >
            <option value="NONE">NONE</option>
            <option value="GM">GM</option>
            <option value="IM">IM</option>
            <option value="FM">FM</option>
            <option value="WGM">WGM</option>
            <option value="WIM">WIM</option>
          </select>
        </label>
        <label htmlFor="elo">
          Elo rating
          <input
            id="elo"
            type="number"
            value={elo}
            placeholder="Elo"
            min="1000"
            className="user-account-inputs"
            onChange={updateEloInput}
          />
        </label>
      </div>
      <div>
        <div className="line user-account-line"></div>
        {isOpenEmailEditing ? (
          <>
            <div>
              <h5 className="user-account-subTitle">Email Address</h5>
              <div className="user-account-email">
                <span>You can chose email address on fields</span>
                <button className="hide-btn" onClick={changeEmailAction}>
                  Hide
                </button>
              </div>
            </div>
            <div className="user-account_input-groups">
              <label htmlFor="newEmail">
                New email address
                <input
                  id="newEmail"
                  className="user-account-inputs"
                  value={newEmail}
                  placeholder="Email"
                  onChange={updateNewEmailInput}
                />
              </label>
              <label htmlFor="currentEmail">
                Current email address
                <input
                  id="currentEmail"
                  className="user-account-inputs"
                  value={email}
                  disabled={true}
                />
              </label>
            </div>
            <button className="green-btn" onClick={updateEmail}>
              Update email
            </button>
          </>
        ) : (
          <div>
            <h5 className="user-account-subTitle">Email Address</h5>
            <div className="user-account-email">
              <p>
                Your email address <span>{email}</span>
              </p>
              <button className="change-btn" onClick={changeEmailAction}>
                Change email
              </button>
            </div>
          </div>
        )}
        <div className="line"></div>

        {isOpenPasswordEditing ? (
          <>
            <div>
              <div className="user-account-email">
                <h5 className="user-account-subTitle">Password</h5>
                <button className="hide-btn" onClick={changePasswordAction}>
                  Hide
                </button>
              </div>
            </div>
            <form onSubmit={updatePassword}>
              <div className="user-account_input-groups">
                <label htmlFor="newPassword" className="user-account-password">
                  New password
                  <input
                    id="newPassword"
                    className="user-account-inputs"
                    value={newPassword}
                    onChange={updateNewPasswordInput}
                    type={newPasswordShown ? 'text' : 'password'}
                  />
                  <i onClick={toggleNewPasswordVisibility}>
                    {newPasswordFieldEye}
                  </i>
                </label>
                <label
                  htmlFor="currentPassword"
                  className="user-account-password"
                >
                  Current password
                  <input
                    id="currentPassword"
                    className="user-account-inputs"
                    value={currentPassword}
                    onChange={updateCurrentPasswordInput}
                    type={currentPasswordShown ? 'text' : 'password'}
                  />
                  <i onClick={toggleCurrentPasswordVisibility}>
                    {currentPasswordFieldEye}
                  </i>
                </label>
              </div>
              <div className="change-password">
                <button
                  type="submit"
                  className="green-btn"
                  onClick={updatePassword}
                >
                  Update password
                </button>
                <button className="change-btn" onClick={resetPassword}>
                  Reset via link
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="user-account-email">
            <h5 className="user-account-subTitle user-account-password">
              Password
            </h5>
            <button className="change-btn" onClick={changePasswordAction}>
              Change password
            </button>
          </div>
        )}

        <div className="line"></div>
        <div>
          <div className="user-account-email-mob-hide">
            <h5 className="user-account-subTitle">Referral link</h5>
            <div className="user-account-email">
              <p className="referral-link-description">
                <span>https://chessify.me/signin?ref={userInfo.userCode}</span>
              </p>
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  open={openClipboardToolTip}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  onMouseLeave={handleTooltipClose}
                  placement="top"
                  title="Copied to clipboard"
                  arrow
                >
                  <button className="change-btn" onClick={copyToClipboard}>
                    Copy Link
                  </button>
                </Tooltip>
              </ClickAwayListener>
            </div>
          </div>

          <div className="user-account-email-mob-show">
            <h5 className="user-account-subTitle">Referral link</h5>
            <ClickAwayListener onClickAway={handleMobileTooltipClose}>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                open={openClipboardToolTipMobile}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                onMouseLeave={handleMobileTooltipClose}
                placement="top"
                title="Copied to clipboard"
                arrow
              >
                <button className="change-btn" onClick={copyToClipboardMobile}>
                  Copy Link
                </button>
              </Tooltip>
            </ClickAwayListener>
          </div>

          <span className="referral-link-description">
            Invite a friend to register on Chessify via your referral link and
            get 10% cashback from their purchases.
          </span>
          <div className="submit-btn-div">
            <span className="earnings">
              Earnings: ${userInfo.referral_balance}
              <div className="oval-div"></div>
              <span>Referred Users: {userInfo.referred_users_count}</span>
            </span>
            <button className="green-btn" onClick={submitButtonAction}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  setIsSavedPasswordModalOpen,
  setIsResetPasswordModalOpen,
})(AccountSettings);
