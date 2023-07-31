import axios from "axios";
import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { SupplicoWebAPI_URL } from "../../utils/settings";

export default function UpdatePallets({updatePallets , setUpdatePallets, orderid, getOrder}) {
    const [pallets, setPallets] = useState(0);

    async function OnUpdatePallets(){
        if (pallets > 0) {
            axios.put(SupplicoWebAPI_URL+ "/orders/pallets",{
                orderid: orderid,
                pallets: pallets,
            })
            .then((res) => {
                console.log(res);
                setUpdatePallets(false);
                getOrder();
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
  return (
    <>
      <Modal show={updatePallets} onHide={setUpdatePallets}>
        <Modal.Header>
          <Modal.Title>Pallets Updating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={OnUpdatePallets} method="put">
            <Form.Group>
                <Form.Label>
                    Pallets Count:
                </Form.Label>
                <Form.Control type="number" value={pallets} onChange={(e) => setPallets(e.target.value)} required>
                </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" onClick={OnUpdatePallets}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
