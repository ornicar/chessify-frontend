import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addMoveNumbersToSans } from '../../utils/chess-utils';
import { doMove } from '../../actions/board';
import { updateNumPV } from '../../actions/cloud';
import { ENGINES } from '../../constants/cloud-params';
import { coreToKNode, ENGINES_NAMES } from '../../utils/engine-list-utils';
import { showEngineInfo } from '../../utils/utils';
import { stopServer } from '../../utils/api';

import { IoIosAdd, IoIosRemove, IoIosLock, IoIosUnlock } from 'react-icons/io';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    numPV: state.cloud.numPV,
    freeAnalyzer: state.cloud.freeAnalyzer,
    proAnalyzers: state.cloud.proAnalyzers,
    userFullInfo: state.cloud.userFullInfo,
    orderedCores: state.cloud.orderedCores,
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

const AnalysisBlock = ({
  engine,
  analysis,
  fenToAnalyze,
  doMove,
  numPV,
  updateNumPV,
}) => {
  const [lockAnalysis, setLockAnalysis] = useState(false);

  const handleMoveClick = (moves, index) => {
    for (let i = 0; i <= index; i++) {
      const move = moves[i][0];
      doMove(move);
    }
  };

  const handleLockAnalysis = () => {
    setLockAnalysis(!lockAnalysis);
  };

  return (
    <div className="analysis-block">
      <div className="displayed-analize-info">
        <div className="title rbt-section-title">
          <h6 className="text-left analize-server-info-title">{`${engine} | depth: ${
            analysis.depth
          } | speed: ${
            analysis.variations[0] &&
            Math.floor(parseInt(analysis.variations[0].nps) / 1000)
          } kN/s | nodes: ${
            (analysis.variations[0].nodes / 1000000).toFixed(2)
          }MN | tbhits: ${analysis.variations[0].tbhits}`}</h6>
        </div>
        <div className="pv-btn-wrapper ">
          <button
            className="pv-btn"
            disabled={lockAnalysis}
            onClick={() => {
              updateNumPV(1);
            }}
          >
            <IoIosAdd />
          </button>
          <span className="pv-value">{numPV}</span>
          <button
            className="pv-btn"
            disabled={lockAnalysis}
            onClick={() => {
              updateNumPV(-1);
            }}
          >
            <IoIosRemove />
          </button>
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
        </div>
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
                    disabled={lockAnalysis}
                    className="analyze-move"
                    onClick={() => handleMoveClick(variation.pgn, i)}
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

const AnalysisArea = ({
  fen,
  handleAnalyze,
  doMove,
  freeAnalyzer,
  proAnalyzers,
  updateNumPV,
  numPV,
  userFullInfo,
  orderedCores,
}) => {
  useEffect(() => {
    let identifier = setTimeout(() => {
      setTimeout(() => handleAnalyze(), 600)
    }, 600)

    return () => {
      clearTimeout(identifier)
    }
  }, [fen]);

  const handleStopServer = (serverName) => {
    stopServer(serverName)
      .then((response) => {
        if (response.error) {
          console.log('ERROR STOPPING');
          return;
        } else {
          console.log('Success stoped');
        }
      })
      .catch((e) => {
        console.error('IN CATCH', e);
      });
  };

  const checkCores = (info) => {
    return (
      <h6 className='preparing-server-info-title '>
        {showEngineInfo(info)}
      </h6>
    );
  };

  const analyzers = proAnalyzers
    ? proAnalyzers
    : freeAnalyzer
    ? [freeAnalyzer]
    : [];

  return (
    <React.Fragment>
      {analyzers.map((analyzer) => {
        if (!analyzer || !(analyzer.name in userFullInfo.servers))
          return null;
        return (
          <div className="main-container-wrapper" key={analyzer.analyzer.url}>
            <div className="analize-area">
              <div className="analize-info">
                {orderedCores[analyzer.name] !==
                userFullInfo.servers[analyzer.name][0].cores ? (
                  <div className="analize-info">
                      {checkCores(userFullInfo.servers[analyzer.name][2])}
                  </div>
                ) : (
                  <div className="analize-info">
                    <div className="analize-info-item">
                      <h6 className="engine-name-wrapper">
                        {ENGINES_NAMES[analyzer.name]}
                      </h6>
                    </div>
                    <div className="analize-info-core-item-wraper">
                      <span style={{ margin: 'auto 0px' }}>Server:&nbsp;</span>
                      {
                        coreToKNode(
                          null,
                          userFullInfo.servers[analyzer.name][0].cores,
                          analyzer.name
                        ).caption
                      }
                    </div>
                    <div className="analize-info-item-wrapper">
                      {userFullInfo.servers[analyzer.name][0].price_per_minute}
                      <span>&nbsp;coins/min</span>
                    </div>
                  </div>
                )}

                <div className="stop-analize-button-wrapper">
                  <button
                    className="stop-analize-button"
                    onClick={() => {
                      handleStopServer(analyzer.name);
                    }}
                  >
                    Stop
                  </button>
                </div>
              </div>
              {analyzer.analysis && (
                <AnalysisBlock
                  key={analyzer.analyzer.url}
                  engine={getEngineName(analyzer)}
                  analysis={analyzer.analysis}
                  fenToAnalyze={fen}
                  doMove={doMove}
                  updateNumPV={updateNumPV}
                  numPV={numPV}
                />
              )}
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default connect(mapStateToProps, {
  doMove,
  updateNumPV,
})(AnalysisArea);
