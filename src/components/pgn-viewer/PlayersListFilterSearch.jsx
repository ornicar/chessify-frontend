import React from 'react';

const PlayersListFilterSearch = (props) => {
  const {
    playersData,
    setPlayerSearchInput,
    userInput,
    color,
    setShowPlayersList,
  } = props;
  const playerSearchHandler = (player) => {
    if (color === 'whitePlayer') {
      setPlayerSearchInput({ ...userInput, whitePlayer: player });
    } else if (color === 'blackPlayer') {
      setPlayerSearchInput({ ...userInput, blackPlayer: player });
    }
    setShowPlayersList(false);
  };
  return (
    <ul className="player-suggestions player-suggestions-filter">
      {playersData.map((player) => {
        return (
          <li
            key={player.length * Math.random()}
            onClick={() => {
              playerSearchHandler(player);
            }}
          >
            {player}
          </li>
        );
      })}
    </ul>
  );
};

export default PlayersListFilterSearch;
