import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { downloadPGN } from '../../utils/chess-utils';
import { setFen, setPgn } from '../../actions/board';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    pgnStr: state.board.pgnStr,
  };
};

const GameFormatsModal = ({
  fen,
  pgnStr,
  isOpen,
  handleModal,
  setFen,
  setPgn,
}) => {
  const [newFen, setNewFen] = useState(fen);
  const [newPgn, setNewPgn] = useState(pgnStr);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setNewFen(fen);
  }, [fen]);

  useEffect(() => {
    setNewPgn(pgnStr);
  }, [pgnStr]);

  const handleCloseModal = () => {
    handleModal(false);
    setActiveTab(0);
  };

  const copyNotation = () => {
    let notationCopy = activeTab === 1 ? newFen : newPgn;

    navigator.clipboard.writeText(notationCopy);
  };

  return (
    <Modal
      show={isOpen}
      onHide={handleCloseModal}
      keyboard={true}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="d-flex flex-row justify-content-between">
          <h3 className="game-format-title">Game Formats</h3>
          <button
            className="modal-close"
            type="button"
            onClick={handleCloseModal}
          >
            <img
              src={require('../../../public/assets/images/pgn-viewer/close-mark.svg')}
              width="30"
              height="30"
              alt=""
            />
          </button>
        </div>
        <Tabs>
          <TabList>
            <div className="format-menu">
              <div className="format-taglist">
                <Tab
                  className={`format-pgn  ${
                    activeTab === 0 && 'format-pgn-active'
                  }`}
                  onClick={() => setActiveTab(0)}
                >
                  PGN
                </Tab>
                <Tab
                  className={`format-fen ${
                    activeTab === 1 && 'format-fen-active'
                  }`}
                  onClick={() => setActiveTab(1)}
                >
                  FEN
                </Tab>
              </div>
              <div>
                <button
                  className="game-format-btn copy-btn"
                  onClick={copyNotation}
                >
                  <img
                    src={require('../../../public/assets/images/pgn-viewer/copy-notation.svg')}
                    width="20"
                    height="20"
                    alt=""
                  />
                  <span>Copy</span>
                </button>
                <button
                  className="game-format-btn download-btn"
                  onClick={() => downloadPGN(newPgn)}
                >
                  <img
                    src={require('../../../public/assets/images/pgn-viewer/download-pgn.svg')}
                    width="20"
                    height="20"
                    alt=""
                  />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </TabList>

          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPgn(newPgn);
              }}
            >
              <div className="form-group">
                <textarea
                  className="pgn-textarea"
                  type="text"
                  name="pgn_input"
                  value={newPgn}
                  rows="4"
                  onChange={(e) => setNewPgn(e.target.value)}
                />
              </div>
              <div className="d-flex flex-row justify-content-between">
                <Button
                  className="game-format-btn game-format-close-btn"
                  variant="primary"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
                <Button
                  className="game-format-apply-btn"
                  variant="primary"
                  onClick={() => {
                    setPgn(newPgn);
                    handleCloseModal();
                  }}
                >
                  Apply
                </Button>
              </div>
            </form>
          </TabPanel>
          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFen(newFen);
              }}
            >
              <div className="form-group">
                <input
                  className="fen-input"
                  type="text"
                  name="fen_input"
                  value={newFen}
                  onChange={(e) => setNewFen(e.target.value)}
                />
              </div>
            </form>
            <div className="d-flex flex-row justify-content-between">
              <Button
                className="game-format-btn game-format-close-btn"
                variant="primary"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                className="game-format-apply-btn"
                variant="primary"
                onClick={() => {
                  setFen(newFen);
                  handleCloseModal();
                }}
              >
                Apply
              </Button>
            </div>
          </TabPanel>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps, { setFen, setPgn })(GameFormatsModal);
