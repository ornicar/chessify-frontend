import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { setToken, connectToFree } from '../../actions/cloud';
import { setPgn, doMove, setFen } from '../../actions/board';
import Chess from 'chess.js';
import Chessground from 'react-chessground';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    orientation: state.board.orientation,
    pgn: state.board.pgn,
    numPV: state.cloud.numPV,
    freeAnalyzer: state.cloud.freeAnalyzer,
    proAnalyzers: state.cloud.proAnalyzers,
  };
};

const NewTaxtak = ({ doMove, fen, setFen, orientation, soundMode }) => {
  useEffect(() => {
    setLastMove(null);
    const moveSound = document.getElementById('move_sound');

    // Hide playback error
    const playPromise = soundMode === 'on' ? moveSound.play() : '';

    if (playPromise !== undefined && soundMode === 'on') {
      playPromise
        .then((_) => {
          // Automatic playback started!
          // Show playing UI.
          console.log('audio played auto');
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
          console.log('playback prevented');
        });
    }
  }, [fen]);

  const [pendingMove, setPendingMove] = useState();
  const [selectVisible, setSelectVisible] = useState(false);
  const [lastMove, setLastMove] = useState();

  const onMove = (from, to) => {
    console.log(`FROM ${from}   TO ${to}`);
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) {
      if (moves[i].flags.indexOf('p') !== -1 && moves[i].from === from) {
        setPendingMove([from, to]);
        setSelectVisible(true);
        return;
      }
    }
    if (chess.move({ from, to, promotion: 'x' })) {
      doMove({ from, to, promotion: 'x' });
      setLastMove([from, to]);
    }
  };

  const promotion = (e) => {
    const from = pendingMove[0];
    const to = pendingMove[1];
    doMove({ from, to, promotion: e });
    setLastMove([from, to]);
    setSelectVisible(false);
  };

  const turnColor = () => {
    const turn = new Chess(fen).turn();
    return turn === 'w' ? 'white' : 'black';
  };

  const calcMovable = () => {
    const chess = new Chess(fen);
    const dests = new Map();
    chess.SQUARES.forEach((s) => {
      const ms = chess.moves({ square: s, verbose: true });
      if (ms.length)
        dests.set(
          s,
          ms.map((m) => m.to)
        );
    });
    return {
      free: false,
      dests,
      color: turnColor(),
    };
  };

  return (
    <>
      <div className="wood4" style={{ '--zoom': 85, padding: '6px' }}>
        <div className="is2d">
          <div style={{ cursor: 'pointer', display: 'block' }}>
            <div className="main-board">
              <div
                id="promotion-choice"
                className="top"
                style={{ display: selectVisible ? '' : 'none' }}
              >
                <square style={{ top: '25%', left: '45%' }}>
                  <piece
                    className={`queen ${turnColor()}`}
                    onClick={() => promotion('q')}
                  ></piece>
                </square>
                <square style={{ top: '37.5%', left: '45%' }}>
                  <piece
                    className={`knight ${turnColor()}`}
                    onClick={() => promotion('n')}
                  ></piece>
                </square>
                <square style={{ top: '50%', left: '45%' }}>
                  <piece
                    className={`rook ${turnColor()}`}
                    onClick={() => promotion('r')}
                  ></piece>
                </square>
                <square style={{ top: '62.5%', left: '45%' }}>
                  <piece
                    className={`bishop ${turnColor()}`}
                    onClick={() => promotion('b')}
                  ></piece>
                </square>
              </div>
              <Chessground
                turnColor={turnColor()}
                movable={calcMovable()}
                lastMove={lastMove}
                fen={fen}
                onMove={onMove}
                promotion={promotion}
                orientation={orientation}
                autoCastle={true}
              />
            </div>
          </div>
        </div>
      </div>
      <audio preload="auto" id="move_sound">
        <source
          src={require('../../../public/assets/sounds/move.webm')}
          type="audio/webm"
        />
        <source
          src={require('../../../public/assets/sounds/move.ogg')}
          type="audio/ogg"
        />
        <source
          src={require('../../../public/assets/sounds/move.mp3')}
          type="audio/mp3"
        />
        <source
          src={require('../../../public/assets/sounds/move.wav')}
          type="audio/wav"
        />
      </audio>
    </>
  );
};

export default connect(mapStateToProps, {
  setToken,
  connectToFree,
  setPgn,
  doMove,
  setFen,
})(NewTaxtak);
