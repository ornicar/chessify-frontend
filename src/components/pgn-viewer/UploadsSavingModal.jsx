import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  uploadFiles,
  setActiveFile,
  setPgn,
} from '../../actions/board';
import { getFiles } from '../../utils/api';

const mapStateToProps = (state) => {
  return {
    currentDirectory: state.board.currentDirectory,
    activeFileInfo: state.board.activeFileInfo,
    pgnStr: state.board.pgnStr,
  };
};

const UploadsSavingModal = ({
  isOpen,
  setIsOpen,
  activeFileInfo,
  fileToSwitchTo,
  uploadFiles,
  setActiveFile,
  setPgn,
  currentDirectory,
  pgnStr,
  userAccountInfo,
  setLoader,
  setActiveTab,
}) => {
  const closeModalHandler = () => {
    setIsOpen(false);
  };

  const closeWithoutSavingHandler = () => {
    getFiles(fileToSwitchTo.path, userAccountInfo.token).then((fileContent) => {
      setPgn(fileContent);
      setActiveFile(fileContent, fileToSwitchTo, currentDirectory);
      setActiveTab(0);
    });
    closeModalHandler();
  };

  const saveAndCloseHandler = () => {
    let file = new File([pgnStr], activeFileInfo.file.key.split('/')[2], {
      type: 'application/vnd.chess-pgn',
    });

    let transfer = new DataTransfer();
    transfer.items.add(file);
    let fileList = transfer.files;

    const path = '/' + activeFileInfo.path + '/';
    setLoader('');
    uploadFiles(path, fileList, activeFileInfo.file.info, userAccountInfo).then(
      () => {
        closeWithoutSavingHandler();
      }
    );
  };

  const cancelHandler = () => {
    closeModalHandler();
    setLoader('');
  };

  return (
    <Modal
      size="md"
      show={isOpen}
      onHide={closeModalHandler}
      keyboard={true}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="save-affirmation-modal">
        <p>
          Save the changes in{' '}
          {activeFileInfo &&
            activeFileInfo.file &&
            activeFileInfo.file.key &&
            activeFileInfo.file.key.split('/')[1] +
              '/' +
              activeFileInfo.file.key.split('/')[2]}{' '}
          before closing it?
        </p>
        <div className="d-flex flex-row justify-content-center">
          <Button
            className="game-format-btn game-format-close-btn"
            onClick={() => {
              closeWithoutSavingHandler();
            }}
          >
            Close
          </Button>
          <Button
            className="game-format-btn game-format-close-btn"
            onClick={() => {
              cancelHandler();
            }}
          >
            Cancel
          </Button>
          <Button
            className="game-format-apply-btn directory"
            onClick={() => {
              saveAndCloseHandler();
            }}
          >
            Save and Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps, {
  setPgn,
  setActiveFile,
  uploadFiles,
})(UploadsSavingModal);
