import io from 'socket.io-client';
import { CLOUD_URL } from '../constants/cloud-params';

export default function connectToFree(token, onConnect, onGetAnalyze) {
  console.log('PARAMS: ', token, onConnect, onGetAnalyze);
  const socket = io(CLOUD_URL, {
    transports: ['websocket', 'flashsocket'],
    transportOptions: {
      polling: {
        extraHeaders: {
          'Access-Token': token,
        },
      },
    },
  });

  socket.on('connect', () => {
    console.log('FREE FREE CLOUD ANALYSIS CONNECT: ', socket.id);
    onConnect(socket);
  });

  socket.on('get_analyze', function (data) {
    console.log('GET FREE ANALYSIS: ', data);
    onGetAnalyze(data);
  });
}
