import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CreateNewFolderModal = ({
  isOpen,
  setIsOpen,
  setLoader,
  createFolder,
  userAccountInfo,
}) => {
  const [folderName, setFolderName] = useState('');

  const closeModalHandler = () => {
    setFolderName('');
    setIsOpen(false);
  };

  const createFolderHandler = () => {
    closeModalHandler();
    setLoader('folderLoader');
    createFolder('/', folderName, userAccountInfo).then(() => {
      setLoader('');
    });
  };

  return (
    <Modal
      size="md"
      show={isOpen}
      onHide={closeModalHandler}
      keyboard={true}
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="d-flex flex-row justify-content-between">
          <h4>New Folder</h4>
          <button
            className="modal-close"
            type="button"
            onClick={closeModalHandler}
          >
            <img
              src={require('../../../public/assets/images/pgn-viewer/close-mark.svg')}
              width="30"
              height="30"
              alt=""
            />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createFolderHandler();
          }}
        >
          <div className="form-group">
            <input
              className="folder-name-input"
              type="text"
              name="folder_name_input"
              value={folderName}
              autoFocus
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          <div className="d-flex flex-row justify-content-between">
            <Button
              className="game-format-btn game-format-close-btn"
              variant="primary"
              onClick={() => {
                closeModalHandler(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="game-format-apply-btn"
              variant="primary"
              type="submit"
            >
              Create
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateNewFolderModal;
