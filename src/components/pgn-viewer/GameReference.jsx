import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import {
  setGameReference,
  setPgn,
  setGameRefLoader,
} from '../../actions/board';
import { convertResult } from '../../utils/pgn-viewer';

const ACTIVE_DESCENDING = require('../../../public/assets/images/pgn-viewer/active-descending.svg');
const INACTIVE_DESCENDING = require('../../../public/assets/images/pgn-viewer/inactive-descending.svg');
const ACTIVE_ASCENDING = require('../../../public/assets/images/pgn-viewer/active-ascending.svg');

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    referenceData: state.board.referenceData,
    referenceGames: state.board.referenceGames,
    gameRefLoader: state.board.gameRefLoader,
    searchParams: state.board.searchParams,
    pageNum: state.board.pageNum,
  };
};

const GameReference = ({
  fen,
  referenceGames,
  gameRefLoader,
  searchParams,
  setGameReference,
  setPgn,
  setGameRefLoader,
  setActiveTab,
}) => {
  useEffect(() => {
    setGameRefLoader(true);
    setGameReference(false, searchParams);
  }, [fen]);

  const setGameHandler = (pgn, setPgn) => {
    setPgn(pgn);
    setActiveTab(0);
  };

  const [order, setOrder] = useState({
    whiteEloOrder: 0,
    blackEloOrder: 0,
    yearOrder: -1,
  });

  const whiteEloOrderHandler = (searchParams) => {
    const orderType = order.whiteEloOrder === -1 ? 1 : -1;
    setOrder({ whiteEloOrder: orderType, blackEloOrder: 0, yearOrder: 0 });
    setGameReference(false, {
      ...searchParams,
      order_by: 'white_rating',
      order: orderType,
    });
  };

  const blackEloOrderHandler = (searchParams) => {
    const orderType = order.blackEloOrder === -1 ? 1 : -1;
    setOrder({ whiteEloOrder: 0, blackEloOrder: orderType, yearOrder: 0 });
    setGameReference(false, {
      ...searchParams,
      order_by: 'black_rating',
      order: orderType,
    });
  };

  const yearOrderHandler = (searchParams) => {
    const orderType = order.yearOrder === -1 ? 1 : -1;
    setOrder({ whiteEloOrder: 0, blackEloOrder: 0, yearOrder: orderType });
    setGameReference(false, {
      ...searchParams,
      order_by: 'date',
      order: orderType,
    });
  };

  const orderImgHandler = (order) => {
    if (order === 1) {
      return ACTIVE_ASCENDING;
    } else if (order === -1) {
      return ACTIVE_DESCENDING;
    } else {
      return INACTIVE_DESCENDING;
    }
  };

  const loadMoreHandler = () => {
    setGameRefLoader(true);
    setGameReference(true, searchParams);
  };

  return (
    <Table className="scroll" hover>
      <thead>
        <tr>
          <th>White</th>
          <th
            className="sortParams"
            onClick={() => whiteEloOrderHandler(searchParams)}
          >
            Elo
            <img
              height={18}
              src={orderImgHandler(order.whiteEloOrder)}
              alt=""
            />
          </th>
          <th>Black</th>
          <th
            className="sortParams"
            onClick={() => blackEloOrderHandler(searchParams)}
          >
            Elo
            <img
              height={18}
              src={orderImgHandler(order.blackEloOrder)}
              alt=""
            />
          </th>
          <th>Result</th>
          <th
            className="sortParams"
            onClick={() => yearOrderHandler(searchParams)}
          >
            Date
            <img height={18} src={orderImgHandler(order.yearOrder)} alt="" />
          </th>
        </tr>
      </thead>
      <tbody>
        {gameRefLoader ? (
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
        {!gameRefLoader && referenceGames && referenceGames.games ? (
          referenceGames.games.map((move_data) => {
            return (
              <tr
                className="game-reference-line"
                key={move_data.id * Math.random()}
                onClick={() => {
                  setGameHandler(move_data.pgn, setPgn);
                }}
              >
                <td className="names">{move_data.white_name}</td>
                <td>{move_data.white_rating}</td>
                <td className="names">{move_data.black_name}</td>
                <td>{move_data.black_rating}</td>
                <td>{convertResult(move_data.result)}</td>
                <td>{move_data.date}</td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
        {!gameRefLoader && referenceGames && referenceGames.message && (
          <tr className="game-reference-line" key="reference-message">
            <td className="noGames">{referenceGames.message}</td>
          </tr>
        )}

        {!gameRefLoader &&
        referenceGames &&
        referenceGames.games &&
        referenceGames.games.length &&
        !referenceGames.message ? (
          <tr>
            <td onClick={loadMoreHandler}>
              <button className="more-btn">more</button>
            </td>
          </tr>
        ) : (
          <></>
        )}
      </tbody>
    </Table>
  );
};

export default connect(mapStateToProps, {
  setGameReference,
  setPgn,
  setGameRefLoader,
})(GameReference);
