import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import {
  setVariationOpt,
  promoteVariation,
  deleteVariation,
} from '../../actions/board';

const mapStateToProps = (state) => {
  return {
    activeMove: state.board.activeMove,
  };
};

const VariationOptionsModal = ({
  activeMove,
  isOpen,
  setVariationOpt,
  promoteVariation,
  deleteVariation,
}) => {
  const mainLineHandler = (activeMove, promoteVariation) => {
    promoteVariation(activeMove);
    setVariationOpt(false);
  };
  const overwriteHandler = (activeMove, promoteVariation, deleteVariation) => {
    promoteVariation(activeMove);
    while (activeMove.ravs) {
      deleteVariation(activeMove.ravs[0].moves[0]);
    }
    setVariationOpt(false);
  };

  const insertHandler = (activeMove, promoteVariation, deleteVariation) => {
    promoteVariation(activeMove);
    const demotedVarFirstMove =
      activeMove.ravs[activeMove.ravs.length - 1].moves[0];
    deleteVariation(demotedVarFirstMove);
    setVariationOpt(false);
  };

  return (
    <Modal
    size="sm"
      show={isOpen}
      onHide={() => {
        setVariationOpt(false);
      }}
      keyboard={true}
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="modal-body">
        <div className="d-flex flex-column justify-content-center">
        <Button
            className="game-format-apply-btn var-opt-btn"
            variant="primary"
            onClick={() => {
              setVariationOpt(false);
            }}
          >
            New Variation
          </Button>
          <Button
            className="game-format-apply-btn var-opt-btn"
            variant="primary"
            onClick={() => {
              mainLineHandler(activeMove, promoteVariation);
            }}
          >
            New Main Line
          </Button>
          <Button
            className="game-format-apply-btn var-opt-btn"
            variant="primary"
            onClick={() => {
              overwriteHandler(activeMove, promoteVariation, deleteVariation);
            }}
          >
            Overwrite
          </Button>
          <Button
            className="game-format-apply-btn var-opt-btn"
            variant="primary"
            onClick={() => {
              insertHandler(activeMove, promoteVariation, deleteVariation);
            }}
          >
            Insert
          </Button>
          <Button
            className="game-format-btn var-opt-btn"
            variant="primary"
            onClick={() => {
              setVariationOpt(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps, {
  setVariationOpt,
  promoteVariation,
  deleteVariation,
})(VariationOptionsModal);
