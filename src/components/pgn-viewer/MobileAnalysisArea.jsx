import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { addMoveNumbersToSans } from '../../utils/chess-utils';
import { doMove } from '../../actions/board';
import { updateNumPV } from '../../actions/cloud';
import { ENGINES } from '../../constants/cloud-params';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    numPV: state.cloud.numPV,
    freeAnalyzer: state.cloud.freeAnalyzer,
    proAnalyzers: state.cloud.proAnalyzers,
  };
};

const getEngineName = (analyzer) => {
  let engineName = `${ENGINES[analyzer.analysis.engine]} ${
    analyzer.temp ? '(Free)' : ''
  } `;

  // LCZero engine is running Stockfish temporary
  if (analyzer.analysis.engine === 'lc0' && analyzer.temp) {
    engineName = `${ENGINES.Stockfish} (Free)`;
  }

  return engineName;
};

const AnalysisBlock = ({ engine, analysis, fenToAnalyze, doMove }) => {
  const handleMoveClick = (moves, index) => {
    for (let i = 0; i <= index; i++) {
      const move = moves[i][0];
      doMove(move);
    }
  };

  return (
    <div className="analysis-block">
      <div className="title rbt-section-title">
        <h6 className="text-center">{`${engine} | depth: ${
          analysis.depth
        } | speed: ${
          analysis.variations[0] &&
          Math.floor(parseInt(analysis.variations[0].nps) / 1000)
        } kn/s`}</h6>
      </div>

      <ul className="list-style--1" style={{ whiteSpace: 'nowrap' }}>
        {analysis.variations.map((variation) => (
          <li>
            <span className="result">{`${variation.score}: `}</span>
            {variation.pgn &&
              addMoveNumbersToSans(
                fenToAnalyze,
                variation.pgn
              ).map((moveObj, i) => (
                <button
                  className="analyze-move"
                  onClick={() => handleMoveClick(variation.pgn, i)}
                >{`${moveObj.move_number} ${moveObj.move} `}</button>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MobileAnalysisArea = ({
  fen,
  handleAnalyze,
  doMove,
  fenToAnalyze,
  freeAnalyzer,
  proAnalyzers,
  updateNumPV,
}) => {
  useEffect(() => {
    handleAnalyze();
  }, [fen]);

  const analyzers = proAnalyzers
    ? proAnalyzers
    : freeAnalyzer
    ? [freeAnalyzer]
    : [];

  return (
    <React.Fragment>
      <div
        style={{
          display: analyzers.length === 0 ? 'none' : 'flex',
        }}
      >
        <button
          className="pv-btn"
          onClick={() => {
            updateNumPV(1);
          }}
        >
          <IoIosAdd />
        </button>
        <button
          className="pv-btn"
          onClick={() => {
            updateNumPV(-1);
          }}
        >
          <IoIosRemove />
        </button>
      </div>
      {analyzers.map((analyzer) => {
        if (!analyzer.analysis) return null;
        return (
          <AnalysisBlock
            key={analyzer.analyzer.url}
            engine={getEngineName(analyzer)}
            analysis={analyzer.analysis}
            fenToAnalyze={fenToAnalyze}
            doMove={doMove}
          />
        );
      })}
    </React.Fragment>
  );
};

export default connect(mapStateToProps, { doMove, updateNumPV })(
  MobileAnalysisArea
);
