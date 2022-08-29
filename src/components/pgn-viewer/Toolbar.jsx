import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  addNags,
  deleteRemainingMoves,
  deleteVariation,
  deleteVarsAndComments,
  promoteVariation,
  deleteMoveComment,
  deleteMoveNag,
  addCommentToMove,
} from '../../actions/board';

const tools = [
  {
    nag: '$3',
    symbol: require('../../../public/assets/images/toolbar-symbols/very-good-move.svg'),
    title: 'Very Good Move',
  },
  {
    nag: '$1',
    symbol: require('../../../public/assets/images/toolbar-symbols/good-move.svg'),
    title: 'Good Move',
  },
  {
    nag: '$5',
    symbol: require('../../../public/assets/images/toolbar-symbols/interesting-move.svg'),
    title: 'Interesting Move',
  },
  {
    nag: '$6',
    symbol: require('../../../public/assets/images/toolbar-symbols/dubious-move.svg'),
    title: 'Dubious Move',
  },
  {
    nag: '$2',
    symbol: require('../../../public/assets/images/toolbar-symbols/bad-move.svg'),
    title: 'Bad Move',
  },
  {
    nag: '$4',
    symbol: require('../../../public/assets/images/toolbar-symbols/very-bad-move.svg'),
    title: 'Very Bad Move',
  },
  {
    nag: '$18',
    symbol: require('../../../public/assets/images/toolbar-symbols/white-winning.svg'),
    title: 'White is Winning',
  },
  {
    nag: '$16',
    symbol: require('../../../public/assets/images/toolbar-symbols/white-better.svg'),
    title: 'White is Better',
  },
  {
    nag: '$11',
    symbol: require('../../../public/assets/images/toolbar-symbols/even.svg'),
    title: 'Even',
  },
  {
    nag: '$13',
    symbol: require('../../../public/assets/images/toolbar-symbols/unclear.svg'),
    title: 'Unclear',
  },
  {
    nag: '$17',
    symbol: require('../../../public/assets/images/toolbar-symbols/black-better.svg'),
    title: 'Black is Better',
  },
  {
    nag: '$19',
    symbol: require('../../../public/assets/images/toolbar-symbols/black-winning.svg'),
    title: 'Black is Winning',
  },
  {
    nag: '$132',
    symbol: require('../../../public/assets/images/toolbar-symbols/counterplay.svg'),
    title: 'Counterplay',
  },
];

const mapStateToProps = (state) => {
  return {
    activeMove: state.board.activeMove,
  };
};

const Toolbar = (props) => {
  const {
    activeMove,
    deleteVarsAndComments,
    deleteRemainingMoves,
    addNags,
    promoteVariation,
    deleteVariation,
    isCommentField,
    setCommentField,
    addCommentToMove,
  } = props;

  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setCommentText(commentText);
  }, [commentText]);

  return (
    <div className="toolbar">
      <div className="mt--2">
        <button
          title="Promote Variation"
          className="toolbar-item"
          onClick={() => {
            promoteVariation(activeMove);
          }}
        >
          <img
            height={35}
            src={require('../../../public/assets/images/toolbar-symbols/promote.svg')}
            alt="Promote"
          />
        </button>
        <button
          title="Delete Variation"
          className="toolbar-item"
          onClick={() => {
            deleteVariation(activeMove);
          }}
        >
          <img
            height={35}
            src={require('../../../public/assets/images/toolbar-symbols/delete-variation.svg')}
            alt="Delete Var"
          />
        </button>
        <button
          title="Delete Remaining Moves"
          className="toolbar-item"
          onClick={() => {
            deleteRemainingMoves(activeMove);
          }}
        >
          <img
            height={35}
            src={require('../../../public/assets/images/toolbar-symbols/delete-remaining-moves.svg')}
            alt="Delete Remaining"
          />
        </button>
        {tools.map((tool) => {
          return (
            <button
              title={tool.title}
              key={tool.nag}
              className="toolbar-item"
              onClick={() => {
                addNags(activeMove, tool.nag);
              }}
            >
              <img height={35} width={35} src={tool.symbol} alt={tool.nag} />
            </button>
          );
        })}
        <button
          title="Delete All Variations and Comments"
          className="toolbar-item"
          onClick={() => {
            deleteVarsAndComments();
          }}
        >
          <img
            height={35}
            src={require('../../../public/assets/images/toolbar-symbols/delete-variations-comments.svg')}
            alt="Del"
          />
        </button>
      </div>
      {isCommentField && activeMove.move ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCommentToMove(activeMove, commentText);
            setCommentField(false);
            setCommentText('');
          }}
        >
          <input
            type="text"
            name="commentMv"
            autoFocus
            className="comment-input"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="comment-btn comment-btn-apply" type="submit">
            <span className="button-text">Apply</span>
          </button>
          <button
            className="comment-btn comment-btn-close"
            onClick={() => {
              setCommentField(false);
              setCommentText('');
            }}
          >
            <span className="button-text">Close</span>
          </button>
        </form>
      ) : (
        <></>
      )}
    </div>
  );
};

export default connect(mapStateToProps, {
  deleteRemainingMoves,
  deleteMoveComment,
  deleteMoveNag,
  deleteVarsAndComments,
  addNags,
  deleteVariation,
  promoteVariation,
  addCommentToMove,
})(Toolbar);
