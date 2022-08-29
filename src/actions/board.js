import BOARD_ACTION_TYPES from '../constants/board-action-types';

export function setFen(fen) {
  return function (dispatch) {
    // Reseting Pgn
    dispatch({ type: BOARD_ACTION_TYPES.SET_INITIAL_PGN, payload: {} });
    dispatch({ type: BOARD_ACTION_TYPES.SET_FEN, payload: { fen } });
  };
}

export function setInitialPgn() {
  return { type: BOARD_ACTION_TYPES.SET_INITIAL_PGN };
}

export function setPgn(pgn) {
  return { type: BOARD_ACTION_TYPES.SET_PGN, payload: { pgn } };
}

export function doMove(move) {
  return { type: BOARD_ACTION_TYPES.DO_MOVE, payload: { move } };
}

export function setActiveMove(activeMove) {
  return {
    type: BOARD_ACTION_TYPES.SET_ACTIVE_MOVE,
    payload: { activeMove },
  };
}

export function setBoardOrientation(orientation) {
  return {
    type: BOARD_ACTION_TYPES.SET_BOARD_ORIENTATION,
    payload: { orientation },
  };
}

export function promoteVariation(move) {
  return {
    type: BOARD_ACTION_TYPES.PROMOTE_VARIATION,
    payload: { move },
  };
}

export function deleteRemainingMoves(move) {
  return {
    type: BOARD_ACTION_TYPES.DELETE_REMAINING_MOVES,
    payload: { move },
  };
}

export function deleteVariation(move) {
  return {
    type: BOARD_ACTION_TYPES.DELETE_VARIATION,
    payload: { move },
  };
}

export function deleteVarsAndComments() {
  return {
    type: BOARD_ACTION_TYPES.DELETE_VARIATIONS_AND_COMMENTS,
    payload: {},
  };
}

export function addNags(move, nag) {
  return {
    type: BOARD_ACTION_TYPES.ADD_NAGS,
    payload: { move, nag },
  };
}

export function deleteMoveComment(move) {
  return {
    type: BOARD_ACTION_TYPES.DELETE_MOVE_COMMENT,
    payload: { move },
  };
}

export function deleteMoveNag(move) {
  return {
    type: BOARD_ACTION_TYPES.DELETE_MOVE_NAG,
    payload: { move },
  };
}

export function addCommentToMove(move, comment) {
  return {
    type: BOARD_ACTION_TYPES.ADD_COMMENT_TO_MOVE,
    payload: { move, comment },
  };
}

export function setReference(fen, searchParams) {
  return {
    type: BOARD_ACTION_TYPES.SET_REFERENCE,
    payload: { fen, searchParams },
  };
}

export function setGameReference(loadMore, searchParams) {
  return {
    type: BOARD_ACTION_TYPES.SET_GAME_REFERENCE,
    payload: { loadMore, searchParams },
  };
}

export function setMoveLoader(moveLoader) {
  return {
    type: BOARD_ACTION_TYPES.SET_MOVE_LOADER,
    payload: { moveLoader },
  };
}

export function setGameRefLoader(gameRefLoader) {
  return {
    type: BOARD_ACTION_TYPES.SET_GAME_REF_LOADER,
    payload: { gameRefLoader },
  };
}

export function setVariationOpt(variationOpt) {
  return {
    type: BOARD_ACTION_TYPES.SET_VARIATION_OPT,
    payload: { variationOpt },
  };
}

export function setActiveFile(fileContent, file, path) {
  return {
    type: BOARD_ACTION_TYPES.SET_ACTIVE_FILE,
    payload: { fileContent, file, path },
  };
}

export function setUserUploads(path, userInfo) {
  return {
    type: BOARD_ACTION_TYPES.SET_USER_UPLOADS,
    payload: { path, userInfo },
  };
}

export function uploadFiles(path, files, info, userInfo) {
  return {
    type: BOARD_ACTION_TYPES.UPLOAD_FILES,
    payload: { path, files, info, userInfo },
  };
}

export function setCurrentDirectory(directory) {
  return {
    type: BOARD_ACTION_TYPES.SET_CURRENT_DIRECTORY,
    payload: { directory },
  };
}

export function setLoader(loaderType) {
  return {
    type: BOARD_ACTION_TYPES.SET_LOADER,
    payload: { loaderType },
  };
}

export function createFolder(path, name, userInfo) {
  return {
    type: BOARD_ACTION_TYPES.CREATE_FOLDER,
    payload: { path, name, userInfo },
  };
}

export function deleteFiles(files, folders, userInfo) {
  return {
    type: BOARD_ACTION_TYPES.DELETE_FILES,
    payload: { files, folders, userInfo },
  };
}

export default {
  setFen,
  setInitialPgn,
  setPgn,
  doMove,
  setActiveMove,
  promoteVariation,
  deleteRemainingMoves,
  deleteVarsAndComments,
  addNags,
  deleteMoveComment,
  deleteMoveNag,
  addCommentToMove,
  setReference,
  setGameReference,
  setMoveLoader,
  setGameRefLoader,
  setVariationOpt,
  setActiveFile,
  setUserUploads,
  uploadFiles,
  setCurrentDirectory,
  setLoader,
  createFolder,
  deleteFiles,
};
