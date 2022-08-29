import { CLOUD_URL } from '../constants/cloud-params';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const UPPERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const modifyMoves = (moves, layer = 0, parentMove = null) => {
  moves.forEach((mv, i) => {
    mv.layer = layer;
    mv.prev_move = i ? moves[i - 1] : parentMove;
    mv.move_id = uuidv4();

    if (mv.ravs) {
      mv.ravs.forEach((rav) => {
        modifyMoves(rav.moves, layer + 1, moves[i - 1]);
      });
    }
  });
};

export const getMovesLine = (toMove, moves = []) => {
  if (toMove.prev_move) getMovesLine({ ...toMove.prev_move }, moves);

  const needToRemoveMoveNumber =
    moves[moves.length - 1] &&
    moves[moves.length - 1].move_number === toMove.move_number;

  if (needToRemoveMoveNumber) delete toMove.move_number;

  moves.push(toMove);
};

export const addMove = (moves, activeMove, moveToAdd) => {
  ////////
  //// Check if variation of the first move
  ////////
  if (!activeMove && moves && moves.length) {
    const newMove = {
      ...moveToAdd,
      layer: 1,
      prev_move: null,
      move_id: uuidv4(),
    };

    if (!moves[0].ravs) moves[0].ravs = [{ moves: [newMove] }];
    else {
      for (let i in moves[0].ravs) {
        if (moves[0].ravs[i].moves[0].move === newMove.move)
          return moves[0].ravs[i].moves[0];
      }

      moves[0].ravs.push({ moves: [newMove] });
    }

    return newMove;
  }

  ////////
  //// Checking if new move already exists in MAIN line
  ////////
  const row = getRowContainingMove(moves, activeMove);

  ////////
  //// For the first move
  ////////
  if (!row) {
    const newMove = {
      ...moveToAdd,
      layer: 0,
      prev_move: null,
      move_id: uuidv4(),
    };
    moves.push(newMove);
    return newMove;
  }

  const curMoveIndexInRow = row.findIndex((mv, i) => {
    return mv.move_id === activeMove.move_id;
  });

  console.log('CUR MOVE INDEX IN ROW: ', curMoveIndexInRow);
  const nextMainMove = row[curMoveIndexInRow + 1]
    ? row[curMoveIndexInRow + 1]
    : null;
  console.log('NEXT MAIN MOVE: ', nextMainMove);
  const moveAlreadyExistsInMain =
    nextMainMove && nextMainMove.move === moveToAdd.move;

  ////////
  //// Checking if new move already exists in RAVS
  ////////
  const nextMoveInRow = row[curMoveIndexInRow + 1];
  const nextRavRow = nextMoveInRow
    ? nextMoveInRow.ravs
      ? nextMoveInRow.ravs.find((rav) => rav.moves[0].move === moveToAdd.move)
      : null
    : null;
  const moveAlreadyExistsInRavs = Boolean(nextRavRow);

  if (moveAlreadyExistsInMain) return nextMainMove;

  if (moveAlreadyExistsInRavs) return nextRavRow.moves[0];

  //Removing move number, if its in main line and is black's move
  if (!nextMainMove && moveToAdd.move_number === activeMove.move_number)
    delete moveToAdd.move_number;

  const newMove = {
    ...moveToAdd,
    layer: nextMainMove ? activeMove.layer + 1 : activeMove.layer,
    prev_move: activeMove,
    move_id: uuidv4(),
  };

  if (!nextMainMove) {
    row.push(newMove);
  } else {
    const move = row[curMoveIndexInRow + 1];
    if (move.ravs) move.ravs.push({ moves: [newMove] });
    else move.ravs = [{ moves: [newMove] }];
  }

  return newMove;
};

export const getRowContainingMove = (moves, move) => {
  if (moves.some((m) => m.move_id === move.move_id)) {
    return moves;
  }

  for (let i in moves) {
    if (moves[i].ravs) {
      for (let j in moves[i].ravs) {
        const row = getRowContainingMove(moves[i].ravs[j].moves, move);
        if (row) return row;
      }
    }
  }
};

