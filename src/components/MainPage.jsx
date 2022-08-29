import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ChessboardWebgl from './taxtak/index';
import { signInAnonymously } from '../firebase';
import { setToken, connectToFree } from '../actions/cloud';
import { setPgn } from '../actions/board';
import { recoverLastSession } from '../utils/utils';

const MainPage = ({ setToken, connectToFree, setPgn }) => {
  useEffect(() => {
    signInAnonymously().then((idToken) => {
      setToken(idToken);
      recoverLastSession(setPgn);
      // connectToFree();
    });
  });

  return <ChessboardWebgl />;
};

export default connect(null, { setToken, connectToFree, setPgn })(MainPage);
