import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setIsResetPasswordModalOpen } from '../actions/userAccount';

const ResetPasswordModal = ({
  isResetPasswordModalOpen,
  setIsResetPasswordModalOpen,
  userInfo,
}) => {
  const [email] = useState(userInfo.email);
  const closeModal = function () {
    setIsResetPasswordModalOpen(!isResetPasswordModalOpen);
    document.getElementById('resetPasswordModal').style.display = 'none';
  };

  return (
    <>
      <section id="resetPasswordModal" className="reset-password-modal">
        <div className="reset-password-modal-main">
          <a href="/" className="close-btn" onClick={closeModal}>
            <img
              src={require('../../public/assets/images/toolbar-symbols/close.svg')}
              alt="close"
            />
          </a>
          <div className="reset-password-modal-body">
            <img
              src={require('../../public/assets/images/lock_icon.svg')}
              alt="lock"
            />
            <h4>Reset your password</h4>
            <span>
              We’ve sent instructons to {email}. If you didn’t get the email,
              ask to resend the instructions.
            </span>
            <a href="/" className="green-btn">
              Back to Log in
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default connect(null, { setIsResetPasswordModalOpen })(
  ResetPasswordModal
);