const addMoveInPgnStringParts = (move, index, parts) => {
  parts.push(
    `${
      move.move_number
        ? move.move_number +
          '.' +
          `${
            move.prev_move &&
            move.prev_move.move_number &&
            parts.includes(
              `${move.prev_move.move_number}. ${move.prev_move.move} `
            ) &&
            index === 0
              ? '..'
              : ''
          }`
        : parts.length && index === 0
        ? move.prev_move.move_number + '.'
        : ''
    } ${move.move}${
      move.nags
        ? move.nags[1]
          ? ` ${move.nags[0]} ${move.nags[1]}`
          : ` ${move.nags[0]}`
        : ''
    }${addCommentsInPgnStr(move)} `
  );
};

const addCommentsInPgnStr = (move) => {
  let comments = '';
  if (move.comments && move.comments.length) {
    move.comments.forEach(
      (comment) => (comments = comments + ` {${comment.text}}`)
    );
  }
  return comments;
};

export const addCommentsInNotation = (move) => {
  let comments = '';
  if (move.comments && move.comments.length) {
    move.comments.forEach(
      (comment) => (comments = comments + ` ${comment.text}`)
    );
  }
  return comments;
};

// Add score in the Notation section
export const scoreInNotation = (move) => {
  let score = '';
  if (move.move.includes('#')) {
    move.move_number ? (score = ' 1-0') : (score = ' 0-1');
  }
  return score;
};

// Add score in the PGN section
const scoreInPGN = (parts, moves) => {
  parts = parts.join('');
  let lastMove = moves[moves.length - 1].move;
  if (
    parts.includes(Math.ceil(moves.length / 2) + '. ' + lastMove) &&
    lastMove.includes('#')
  ) {
    parts += ' 1-0';
  } else if (lastMove.includes('#')) {
    parts += ' 0-1';
  } else {
    parts += ' *';
  }
  return parts;
};

export const getPgnString = (moves, parts = [], rav_ind = 0) => {
  if (rav_ind !== 0) parts.push(' ) (');
  moves.forEach((move, index) => {
    if (move.ravs) {
      addMoveInPgnStringParts(move, index, parts);
      parts.push(' (');
      move.ravs.forEach((rav, ind) => getPgnString(rav.moves, parts, ind));
      parts.push(') ');
    } else {
      addMoveInPgnStringParts(move, index, parts);
    }
  });

  parts[parts.length - 1] = parts[parts.length - 1].trimEnd();

  if (moves[0].layer === 0) parts = scoreInPGN(parts, moves);

  return parts;
};

export const addScorePGN = (payloadPGN, chess) => {
  if (
    chess.in_checkmate() &&
    !payloadPGN.endsWith('0-1') &&
    !payloadPGN.endsWith('1-0')
  ) {
    if (chess.turn() === 'w') {
      payloadPGN = payloadPGN.slice(0, -1) + ' 0-1';
    } else {
      payloadPGN = payloadPGN.slice(0, -1) + ' 1-0';
    }
  }
  return payloadPGN;
};

export const findRootVariations = (mv, rootVariations = []) => {
  if (mv.layer === 0) {
    return rootVariations;
  }

  if (mv.layer !== mv.prev_move.layer) {
    rootVariations.push(mv.prev_move.move_id);
  }
  return findRootVariations(mv.prev_move, rootVariations);
};

export const findIndexedPath = (pgn, rootVariations, indexedPath = []) => {
  pgn.forEach((pgn_moves, indx) => {
    let moves = pgn_moves.moves;
    const index = moves.findIndex((mv) => {
      return mv.move_id === rootVariations[0];
    });
    if (index >= 0) {
      let holder = {};
      holder.ravInd = indx;
      holder.moveInd = rootVariations.length !== 1 ? index + 1 : index;
      indexedPath.push(holder);
      if (rootVariations.length !== 1 && moves[index + 1]) {
        return findIndexedPath(
          moves[index + 1].ravs,
          rootVariations.slice(1),
          indexedPath
        );
      }
    }
  });
  return indexedPath;
};

