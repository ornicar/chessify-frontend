import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setActiveMove } from '../../actions/board';
import {
  checkForMainLineVariation,
  getMoveFullInfo,
  checkSubravs,
  getLineIndexLetter,
} from '../../utils/pgn-viewer';
import MoveContextmenu from './MoveContextmenu';
import { cloneDeep } from 'lodash';

const mapStateToProps = (state) => {
  return {
    pgn: state.board.pgn,
    activeMove: state.board.activeMove,
  };
};

const handleContextMenu = (
  event,
  setContextmenuCoords,
  setShowMenu,
  setActiveMove,
  move
) => {
  event.preventDefault();
  setActiveMove(move);
  const subtructBoardWidth =
    Math.trunc(
      document.getElementsByClassName('page-wrapper')[0].getBoundingClientRect()
        .width / 3
    ) + 180;
  const coordX = event.pageX - subtructBoardWidth + 'px';
  const coordY = event.pageY - 100 + 'px';
  setContextmenuCoords({ x: coordX, y: coordY });
  setShowMenu(true);
};

const getPgnRavLines = (
  moves,
  activeMove,
  setActiveMove,
  setContextmenuCoords,
  setShowMenu,
  appendCurrentLineComponents,
  container,
  parentIndex = '',
  symbolModeEnabled
) => {
  moves.forEach((move, indx) => {
    if (move.ravs && checkSubravs(move)) {
      let moveRavs = move.ravs;
      let remainingMoves = moves.splice(indx);
      if (!remainingMoves[0].move_number) {
        remainingMoves[0].move_number =
          remainingMoves[0].prev_move.move_number + '..';
      }
      remainingMoves = { moves: remainingMoves, result: null };
      delete remainingMoves.moves[0].ravs;
      let moveRavsAndRemaining = [...moveRavs, remainingMoves];

      moveRavsAndRemaining.forEach((moveRav, index) => {
        const lineIndex = getLineIndexLetter(index, parentIndex);
        let indent = lineIndex.length + 1;
        container = [];
        container.push(
          <span key={indent * Math.random()}>{lineIndex + ') '}</span>
        );
        appendCurrentLineComponents(container, indent);
        getPgnRavLines(
          moveRav.moves,
          activeMove,
          setActiveMove,
          setContextmenuCoords,
          setShowMenu,
          appendCurrentLineComponents,
          container,
          lineIndex,
          symbolModeEnabled
        );
        container = [];
      });
    } else {
      const {
        moveNumber,
        movePiece,
        moveDirection,
        moveNags,
        moveComments,
      } = getMoveFullInfo(move, symbolModeEnabled);
      container.push(
        <button
          key={move.move_id}
          onClick={() => setActiveMove(move)}
          onContextMenu={(e) =>
            handleContextMenu(
              e,
              setContextmenuCoords,
              setShowMenu,
              setActiveMove,
              move
            )
          }
          className={
            activeMove && move.move_id === activeMove.move_id ? 'active' : ''
          }
          style={{ border: 'none', marginLeft: indx === 0 ? 0 : 10 }}
        >
          {moveNumber}
          {movePiece && (
            <span className={symbolModeEnabled ? 'symbol' : 'not'}>
              {movePiece}
            </span>
          )}
          {moveDirection && <span>{moveDirection}</span>}
          <span className="nags">{moveNags}</span>
          <span className="comments">{moveComments}</span>
        </button>
      );
      if (move.ravs && !checkSubravs(move)) {
        move.ravs.forEach((moves, index) => {
          moves.moves.forEach((mv, indx) => {
            const {
              moveNumber,
              movePiece,
              moveDirection,
              moveNags,
              moveComments,
            } = getMoveFullInfo(mv, symbolModeEnabled);
            const openParenthesis = index === 0 && indx === 0;
            const semicolumn =
              indx === moves.moves.length - 1 && move.ravs[index + 1];
            const closeParenthesis =
              indx === moves.moves.length - 1 && index === move.ravs.length - 1;
            container.push(
              <span key={mv.move_id}>
                <span>{openParenthesis ? ' (' : ''}</span>
                <button
                  onClick={() => setActiveMove(mv)}
                  onContextMenu={(e) =>
                    handleContextMenu(
                      e,
                      setContextmenuCoords,
                      setShowMenu,
                      setActiveMove,
                      mv
                    )
                  }
                  className={
                    activeMove && mv.move_id === activeMove.move_id
                      ? 'active'
                      : ''
                  }
                  style={{
                    border: 'none',
                    marginLeft: openParenthesis ? 0 : 10,
                  }}
                >
                  {moveNumber}
                  {movePiece && (
                    <span className={symbolModeEnabled ? 'symbol' : 'not'}>
                      {movePiece}
                    </span>
                  )}
                  {moveDirection && <span>{moveDirection}</span>}
                  <span className="nags">{moveNags}</span>
                  <span className="comments">{moveComments}</span>
                </button>
                <span>{semicolumn ? ';' : ''}</span>
                <span>{closeParenthesis ? ')' : ''}</span>
              </span>
            );
          });
        });
      }
    }
  });
};

