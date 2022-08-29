import CLOUD_ACTION_TYPES from '../constants/cloud-action-types';
import { connectToFree, connectToPro } from '../connections';
import { parseProAnalysis } from '../utils/chess-utils';

let newProAnalyzers = []; // New Pro Analyzers to apply on new server connect or disconnecct
export function cloudMiddleware({ getState, dispatch }) {
  return function (next) {
    return function (action) {
      switch (action.type) {
        case CLOUD_ACTION_TYPES.SET_VIDEOS: {
          try {
            // CHECK VIDEOS FROM BACKEND
          } catch (e) {
            console.error('INVALID VIDEOS: ', e);
            return;
          }
          break;
        }

        case CLOUD_ACTION_TYPES.SET_GAMES: {
          try {
            // CHECK GAMES DATA FROM BACKEND
          } catch (e) {
            console.error('INVALID GAMES: ', e);
            return;
          }
          break;
        }

        ///////////
        ////// SET FREE ANALYZER CONTAINING WSSConnection, Analysis, Analysis State
        ///////////
        case CLOUD_ACTION_TYPES.CONNECT_TO_FREE: {
          try {
            const cloudState = getState().cloud;
            const { token } = cloudState;

            /// TODO! CHECK FREE ANALYZER

            const onConnect = (freeAnalyzer) => {
              return dispatch({
                type: CLOUD_ACTION_TYPES.SET_FREE_ANALYZER,
                payload: { freeAnalyzer },
              });
            };

            const onGetAnalyze = (freeAnalysisData) => {
              return dispatch({
                type: CLOUD_ACTION_TYPES.SET_FREE_ANALYSIS_DATA,
                payload: { freeAnalysisData },
              });
            };

            connectToFree(token, onConnect, onGetAnalyze);
          } catch (e) {
            console.error('INVALID FREE ANALYZER: ', e);
            return;
          }
          break;
        }

        ///////////
        ////// PARSE FREE ANALYSIS DATA AND SET
        ///////////
        case CLOUD_ACTION_TYPES.SET_FREE_ANALYSIS_DATA: {
          try {
            const freeAnalysisData = action.payload.freeAnalysisData;

            if (
              freeAnalysisData.error ||
              typeof freeAnalysisData.json !== 'string'
            ) {
              action.payload.isAnalysing = false;
              action.payload.freeAnalysisData = null;
            } else {
              action.payload.isAnalysing = true;
              action.payload.freeAnalysisData = JSON.parse(
                freeAnalysisData.json
              );
            }
          } catch (e) {
            console.error('INVALID ANALYSIS DATA: ', e);
            return;
          }
          break;
        }

        ///////////
        ////// CONNECTING TO PRO ANALYZING SERVERS
        ///////////
        case CLOUD_ACTION_TYPES.CONNECT_TO_PRO: {
          try {
            // CHECK WSS CHANNELS FROM CLOUD SERVICE
            const state = getState();
            const { proAnalyzers, numPV } = state.cloud;
            const { fen } = state.board;

            // sessionStorage.setItem("latest_analyze_info", JSON.stringify(proAnalyzers));
            if (proAnalyzers && Object.keys(proAnalyzers).length > 0) {
              let dataFromSessionStorage =
                sessionStorage.getItem('latest_analyze_info') || [];
              let merged = [];

              if (dataFromSessionStorage.length <= 0) {
                merged.push(...proAnalyzers);
              } else {
                dataFromSessionStorage = JSON.parse(dataFromSessionStorage);
                for (let i = 0; i < proAnalyzers.length; i++) {
                  merged.push({
                    ...proAnalyzers[i],
                  });
                }
                merged.push(
                  ...dataFromSessionStorage.filter(
                    (item) =>
                      !proAnalyzers.some(
                        (proAnalyzers) => proAnalyzers.name === item.name
                      )
                  )
                );
              }

              sessionStorage.setItem(
                'latest_analyze_info',
                JSON.stringify(merged)
              );
            }

            console.log('PRO ANALYZERS: ', proAnalyzers);

            const newProWSSChannels = action.payload.proWSSChannels; // New Wss Channels list from backend.

            console.log('NEW WSS CHANNELS GOT: ', newProWSSChannels);

            ////
            //  Filter current Pro Analyzer. If WSS url of analyzer doesn't exists in new WSS Channels list from backend, than remove it
            ////
            newProAnalyzers = proAnalyzers
              ? proAnalyzers.filter((pa) => {
                  const connectionExists = newProWSSChannels.some(
                    (nwssc) => pa.analyzer.url === nwssc.channel
                  );

                  if (!connectionExists) {
                    pa.analyzer.close();
                    return false;
                  }
                  return true;
                })
              : [];

            if (
              proAnalyzers &&
              newProAnalyzers.length !== proAnalyzers.length
            ) {
              return dispatch({
                type: CLOUD_ACTION_TYPES.SET_PRO_ANALYZERS,
                payload: { proAnalyzers: newProAnalyzers },
              });
            }

            ///
            // Create New Connection if new Wss Channel added
            ///
            newProWSSChannels.forEach((wsc) => {
              const connectionExists = newProAnalyzers.some(
                (pa) => pa.analyzer.url === wsc.channel
              );
              if (!connectionExists) {
                const onConnect = (socket) => {
                  console.log('YOHOOO CONNECT: ', socket);
                  newProAnalyzers.push({
                    name: wsc.name,
                    analyzer: socket,
                    temp: Boolean(wsc.temp), // If the ordered server is temporary
                    isSubscription: wsc.isSubscription, // If the current user is subscribed. NOT a single package
                  });
                  return dispatch({
                    type: CLOUD_ACTION_TYPES.SET_PRO_ANALYZERS,
                    payload: { proAnalyzers: newProAnalyzers },
                  });
                };
                const onGetAnalyze = (proAnalysisData) => {
                  const newState = getState();
                  const { numPV } = newState.cloud;
                  const parsedAnalysisData = parseProAnalysis(
                    proAnalysisData,
                    newState.board.fen
                  );
                  // parsedAnalysisData is null when moves dont exist in data from Stockfish
                  if (parsedAnalysisData) {
                    //Make a duplicate of proAnalyzers list, because find method works with referance and will change original list
                    const cpProAnalyzers = [...newState.cloud.proAnalyzers];
                    const analyzer = cpProAnalyzers.find(
                      (pa) => pa.analyzer.url === wsc.channel
                    );

                    console.assert(analyzer);

                    const {
                      stopped,
                      rowId,
                      depth,
                      variation,
                    } = parsedAnalysisData;

                    if (stopped) {
                      analyzer.isAnalysing = false;
                    } else {
                      analyzer.isAnalysing = true;
                      analyzer.analysis = analyzer.analysis
                        ? analyzer.analysis
                        : {};
                      analyzer.analysis.depth = depth;
                      analyzer.analysis.engine = wsc.name;
                      if (!analyzer.analysis.variations)
                        analyzer.analysis.variations = [];
                      if (rowId + 1 <= numPV)
                        analyzer.analysis.variations[rowId] = variation;
                    }

                    return dispatch({
                      type: CLOUD_ACTION_TYPES.SET_PRO_ANALYZERS,
                      payload: {
                        proAnalyzers: cpProAnalyzers,
                      },
                    });
                  }
                };
                const onDisconnect = (socket) => {
                  console.log('YOHOOO DISCONNECT: ', socket);
                  return dispatch({
                    type: CLOUD_ACTION_TYPES.SET_PRO_ANALYZERS,
                    payload: {
                      proAnalyzers: newProAnalyzers.filter(
                        (pa) => pa.analyzer.url !== socket.url
                      ),
                    },
                  });
                };
                connectToPro(
                  wsc.channel,
                  fen,
                  onConnect,
                  onGetAnalyze,
                  onDisconnect,
                  numPV
                );
              }
            });
          } catch (e) {
            console.error('INVALID PRO ANALYZERS: ', e);
            return;
          }
          break;
        }

        case CLOUD_ACTION_TYPES.UPDATE_NUM_PV: {
          try {
            const state = getState();
            const currentPV = state.cloud.numPV;
            const numPV = action.payload.numPV;
            const newPV = currentPV + numPV;

            if (newPV > 15 || newPV < 1) {
              console.error('NUMBER OF PV LINES OUT OF RANGE');
              return;
            }
            action.payload.numPV = newPV;
            const proAnalyzers = state.cloud.proAnalyzers;
            proAnalyzers.forEach((pa) => {
              pa.analyzer.send('stop');
              pa.analyzer.send(`setoption name MultiPV value ${newPV}`);
              pa.analyzer.send('go infinite');
            });
          } catch (e) {
            console.error('FAILED SETTING PV: ', e);
            return;
          }
          break;
        }

        ////
        // DEFAULT
        ////
        default: {
          break;
        }
      }
      return next(action);
    };
  };
}

export default [cloudMiddleware];
