import React from 'react';
import {
  setReference,
  setGameRefLoader,
  setMoveLoader,
  setGameReference,
} from '../../actions/board';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
  };
};

const PlayersList = (props) => {
  const {
    playersData,
    setPlayerSearchInput,
    setReference,
    fen,
    setGameRefLoader,
    setMoveLoader,
    setGameReference,
  } = props;
  const handlePlayerSearch = (player) => {
    setPlayerSearchInput(player);
    const searchParams = {
      whitePlayer: player,
      blackPlayer: '',
      whiteElo: '',
      blackElo: '',
      ignoreColor: true,
      resultWins: false,
      resultDraws: false,
      resultLosses: false,
      dateMin: '',
      dateMax: '',
    };
    setMoveLoader();
    setGameRefLoader();
    setReference(fen, searchParams);
    setGameReference(false, searchParams);
    setPlayerSearchInput('');
  };
  return (
    <ul className="player-suggestions">
      {playersData.map((player) => {
        return (
          <li
            key={player.length * Math.random()}
            onClick={() => {
              handlePlayerSearch(player);
            }}
          >
            {player}
          </li>
        );
      })}
    </ul>
  );
};

export default connect(mapStateToProps, {
  setReference,
  setGameRefLoader,
  setMoveLoader,
  setGameReference,
})(PlayersList);
