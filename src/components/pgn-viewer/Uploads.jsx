import React, { useState, useEffect } from 'react';
import UploadedDirs from './UploadedDirs';
import UploadsNav from './UploadsNav';
import UploadedFiles from './UploadedFiles';
import { connect } from 'react-redux';
import { setLoader, setUserUploads } from '../../actions/board';

const mapStateToProps = (state) => {
  return {
    userUploads: state.board.userUploads,
    currentDirectory: state.board.currentDirectory,
    loader: state.board.loader,
    userAccountInfo: state.userAccount.userAccountInfo,
  };
};

const Uploads = ({
  userUploads,
  setUserUploads,
  currentDirectory,
  loader,
  userAccountInfo,
  setActiveTab,
  setLoader,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const outsideClickHandler = (event) => {
    if (
      !event.target.classList.contains('directory') &&
      Object.keys(event.target.classList).length !== 0
    ) {
      setSelectedFiles([]);
    }
  };

  useEffect(() => {
    const outsideClick = setTimeout(() => {
      document.addEventListener('click', outsideClickHandler);
    }, 500);
    return () => {
      clearTimeout(outsideClick);
      document.removeEventListener('click', outsideClickHandler);
    };
  });

  useEffect(() => {
    let isMounted = true;
    if (
      Object.keys(userUploads).length === 0 &&
      !userUploads.hasOwnProperty('noExistingFilesErrorMessage') &&
      isMounted
    ) {
      setLoader('initalLoad');
      setUserUploads('/', userAccountInfo);
    }
    return () => {
      isMounted = false;
    };
  }, [userUploads]);

  useEffect(() => {
    console.log('DIRECTORY CHANGED');
  }, [currentDirectory]);

  return (
    <>
      {loader === 'initalLoad' ? (
        <div className="isLoading isLoading-folder isLoading-uploads">
          <div>
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <UploadsNav
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            userAccountInfo={userAccountInfo}
          />
          {userUploads.hasOwnProperty('noExistingFilesErrorMessage') ? (
            <div className="no-uploads">
              {userUploads.noExistingFilesErrorMessage}
            </div>
          ) : currentDirectory === '/' ? (
            <UploadedDirs
              userUploadedFiles={userUploads}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              userAccountInfo={userAccountInfo}
            />
          ) : (
            <UploadedFiles
              userUploadedFiles={userUploads}
              userAccountInfo={userAccountInfo}
              setActiveTab={setActiveTab}
            />
          )}
        </>
      )}
    </>
  );
};

export default connect(mapStateToProps, { setUserUploads, setLoader })(Uploads);
