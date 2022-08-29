import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import DesktopPPGViewer from './DesktopPGNViewer';
import MobilePGNViewer from './MobilePGNViewer';

import { setVideos } from '../../actions/cloud';
import { getVideos } from '../../utils/api';

const mapStateToProps = (state) => {
  return {
    fen: state.board.fen,
    token: state.cloud.token,
    videos: state.cloud.videos,
    freeAnalyzer: state.cloud.freeAnalyzer,
    proAnalyzers: state.cloud.proAnalyzers,
    numPV: state.cloud.numPV,
  };
};

const PGNViewer = (props) => {
  const {
    fen,
    token,
    videos,
    setVideos,
    freeAnalyzer,
    proAnalyzers,
    numPV,
  } = props;

  const [fenToAnalyze, setFenToAnalyze] = useState(fen);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const needAnalyzeCheck =
    proAnalyzers &&
    proAnalyzers.length === 1 &&
    proAnalyzers[0].temp &&
    proAnalyzers[0].isSubscription;

  ////
  // ANALYZING POSITION
  ////
  const handleAnalyze = () => {
    if (!freeAnalyzer && !proAnalyzers) {
      return;
    }

    if (!proAnalyzers) {
      const data = {
        command: 'go',
        fen,
        token,
        sub: false,
        numPV: numPV,
      };

      freeAnalyzer.analyzer.emit('analyze', data);
    } else {
      proAnalyzers.forEach((pa) => {
        pa.analyzer.send('stop');
        pa.analyzer.send(`setoption name MultiPV value ${numPV}`);
        pa.analyzer.send(`position fen ${fen}`);
        pa.analyzer.send('go infinite');
      });
    }

    setFenToAnalyze(fen);
  };

  ////
  // STOP ANALYZE
  ////
  const handleStopAnalyze = () => {
    if (!freeAnalyzer && !proAnalyzers) return;

    if (!proAnalyzers) {
      const data = {
        command: 'stop',
        fen,
        token,
        sub: false,
        numPV: numPV,
      };

      freeAnalyzer.analyzer.emit('analyze', data);
    } else {
      proAnalyzers.forEach((pa) => {
        pa.analyzer.send('stop');
      });
    }
  };

  ////
  // GETTING VIDEOS
  ////
  const handleGetVideos = () => {
    const shortFen = fen.split(' ')[0];
    setLoadingVideos(true);
    getVideos(token, shortFen)
      .then((videos) => {
        setVideos(videos.video);
        setLoadingVideos(false);
      })
      .catch((e) => {
        setLoadingVideos(false);
        console.error(e);
      });
  };

  return (
    <React.Fragment>
      <BrowserView>
        <DesktopPPGViewer
          fenToAnalyze={fenToAnalyze}
          setFenToAnalyze={setFenToAnalyze}
          handleAnalyze={handleAnalyze}
          handleStopAnalyze={handleStopAnalyze}
          videos={videos}
          handleGetVideos={handleGetVideos}
          loadingVideos={loadingVideos}
        />
      </BrowserView>
      <MobileView>
        <MobilePGNViewer
          fenToAnalyze={fenToAnalyze}
          setFenToAnalyze={setFenToAnalyze}
          handleAnalyze={handleAnalyze}
          handleStopAnalyze={handleStopAnalyze}
          videos={videos}
          handleGetVideos={handleGetVideos}
          loadingVideos={loadingVideos}
        />
      </MobileView>
      {/* {needAnalyzeCheck && <SubAnalyzeCheckerModal stop={handleStopAnalyze} />} */}
    </React.Fragment>
  );
};

export default connect(mapStateToProps, { setVideos })(PGNViewer);
