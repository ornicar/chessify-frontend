import React from 'react';
import { connect } from 'react-redux';
import {
  IoIosSquare,
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdSkipBackward,
  IoMdSkipForward,
} from 'react-icons/io';
import { MdTimeline } from 'react-icons/md';

import { setActiveMove } from '../../actions/board';
import { getRowContainingMove } from '../../utils/pgn-viewer';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

const mapStateToProps = (state) => {
  return {
    pgn: state.board.pgn,
    activeMove: state.board.activeMove,
    freeAnalyzer: state.cloud.freeAnalyzer,
    proAnalyzers: state.cloud.proAnalyzers,
  };
};

const checkIsAnalysing = (freeAnalyzer, proAnalyzers) => {
  if (!freeAnalyzer && !proAnalyzers) return false;

  if (!proAnalyzers) {
    return freeAnalyzer.isAnalysing;
  } else {
    return proAnalyzers.some((pa) => pa.isAnalysing);
  }
};

class VariationActions extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  handleKeyDown(event) {
    switch (event.key) {
      case ARROW_LEFT: {
        this.goToPrevMove();
        break;
      }
      case ARROW_RIGHT: {
        this.goToNextMove();
        break;
      }
      default: {
        break;
      }
    }
  }

  goToPrevMove() {
    const { activeMove, setActiveMove } = this.props;

    if (!activeMove) return;

    setActiveMove(activeMove.prev_move);
  }

  goToNextMove() {
    const { activeMove, pgn, setActiveMove } = this.props;
    if (!pgn.moves) return;

    if (!activeMove) {
      setActiveMove(pgn.moves[0]);
      return;
    }

    const row = getRowContainingMove(pgn.moves, activeMove);

    const curMoveIndexInRow = row.findIndex(
      (m) => m.move_id === activeMove.move_id
    );

    if (row[curMoveIndexInRow + 1]) setActiveMove(row[curMoveIndexInRow + 1]);
  }

  goToLastMove() {
    const { pgn, setActiveMove } = this.props;

    if (pgn.moves) setActiveMove([...pgn.moves].pop());
  }

  goToFirstMove() {
    const { pgn, setActiveMove } = this.props;

    if (pgn.moves) setActiveMove(pgn.moves[0]);
  }

  render() {
    const { start, stop, freeAnalyzer, proAnalyzers } = this.props;
    const isAnalysing = checkIsAnalysing(freeAnalyzer, proAnalyzers);

    return (
      <React.Fragment>
        <button onClick={() => this.goToFirstMove()}>
          <IoMdSkipBackward size={15} />
        </button>
        <button onClick={() => this.goToPrevMove()}>
          <IoIosArrowBack size={15} />
        </button>
        {isAnalysing ? (
          <button onClick={stop} style={{ height: 50, width: 50 }}>
            <IoIosSquare size={25} />
          </button>
        ) : (
          <button
            onClick={start}
            style={{ height: 50, width: 50 }}
            title="Start Analyzing"
          >
            <MdTimeline size={30} />
          </button>
        )}
        <button onClick={() => this.goToNextMove()}>
          <IoIosArrowForward size={15} />
        </button>
        <button onClick={() => this.goToLastMove()}>
          <IoMdSkipForward size={15} />
        </button>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, { setActiveMove })(VariationActions);
