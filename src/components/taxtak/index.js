import React from 'react';
import { connect } from 'react-redux';
import NewTaxtak from './NewTaxtak';
import PgnViewer from '../pgn-viewer';
import EditArea from './EditArea';
import { setFen, setBoardOrientation, setPgn } from '../../actions/board';
import GameFormatsModal from '../pgn-viewer/GameFormatsModal';
import QuickEdit from './QuickEdit';

const mapStateToProps = (state) => {
  return { fen: state.board.fen, orientation: state.board.orientation };
};

const SOUND_MODE_LS_OPTION = 'dashboard:soundMode';

class ChessboardWebgl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promotion: null,
      editMode: false,
      soundMode: '',
      openGameFormat: false,
    };
    this.isDialogOpened = false;
  }

  setEditMode = () => {
    const { editMode } = this.state;
    this.setState({
      editMode: !editMode,
    });
  };

  setSoundMode = (mode) => {
    this.setState({
      soundMode: mode,
    });
  };

  updateSoundMode = (mode) => {
    this.setSoundMode(mode);
    window.localStorage.setItem(SOUND_MODE_LS_OPTION, mode);
  };

  setOpenGameFormat = () => {
    const { openGameFormat } = this.state;
    this.setState({
      openGameFormat: !openGameFormat,
    });
  };

  componentDidMount() {
    if (window.localStorage.getItem(SOUND_MODE_LS_OPTION) === 'on') {
      this.updateSoundMode('on');
    } else {
      this.updateSoundMode('off');
    }
  }

  render() {
    const {
      fen,
      orientation,
      setFen,
      setBoardOrientation,
      setPgn,
    } = this.props;
    const { editMode, soundMode, openGameFormat } = this.state;

    return (
      <div>
        <main className="page-wrapper">
          <div className="container-fluid">
            <div
              className="colomn"
              style={{ display: `${editMode ? '' : 'none'}` }}
            >
              <div className="col-lg-9 col-12">
                <div
                  className="wood4"
                  style={{
                    '--zoom': 100,
                    padding: '6px',
                  }}
                  data-asset-version="TDotAa"
                  data-asset-url="https://lichess1.org"
                >
                  <div id="board-editor" className="is2d board-area" />
                </div>
              </div>
            </div>
            <div
              className="row"
            >
              <div className={`col-12 board-area  ${!editMode ?  "col-lg-5" : "col-lg-2 edit-board-area"}`}>
                <div style={{ display: `${!editMode ? '' : 'none'}` }}>
                  <QuickEdit
                    setFen={setFen}
                    setBoardOrientation={setBoardOrientation}
                    orientation={orientation}
                    updateSoundMode={this.updateSoundMode}
                    soundMode={soundMode}
                  />
                  <NewTaxtak soundMode={soundMode} />
                </div>
                <div className={`d-flex flex-row mt-2  ${!editMode ?  " justify-content-between" : " justify-content-center"}`}>
                  <EditArea
                    fen={fen}
                    orientation={orientation}
                    setFen={setFen}
                    setEditMode={this.setEditMode}
                    editMode={editMode}
                    setBoardOrientation={setBoardOrientation}
                  />
                  <div className="game-import-section" style={{ display: `${!editMode ? '' : 'none'}` }}>
                    <button
                      className="game-import"
                      type="button"
                      onClick={this.setOpenGameFormat}
                    >
                      <img
                        src={require('../../../public/assets/images/pgn-viewer/import-checkmark.svg')}
                        width="10"
                        height="10"
                        alt=""
                      />
                      Import/ Export
                    </button>
                  </div>
                </div>
                <GameFormatsModal
                  isOpen={openGameFormat}
                  handleModal={this.setOpenGameFormat}
                />
              </div>
              <div
                className="col-lg-7 col-12 pgn-viewer-container-scroll"
                style={{ display: `${!editMode ? '' : 'none'}` }}
              >
                <PgnViewer />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  setFen,
  setBoardOrientation,
  setPgn,
})(ChessboardWebgl);
