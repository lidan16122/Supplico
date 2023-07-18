import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function CustomModal({ title, body, btn, defaultShow }) {
  const [show, setShow] = useState(defaultShow);
  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        {btn ? (
          btn
        ) : (
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
