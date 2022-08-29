import { cloneDeep } from 'lodash';
import CLOUD_ACTION_TYPES from '../constants/cloud-action-types';

const initialState = {
  token: '', // Firebase ID Token
  videos: [], // Videos result from Backend
  games: [], // Hot Games result from backend
  freeAnalyzer: null, // Mobile Free Analyzer up to 30,000 kN/s. Object like {id: uuid, name: stockfish10, analyzer: <SOCKET.IO CONNECTION>, analysis: <ANALYSIS_RESULT>, isAnalysing: true}
  proAnalyzers: null, // Pro Analyzers. List containing objects like {id: uuid, name: stockfish10, analyzer: <WS_CONNECTION>, analysis: <ANALYSIS_RESULT>, isAnalysing: true}
  numPV: 3, // Number of PV lines in analysis. Ranges from 1 to 15, latter included
  userFullInfo: {}, // User full information from backend
  orderedCores: {}, // Core value successful server order
  savedAnalyzeInfo: null, // The latest analysis info is saved in session storage
};

function cloudReducer(state = initialState, action) {
  switch (action.type) {
    case CLOUD_ACTION_TYPES.SET_TOKEN: {
      return { ...state, token: action.payload.token };
    }
    case CLOUD_ACTION_TYPES.SET_VIDEOS: {
      return { ...state, videos: action.payload.videos };
    }
    case CLOUD_ACTION_TYPES.SET_GAMES: {
      return { ...state, games: action.payload.games };
    }
    case CLOUD_ACTION_TYPES.SET_FREE_ANALYZER: {
      console.log('SETTING ANALYZER: ', action.payload);
      return {
        ...state,
        freeAnalyzer: {
          ...state.freeAnalyzer,
          analyzer: action.payload.freeAnalyzer,
        },
      };
    }
    case CLOUD_ACTION_TYPES.SET_FREE_ANALYSIS_DATA: {
      console.log('SETTING ANALYSIS: ', action.payload);

      return {
        ...state,
        freeAnalyzer: {
          ...state.freeAnalyzer,
          analysis: action.payload.freeAnalysisData
            ? action.payload.freeAnalysisData
            : state.freeAnalyzer.analysis,
          isAnalysing: action.payload.isAnalysing,
        },
      };
    }
    case CLOUD_ACTION_TYPES.SET_PRO_ANALYZERS: {
      return { ...state, proAnalyzers: action.payload.proAnalyzers };
    }
    case CLOUD_ACTION_TYPES.UPDATE_NUM_PV: {
      const { numPV } = action.payload;
      const newProAnalyzers = cloneDeep(state.proAnalyzers);
      newProAnalyzers.forEach((pa) => {
        while (pa.analysis && pa.analysis.variations.length > numPV)
          pa.analysis.variations.pop();
      });
      return {
        ...state,
        proAnalyzers: newProAnalyzers,
        numPV: action.payload.numPV,
      };
    }
    case CLOUD_ACTION_TYPES.GET_USER_FULL_INFO: {
      return { ...state, userFullInfo: action.payload.userData };
    }
    case CLOUD_ACTION_TYPES.SET_ORDERED_CORES: {
      return { ...state, orderedCores: action.payload.orderedCores };
    }
    case CLOUD_ACTION_TYPES.SET_SAVED_ANALYZE_INFO: {
      return { ...state, savedAnalyzeInfo: action.payload.analyzeInfo };
    }
    default: {
      // console.warn('Unhandled or System action fired: ', action.type);
    }
  }
  return state;
}

export default cloudReducer;