const changeLayerNum = (moves, promote = true) => {
  moves.forEach((mv) => {
    if (mv.ravs) {
      mv.layer += promote ? -1 : 1;
      mv.ravs.forEach((mvRav) => {
        changeLayerNum(mvRav.moves, promote);
      });
    } else {
      mv.layer += promote ? -1 : 1;
    }
  });
};

const promoteMove = (nextPgn, lastMove, prelastMove) => {
  let mainLine = nextPgn.ravs[prelastMove.ravInd].moves;
  let demotingMoves = mainLine.splice(prelastMove.moveInd);
  let promotingMoves = demotingMoves[0].ravs[lastMove.ravInd].moves;

  const demotingResult = nextPgn.ravs[prelastMove.ravInd].result;
  const promotingResult = demotingMoves[0].ravs[lastMove.ravInd].result;
  nextPgn.ravs[prelastMove.ravInd].result = promotingResult;

  let promotingMV1st = promotingMoves[0];
  let demotingMV1st = demotingMoves[0];
  promotingMV1st.layer -= 1;
  demotingMV1st.layer += 1;

  // in case we are promoting a black move, we need to remove its move number.
  if (promotingMV1st.move_number && promotingMV1st.prev_move.move_number) {
    demotingMV1st.move_number = promotingMV1st.move_number;
    delete promotingMV1st.move_number;
  }

  demotingMV1st.ravs.splice(lastMove.ravInd, 1);
  if (demotingMV1st.ravs.length) {
    promotingMV1st.ravs = demotingMV1st.ravs;
  }
  delete demotingMV1st.ravs;

  changeLayerNum(demotingMoves.slice(1), false);
  changeLayerNum(promotingMoves.slice(1), true);

  if (promotingMV1st.ravs) {
    promotingMV1st.ravs.push({});
    promotingMV1st.ravs[promotingMV1st.ravs.length - 1].moves = demotingMoves;
    promotingMV1st.ravs[promotingMV1st.ravs.length - 1].result = demotingResult;
  } else {
    promotingMV1st.ravs = [];
    let holder = {};
    holder.moves = demotingMoves;
    holder.result = demotingResult;
    promotingMV1st.ravs.push(holder);
  }

  promotingMoves.forEach((mv) => {
    mainLine.push(mv);
  });
};

export const findLast2MovesOfIndexedPath = (pgn, indexedPath) => {
  const { ravInd, moveInd } = indexedPath[0];
  const isFirstLayer = pgn.moves && pgn.moves[moveInd].layer === 0;

  let nextPgn;

  if (indexedPath.length === 2) {
    nextPgn = {};
    nextPgn.ravs = [pgn];
  } else {
    nextPgn = isFirstLayer
      ? pgn.moves[moveInd]
      : pgn.ravs[ravInd].moves[moveInd];
    indexedPath = indexedPath.slice(1);
  }

  if (indexedPath.length > 2) {
    return findLast2MovesOfIndexedPath(nextPgn, indexedPath);
  } else {
    promoteMove(nextPgn, indexedPath[1], indexedPath[0]);
  }
};

export const deleteRemainingMV = (pgn, indexedPath) => {
  const { ravInd, moveInd } = indexedPath[0];
  const isFirstLayer = pgn.moves && pgn.moves[moveInd].layer === 0;

  if (indexedPath.length === 1 && isFirstLayer) {
    const hasNextMove = pgn.moves[moveInd + 1];
    if (hasNextMove) {
      pgn.moves.splice(moveInd + 1);
    }
    return;
  }

  if (indexedPath.length > 1) {
    let nextPgn = isFirstLayer
      ? pgn.moves[moveInd]
      : pgn.ravs[ravInd].moves[moveInd];
    indexedPath = indexedPath.slice(1);
    return deleteRemainingMV(nextPgn, indexedPath);
  } else {
    const hasNextMove = pgn.ravs[ravInd].moves[moveInd + 1];
    if (hasNextMove) {
      pgn.ravs[ravInd].moves.splice(moveInd + 1);
    }
  }
};

