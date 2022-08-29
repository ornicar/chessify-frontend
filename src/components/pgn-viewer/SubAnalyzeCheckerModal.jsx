import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
  };
};

function SubAnalyzeCheckerModal({ fen, stop }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalTimeout, setShowModalTimeout] = useState(NaN);
  const [stopAnalyzeTimeout, setStopAnalyzeTimeout] = useState(NaN);

  const startModalShowingTimeout = () => {
    if (showModalTimeout) clearTimeout(showModalTimeout);
    const smt = setTimeout(() => {
      setShowModal(true);
    }, 540000);
    setShowModalTimeout(smt);
  };

  const startStopAnalyzeTimeout = () => {
    if (!showModal) return;
    if (stopAnalyzeTimeout) clearTimeout(stopAnalyzeTimeout);
    const sat = setTimeout(() => {
      clearTimeouts();
      stop();
    }, 60000);
    setStopAnalyzeTimeout(sat);
  };

  const handleCloseModal = () => {
    clearTimeouts();
    startModalShowingTimeout();
  };

  const clearTimeouts = () => {
    clearTimeout(showModalTimeout);
    clearTimeout(stopAnalyzeTimeout);
    setShowModalTimeout(NaN);
    setStopAnalyzeTimeout(NaN);
    setShowModal(false);
  };

  useEffect(startModalShowingTimeout, [fen]);

  useEffect(startStopAnalyzeTimeout, [showModal]);

  console.log('MODAL TIMEOUT: ', showModalTimeout);
  console.log('STOP TIMEOUT: ', stopAnalyzeTimeout);

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      keyboard={false}
      backdrop="static"
    >
      <Modal.Body>
        <p>In order to continue the analysis press here</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleCloseModal}>
          I'm Here
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default connect(mapStateToProps)(SubAnalyzeCheckerModal);
