import React from 'react';
import { connect } from 'react-redux';
import { setIsSavedPasswordModalOpen } from '../actions/userAccount';

const PasswordSavedModal = ({
  isSavedPasswordModalOpen,
  setIsSavedPasswordModalOpen,
}) => {
  const closeModal = function () {
    setIsSavedPasswordModalOpen(!isSavedPasswordModalOpen);
    document.getElementById('passwordSavedModal').style.display = 'none';
  };

  return (
    <>
      <section id="passwordSavedModal" className="password-saved-modal">
        <div className="password-saved-modal-main">
          <a href="/" className="close-btn" onClick={closeModal}>
            <img
              src={require('../../public/assets/images/toolbar-symbols/close.svg')}
              alt="close"
            />
          </a>
          <div className="password-saved-modal-body">
            <img
              src={require('../../public/assets/images/toolbar-symbols/check.svg')}
              alt="check"
            />
            <h4>Password saved successfully</h4>
          </div>
        </div>
      </section>
    </>
  );
};

export default connect(null, { setIsSavedPasswordModalOpen })(
  PasswordSavedModal
);