export const deleteVarAndReturnParent = (pgn, indexedPath) => {
  const { ravInd, moveInd } = indexedPath[0];
  const isFirstLayer = pgn.moves && pgn.moves[moveInd].layer === 0;

  let nextPgn;

  if (indexedPath.length === 2) {
    nextPgn = {};
    nextPgn.ravs = [pgn];
  } else {
    nextPgn = isFirstLayer
      ? pgn.moves[moveInd]
      : pgn.ravs[ravInd].moves[moveInd];
    indexedPath = indexedPath.slice(1);
  }
  if (indexedPath.length > 2) {
    return deleteVarAndReturnParent(nextPgn, indexedPath);
  } else {
    let parentOfVar =
      nextPgn.ravs[indexedPath[0].ravInd].moves[indexedPath[0].moveInd];
    parentOfVar.ravs.splice(indexedPath[1].ravInd, 1);
    if (parentOfVar.ravs.length === 0) {
      delete parentOfVar.ravs;
    }
    return parentOfVar;
  }
};

export const convertPieceToSymbol = (move) => {
  const { move_number, prev_move } = move;
  const isBlackMove =
    (move_number &&
      prev_move &&
      prev_move.move_number &&
      !prev_move.prev_move.move_number) ||
    !move_number;

  const letters = ['K', 'Q', 'R', 'B', 'N'];
  const symbols_black = ['\u265A', '\u265B', '\u265C', '\u265D', '\u265E'];
  const symbols_white = ['\u2654', '\u2655', '\u2656', '\u2657', '\u2658'];

  const [piece, direction] = splitMovePieceNotation(move);

  const notationLetterIndex = letters.indexOf(piece);
  if (notationLetterIndex !== -1) {
    if (isBlackMove) {
      return [symbols_black[notationLetterIndex], direction];
    } else {
      return [symbols_white[notationLetterIndex], direction];
    }
  }

  return [null, piece + direction];
};
export const splitMovePieceNotation = (move) => {
  return [move.move[0], move.move.slice(1)];
};

export const convertNagsToSymbols = (move) => {
  if (!move.nags) return '';
  let convertedNags = [];
  move.nags.forEach((nag) => {
    switch (nag) {
      case '$1':
        convertedNags.push('\u0021');
        break;
      case '$2':
        convertedNags.push('\u003F');
        break;
      case '$3':
        convertedNags.push('\u203C');
        break;
      case '$4':
        convertedNags.push('\u2047');
        break;
      case '$5':
        convertedNags.push('\u2049');
        break;
      case '$6':
        convertedNags.push('\u2048');
        break;
      case '$11':
        convertedNags.push('\u003D');
        break;
      case '$13':
        convertedNags.push('\u221E');
        break;
      case '$16':
        convertedNags.push('\u00B1');
        break;
      case '$17':
        convertedNags.push('\u2213');
        break;
      case '$18':
        convertedNags.push('\u002B\u002D');
        break;
      case '$19':
        convertedNags.push('\u002D\u002B');
        break;
      case '$132':
        convertedNags.push('\u21C6');
        break;
      default:
        console.log('Did not match with available nags');
    }
  });
  return convertedNags.join(' ');
};

