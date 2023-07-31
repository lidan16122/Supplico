import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Keys, getItem } from "../../utils/storage";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import CustomModal from "../layout/CustomModal";
import AuthContext from "../context/AuthContext";
import { Button, Modal } from "react-bootstrap";
import UpdatePallets from "./UpdatePallets";

export default function DisplayOrder() {
  const [order, setOrder] = useState();
  const [orderItems, setOrderItems] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderid } = useParams();
  let { roleID } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("Error");
  const [modalBody, setModalBody] = useState("");
  const [updatePallets, setUpdatePallets] = useState(false);
console.log(updatePallets)
  function handleClose() {
    setShow(false);
  }

  console.log(orderid);

  useEffect(() => {
    getOrder();
  }, []);

  function getOrder() {
    let options = {
      headers: {
        Authorization: `Bearer ${getItem(Keys.accessToken)}`,
      },
    };
    axios
      .get(SupplicoWebAPI_URL + "/orders/display-order/" + orderid, options)
      .then((res) => {
        if (res.data) {
          setOrder(res.data);
          getOrderItems();
          console.log(res.data);
          setLoading(fale);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }

  function getOrderItems() {
    let options = {
      headers: {
        Authorization: `Bearer ${getItem(Keys.accessToken)}`,
      },
    };
    axios
      .get(SupplicoWebAPI_URL + "/orderItems/display-order/" + orderid, options)
      .then((res) => {
        if (res.data) {
          setOrderItems(res.data);
          console.log(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }

  async function supplierConfirm() {
    await axios
      .put(SupplicoWebAPI_URL + "/orders/supplier", {
        orderId: order[0].orderId,
      })
      .then((res) => {
        console.log(res);
        setShow(true);
        setModalTitle("Confirmed");
        setModalBody("Shipment confirmed, now searching for a driver! please update pallets count");
        getOrder();
      })
      .catch((err) => {
        setShow(true);
        setModalBody(err.response.data + ", " + err.message);
      });
  }

  async function driverConfirm() {
    await axios
      .put(SupplicoWebAPI_URL + "/orders/driver", {
        orderId: order[0].orderId,
        driverId: getItem(Keys.userId),
      })
      .then((res) => {
        console.log(res);
        setShow(true);
        setModalTitle("Confirmed");
        setModalBody(
          "Shipment confirmed and now has a driver, please contact the supplier to pickup!"
        );
        getOrder();
      })
      .catch((err) => {
        setShow(true);
        setModalBody(err.response.data + ", " + err.message);
      });
  }

  if (!loading) {
    return (
      <>
      {updatePallets ? <UpdatePallets updatePallets={updatePallets} setUpdatePallets={setUpdatePallets} orderid={orderid} getOrder={getOrder}/> : ""}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="text-center text-black pt-5 mb-3">
          <h1 className="component-title">
            An Official Supplico Shipment Form
          </h1>
          <h3>Transaction Id: {order[0].transactionId}</h3>
        </div>
        <div className="container text-black display-order">
          <p className="display-order-summary">
            Requested shipment delivery by: <b>{order[0].businessFullName}</b>{" "}
            from <b>{order[0].supplierFullName}</b> and should be delivered by{" "}
            <b>{order[0].driverFullName ?? "NONE"}</b>
          </p>
          <h3
            className="text-center pt-4 pb-2"
            style={{ textDecoration: "underline" }}
          >
            Items In Shipment
          </h3>
          <table className="table display-order-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((o) => (
                <tr key={o.id}>
                  <td>{o.productName}</td>
                  <td>{o.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="text-center">
            Shipment total sum: <b>{order[0].sum}</b>, total quantity of:{" "}
            <b>{order[0].quantity}</b> products
          </h4>
          <h4 className="text-center pb-5">
            Total shipment pallets: <b>{order[0].pallets ?? 0}</b>
          </h4>
          <div className="row">
            <p className="col-4">
              Business name: <b>{order[0].businessFullName}</b>
              <br />
              Business phone number: <b>{order[0].businessPhoneNumber}</b>
              <br />
              Business email: <b>{order[0].businessEmail}</b>
            </p>
            <p className="col-4">
              Driver name: <b>{order[0].driverFullName ?? "NONE"}</b>
              <br />
              Driver phone number: <b>{order[0].driverPhoneNumber ?? "NONE"}</b>
              <br />
              Driver email: <b>{order[0].driverEmail ?? "NONE"}</b>
              <br />
              <b>{order[0].driverConfirmation
                ? "This shipment has a driver"
                : "*Searching for a suitable driver"}</b>
              <br />
              {roleID == 2 && order[0].driverConfirmation == false ? (
                <Button variant="dark" onClick={driverConfirm}>
                  Confirm
                </Button>
              ) : (
                ""
              )}
            </p>
            <p className="col-4">
              Supplier name: <b>{order[0].supplierFullName}</b>
              <br />
              Supplier phone number: <b>{order[0].supplierPhoneNumber}</b>
              <br />
              Supplier email: <b>{order[0].supplierEmail}</b>
              <br />
              <b>{order[0].supplierConfirmation
                ? "The supplier has confirmed this shipment"
                : "*Watiting for supplier confirmation"}</b>
              <br />
              {roleID == 3 && order[0].supplierConfirmation == false ? (
                <Button variant="dark" onClick={supplierConfirm}>
                  Confirm
                </Button>
              ) : (
                ""
              )}
              <br />
              {roleID == 3 && order[0].supplierConfirmation == true ? <Button variant="dark" onClick={() => setUpdatePallets(true)}>Update pallets count</Button> : ""}
            </p>
          </div>
          <p className="pt-5">
            Date: <b>{order[0].created.slice(0, 10)}</b>
          </p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {errorMessage ? (
          <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        ) : (
          ""
        )}
        <h1 className="text-center">LOADING...</h1>
      </>
    );
  }
}
