import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
  setReference,
  setMoveLoader,
  setGameRefLoader,
  setGameReference,
} from '../../actions/board';
import { searchPlayers } from '../../utils/api';
import { connect } from 'react-redux';
import PlayersListFilterSearch from './PlayersListFilterSearch';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    referenceData: state.board.referenceData,
    searchParams: state.board.searchParams,
  };
};

const SearchFilterModal = ({
  isOpen,
  handleModal,
  fen,
  searchParams,
  setReference,
  setMoveLoader,
  setGameRefLoader,
  setGameReference,
}) => {
  const [userInput, setUserInput] = useState({
    whitePlayer: '',
    blackPlayer: '',
    whiteElo: '',
    blackElo: '',
    ignoreColor: false,
    resultWins: false,
    resultDraws: false,
    resultLosses: false,
    dateMin: '',
    dateMax: '',
  });

  const [whitePlayersData, setWhitePlayersData] = useState([]);
  const [blackPlayersData, setBlackPlayersData] = useState([]);
  const [showWhitePlayersList, setShowWhitePlayersList] = useState(false);
  const [showBlackPlayersList, setShowBlackPlayersList] = useState(false);

  const outsideWhiteClickHandler = () => {
    if (showWhitePlayersList) setShowWhitePlayersList(false);
  };

  const outsideBlackClickHandler = () => {
    if (showWhitePlayersList) setShowBlackPlayersList(false);
  };

  useEffect(() => {
    document.addEventListener('click', outsideWhiteClickHandler);
  });

  useEffect(() => {
    document.addEventListener('click', outsideBlackClickHandler);
  });

  const handleCloseModal = () => {
    handleModal(false);
    setUserInput({
      whitePlayer: '',
      blackPlayer: '',
      whiteElo: '',
      blackElo: '',
      ignoreColor: false,
      resultWins: false,
      resultDraws: false,
      resultLosses: false,
      dateMin: '',
      dateMax: '',
    });
  };

  const whitePlayerHandler = (event) => {
    event.preventDefault();
    let playerName = event.target.value;
    setUserInput({ ...userInput, whitePlayer: event.target.value });
    if (playerName.length >= 3) {
      searchPlayers(playerName)
        .then((players) => {
          setWhitePlayersData(players);
          setShowWhitePlayersList(true);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      setWhitePlayersData([]);
      setShowWhitePlayersList(false);
    }
  };

  const whiteEloHandler = (event) => {
    event.preventDefault();
    setUserInput({ ...userInput, whiteElo: event.target.value });
  };

  const blackPlayerHandler = (event) => {
    event.preventDefault();
    let playerName = event.target.value;
    setUserInput({ ...userInput, blackPlayer: event.target.value });
    if (playerName.length >= 3) {
      searchPlayers(playerName)
        .then((players) => {
          setBlackPlayersData(players);
          setShowBlackPlayersList(true);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      setBlackPlayersData([]);
      setShowBlackPlayersList(false);
    }
  };

  const blackEloHandler = (event) => {
    event.preventDefault();
    setUserInput({ ...userInput, blackElo: event.target.value });
  };

  const ignoreColorHandler = () => {
    setUserInput({ ...userInput, ignoreColor: !userInput.ignoreColor });
  };

  const resultWinsHandler = () => {
    setUserInput({ ...userInput, resultWins: !userInput.resultWins });
  };

  const resultDrawsHandler = () => {
    setUserInput({ ...userInput, resultDraws: !userInput.resultDraws });
  };

  const resultLossesHandler = () => {
    setUserInput({ ...userInput, resultLosses: !userInput.resultLosses });
  };

  const dateMinHandler = (event) => {
    event.preventDefault();
    setUserInput({ ...userInput, dateMin: event.target.value });
  };

  const dateMaxHandler = (event) => {
    event.preventDefault();
    setUserInput({ ...userInput, dateMax: event.target.value });
  };

  const handleReferenceSearch = () => {
    setMoveLoader(true);
    setGameRefLoader(true);
    setReference(fen, userInput);
    setGameReference(false, userInput);
    handleCloseModal();
  };

  const showModalHandler = () => {
    setUserInput({
      whitePlayer: searchParams.whitePlayer || '',
      blackPlayer: searchParams.blackPlayer || '',
      whiteElo: searchParams.whiteElo || '',
      blackElo: searchParams.blackElo || '',
      ignoreColor: searchParams.ignoreColor ? searchParams.ignoreColor : false,
      resultWins: searchParams.resultWins ? searchParams.resultWins : false,
      resultDraws: searchParams.resultDraws ? searchParams.resultDraws : false,
      resultLosses: searchParams.resultLosses
        ? searchParams.resultLosses
        : false,
      dateMin: searchParams.dateMin || '',
      dateMax: searchParams.dateMax || '',
    });
  };

  return (
    <Modal
      show={isOpen}
      onHide={handleCloseModal}
      onShow={showModalHandler}
      keyboard={true}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="d-flex flex-row justify-content-end">
          <button
            className="modal-close modal-close-search"
            type="button"
            onClick={handleCloseModal}
          >
            <img
              src={require('../../../public/assets/images/pgn-viewer/close-mark.svg')}
              width="20"
              height="20"
              alt=""
            />
          </button>
        </div>
        <div className="player-data">
          <h4>Player Data</h4>
          <div className="player-data-white d-flex flex-row justify-content-around mt-1">
            <div className="d-flex flex-column">
              <label htmlFor="whitePlayer">White</label>
              <input
                id="whitePlayer"
                value={userInput.whitePlayer}
                onChange={whitePlayerHandler}
              />
              {whitePlayersData.length > 0 && showWhitePlayersList ? (
                <PlayersListFilterSearch
                  playersData={whitePlayersData}
                  setPlayerSearchInput={setUserInput}
                  userInput={userInput}
                  color={'whitePlayer'}
                  setShowPlayersList={setShowWhitePlayersList}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="whitePlayerElo">Elo Min</label>
              <input
                id="whitePlayerElo"
                type="number"
                min="0"
                value={userInput.whiteElo}
                onChange={whiteEloHandler}
              />
            </div>
          </div>
          <div className="player-data-black d-flex flex-row justify-content-around mt-2">
            <div className="d-flex flex-column">
              <label htmlFor="blackPlayer">Black</label>
              <input
                id="blackPlayer"
                value={userInput.blackPlayer}
                onChange={blackPlayerHandler}
              />
              {blackPlayersData.length > 0 && showBlackPlayersList ? (
                <PlayersListFilterSearch
                  playersData={blackPlayersData}
                  setPlayerSearchInput={setUserInput}
                  userInput={userInput}
                  color={'blackPlayer'}
                  setShowPlayersList={setShowBlackPlayersList}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="blackPlayerElo">Elo Min</label>
              <input
                id="blackPlayerElo"
                type="number"
                min="0"
                value={userInput.blackElo}
                onChange={blackEloHandler}
              />
            </div>
          </div>
          <div className="d-flex flex-row mt-2 search-checkbox">
            <input
              id="ignoreColor"
              type="checkbox"
              checked={userInput.ignoreColor}
              onChange={ignoreColorHandler}
            />
            <label htmlFor="ignoreColor">Ignore Color</label>
          </div>
        </div>
        <div className="game-data">
          <h4>Game Data</h4>
          <div className="d-flex flex-row game-result search-checkbox">
            <input
              id="resultWins"
              type="checkbox"
              checked={userInput.resultWins}
              onChange={resultWinsHandler}
            />
            <label htmlFor="resultWins">Wins: 1-0</label>
            <input
              id="resultDraws"
              type="checkbox"
              checked={userInput.resultDraws}
              onChange={resultDrawsHandler}
            />
            <label htmlFor="resultDraws">
              Draws: <sup>1</sup>&frasl;<sub>2</sub>-<sup>1</sup>&frasl;
              <sub>2</sub>
            </label>
            <input
              id="resultLoss"
              type="checkbox"
              checked={userInput.resultLosses}
              onChange={resultLossesHandler}
            />
            <label htmlFor="resultLoss">Losses: 0-1</label>
          </div>
          <div className="d-flex flex-row  justify-content-around game-dates">
            <div className="d-flex flex-column game-min-date">
              <label htmlFor="dateMin">Date Min</label>
              <input
                id="dateMin"
                type="date"
                min="0"
                value={userInput.dateMin}
                onChange={dateMinHandler}
              />
            </div>
            <div className="d-flex flex-column game-max-date">
              <label htmlFor="dateMax">Date Max</label>
              <input
                id="dateMax"
                type="date"
                min="0"
                value={userInput.dateMax}
                onChange={dateMaxHandler}
              />
            </div>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-between mt-3">
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
              handleReferenceSearch();
            }}
          >
            Search
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps, {
  setReference,
  setMoveLoader,
  setGameRefLoader,
  setGameReference,
})(SearchFilterModal);
