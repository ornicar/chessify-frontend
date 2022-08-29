import React from 'react';
import { useEffect, useState } from 'react';
import NavBar from './NavBar.jsx';
import AccountSettings from './AccountSettings';
import PlanDetails from './PlanDetails';
import PasswordSavedModal from './PasswordSavedModal';
import ResetPasswordModal from './ResetPasswordModal';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

const mapStateToProps = (state) => {
  return {
    isSavedPasswordModalOpen: state.userAccount.isSavedPasswordModalOpen,
    isResetPasswordModalOpen: state.userAccount.isResetPasswordModalOpen,
    userAccountInfo: state.userAccount.userAccountInfo,
  };
};

const UserAccount = ({
  isSavedPasswordModalOpen,
  isResetPasswordModalOpen,
  userAccountInfo,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div  className="user-account-wrapper">
      {isSavedPasswordModalOpen && (
        <PasswordSavedModal
          isSavedPasswordModalOpen={isSavedPasswordModalOpen}
        />
      )}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          isResetPasswordModalOpen={isResetPasswordModalOpen}
          userInfo={userAccountInfo}
        />
      )}
      <article className="user-account">
        <AccountSettings
          userInfo={userAccountInfo}
          isSavedPasswordModalOpen={isSavedPasswordModalOpen}
          isResetPasswordModalOpen={isResetPasswordModalOpen}
        />
        <PlanDetails userInfo={userAccountInfo} />
      </article>
      <div className="user-account_mob-button">
        <button className="green-btn user-account_log-out">Log out</button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, null)(UserAccount);
