import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Variations from './Variations';
import VariationActions from './VariationActions';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Toolbar from './Toolbar';
import DesktopEnginesList from './DesktopEnginesList';
import MoveReference from './MoveReference';
import BoardReference from './BoardReference';
import VariationOptionsModal from './VariationOptionsModal';
import { IoMdFolder } from 'react-icons/io';
import { RiFile3Fill } from 'react-icons/ri';
import { connect } from 'react-redux';
import Uploads from './Uploads';
import AnalysisArea from './AnalysisArea';
import {
  setActiveFile,
  setPgn,
  uploadFiles,
  setCurrentDirectory,
} from '../../actions/board';

const mapStateToProps = (state) => {
  return {
    variationOpt: state.board.variationOpt,
    activeFileInfo: state.board.activeFileInfo,
    pgnStr: state.board.pgnStr,
    userAccountInfo: state.userAccount.userAccountInfo,
  };
};

const SYMBOL_MODE_LS_OPTION = 'dashboard:symbolMode';
const ACTIVE_NOTATION = require('../../../public/assets/images/pgn-viewer/notation-active.svg');
const INACTIVE_NOTATION = require('../../../public/assets/images/pgn-viewer/notation-inactive.svg');
const ACTIVE_REFERENCE = require('../../../public/assets/images/pgn-viewer/reference-active.svg');
const INACTIVE_REFERENCE = require('../../../public/assets/images/pgn-viewer/reference-inactive.svg');

const DesktopPGNViewer = (props) => {
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
    <React.Fragment>
      <div>
        <div className="dsk-pgn-viewer ml-3">
          <Tabs
            selectedIndex={activeTab}
            onSelect={(index) => setActiveTab(index)}
          >
            <div className="pgn-viewer-header">
              <TabList className="tab-style--1">
                <div>
                  <Tab onClick={() => setActiveTab(0)}>
                    <img
                      src={
                        activeTab === 0 ? ACTIVE_NOTATION : INACTIVE_NOTATION
                      }
                      height={20}
                      width={20}
                      alt=""
                    />
                    <span>Notation</span>
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
                      height={20}
                      width={20}
                      alt=""
                    />
                    <span>Reference</span>
                  </Tab>
                  <Tab
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
                <div className="pgn-regulation">
                  <div className="toggle-btn">
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
                </div>
              </TabList>
            </div>
            <div className="pgn-viewer-body">
              <TabPanel>
                <div>
                  {Object.keys(activeFileInfo).length !== 0 &&
                  activeFileInfo.file &&
                  activeFileInfo.file.key ? (
                    <div className="d-flex flex-row justify-content-between">
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
          <div className="pgn-viewer-footer mt--10">
            <VariationActions start={handleAnalyze} stop={handleStopAnalyze} />
          </div>
          {variationOpt ? (
            <VariationOptionsModal isOpen={variationOpt} />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="mt--10 ml-3">
        <AnalysisArea
          handleAnalyze={handleAnalyze}
          fenToAnalyze={fenToAnalyze}
          setFenToAnalyze={setFenToAnalyze}
        />
        <DesktopEnginesList
          handleAnalyze={handleAnalyze}
          fenToAnalyze={fenToAnalyze}
          setFenToAnalyze={setFenToAnalyze}
        />
      </div>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, {
  setPgn,
  setActiveFile,
  uploadFiles,
  setCurrentDirectory,
})(DesktopPGNViewer);
