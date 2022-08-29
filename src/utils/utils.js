export function recoverLastSession(setPgn) {
  const lastPgn = sessionStorage.getItem('chessify_pgn_string');
  if (lastPgn) {
    let loadLast = window.confirm('Load the last game?');
    if (loadLast === true) setPgn(lastPgn);
    else sessionStorage.removeItem('chessify_pgn_string');
  }
}

export function recoverPgn(setPgn) {
  const lastPgn = sessionStorage.getItem('chessify_pgn_string');
  if (lastPgn) {
    setPgn(lastPgn);
  }
}

export function showEngineInfo(type) {
  switch (type) {
    case 'Normal':
      return 'The server will connect in 2-3 minutes. Meanwhile, you can analyze on 10MN/s server for Free.';
    case 'Delayed':
      return 'Sorry, additional 2-3 minutes are needed for server allocation.';
    case 'Try Later':
      return 'Sorry, but this time your order could not be completed. Please try later.';
    default:
      return 'Free analysis on a server of up to 100,000 kN/s speed';
  }
}

export default {
  recoverLastSession,
  recoverPgn,
  showEngineInfo,
};
