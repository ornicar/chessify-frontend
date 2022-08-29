import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import {
  RiEdit2Line,
  RiUpload2Line,
  RiDeleteBinFill,
  RiFileDownloadLine,
} from 'react-icons/ri';
import {
  setActiveFile,
  setPgn,
  uploadFiles,
  setLoader,
  deleteFiles,
} from '../../actions/board';
import { connect } from 'react-redux';
import { getFiles } from '../../utils/api';
import FileInfoModal from './FileInfoModal';
import UploadsSavingModal from './UploadsSavingModal';
import DeleteFilesModal from './DeleteFilesModal';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    pgnStr: state.board.pgnStr,
    currentDirectory: state.board.currentDirectory,
    loader: state.board.loader,
    activeFileInfo: state.board.activeFileInfo,
  };
};

const UploadedFiles = ({
  userUploadedFiles,
  currentDirectory,
  setPgn,
  setActiveFile,
  loader,
  uploadFiles,
  setLoader,
  activeFileInfo,
  pgnStr,
  deleteFiles,
  userAccountInfo,
  setActiveTab,
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingFile, setEditingFile] = useState({
    file: '',
    path: '',
    info: '',
  });
  const [openSaveWarning, setOpenSaveWarning] = useState(false);
  const [fileToSwitchTo, setFileToSwitchTo] = useState('');

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingFile, setDeletingFile] = useState('');

  async function setFilePgn(file, currentDirectory) {
    setLoader(file.key + '-setNotLoad');
    if (
      activeFileInfo &&
      activeFileInfo.file &&
      activeFileInfo.file.path &&
      activeFileInfo.file.path.length
    ) {
      getFiles(activeFileInfo.file.path, userAccountInfo.token)
        .then((fileContent) => {
          if (!fileContent.includes(pgnStr)) {
            setOpenSaveWarning(true);
            setFileToSwitchTo(file);
          }
          return fileContent;
        })
        .then((fileContent) => {
          if (fileContent.includes(pgnStr)) {
            getFiles(file.path, userAccountInfo.token).then((fileContent) => {
              setPgn(fileContent);
              setActiveFile(fileContent, file, currentDirectory);
              setLoader('');
              setActiveTab(0);
            });
          }
        });
    } else {
      getFiles(file.path, userAccountInfo.token).then((fileContent) => {
        setPgn(fileContent);
        setActiveFile(fileContent, file, currentDirectory);
        setActiveTab(0);
        setLoader('');
      });
    }
  }

  const editFileInfoHandler = (file) => {
    setLoader(file.key + '-editLoad');
    getFiles(file.path, userAccountInfo.token).then((fileContent) => {
      let newFile = new File([fileContent], file.key.split('/')[2], {
        type: 'application/vnd.chess-pgn',
      });

      let transfer = new DataTransfer();
      transfer.items.add(newFile);
      let fileList = transfer.files;
      setEditingFile({
        file: fileList,
        path: '/' + currentDirectory + '/',
        info: file.info,
      });
      setLoader('');
      setOpenEditModal(true);
    });
  };

  const deleteFileHandler = (file) => {
    setDeletingFile([file.key]);
    setOpenDeleteModal(true);
  };

  const downloadFileHandler = (file) => {
    setLoader(file.key + '-downloadLoad');
    getFiles(file.path, userAccountInfo.token).then((fileContent) => {
      let element = window.document.createElement('a');
      element.href = window.URL.createObjectURL(
        new Blob([fileContent], { type: 'application/vnd.chess-pgn' })
      );
      const name = file.key.split('/')[2];

      element.download = name;

      document.body.appendChild(element);
      element.click();

      document.body.removeChild(element);
      setLoader('');
    });
  };

  const editResult = (result) => {
    if (result === 'wins') return '1-0';
    if (result === 'draws') return '1/2-1/2';
    if (result === 'losses') return '0-1';
  };

  return (
    <>
      <Table className="scroll" hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>White</th>
            <th>Black</th>
            <th>Result</th>
            <th className="editing-col-th"></th>
          </tr>
        </thead>
        <tbody>
          {loader === 'fileLoader' ? (
            <tr className="isLoading">
              <td>
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </td>
            </tr>
          ) : (
            <></>
          )}
          {loader !== 'fileLoader' &&
          userUploadedFiles &&
          userUploadedFiles[`${currentDirectory}`] ? (
            userUploadedFiles[`${currentDirectory}`].map((file, index) => {
              return (
                <tr
                  className={`uploaded-files ${
                    activeFileInfo.file &&
                    activeFileInfo.file.key &&
                    file.key &&
                    file.key === activeFileInfo.file.key
                      ? 'activeFile'
                      : ''
                  }`}
                  key={file.key + Math.random()}
                >
                  <td>{file.key.split('/')[2]}</td>
                  <td className={file.info && file.info.date ? '' : 'emptyTD'}>
                    {file.info && file.info.date ? file.info.date : '-'}
                  </td>
                  <td className={file.info && file.info.white ? '' : 'emptyTD'}>
                    {file.info && file.info.white ? file.info.white : '-'}
                  </td>
                  <td className={file.info && file.info.black ? '' : 'emptyTD'}>
                    {file.info && file.info.black ? file.info.black : '-'}
                  </td>
                  <td
                    className={file.info && file.info.result ? '' : 'emptyTD'}
                  >
                    {file.info && file.info.result
                      ? editResult(file.info.result)
                      : '-'}
                  </td>
                  <td className="editing-col">
                    <div className="d-flex flex-row">
                      <>
                        {loader === file.key + '-editLoad' ? (
                          <div className="circle-loader"></div>
                        ) : (
                          <RiEdit2Line
                            className="edit-file"
                            title="Edit Info"
                            onClick={() => {
                              editFileInfoHandler(file);
                            }}
                          />
                        )}
                      </>
                      <>
                        {loader === file.key + '-setNotLoad' ? (
                          <div className="circle-loader"></div>
                        ) : (
                          <RiUpload2Line
                            className="edit-file"
                            title="Set to notation"
                            onClick={() => {
                              setFilePgn(file, currentDirectory);
                            }}
                          />
                        )}
                      </>
                      <>
                        {loader === file.key + '-downloadLoad' ? (
                          <div className="circle-loader"></div>
                        ) : (
                          <RiFileDownloadLine
                            className="edit-file"
                            title="Download File"
                            onClick={() => {
                              downloadFileHandler(file, currentDirectory);
                            }}
                          />
                        )}
                      </>
                      <>
                        {loader === file.key + '-deleteLoad' ? (
                          <div className="circle-loader"></div>
                        ) : (
                          <RiDeleteBinFill
                            className="edit-file"
                            title="Delete File"
                            onClick={() => {
                              deleteFileHandler(file);
                            }}
                          />
                        )}
                      </>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </Table>
      <FileInfoModal
        isOpen={openEditModal}
        setIsOpen={setOpenEditModal}
        upload={editingFile}
        uploadFiles={uploadFiles}
        setLoader={setLoader}
        userAccountInfo={userAccountInfo}
      />
      <UploadsSavingModal
        isOpen={openSaveWarning}
        setIsOpen={setOpenSaveWarning}
        fileToSwitchTo={fileToSwitchTo}
        userAccountInfo={userAccountInfo}
        setLoader={setLoader}
        setActiveTab={setActiveTab}
      />
      <DeleteFilesModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        selectedFiles={deletingFile}
        setSelectedFiles={setDeletingFile}
        deleteFiles={deleteFiles}
        isFile={true}
        userAccountInfo={userAccountInfo}
        setLoader={setLoader}
      />
    </>
  );
};

export default connect(mapStateToProps, {
  setPgn,
  setActiveFile,
  uploadFiles,
  setLoader,
  deleteFiles,
})(UploadedFiles);
