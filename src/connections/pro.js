export default function connectToPro(
  channel,
  fen,
  onConnect,
  onGetAnalyze,
  onDisconnect,
  numPV
) {
  const socket = new WebSocket(channel);
  socket.onopen = () => {
    socket.send(`stop`);
    socket.send(`setoption name MultiPV value ${numPV}`);
    socket.send(`position fen ${fen}`);
    socket.send('go infinite');
    onConnect(socket);
  };

  socket.onmessage = (event) => {
    onGetAnalyze(event.data);
  };

  socket.onclose = () => {
    onDisconnect(socket);
  };
  socket.onerror = console.error;
}
