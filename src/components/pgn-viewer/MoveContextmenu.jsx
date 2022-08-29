import React from 'react';
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

const mapStateToProps = (state) => {
  return {
    activeMove: state.board.activeMove,
  };
};

const MoveContextmenu = (props) => {
  const {
    activeMove,
    deleteVarsAndComments,
    deleteMoveComment,
    deleteMoveNag,
    deleteRemainingMoves,
    addNags,
    promoteVariation,
    deleteVariation,
    setCommentField,
    top,
    left,
  } = props;

  return (
    <ul className="move-contextmenu" style={{ left: left, top: top }}>
      <li className="menu-item">
        <button
          type="button"
          className="menu-btn"
          onClick={() => {
            promoteVariation(activeMove);
          }}
        >
          <span>Promote Variation</span>{' '}
        </button>
      </li>
      <li className="menu-item">
        <button type="button" className="menu-btn">
          <span>Delete</span>
          <span>
            <img
              height={14}
              src={require('../../../public/assets/images/toolbar-symbols/arrow-extend.svg')}
              style={{ marginLeft: 10 }}
              alt=""
            />
          </span>
        </button>
        <ul className="move-contextmenu move-contextmenu-del">
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                deleteRemainingMoves(activeMove);
              }}
            >
              Delete Remaining Moves
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                deleteVariation(activeMove);
              }}
            >
              Delete Variation
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                deleteMoveComment(activeMove);
              }}
            >
              Delete Move Comments
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                deleteMoveNag(activeMove);
              }}
            >
              Delete Position Values
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                deleteVarsAndComments();
              }}
            >
              Delete Variations and Comments
            </button>
          </li>
        </ul>
      </li>
      <hr className="divider" />
      <li className="menu-item">
        <button
          type="button"
          className="menu-btn"
          onClick={() => {
            setCommentField(true);
          }}
        >
          <span>Add Comment</span>
        </button>
      </li>
      <li className="menu-item">
        <button type="button" className="menu-btn">
          <span>Set Value for Move</span>
          <span className="menu-shortcuts">
            {'\u003F '}
            {'\u0021 '}
            <img
              height={14}
              src={require('../../../public/assets/images/toolbar-symbols/arrow-extend.svg')}
              style={{ marginLeft: 10 }}
              alt=""
            />
          </span>
        </button>
        <ul className="move-contextmenu move-contextmenu-nags">
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$3');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/very-good-move.svg')}
                className="gray-tool"
                alt="Very good move"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$1');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/good-move.svg')}
                className="gray-tool"
                alt="Good move"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$5');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/interesting-move.svg')}
                className="gray-tool"
                alt="Interesting move"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$6');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/dubious-move.svg')}
                className="gray-tool"
                alt="Dubious move"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$2');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/bad-move.svg')}
                className="gray-tool"
                alt="Bad move"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$4');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/very-bad-move.svg')}
                className="gray-tool"
                alt="Very bad move"
              />
            </button>
          </li>
        </ul>
      </li>
      <li className="menu-item">
        <button type="button" className="menu-btn">
          <span>Set Value to Position</span>
          <span className="menu-shortcuts">
            {'\u002B\u002D '}
            {'\u003D '}
            <img
              height={14}
              src={require('../../../public/assets/images/toolbar-symbols/arrow-extend.svg')}
              style={{ marginLeft: 10 }}
              alt=""
            />
          </span>
        </button>
        <ul className="move-contextmenu move-contextmenu-nags move-contextmenu-nags-game">
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$18');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/white-winning.svg')}
                className="gray-tool"
                alt="White winning"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$16');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/white-better.svg')}
                className="gray-tool"
                alt="White better"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$11');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/even.svg')}
                className="gray-tool"
                alt="Even"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$13');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/unclear.svg')}
                className="gray-tool"
                alt="Unclear"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$17');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/black-better.svg')}
                className="gray-tool"
                alt="Black better"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$19');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/black-winning.svg')}
                className="gray-tool"
                alt="Black winning"
              />
            </button>
          </li>
          <li className="menu-item">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                addNags(activeMove, '$132');
              }}
            >
              <img
                src={require('../../../public/assets/images/toolbar-symbols/counterplay.svg')}
                className="gray-tool"
                alt="Counterplay"
              />
            </button>
          </li>
        </ul>
      </li>
    </ul>
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
})(MoveContextmenu);