export const addNagInMove = (move, nag) => {
  if (!move.nags) {
    move.nags = [nag];
    return;
  }
  const valueNag = ['$3', '$1', '$5', '$6', '$2', '$4'];
  const positionNag = ['$18', '$16', '$11', '$13', '$17', '$19', '$132'];

  const isNewValueNag = valueNag.includes(nag);
  const isNewPositionNag = positionNag.includes(nag);

  const isValueNag = valueNag.includes(move.nags[0]);
  const isPositionNag = positionNag.includes(move.nags[0]);

  if (move.nags.length === 1) {
    if ((isValueNag && isNewValueNag) || (isPositionNag && isNewPositionNag)) {
      if (move.nags[0] === nag) {
        delete move.nags;
      } else {
        move.nags[0] = nag;
      }
      return;
    }
    if (isValueNag && isNewPositionNag) {
      move.nags.push(nag);
      return;
    }
    if (isPositionNag && isNewValueNag) {
      move.nags.push(move.nags[0]);
      move.nags[0] = nag;
      return;
    }
  }
  if (move.nags.length === 2) {
    if (isNewValueNag) {
      if (move.nags[0] === nag) {
        move.nags.shift();
      } else {
        move.nags[0] = nag;
      }
      return;
    }
    if (isNewPositionNag) {
      if (move.nags[1] === nag) {
        move.nags.pop();
      } else {
        move.nags[1] = nag;
      }
      return;
    }
  }
};

export const addNagInPgn = (pgn, indexedPath, nag) => {
  const { ravInd, moveInd } = indexedPath[0];
  const isFirstLayer = pgn.moves && pgn.moves[moveInd].layer === 0;

  if (indexedPath.length === 1 && isFirstLayer) {
    addNagInMove(pgn.moves[moveInd], nag);
    return;
  }

  if (indexedPath.length > 1) {
    let nextPgn = isFirstLayer
      ? pgn.moves[moveInd]
      : pgn.ravs[ravInd].moves[moveInd];
    indexedPath = indexedPath.slice(1);
    return addNagInPgn(nextPgn, indexedPath, nag);
  } else {
    addNagInMove(pgn.ravs[ravInd].moves[moveInd], nag);
  }
};

export const deleteMvComment = (pgn, indexedPath) => {
  const { ravInd, moveInd } = indexedPath[0];
  const isFirstLayer = pgn.moves && pgn.moves[moveInd].layer === 0;

  if (indexedPath.length === 1 && isFirstLayer) {
    pgn.moves[moveInd].comments = [];
    return;
  }

  if (indexedPath.length > 1) {
    let nextPgn = isFirstLayer
      ? pgn.moves[moveInd]
      : pgn.ravs[ravInd].moves[moveInd];
    indexedPath = indexedPath.slice(1);
    return deleteMvComment(nextPgn, indexedPath);
  } else {
    pgn.ravs[ravInd].moves[moveInd].comments = [];
  }
};

export const deleteMvNag = (pgn, indexedPath) => {
  const { ravInd, moveInd } = indexedPath[0];
  const isFirstLayer = pgn.moves && pgn.moves[moveInd].layer === 0;

  if (indexedPath.length === 1 && isFirstLayer) {
    delete pgn.moves[moveInd].nags;
    return;
  }

  if (indexedPath.length > 1) {
    let nextPgn = isFirstLayer
      ? pgn.moves[moveInd]
      : pgn.ravs[ravInd].moves[moveInd];
    indexedPath = indexedPath.slice(1);
    return deleteMvNag(nextPgn, indexedPath);
  } else {
    delete pgn.ravs[ravInd].moves[moveInd].nags;
  }
};

export const addCommentToMV = (pgn, indexedPath, comment) => {
  const { ravInd, moveInd } = indexedPath[0];
  const isFirstLayer = pgn.moves && pgn.moves[moveInd].layer === 0;

  if (indexedPath.length === 1 && isFirstLayer) {
    const commentObj = { text: comment };
    pgn.moves[moveInd].comments.push(commentObj);
    return;
  }

  if (indexedPath.length > 1) {
    let nextPgn = isFirstLayer
      ? pgn.moves[moveInd]
      : pgn.ravs[ravInd].moves[moveInd];
    indexedPath = indexedPath.slice(1);
    return addCommentToMV(nextPgn, indexedPath, comment);
  } else {
    const commentObj = { text: comment };
    pgn.ravs[ravInd].moves[moveInd].comments.push(commentObj);
  }
};

