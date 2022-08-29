import React, { useState } from 'react';
import { ImFolderPlus, ImFolderUpload } from 'react-icons/im';
import {
  RiFileUploadFill,
  RiArrowLeftLine,
  RiDeleteBinFill,
} from 'react-icons/ri';
import CreateNewFolderModal from './CreateNewFolderModal';
import DeleteFilesModal from './DeleteFilesModal';
import FileInfoModal from './FileInfoModal';
import {
  uploadFiles,
  setCurrentDirectory,
  setLoader,
  createFolder,
  deleteFiles,
} from '../../actions/board';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    userUploads: state.board.userUploads,
    currentDirectory: state.board.currentDirectory,
  };
};

const UploadsNav = ({
  currentDirectory,
  setCurrentDirectory,
  selectedFiles,
  setSelectedFiles,
  uploadFiles,
  setLoader,
  createFolder,
  deleteFiles,
  userAccountInfo,
}) => {
  const [createFolderModal, setcreateFolderModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileInfoModal, setFileInfoModal] = useState(false);
  const [upload, setUpload] = useState({
    file: '',
    path: '',
  });

  const createNewFolderHandler = () => {
    setcreateFolderModal(true);
  };

  const uploadFilesHandler = (event) => {
    const files = event.target.files;

    const path = '/' + currentDirectory + '/';
    if (files.length === 1) {
      setFileInfoModal(true);
      setLoader('fileLoader');
      setUpload({ file: files, path: path });
    } else {
      setLoader('fileLoader');
      uploadFiles(path, files, {}, userAccountInfo).then(() => setLoader(''));
    }
  };

  const uploadFolderHandler = (e) => {
    const files = e.target.files;
    const path = files[0].webkitRelativePath.split('/')[0];
    setLoader('folderLoader');
    createFolder('/', path, userAccountInfo).then(() => {
      setLoader('fileLoader');
      uploadFiles('/' + path + '/', files, {}, userAccountInfo);
    });
  };

  const deleteFilesHandler = () => {
    setDeleteModal(true);
  };

  const backFromDirectoryHandler = () => {
    setCurrentDirectory('/');
  };

  return (
    <div className="upload-nav directory">
      <div>
        {currentDirectory !== '/' ? (
          <RiArrowLeftLine
            className="upload-nav-icon"
            onClick={() => backFromDirectoryHandler()}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="upload-nav-operatons">
        {selectedFiles && selectedFiles.length ? (
          <RiDeleteBinFill
            className="upload-nav-icon directory"
            width={35}
            height={35}
            onClick={deleteFilesHandler}
          />
        ) : (
          <></>
        )}
        {currentDirectory !== '/' ? (
          <>
            <label htmlFor="upload-file">
              <RiFileUploadFill
                className="upload-nav-icon upload-file"
                title="Upload File"
              />
            </label>
            <input
              id="upload-file"
              type="file"
              accept=".pgn"
              multiple
              onChange={(e) => uploadFilesHandler(e)}
              hidden
            />
          </>
        ) : (
          <>
            <ImFolderPlus
              className="upload-nav-icon"
              title="New Folder"
              onClick={createNewFolderHandler}
            />
            <label htmlFor="upload-folder">
              <ImFolderUpload
                className="upload-nav-icon"
                title="Upload Folder"
              />
            </label>
            <input
              id="upload-folder"
              type="file"
              directory=""
              webkitdirectory=""
              mozdirectory=""
              hidden
              onChange={(e) => uploadFolderHandler(e)}
            />
          </>
        )}
      </div>
      <CreateNewFolderModal
        isOpen={createFolderModal}
        setIsOpen={setcreateFolderModal}
        uploadFiles={uploadFiles}
        setLoader={setLoader}
        createFolder={createFolder}
        userAccountInfo={userAccountInfo}
      />
      <DeleteFilesModal
        isOpen={deleteModal}
        setIsOpen={setDeleteModal}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        deleteFiles={deleteFiles}
        userAccountInfo={userAccountInfo}
        setLoader={setLoader}
      />
      <FileInfoModal
        isOpen={fileInfoModal}
        setIsOpen={setFileInfoModal}
        upload={upload}
        uploadFiles={uploadFiles}
        setLoader={setLoader}
        userAccountInfo={userAccountInfo}
      />
    </div>
  );
};

export default connect(mapStateToProps, {
  uploadFiles,
  setCurrentDirectory,
  setLoader,
  createFolder,
  deleteFiles,
})(UploadsNav);