const getPgnLines = (
  moves,
  activeMove,
  setActiveMove,
  setContextmenuCoords,
  setShowMenu,
  symbolModeEnabled,
  container = [],
  componentsLines = []
) => {
  if (!moves.length) return [];
  const hasVariation = checkForMainLineVariation(moves);

  const appendCurrentLineComponents = (container, indent) => {
    if (!container.length) return;
    const isBold = indent === 0 && hasVariation;
    componentsLines.push(
      <li
        key={componentsLines.length * Math.random()}
        className="variation-line"
        style={{
          marginLeft: indent * 20,
          fontWeight: isBold ? 'bold' : 'normal',
        }}
      >
        {container}
      </li>
    );
  };

  moves.forEach((move) => {
    const {
      moveNumber,
      movePiece,
      moveDirection,
      moveNags,
      moveComments,
    } = getMoveFullInfo(move, symbolModeEnabled);
    container.push(
      <span key={move.move_id} className="button-var">
        <button
          onClick={() => setActiveMove(move)}
          onContextMenu={(e) =>
            handleContextMenu(
              e,
              setContextmenuCoords,
              setShowMenu,
              setActiveMove,
              move
            )
          }
          className={
            activeMove && move.move_id === activeMove.move_id
              ? 'active'
              : 'no-active'
          }
          style={{ border: 'none', marginLeft: 10 }}
        >
          {moveNumber}
          {movePiece && (
            <span className={symbolModeEnabled ? 'symbol' : 'not'}>
              {movePiece}
            </span>
          )}
          {moveDirection && <span>{moveDirection}</span>}
          <span className="nags">{moveNags}</span>
          <span className="comments">{moveComments}</span>
        </button>
      </span>
    );
    if (move.ravs) {
      appendCurrentLineComponents(container, 0);
      container = [];

      move.ravs.forEach((moveRav) => {
        container.push('[');
        appendCurrentLineComponents(container, 1);
        getPgnRavLines(
          moveRav.moves,
          activeMove,
          setActiveMove,
          setContextmenuCoords,
          setShowMenu,
          appendCurrentLineComponents,
          container,
          '',
          symbolModeEnabled
        );
        componentsLines[componentsLines.length - 1].props.children.push(
          <span key={Math.random()}>]</span>
        );
        container = [];
      });
    }
  });
  appendCurrentLineComponents(container, 0);
  return componentsLines;
};

const VariationsNew = (props) => {
  const {
    pgn,
    activeMove,
    setActiveMove,
    setCommentField,
    symbolModeEnabled,
  } = props;
  const moves = pgn.moves ? cloneDeep(pgn.moves) : [];
  const [contextmenuCoords, setContextmenuCoords] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (showMenu) setShowMenu(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
  });

  const container = getPgnLines(
    moves,
    activeMove,
    setActiveMove,
    setContextmenuCoords,
    setShowMenu,
    symbolModeEnabled
  );
  return (
    <div className="variations-container">
      <div>
        <ul style={{ display: 'inline-block', position: 'relative' }}>
          {container}
        </ul>
      </div>
      {showMenu ? (
        <MoveContextmenu
          setCommentField={setCommentField}
          top={contextmenuCoords.y}
          left={contextmenuCoords.x}
        />
      ) : (
        <> </>
      )}
    </div>
  );
};

export default connect(mapStateToProps, {
  setActiveMove,
})(VariationsNew);
