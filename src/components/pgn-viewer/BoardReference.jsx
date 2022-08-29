import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchFilterModal from './SearchFilterModal';
import GameReference from './GameReference';
import PlayersList from './PlayersList';
import { searchPlayers } from '../../utils/api';
import { isQuickSearch, modifySearchParam } from '../../utils/pgn-viewer';
import {
  setGameReference,
  setReference,
  setMoveLoader,
  setGameRefLoader,
} from '../../actions/board';

const mapStateToProps = (state) => {
  return {
    searchParams: state.board.searchParams,
    fen: state.board.fen,
  };
};

const BoardReference = ({
  fen,
  searchParams,
  setReference,
  setGameReference,
  setMoveLoader,
  setGameRefLoader,
  setActiveTab,
}) => {
  const [filterModal, setFileterModal] = useState(false);
  const [playerSearchInput, setPlayerSearchInput] = useState('');
  const [playersData, setPlayersData] = useState([]);
  const [showPlayersList, setShowPlayersList] = useState(false);

  const outsideClickHandler = () => {
    if (showPlayersList) setShowPlayersList(false);
  };

  useEffect(() => {
    document.addEventListener('click', outsideClickHandler);
  });

  const handleFilterModal = () => {
    setFileterModal(!filterModal);
  };

  const searchParamRemoveHandler = (param, fen, searchParams) => {
    let updatedSearchParams = { ...searchParams };
    if (isQuickSearch(searchParams, param)) {
      updatedSearchParams = {};
    } else if (
      (param == 'ignoreColor' || param.includes('result')) &&
      searchParams[param]
    ) {
      updatedSearchParams = {
        ...searchParams,
        [`${param}`]: false,
      };
    } else {
      updatedSearchParams = { ...searchParams, [`${param}`]: '' };
    }
    setMoveLoader(true);
    setGameRefLoader(true);
    setReference(fen, updatedSearchParams);
    setGameReference(false, updatedSearchParams);
  };

  const playerSearchInputHandler = (event) => {
    let playerName = event.target.value;
    setPlayerSearchInput(playerName);
    if (playerName.length >= 3) {
      searchPlayers(playerName)
        .then((players) => {
          setPlayersData(players);
          setShowPlayersList(true);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      setPlayersData([]);
      setShowPlayersList(false);
    }
  };

  return (
    <div>
      <div className="search-reference-section d-flex flex-row justify-content-between">
        <div className="quick-search">
          <div className="d-flex flex-row">
            <img
              src={require('../../../public/assets/images/pgn-viewer/reference-inactive.svg')}
              className="quick-search-img"
              width={24}
              height={24}
              alt=""
            />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name..."
              value={playerSearchInput}
              onChange={playerSearchInputHandler}
            />
          </div>
          {playersData.length > 0 && showPlayersList ? (
            <PlayersList
              playersData={playersData}
              setPlayerSearchInput={setPlayerSearchInput}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="d-flex flex-row">
          <ul className="d-flex flex-wrap">
            {searchParams
              ? Object.keys(searchParams).map((key, index) => {
                  return (searchParams[key] && key.includes('result')) ||
                    (searchParams[key].length &&
                      key !== 'ignoreColor' &&
                      key !== 'order' &&
                      key !== 'order_by') ? (
                    <li
                      className="search-param-tag d-flex flex-row"
                      key={index * Math.random()}
                    >
                      <p>{modifySearchParam(searchParams, key)}</p>
                      <button
                        className="tag-close"
                        onClick={() => {
                          searchParamRemoveHandler(key, fen, searchParams);
                        }}
                      >
                        <img
                          src={require('../../../public/assets/images/pgn-viewer/close-mark.svg')}
                          width={18}
                          height={18}
                          alt=""
                        />
                      </button>
                    </li>
                  ) : (
                    <div key={Math.random()}></div>
                  );
                })
              : ''}
          </ul>
          <button
            className="filtered-search search-btn"
            onClick={handleFilterModal}
          >
            <img
              src={require('../../../public/assets/images/pgn-viewer/filter.svg')}
              width={24}
              height={24}
              alt=""
            />
          </button>
        </div>
      </div>
      <GameReference setActiveTab={setActiveTab} />
      <SearchFilterModal isOpen={filterModal} handleModal={setFileterModal} />
    </div>
  );
};

export default connect(mapStateToProps, {
  setReference,
  setGameReference,
  setMoveLoader,
  setGameRefLoader,
})(BoardReference);