export const checkForMainLineVariation = (moves) => {
  let hasVariation = false;
  if (moves) {
    moves.forEach((move) => {
      if (move.ravs) {
        hasVariation = true;
      }
    });
  }
  return hasVariation;
};

export const checkSubravs = (move) => {
  let hasSubvars = false;
  move.ravs.forEach((rav) => {
    rav.moves.forEach((move) => {
      if (move.ravs) {
        hasSubvars = true;
      }
    });
  });
  return hasSubvars;
};

const isVariationBlackMove = (move) =>
  move.prev_move && move.move_number === move.prev_move.move_number;

const formatMoveNumber = (move) => {
  let moveNumber = move.move_number ? move.move_number + '. ' : '';

  if (!move.move_number && move.prev_move && move.prev_move.ravs) {
    moveNumber = move.prev_move.move_number;
  }

  const isFirstMove = move.prev_move && move.layer !== move.prev_move.layer;
  if (isFirstMove && isVariationBlackMove(move)) {
    moveNumber = (moveNumber + '').trimEnd() + '.. ';
  } else if (!move.move_number && move.prev_move && move.prev_move.ravs) {
    moveNumber = (moveNumber + '').trimEnd() + '... ';
  } else if (
    move.move_number &&
    move.prev_move &&
    move.prev_move.ravs &&
    move.prev_move.move_number
  ) {
    moveNumber = (moveNumber + '').trimEnd() + '.. ';
  }

  return moveNumber;
};

export const getMoveFullInfo = (move, symbolModeEnabled) => {
  const moveNumber = formatMoveNumber(move);
  const [piece, direction] = symbolModeEnabled
    ? convertPieceToSymbol(move)
    : splitMovePieceNotation(move);
  const moveNags = convertNagsToSymbols(move);
  const moveComments = addCommentsInNotation(move);
  const moveFullInfo = {
    moveNumber: moveNumber,
    movePiece: piece,
    moveDirection: direction,
    moveNags: moveNags,
    moveComments: moveComments,
  };
  return moveFullInfo;
};

export const getLineIndexLetter = (lineIndex, parentIndex) => {
  let lineIndexLetter = '';

  if (!parentIndex.length) {
    return UPPERCASE_ALPHABET[lineIndex];
  }

  if (parentIndex.length % 3 === 0) {
    lineIndexLetter = parentIndex + UPPERCASE_ALPHABET[lineIndex];
  } else if (parentIndex.length % 3 === 1) {
    lineIndexLetter = parentIndex + (lineIndex + 1);
  } else {
    lineIndexLetter = parentIndex + ALPHABET[lineIndex];
  }
  return lineIndexLetter;
};

export const sortDataByGameCount = (data) => {
  data.sort((a, b) => {
    return b.games_count - a.games_count;
  });
  return data;
};

export const getReferencesUrl = (fen, searchParams, urlFunc) => {
  let url = `${CLOUD_URL}/dbsearch/${urlFunc}?${'fen=' + fen}`;

  if (!searchParams) return url;

  if (searchParams.whitePlayer && searchParams.whitePlayer.length) {
    url += `&white_name=${searchParams.whitePlayer}`;
  }

  if (searchParams.blackPlayer && searchParams.blackPlayer.length) {
    url += `&black_name=${searchParams.blackPlayer}`;
  }

  if (searchParams.whiteElo && searchParams.whiteElo.length) {
    url += `&white_elo_min=${searchParams.whiteElo}`;
  }

  if (searchParams.blackElo && searchParams.blackElo.length) {
    url += `&black_elo_min=${searchParams.blackElo}`;
  }

  if (searchParams.ignoreColor === true || searchParams.ignoreColor === false) {
    url += `&ignore_color=${searchParams.ignoreColor}`;
  }

  if (searchParams.resultWins === true || searchParams.resultWins === false) {
    url += `&wins=${searchParams.resultWins}`;
  }

  if (
    searchParams.resultLosses === true ||
    searchParams.resultLosses === false
  ) {
    url += `&loses=${searchParams.resultLosses}`;
  }

  if (searchParams.resultDraws === true || searchParams.resultDraws === false) {
    url += `&draws=${searchParams.resultDraws}`;
  }

  if (searchParams.dateMin && searchParams.dateMin.length) {
    const enteredDateMin = searchParams.dateMin.replaceAll('-', '.');
    url += `&date_min=${enteredDateMin}`;
  }

  if (searchParams.dateMax && searchParams.dateMax.length) {
    const enteredDateMax = searchParams.dateMax.replaceAll('-', '.');
    url += `&date_max=${enteredDateMax}`;
  }

  if (
    urlFunc === 'get_games' &&
    searchParams.order_by &&
    Math.abs(searchParams.order) &&
    searchParams.order_by.length
  ) {
    url += `&order_by=${searchParams.order_by}&order=${searchParams.order}`;
  }

  return url;
};

