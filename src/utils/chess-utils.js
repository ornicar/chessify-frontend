import Chess from 'chess.js';

const chess = new Chess();

export function addMoveNumbersToSans(fullFen, moves) {
  /*
   * This function initially assumed that moves is a list of SAN moves
   */

  const fenParts = fullFen.split(' ');

  let moveNumber = parseInt(fenParts[5]);
  let whitesMove = fenParts[1] === 'w';

  return moves.map((mv, i) => {
    const moveObj = {
      move_number:
        i === 0 && !whitesMove
          ? `${moveNumber}...`
          : whitesMove
          ? `${moveNumber}.`
          : '',
      move: mv[0],
    };

    moveNumber = whitesMove ? moveNumber : moveNumber + 1;
    whitesMove = !whitesMove;

    return moveObj;
  });
}

export function parseProAnalysis(data, fen) {
  const whitesMove = fen.split(' ')[1] === 'w';
  const splitedStringAnalysisData = data.split(' ');

  // If 'bestmove' exists in string, it means analysis is successfully stopped
  const bestMoveIndex = splitedStringAnalysisData.findIndex(
    (str) => str === 'bestmove'
  );
  if (bestMoveIndex !== -1) return { stopped: true };

  const pvIndex = splitedStringAnalysisData.findIndex((str) => str === 'pv');
  if (pvIndex === -1) return null; // Moves don't exist in data

  // Get list of moves from Stockfish, parse it to sans with Chess.js and put each move in array to make it like Free Analysis data.
  const movesList = splitedStringAnalysisData.slice(pvIndex + 1);

  chess.load(fen);
  movesList.forEach((move) => {
    chess.move(move, { sloppy: true });
  });

  const pgn = chess.history().map((m) => [m]);

  // Which row of analysis to update
  const multiPvNumberIndex =
    splitedStringAnalysisData.findIndex((str) => str === 'multipv') + 1;
  const rowId = multiPvNumberIndex
    ? parseInt(splitedStringAnalysisData[multiPvNumberIndex]) - 1
    : 0;

  // Depth
  const depthIndex =
    splitedStringAnalysisData.findIndex((str) => str === 'depth') + 1;
  const depth = splitedStringAnalysisData[depthIndex];

  // NPS
  const npsIndex =
    splitedStringAnalysisData.findIndex((str) => str === 'nps') + 1;
  const nps = splitedStringAnalysisData[npsIndex];

  // NODES
  const nodesIndex =
    splitedStringAnalysisData.findIndex((str) => str === 'nodes') + 1;
  const nodes = splitedStringAnalysisData[nodesIndex];

  // TBHITS
  const tbhitsIndex =
    splitedStringAnalysisData.findIndex((str) => str === 'tbhits') + 1;
  const tbhits = splitedStringAnalysisData[tbhitsIndex];

  // Score
  let scoreIndex =
    splitedStringAnalysisData.findIndex((str) => str === 'cp') + 1;
  let score = whitesMove
    ? `${parseInt(splitedStringAnalysisData[scoreIndex]) / 100}`
    : `${-parseInt(splitedStringAnalysisData[scoreIndex]) / 100}`;
  if (!scoreIndex) {
    scoreIndex =
      splitedStringAnalysisData.findIndex((str) => str === 'mate') + 1;
    score = whitesMove
      ? `#${parseInt(splitedStringAnalysisData[scoreIndex])}`
      : `#${-parseInt(splitedStringAnalysisData[scoreIndex])}`;
  }

  return {
    rowId,
    depth,
    variation: {
      score,
      nps,
      pgn,
      nodes,
      tbhits,
    },
  };
}

export function downloadPGN(text) {
  let element = window.document.createElement('a');
  element.href = window.URL.createObjectURL(
    new Blob([text], { type: 'application/vnd.chess-pgn' })
  );

  const date = new Date();
  const name = `Chessify-${date.getMonth()}-${date.getDate()}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}.pgn`;

  element.download = name;

  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}
