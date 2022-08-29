import Chess from 'chess.js';
import pgnParser from 'pgn-parser';
import BOARD_ACTION_TYPES from '../constants/board-action-types';
import BOARD_PARAMS from '../constants/board-params';
import {
  modifyMoves,
  getMovesLine,
  addMove,
  getPgnString,
  addScorePGN,
  findRootVariations,
  findIndexedPath,
  findLast2MovesOfIndexedPath,
  deleteRemainingMV,
  deleteVarAndReturnParent,
  addNagInPgn,
  deleteMvComment,
  deleteMvNag,
  addCommentToMV,
  getReferencesUrl,
  sortDataByGameCount,
} from '../utils/pgn-viewer';
import { setReference } from '../actions/board';
import { CLOUD_URL } from '../constants/cloud-params';

export function boardMiddleware({ getState, dispatch }) {
  const chess = new Chess();
  chess.header('White', 'Player 1', 'Black', 'Player 2');

  return function (next) {
    return async function (action) {
      console.log('ACTION TYPE:', action.type);
      switch (action.type) {
        ////
        // SET FEN
        ///
        case BOARD_ACTION_TYPES.SET_FEN: {
          try {
            const res = chess.load(action.payload.fen);
            const parsedPgn = pgnParser.parse(BOARD_PARAMS.INITIAL_PGN_STRING);
            if (!res) {
              return dispatch({
                type: 'INVALID_FEN',
                payload: { error: res.error },
              });
            }
            const boardState = getState('board');
            const { searchParams } = boardState;
            setReference(chess.fen(), searchParams);
            action.payload.pgnStr = chess.pgn();
            action.payload.pgn = parsedPgn[0];
          } catch (e) {
            console.error('INVALID FEN: ', e);
            return;
          }
          break;
        }

        ////
        // SET INITIAL PGN
        ////
        case BOARD_ACTION_TYPES.SET_INITIAL_PGN: {
          try {
            const parsedPgn = pgnParser.parse(BOARD_PARAMS.INITIAL_PGN_STRING);

            const isSet = chess.load_pgn(BOARD_PARAMS.INITIAL_PGN_STRING);
            if (!isSet)
              throw new Error("PGN parsed, but can't load into chess.js");
            if (sessionStorage.getItem('chessify_pgn_string'))
              sessionStorage.removeItem('chessify_pgn_string');

            action.payload.pgnStr = chess.pgn();
            action.payload.pgn = parsedPgn[0];

            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'INVALID_INITIAL_PGN',
              payload: { message: 'Invalid initial PGN' },
            });
          }
        }

        ////
        // SET PGN
        ////
        case BOARD_ACTION_TYPES.SET_PGN: {
          try {
            action.payload.pgn = action.payload.pgn.trimEnd();
            action.payload.pgn =
              action.payload.pgn.endsWith('*') ||
              action.payload.pgn.endsWith('0-1') ||
              action.payload.pgn.endsWith('1-0') ||
              action.payload.pgn.endsWith('1/2-1/2')
                ? action.payload.pgn
                : action.payload.pgn + ' *';
            const parsedPGN = pgnParser.parse(action.payload.pgn);
            console.log('PARSED PGN: ', parsedPGN);
            // ADDING layer AND prevMove in each move
            modifyMoves(parsedPGN[0].moves);
            const isSet = chess.load_pgn(action.payload.pgn, { sloppy: true });

            if (!isSet)
              throw new Error("PGN parsed, but can't load into chess.js");

            const lastMainMove = [...parsedPGN[0].moves]
              .reverse()
              .find((m) => m.layer === 0);

            action.payload.pgn = addScorePGN(action.payload.pgn, chess);

            const boardState = getState().board;
            const { searchParams } = boardState;
            setReference(chess.fen(), searchParams);
            window.sessionStorage.setItem(
              'chessify_pgn_string',
              action.payload.pgn
            );

            action.payload.pgnStr = action.payload.pgn;
            action.payload.pgn = parsedPGN[0];
            action.payload.fen = chess.fen();
            action.payload.activeMove = lastMainMove;
            break;
          } catch (e) {
            console.error(e.message);
            window.alert('Invalid PGN');
            return dispatch({
              type: 'INVALID_PGN',
              payload: { message: 'Invalid PGN' },
            });
          }
        }

        ////
        // DO MOVE
        ////
        case BOARD_ACTION_TYPES.DO_MOVE: {
          try {
            // Getting the Move Number from FEN
            const fenObj = chess.fen().split(' ');
            const move_number = parseInt(fenObj[fenObj.length - 1]);
            const mv = chess.move(action.payload.move);
            if (!mv) throw new Error(`Invalid move: ${action.payload.move}`);

            const boardState = getState().board;
            const { pgn, activeMove, searchParams } = boardState;

            const moveToAdd = {
              move: mv.san,
              move_number,
              comments: [],
            };

            const curMoves = pgn.moves ? pgn.moves : [];

            const newActiveMove = addMove(curMoves, activeMove, moveToAdd);

            action.payload.variationOpt =
              newActiveMove.prev_move &&
              newActiveMove.layer !== newActiveMove.prev_move.layer;

            const pgnStr = getPgnString(curMoves);

            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);

            console.log('PGN STRING: ', pgnStr);
            setReference(chess.fen(), searchParams);
            action.payload.pgnStr = pgnStr;
            action.payload.pgn = { ...pgn, moves: curMoves };
            action.payload.fen = chess.fen();
            action.payload.activeMove = newActiveMove;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'INVALID_MOVE',
              payload: { message: 'Invalid move' },
            });
          }
        }

        ////
        // SET ACTIVE MOVE
        ////
        case BOARD_ACTION_TYPES.SET_ACTIVE_MOVE: {
          try {
            const activeMove = action.payload.activeMove;

            if (
              Object.keys(chess.header()).length === 0 &&
              chess.header().constructor === Object
            ) {
              chess.header('White', 'Player 1', 'Black', 'Player 2');
            }

            const pgn = chess.pgn();
            const linePgn = pgn.split('\n\n');

            if (!activeMove) {
              linePgn[1] = '*';
              const isSet = chess.load_pgn(linePgn.join('\n\n'), {
                sloppy: true,
              });
              if (!isSet)
                throw new Error("PGN parsed, but can't load into chess.js");

              // WARNING!!! Remove later
              const fen = chess.fen();
              // window.TAXTAK.setFen(fen);
              action.payload.fen = fen;
              break;
            }

            const moves = [];
            getMovesLine({ ...activeMove }, moves);

            let movesStr = '';
            moves.forEach(
              (mv) =>
                (movesStr += `${mv.move_number ? mv.move_number + '. ' : ''}${
                  mv.move
                } `)
            );
            linePgn[0] = linePgn[0].split('\n ')[0];
            linePgn[1] = movesStr;

            console.log('LINE PGN: ', linePgn);
            const isSet = chess.load_pgn(linePgn.join('\n\n'), {
              sloppy: true,
            });

            if (!isSet)
              throw new Error("PGN parsed, but can't load into chess.js");

            // WARNING!!! Remove later
            const fen = chess.fen();
            // window.TAXTAK.setFen(fen);
            action.payload.fen = fen;

            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'INVALID_PGN',
              payload: { message: 'Invalid PGN' },
            });
          }
        }

        ////
        // PROMOTE VARIATION
        /////
        case BOARD_ACTION_TYPES.PROMOTE_VARIATION: {
          try {
            let move = action.payload.move;
            if (!move.move) {
              console.log('No selected move');
              return;
            }

            console.log('PROMOTION MOVE: ', move);
            if (move.layer === 0) {
              console.log('Already in main line');
              return;
            }
            const boardState = getState().board;
            let { pgn } = boardState;

            let rootVariations = findRootVariations(move).reverse();
            rootVariations.push(move.move_id);
            const indexedPath = findIndexedPath([pgn], rootVariations);
            console.log('INDEXED PATH: ', indexedPath);
            findLast2MovesOfIndexedPath(pgn, indexedPath);
            console.log('PROMOTED UPDATED: ', pgn);

            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);
            chess.load_pgn(pgnStr, { sloppy: true });
            const fen = chess.fen();

            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            action.payload.fen = fen;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'PROMOTION_FAILED',
              payload: { message: 'Promotion failed' },
            });
          }
        }

        ////
        // DELETE REMAINING MOVES
        /////

        case BOARD_ACTION_TYPES.DELETE_REMAINING_MOVES: {
          try {
            let move = action.payload.move;
            if (!move.move) {
              console.log('No selected move');
              return;
            }
            console.log('FROM MOVE: ', move);

            const boardState = getState().board;
            let { pgn } = boardState;

            let rootVariations = findRootVariations(move).reverse();
            rootVariations.push(move.move_id);
            const indexedPath = findIndexedPath([pgn], rootVariations);
            console.log('INDEXED PATH: ', indexedPath);

            deleteRemainingMV(pgn, indexedPath);
            console.log('DELETED REMAINING MOVES UPDATE: ', pgn);

            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);
            const activeMove = move;

            const moves = [];
            getMovesLine({ ...activeMove }, moves);

            let movesStr = '';
            moves.forEach(
              (mv) =>
                (movesStr += `${mv.move_number ? mv.move_number + '. ' : ''}${
                  mv.move
                } `)
            );

            const isSet = chess.load_pgn(movesStr, { sloppy: true });

            if (!isSet)
              throw new Error("PGN parsed, but can't load into chess.js");

            const fen = chess.fen();

            action.payload.fen = fen;
            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            action.payload.activeMove = move;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'DELETION_FAILED',
              payload: { message: 'Delete remaining moves failed' },
            });
          }
        }

        case BOARD_ACTION_TYPES.DELETE_VARIATION: {
          try {
            let move = action.payload.move;
            if (!move.move) {
              console.log('No selected move');
              return;
            }
            console.log('FROM MOVE: ', move);

            if (move.layer === 0) {
              console.log('Cannot delete main line');
              return;
            }

            const boardState = getState().board;
            let { pgn } = boardState;

            let rootVariations = findRootVariations(move).reverse();
            rootVariations.push(move.move_id);
            const indexedPath = findIndexedPath([pgn], rootVariations);
            console.log('INDEXED PATH: ', indexedPath);

            let parentMove = deleteVarAndReturnParent(pgn, indexedPath);
            console.log('DELETED VARIATION UPDATE: ', pgn);

            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);
            const activeMove = parentMove;

            const moves = [];
            getMovesLine({ ...activeMove }, moves);

            let movesStr = '';
            moves.forEach(
              (mv) =>
                (movesStr += `${mv.move_number ? mv.move_number + '. ' : ''}${
                  mv.move
                } `)
            );
            const isSet = chess.load_pgn(movesStr, { sloppy: true });

            if (!isSet)
              throw new Error("PGN parsed, but can't load into chess.js");

            const fen = chess.fen();

            action.payload.fen = fen;
            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            action.payload.activeMove = activeMove;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'VAR_DELETION_FAILED',
              payload: { message: 'Delete variation failed' },
            });
          }
        }

        case BOARD_ACTION_TYPES.DELETE_VARIATIONS_AND_COMMENTS: {
          try {
            const boardState = getState().board;
            let { pgn } = boardState;

            pgn.comments = null;
            pgn.comments_above_header = null;
            pgn.moves.forEach((mv) => {
              if (mv.ravs) {
                delete mv.ravs;
              }
              mv.comments = [];
              mv.nags = [];
              delete mv.nags;
            });

            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);

            chess.load_pgn(pgnStr, { sloppy: true });
            const fen = chess.fen();

            const lastMainMove = [...pgn.moves]
              .reverse()
              .find((m) => m.layer === 0);

            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            action.payload.fen = fen;
            action.payload.activeMove = lastMainMove;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'VAR_COMMENT_DELETION_FAILED',
              payload: { message: 'Delete vars and comments failed' },
            });
          }
        }

        case BOARD_ACTION_TYPES.ADD_NAGS: {
          try {
            let move = action.payload.move;
            const nag = action.payload.nag;

            if (!move.move) {
              console.log('No selected move');
              return;
            }

            const boardState = getState().board;
            let { pgn } = boardState;

            let rootVariations = findRootVariations(move).reverse();
            rootVariations.push(move.move_id);
            const indexedPath = findIndexedPath([pgn], rootVariations);

            addNagInPgn(pgn, indexedPath, nag);
            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);

            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            action.payload.activeMove = move;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'ADDING_NAG_FAILED',
              payload: { message: 'Adding nag failed' },
            });
          }
        }

        case BOARD_ACTION_TYPES.DELETE_MOVE_COMMENT: {
          try {
            let move = action.payload.move;

            if (!move.move) {
              console.log('No selected move');
              return;
            }

            if (!move.comments.length) {
              console.log('The move has no comment');
              return;
            }

            const boardState = getState().board;
            let { pgn } = boardState;

            let rootVariations = findRootVariations(move).reverse();
            rootVariations.push(move.move_id);
            const indexedPath = findIndexedPath([pgn], rootVariations);

            deleteMvComment(pgn, indexedPath);

            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);

            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'DELETING_MV_COMMENT_FAILED',
              payload: { message: 'Delete move comment failed' },
            });
          }
        }

        case BOARD_ACTION_TYPES.DELETE_MOVE_NAG: {
          try {
            let move = action.payload.move;

            if (!move.move) {
              console.log('No selected move');
              return;
            }

            if (!move.nags) {
              console.log('The move has no nags');
              return;
            }

            const boardState = getState().board;
            let { pgn } = boardState;

            let rootVariations = findRootVariations(move).reverse();
            rootVariations.push(move.move_id);
            const indexedPath = findIndexedPath([pgn], rootVariations);

            deleteMvNag(pgn, indexedPath);

            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);

            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'DELETING_MV_COMMENT_FAILED',
              payload: { message: 'Delete move comment failed' },
            });
          }
        }

        case BOARD_ACTION_TYPES.ADD_COMMENT_TO_MOVE: {
          try {
            let move = action.payload.move;
            const comment = action.payload.comment;

            if (!move.move) {
              console.log('No move');
              return;
            }

            if (!comment.length) {
              console.log('No text to add');
              return;
            }

            const boardState = getState().board;
            let { pgn } = boardState;

            let rootVariations = findRootVariations(move).reverse();
            rootVariations.push(move.move_id);
            const indexedPath = findIndexedPath([pgn], rootVariations);

            addCommentToMV(pgn, indexedPath, comment);

            const pgnStr = getPgnString(pgn.moves);
            window.sessionStorage.setItem('chessify_pgn_string', pgnStr);

            action.payload.pgn = pgn;
            action.payload.pgnStr = pgnStr;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'ADDING_MV_COMMENT_FAILED',
              payload: { message: 'Adding move comment failed' },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_REFERENCE: {
          try {
            let fen = action.payload.fen;
            if (!fen) {
              return;
            }
            let searchParams = action.payload.searchParams;
            let url = getReferencesUrl(fen, searchParams, 'get_references');
            async function getReferences() {
              const response = await fetch(url);
              if (!response.ok) {
                action.payload.moveLoader = false;
                action.payload.referenceData = {};
                action.payload.referenceData['message'] = 'No moves found';
                return;
              }
              let respJson = await response.json();
              let { data, error } = respJson;
              if (data) {
                let statistics = sortDataByGameCount(data);
                action.payload.referenceData = {};
                action.payload.referenceData['statistics'] = statistics;
              } else if (error) {
                action.payload.referenceData = {};
                action.payload.referenceData['message'] = error;
              }
            }
            await getReferences();
            action.payload.moveLoader = false;
            action.payload.searchParams = searchParams;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'SETTING_REFERENCE_FAILED',
              payload: { message: 'Failed setting reference' },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_GAME_REFERENCE: {
          try {
            const loadMore = action.payload.loadMore;
            const searchParams = action.payload.searchParams;

            const boardState = getState().board;
            const { fen, pageNum, referenceGames } = boardState;
            let url = getReferencesUrl(fen, searchParams, 'get_games');
            url += loadMore ? `&&page=${pageNum + 1}` : '';

            async function searchGames() {
              const response = await fetch(url);
              if (!response.ok) {
                action.payload.gameRefLoader = false;
                if (
                  loadMore &&
                  referenceGames &&
                  referenceGames.games &&
                  referenceGames.games.length
                ) {
                  action.payload.referenceGames = {
                    games: referenceGames.games,
                    message: 'No more games',
                  };
                } else {
                  action.payload.referenceGames = {
                    message: 'No games found',
                    game: [],
                  };
                }
                return;
              }
              const refGames = await response.json();

              if (loadMore) {
                if (refGames.games.length) {
                  if (refGames.games.length % 10 !== 0) {
                    action.payload.referenceGames = {
                      message: 'No more games',
                      games: [...referenceGames.games, ...refGames.games],
                    };
                  } else {
                    action.payload.referenceGames = {
                      games: [...referenceGames.games, ...refGames.games],
                    };
                  }
                } else {
                  action.payload.referenceGames = {
                    games: [...referenceGames.games],
                    message: 'No more games',
                  };
                }
              } else {
                if (refGames.games.length % 10 !== 0) {
                  action.payload.referenceGames = {
                    message: '-',
                    games: [...refGames.games],
                  };
                } else {
                  action.payload.referenceGames = refGames;
                }
              }
            }
            await searchGames();
            action.payload.gameRefLoader = false;
            action.payload.searchParams = searchParams;
            action.payload.pageNum = loadMore ? pageNum + 1 : 0;
            break;
          } catch (e) {
            console.error(e.message);
            return dispatch({
              type: 'SETTING_GAME_REFERENCE_FAILED',
              payload: {
                message: 'Failed setting game reference',
              },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_MOVE_LOADER: {
          try {
            const moveLoader = action.payload.moveLoader;
            action.payload.moveLoader = moveLoader;
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SETTING_MOVE_LOADER_FAILED',
              payload: {
                message: 'Failed to set move loader',
              },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_GAME_REF_LOADER: {
          try {
            const gameRefLoader = action.payload.gameRefLoader;
            action.payload.moveLoader = gameRefLoader;
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SETTING_GAME_REF_LOADER_FAILED',
              payload: { message: 'Failed to set game ref loader' },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_VARIATION_OPT: {
          try {
            const variationOpt = action.payload.variationOpt;
            action.payload.moveLoader = variationOpt;
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SETTING_VAR_OPT_FAILED',
              payload: { message: 'Failed to set variation option' },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_ACTIVE_FILE: {
          try {
            const { fileContent, path, file } = action.payload;
            const activeFileInfo = {
              fileContent: fileContent,
              path: path,
              file: file,
            };
            action.payload.activeFileInfo = activeFileInfo;
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SETTING_ACTIVE_FILE_FAILED',
              payload: { message: 'Failed to set active file' },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_USER_UPLOADS: {
          try {
            const { path, userInfo } = action.payload;
            const token = userInfo.token;
            async function getDirectories(path, token) {
              const url = `${CLOUD_URL}/user_account/get-directory?path=${path}`;
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  Authorization: `Token ${token}`,
                },
              });
              if (!response.ok) {
                return;
              }
              let respJson = await response.json();
              if (Object.keys(respJson.data).length === 0) {
                respJson.data['noExistingFilesErrorMessage'] = 'No uploads yet';
              }
              action.payload.userUploads = respJson.data;
            }

            await getDirectories(path, token);
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SETTING_USER_UPLOADS_FAILED',
              payload: { message: 'Failed to set user uploads' },
            });
          }
        }

        case BOARD_ACTION_TYPES.UPLOAD_FILES: {
          try {
            const { path, files, info, userInfo } = action.payload;
            const token = userInfo.token;
            async function uploadFiles(path, files, info, token) {
              const url = `${CLOUD_URL}/user_account/upload-pgn/`;
              let data = new FormData();
              data.append('path', path);
              for (let i = 0; i < files.length; i++) {
                if (files[i].name.endsWith('.pgn'))
                  data.append('files', files[i]);
              }
              if (!data.has('files')) return;
              if (info) {
                data.append('white', info.white);
                data.append('black', info.black);
                data.append('tournament', info.tournament);
                data.append('elo_white', info.whiteElo);
                data.append('elo_black', info.blackElo);
                data.append('eco_code', info.ecoCode);
                data.append('date', info.date);
                data.append('round', info.round);
                data.append('subround', info.subround);
                data.append('result', info.result);
                data.append('annotator', info.annotator);
                data.append('white_team', info.whiteTeam);
                data.append('black_team', info.blackTeam);
                data.append('source', info.source);
              }
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  Authorization: `Token ${token}`,
                },
                body: data,
              });
              if (!response.ok) {
                throw new Error('Something went wrong');
              }
              return await response.json();
            }

            await uploadFiles(path, files, info, token);
            action.payload.userUploads = {};
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'UPLOADING_FILE_FAILED',
              payload: { message: 'Failed to upload' },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_CURRENT_DIRECTORY: {
          try {
            const { directory } = action.payload;
            action.payload.currentDirectory = directory;
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SET_CURRENT_DIRECTORY_FAILED',
              payload: { message: 'Failed to set current directory' },
            });
          }
        }

        case BOARD_ACTION_TYPES.SET_LOADER: {
          try {
            const { loaderType } = action.payload;
            action.payload.loader = loaderType;
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SET_CURRENT_DIRECTORY_FAILED',
              payload: { message: 'Failed to set current directory' },
            });
          }
        }

        case BOARD_ACTION_TYPES.CREATE_FOLDER: {
          try {
            const { path, name, userInfo } = action.payload;
            const token = userInfo.token;
            async function createFolder(path, name, token) {
              const url = `${CLOUD_URL}/user_account/create-folder/`;
              const data = {};
              data['path'] = path;
              data['name'] = name;
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${token}`,
                },
                body: JSON.stringify(data),
              });

              if (!response.ok) {
                throw new Error('Something went wrong');
              }

              return await response.json();
            }
            await createFolder(path, name, token);
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'SET_CURRENT_DIRECTORY_FAILED',
              payload: { message: 'Failed to set current directory' },
            });
          }
        }

        case BOARD_ACTION_TYPES.DELETE_FILES: {
          try {
            const { files, folders, userInfo } = action.payload;
            const token = userInfo.token;
            async function deleteFiles(files, folders, token) {
              const url = `${CLOUD_URL}/user_account/delete-directories/`;
              let data = {};
              if (folders.length) {
                for (let i = 0; i < folders.length; i++) {
                  folders[i] = '/' + folders[i] + '/';
                }
              }
              data['folders'] = folders;
              data['files'] = files;
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${token}`,
                },
                body: JSON.stringify(data),
              });
              if (!response.ok) {
                throw new Error('Something went wrong');
              }
              return await response;
            }
            await deleteFiles(files, folders, token);
            break;
          } catch (e) {
            console.error(e);
            return dispatch({
              type: 'DELETING_FILES_FAILED',
              payload: { message: 'Failed to delete files' },
            });
          }
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

export default [boardMiddleware];
