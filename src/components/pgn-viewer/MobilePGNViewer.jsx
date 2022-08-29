import React, { useState, useEffect } from 'react';
import { withOrientationChange } from 'react-device-detect';
import MobileEnginesList from './MobileEnginesList';
import Variations from './Variations';
import VariationActions from './VariationActions';
import Toolbar from './Toolbar';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MoveReference from './MoveReference';
import BoardReference from './BoardReference';
import VariationOptionsModal from './VariationOptionsModal';
import Uploads from './Uploads';
import { IoMdFolder } from 'react-icons/io';
import { RiFile3Fill } from 'react-icons/ri';
import AnalysisArea from './AnalysisArea';
import { connect } from 'react-redux';
import {
  setActiveFile,
  setPgn,
  uploadFiles,
  setCurrentDirectory,
} from '../../actions/board';

const SYMBOL_MODE_LS_OPTION = 'dashboard:symbolMode';
const ACTIVE_NOTATION = require('../../../public/assets/images/pgn-viewer/notation-active.svg');
const INACTIVE_NOTATION = require('../../../public/assets/images/pgn-viewer/notation-inactive.svg');
const ACTIVE_REFERENCE = require('../../../public/assets/images/pgn-viewer/reference-active.svg');
const INACTIVE_REFERENCE = require('../../../public/assets/images/pgn-viewer/reference-inactive.svg');

const mapStateToProps = (state) => {
  return {
    variationOpt: state.board.variationOpt,
    pgnStr: state.board.pgnStr,
    userAccountInfo: state.userAccount.userAccountInfo,
    activeFileInfo: state.board.activeFileInfo,
  };
};

