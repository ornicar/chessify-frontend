import React from 'react';
import {
  MdRotate90DegreesCcw,
  MdLayers,
  MdDelete,
  MdMusicNote,
} from 'react-icons/md';
import { INITIAL_FEN, CLEAR_FEN } from '../../constants/board-params';

const QuickEdit = ({
  orientation,
  soundMode,
  updateSoundMode,
  setFen,
  setBoardOrientation,
}) => {
  const handleSoundToggle = () => {
    soundMode === 'on' ? updateSoundMode('off') : updateSoundMode('on');
  };
  return (
    <div className="mb-2">
      <button
        className="white-button"
        onClick={() => {
          setBoardOrientation(orientation === 'white' ? 'black' : 'white');
        }}
      >
        <MdRotate90DegreesCcw size={18} /> Flip
      </button>
      <button
        className="white-button ml-2"
        onClick={() => {
          window.confirm(
            'You are going to reset the chessboard. Are you sure?'
          ) && setFen(INITIAL_FEN);
        }}
      >
        <MdLayers size={18} /> Reset
      </button>
      <button
        className="white-button ml-2"
        onClick={() => {
          window.confirm(
            'You are going to clear the chessboard. Are you sure?'
          ) && setFen(CLEAR_FEN);
        }}
      >
        <MdDelete size={18} /> Clear
      </button>
      <button
        className="white-button ml-2"
        onClick={() => {
          handleSoundToggle();
        }}
      >
        <MdMusicNote size={18} /> {soundMode === 'off' ? 'Turn On' : 'Turn Off'}
      </button>
    </div>
  );
};

export default QuickEdit;
