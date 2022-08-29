import React from 'react';
import { MdEdit, MdCheck } from 'react-icons/md';
import { recoverPgn } from '../../utils/utils';

const EditArea = ({
  fen,
  orientation,
  setFen,
  setEditMode,
  editMode,
  setBoardOrientation,
  setPgn,
}) => {
  const switchEditMode = () => {
    window.LichessEditor.setFen(fen);
    window.LichessEditor.setOrientation(orientation);
    setEditMode(!editMode);
  };
  const switchToBoard = () => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const fenFromUrl = url.searchParams.get('fen');
    const orientation = window.LichessEditor.getOrientation();
    if (fenFromUrl && fenFromUrl !== fen) {
      window.confirm(
        'Your current position will be reseted. Are you sure you want set new position?'
      ) && setFen(fenFromUrl);
    } else {
      recoverPgn(setPgn);
    }
    setBoardOrientation(orientation);
    setEditMode(!editMode);
  };

  return (
    <div>
      {editMode ? (
        <button className="white-button done-editor-btn" onClick={switchToBoard}>
          <MdCheck size={20} />
          Done
        </button>
      ) : (
        <button
          className="white-button"
          onClick={switchEditMode}
        >
          <MdEdit size={18} />
          Edit
        </button>
      )}
    </div>
  );
};

export default EditArea;
