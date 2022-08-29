import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import {
  doMove,
  setMoveLoader,
  setReference,
} from '../../actions/board';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    pgnStr: state.board.pgnStr,
    fen: state.board.fen,
    referenceData: state.board.referenceData,
    searchParams: state.board.searchParams,
    moveLoader: state.board.moveLoader,
  };
};

const MoveReference = ({
  fen,
  referenceData,
  searchParams,
  setReference,
  moveLoader,
  doMove,
  setMoveLoader,
}) => {
  useEffect(() => {
    setMoveLoader(true);
    setReference(fen, searchParams ? searchParams : '');
  }, [fen]);

  const handleMoveReferenceClick = (move, doMove, setMoveLoader) => {
    let splitMove = move.split('.');

    move = splitMove[splitMove.length - 1].trim();
    doMove(move);
  };
  return (
    <div className="scroll">
      <Table hover>
        <thead>
          <tr>
            <th>Move</th>
            <th>Games</th>
            <th>Score</th>
            <th>Elo Avg.</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {moveLoader || !referenceData ? (
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
          {!moveLoader && referenceData && referenceData.statistics ? (
            referenceData.statistics.map((move) => {
              return (
                <tr
                  className="move-reference-line"
                  key={move.games_count * Math.random()}
                  onClick={() => {
                    handleMoveReferenceClick(move.move, doMove, setMoveLoader);
                  }}
                >
                  <td>
                    <b>{move.move}</b>
                  </td>
                  <td>{move.games_count}</td>
                  <td>{move.result[0]}</td>
                  <td>{move.avg_rating}</td>
                  <td>
                    {Math.floor((move.result[0] / move.games_count) * 100)}
                  </td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
          {!moveLoader && referenceData && referenceData.message ? (
            <tr className="move-reference-line" key="no-moves">
              <td className='noGames'>{referenceData.message}</td>
            </tr>
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default connect(mapStateToProps, {
  setReference,
  doMove,
  setMoveLoader,
})(MoveReference);