export const hasSearchParam = (searchParams) => {
  return Object.keys(searchParams).length !== 0;
};

export const convertResult = (result) => {
  if (result === '1') {
    return '1-0';
  } else if (result === '0') {
    return '0-1';
  } else if (result === '1/2') {
    return '1/2-1/2';
  }
};

export const modifySearchParam = (searchParams, param) => {
  if (
    !searchParams['ignoreColor'] &&
    param === 'whitePlayer' &&
    searchParams[param].length
  ) {
    return `\u2658 ${searchParams[param]}`;
  }
  if (
    !searchParams['ignoreColor'] &&
    param === 'blackPlayer' &&
    searchParams[param].length
  ) {
    return `\u265E ${searchParams[param]}`;
  }
  if (param === 'whiteElo' && searchParams[param].length) {
    return `White Elo Min: ${searchParams[param]}`;
  }
  if (param === 'blackElo' && searchParams[param].length) {
    return `Black Elo Min: ${searchParams[param]}`;
  }
  if (param === 'dateMin' && searchParams[param].length) {
    return `Date Min: ${searchParams[param]}`;
  }
  if (param === 'dateMax' && searchParams[param].length) {
    return `Date Max: ${searchParams[param]}`;
  }
  if (
    param !== 'ignoreColor' &&
    param !== 'resultWins' &&
    param !== 'resultDraws' &&
    param !== 'resultLosses' &&
    searchParams[param].length
  ) {
    return searchParams[param];
  } else {
    if (param === 'resultDraws' && searchParams[param]) {
      return 'Draws';
    }
    if (param === 'resultWins' && searchParams[param]) {
      return 'Wins';
    }
    if (param === 'resultLosses' && searchParams[param]) {
      return 'Losses';
    }
  }
};

export const isQuickSearch = (searchParams, param) => {
  return (
    param == 'whitePlayer' &&
    searchParams.ignoreColor &&
    !searchParams.resultWins &&
    !searchParams.resultDraws &&
    !searchParams.resultLosses &&
    !searchParams.blackPlayer.length &&
    !searchParams.whiteElo.length &&
    !searchParams.blackElo.length &&
    !searchParams.dateMin.length &&
    !searchParams.dateMax.length
  );
};

export default {
  uuidv4,
  modifyMoves,
  getMovesLine,
  getRowContainingMove,
  addMove,
  getPgnString,
  scoreInNotation,
  addScorePGN,
  findRootVariations,
  findIndexedPath,
  findLast2MovesOfIndexedPath,
  deleteRemainingMV,
  deleteVarAndReturnParent,
  convertNagsToSymbols,
  deleteMvComment,
  deleteMvNag,
  addCommentToMV,
  addCommentsInNotation,
  checkForMainLineVariation,
  checkSubravs,
  getMoveFullInfo,
  getLineIndexLetter,
  sortDataByGameCount,
  getReferencesUrl,
  convertResult,
  modifySearchParam,
  isQuickSearch,
};
