import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Chess from 'chess.js';
import { addMoveNumbersToSans } from '../../utils/chess-utils';
import { doMove, setFen } from '../../actions/board';
import { ENGINES } from '../../constants/cloud-params';
import { IoIosLock, IoIosUnlock } from 'react-icons/io';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    savedAnalyzeInfo: state.cloud.savedAnalyzeInfo,
  };
};

const getEngineName = (analyzer) => {
  if (
    analyzer.analysis.depth === '1' &&
    analyzer.analysis.variations[0].nps === '0'
  ) {
    return 'Syzygy';
  }

  let engineName = `${ENGINES[analyzer.analysis.engine]} ${
    analyzer.temp ? '(Free)' : ''
  } `;

  // LCZero and AllieStein engines are running Stockfish temporary
  if (
    (analyzer.analysis.engine === 'lc0' ||
      analyzer.analysis.engine === 'allie') &&
    analyzer.temp
  ) {
    engineName = `${ENGINES.Stockfish} (Free)`;
  }

  return engineName;
};

const SavedAnalysisBlock = ({ engine, analysis, fenToAnalyze, doMove, setFen }) => {
// ToDo make move clickable

  // const [lockAnalysis, setLockAnalysis] = useState(false);

  // const handleMoveClick = (moves, index) => {
  //   const chess = new Chess();
  //   for (let i = 0; i <= index; i++) {
  //     const move = moves[i][0];
  //     chess.move(move);
  //     doMove(move);
  //   }
  //   const fen = chess.fen();
  //   setFen(fen);
  // };

  // const handleLockAnalysis = () => {
  //   setLockAnalysis(!lockAnalysis);
  // };

  return (
    <div className="saved-analysis-block">
      <div className="displayed-analize-info">
        <div className="title rbt-section-title">
          <h6 className="text-left analize-server-info-title">{`${engine} | depth: ${
            analysis.depth
          } | speed: ${
            analysis.variations[0] &&
            Math.floor(parseInt(analysis.variations[0].nps) / 1000)
          } kN/s | nodes: ${(analysis.variations[0].nodes / 1000000).toFixed(
            2
          )}MN | tbhits: ${analysis.variations[0].tbhits}`}</h6>
        </div>
        {/* <div className="pv-btn-wrapper ">
          {lockAnalysis && (
            <button
              className="lock-button"
              title="Unlock"
              onClick={handleLockAnalysis}
            >
              <IoIosLock />
            </button>
          )}

          {!lockAnalysis && (
            <button
              className="lock-button"
              title="Lock"
              onClick={handleLockAnalysis}
            >
              <IoIosUnlock />
            </button>
          )}
        </div> */}
      </div>
      <ul className="list-style--1" style={{ whiteSpace: 'nowrap' }}>
        {analysis.variations.map((variation, indx) =>
          indx === 0 ||
          analysis.variations[0].nps !== '0' ||
          analysis.depth !== '1' ? (
            <li>
              <span className="result">{`${variation.score} `}</span>
              {variation.pgn &&
                addMoveNumbersToSans(
                  fenToAnalyze,
                  variation.pgn
                ).map((moveObj, i) => (
                  <button
                    disabled={true}
                    className="analyze-move"
                    // onClick={() => handleMoveClick(variation.pgn, i)}
                  >{`${moveObj.move_number} ${moveObj.move} `}</button>
                ))}
            </li>
          ) : (
            <></>
          )
        )}
      </ul>
    </div>
  );
};

const SavedAnalysisArea = ({
  fen,
  doMove,
  fenToAnalyze,
  savedAnalyzeInfo,
  serverName,
  setFen
}) => {
  useEffect(() => {}, [fen]);

  return (
    <React.Fragment>
      {savedAnalyzeInfo.map((analyzer) => {
        return (
          <>
            {analyzer.analysis && analyzer.name === serverName && (
              <div
                className="main-container-wrapper"
                key={analyzer.analyzer.url}
              >
                <div className="analize-area">
                  <SavedAnalysisBlock
                    key={analyzer.analyzer.url}
                    engine={getEngineName(analyzer)}
                    analysis={analyzer.analysis}
                    fenToAnalyze={fen}
                    doMove={doMove}
                    setFen={setFen}
                  />
                </div>
              </div>
            )}
          </>
        );
      })}
    </React.Fragment>
  );
};

export default connect(mapStateToProps, { doMove, setFen })(SavedAnalysisArea);
