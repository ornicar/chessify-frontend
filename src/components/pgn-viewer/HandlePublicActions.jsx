import { useEffect } from 'react';
import { connect } from 'react-redux';
import { connectToPro } from '../../actions/cloud';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://mauser:4433',
  'https://qanduqarap.me',
  'https://chessify.me',
];

function HandlePublicActions(props) {
  const { connectToPro } = props;

  useEffect(() => {
    window.addEventListener('message', handleActions, false);

    return () => window.removeEventListener('message', handleActions);
  }, []);

  // const channels = [
  //   {
  //     name: 'asmfish',
  //     channel:
  //       'wss://chessify.me/analyzer/0/a5b05a14-a511-11ec-8e28-02420a6fde03',
  //   },
  // ];

  // connectToPro(channels);

  const handleActions = (e) => {
    try {
      if (!ALLOWED_ORIGINS.includes(e.origin)) {
        console.error(`Origin ${e.origin} is not allowed`);
        return;
      }

      console.log('HANDLED REMOTE MESSAGE: ', e.data);
      let data = null;
      try {
        data = JSON.parse(e.data);
      } catch (e) {
        data = e.data;
      }

      if (data.type && data.type === 'get_wss_channels') {
        connectToPro(data.channels);
      }

      console.log('PARSED REMOTE MESSAGE: ', data);
    } catch (e) {
      console.error('ERROR IN PUBLIC ACTION HANDLING: ', e);
    }
  };

  return null;
}

export default connect(null, { connectToPro })(HandlePublicActions);