const MobilePGNViewer = (props) => {
  const {
    variationOpt,
    activeFileInfo,
    pgnStr,
    userAccountInfo,
    handleAnalyze,
    handleStopAnalyze,
    fenToAnalyze,
    setFenToAnalyze,
    setPgn,
    setActiveFile,
    uploadFiles,
    setCurrentDirectory,
  } = props;
  const [symbolMode, setSymbolMode] = useState('');
  const [commentField, setCommentField] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const updateSymbolMode = (mode) => {
    setSymbolMode(mode);
    window.localStorage.setItem(SYMBOL_MODE_LS_OPTION, mode);
  };

  useEffect(() => {
    if (window.localStorage.getItem(SYMBOL_MODE_LS_OPTION) === 'symbol') {
      updateSymbolMode('symbol');
    } else {
      updateSymbolMode('notation');
    }
  });

  const toggleSymbolChange = () =>
    updateSymbolMode(symbolMode === 'symbol' ? 'notation' : 'symbol');

  const closeFileHandler = () => {
    setPgn('');
    setActiveFile('', '', '');
  };

  const saveFileContentHandler = () => {
    let file = new File([pgnStr], activeFileInfo.file.key.split('/')[2], {
      type: 'application/vnd.chess-pgn',
    });

    let transfer = new DataTransfer();
    transfer.items.add(file);
    let fileList = transfer.files;

    const path = '/' + activeFileInfo.path + '/';
    uploadFiles(path, fileList, activeFileInfo.file.info, userAccountInfo).then(
      () => {
        setCurrentDirectory('/');
        closeFileHandler();
      }
    );
  };

  return (
    <div className="mb-pgn-viewer">
      <div className="pgn-viewer-body">
        <AnalysisArea
          handleAnalyze={handleAnalyze}
          fenToAnalyze={fenToAnalyze}
          setFenToAnalyze={setFenToAnalyze}
        />
        <div>
          <MobileEnginesList
            handleAnalyze={handleAnalyze}
            fenToAnalyze={fenToAnalyze}
            setFenToAnalyze={setFenToAnalyze}
          />
        </div>
        <div className="toggle-btn ml-3 mt-4">
          <p className="letter-toggle">N</p>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={toggleSymbolChange}
                  checked={symbolMode === 'symbol' ? true : false}
                  value="active"
                />
              }
              label=""
            />
          </FormGroup>
          <p>
            <span>{'\u265E'}</span>
          </p>
        </div>
        <div className="mb-pgn-wrapper">
          <div className="pgn-regulation">
            <div className="pgn-viewer-header mt-4">
              <TabList className="tab-style-mb">
                <div className="d-flex flex-row">
                  <Tab onClick={() => setActiveTab(0)}>
                    <img
                      src={
                        activeTab === 0 ? ACTIVE_NOTATION : INACTIVE_NOTATION
                      }
                      height={17}
                      width={17}
                      alt=""
                    />
                    <span
                      style={{ color: activeTab === 0 ? '#358C65' : '#959D99' }}
                    >
                      Notation
                    </span>
                  </Tab>
                  <Tab
                    onClick={() => {
                      setActiveTab(1);
                    }}
                  >
                    <img
                      src={
                        activeTab === 1 ? ACTIVE_REFERENCE : INACTIVE_REFERENCE
                      }
                      height={17}
                      width={17}
                      alt=""
                    />
                    <span
                      style={{ color: activeTab === 1 ? '#358C65' : '#959D99' }}
                    >
                      Reference
                    </span>
                  </Tab>
                  <Tab
                    className="uploads-tab"
                    onClick={() => {
                      setActiveTab(2);
                    }}
                  >
                    <IoMdFolder
                      height={20}
                      width={20}
                      className="uploads"
                      style={{ color: activeTab === 2 ? '#358C65' : '#959D99' }}
                    />
                    <span>
                      Uploads <sup className="beta">beta</sup>
                    </span>
                  </Tab>
                </div>
              </TabList>
            </div>
          </div>
          <Tabs
            selectedIndex={activeTab}
            onSelect={(index) => setActiveTab(index)}
          >
            <div className="pgn-viewer-body">
              <TabPanel>
                <div>
                  {Object.keys(activeFileInfo).length !== 0 &&
                  activeFileInfo.file &&
                  activeFileInfo.file.key ? (
                    <div className="d-flex flex-column">
                      <div className="uploaded-folder-title">
                        <RiFile3Fill width={20} height={20} />
                        <span>
                          {activeFileInfo.file.key.split('/')[1] +
                            '/' +
                            activeFileInfo.file.key.split('/')[2]}
                        </span>
                      </div>

                      <div className="d-flex flex-row justify-content-end">
                        <button
                          className="game-format-btn game-format-close-btn file-close-btn"
                          variant="primary"
                          type="button"
                          onClick={() => {
                            closeFileHandler();
                          }}
                        >
                          Close without Saving
                        </button>
                        <button
                          className="game-format-apply-btn file-save-btn"
                          variant="primary"
                          type="button"
                          onClick={() => saveFileContentHandler()}
                        >
                          Save and Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <Variations
                    symbolModeEnabled={symbolMode === 'symbol'}
                    setCommentField={setCommentField}
                  />
                  <div>
                    <Toolbar
                      isCommentField={commentField}
                      setCommentField={setCommentField}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="reference-content">
                  <MoveReference />
                </div>
                <div className="reference-divider"></div>
                <div className="reference-content">
                  <BoardReference setActiveTab={setActiveTab} />
                </div>
              </TabPanel>
              <TabPanel>
                <Uploads setActiveTab={setActiveTab} />
              </TabPanel>
            </div>
          </Tabs>
          {variationOpt ? (
            <VariationOptionsModal isOpen={variationOpt} />
          ) : (
            <></>
          )}
        </div>
        <div className="pgn-viewer-footer">
          <VariationActions start={handleAnalyze} stop={handleStopAnalyze} />
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, {
  setPgn,
  setActiveFile,
  uploadFiles,
  setCurrentDirectory,
})(withOrientationChange(MobilePGNViewer));
