import BOARD_ACTION_TYPES from '../constants/board-action-types';
import BOARD_PARAMS from '../constants/board-params';

const initialState = {
  fen: BOARD_PARAMS.INITIAL_FEN,
  pgnStr: '',
  pgn: {},
  activeMove: {},
  orientation: BOARD_PARAMS.BOARD_ORIENTATION,
  referenceData: {},
  searchParams: {},
  referenceGames: {},
  moveLoader: false,
  gameRefLoader: false,
  variationOpt: false,
  pageNum: 0,
  activeFileInfo: {},
  userUploads: {},
  currentDirectory: '/',
  loader: '',
};

function boardReducer(state = initialState, action) {
  switch (action.type) {
    case BOARD_ACTION_TYPES.SET_FEN: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: action.payload.pgn,
        fen: action.payload.fen,
      };
    }
    case BOARD_ACTION_TYPES.SET_INITIAL_PGN: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: action.payload.pgn,
        activeMove: {},
      };
    }
    case BOARD_ACTION_TYPES.SET_PGN: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: action.payload.pgn,
        fen: action.payload.fen,
        activeMove: action.payload.activeMove,
      };
    }
    case BOARD_ACTION_TYPES.DO_MOVE: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: action.payload.pgn,
        fen: action.payload.fen,
        activeMove: action.payload.activeMove,
        variationOpt: action.payload.variationOpt,
        moveLoader: true,
      };
    }
    case BOARD_ACTION_TYPES.SET_ACTIVE_MOVE: {
      return {
        ...state,
        activeMove: action.payload.activeMove,
        fen: action.payload.fen,
      };
    }
    case BOARD_ACTION_TYPES.SET_BOARD_ORIENTATION: {
      return {
        ...state,
        orientation: action.payload.orientation,
      };
    }
    case BOARD_ACTION_TYPES.PROMOTE_VARIATION: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: { ...action.payload.pgn },
        fen: action.payload.fen,
      };
    }
    case BOARD_ACTION_TYPES.DELETE_REMAINING_MOVES: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: { ...action.payload.pgn },
        fen: action.payload.fen,
        activeMove: action.payload.activeMove,
      };
    }
    case BOARD_ACTION_TYPES.DELETE_VARIATION: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: { ...action.payload.pgn },
        fen: action.payload.fen,
        activeMove: action.payload.activeMove,
      };
    }
    case BOARD_ACTION_TYPES.DELETE_VARIATIONS_AND_COMMENTS: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: { ...action.payload.pgn },
        fen: action.payload.fen,
        activeMove: action.payload.activeMove,
      };
    }
    case BOARD_ACTION_TYPES.ADD_NAGS: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: action.payload.pgn,
        activeMove: { ...action.payload.activeMove },
      };
    }
    case BOARD_ACTION_TYPES.DELETE_MOVE_COMMENT: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: { ...action.payload.pgn },
      };
    }
    case BOARD_ACTION_TYPES.DELETE_MOVE_NAG: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: { ...action.payload.pgn },
      };
    }
    case BOARD_ACTION_TYPES.ADD_COMMENT_TO_MOVE: {
      return {
        ...state,
        pgnStr: action.payload.pgnStr,
        pgn: { ...action.payload.pgn },
      };
    }
    case BOARD_ACTION_TYPES.SET_REFERENCE: {
      return {
        ...state,
        referenceData: { ...action.payload.referenceData },
        moveLoader: action.payload.moveLoader,
      };
    }
    case BOARD_ACTION_TYPES.SET_GAME_REFERENCE: {
      return {
        ...state,
        referenceGames: { ...action.payload.referenceGames },
        gameRefLoader: action.payload.gameRefLoader,
        searchParams: { ...action.payload.searchParams },
        pageNum: action.payload.pageNum,
      };
    }
    case BOARD_ACTION_TYPES.SET_MOVE_LOADER: {
      return {
        ...state,
        moveLoader: action.payload.moveLoader,
      };
    }
    case BOARD_ACTION_TYPES.SET_GAME_REF_LOADER: {
      return {
        ...state,
        gameRefLoader: action.payload.gameRefLoader,
      };
    }
    case BOARD_ACTION_TYPES.SET_VARIATION_OPT: {
      return {
        ...state,
        variationOpt: action.payload.variationOpt,
      };
    }
    case BOARD_ACTION_TYPES.SET_ACTIVE_FILE: {
      return {
        ...state,
        activeFileInfo: { ...action.payload.activeFileInfo },
      };
    }
    case BOARD_ACTION_TYPES.SET_USER_UPLOADS: {
      return {
        ...state,
        userUploads: { ...action.payload.userUploads },
        loader: '',
      };
    }
    case BOARD_ACTION_TYPES.UPLOAD_FILES: {
      return {
        ...state,
        userUploads: {},
      };
    }
    case BOARD_ACTION_TYPES.SET_CURRENT_DIRECTORY: {
      return {
        ...state,
        currentDirectory: action.payload.currentDirectory,
      };
    }
    case BOARD_ACTION_TYPES.SET_LOADER: {
      return {
        ...state,
        loader: action.payload.loader,
      };
    }
    case BOARD_ACTION_TYPES.CREATE_FOLDER: {
      return {
        ...state,
        userUploads: {},
      };
    }
    case BOARD_ACTION_TYPES.DELETE_FILES: {
      return {
        ...state,
        userUploads: {},
      };
    }
    default: {
      // console.warn('Unhandled or System action fired: ', action.type);
      return state;
    }
  }
}

export default boardReducer;
