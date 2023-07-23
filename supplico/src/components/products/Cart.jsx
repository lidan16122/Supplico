import React from "react";
import { Button } from "react-bootstrap";

export default function Cart({ setCart, listMsg, makeOrder }) {
  return (
    <>
      <div className="cart">
        <h4 style={{textDecoration: "underline"}}>Cart</h4>
        {listMsg}
        <Button variant="success" onClick={() => makeOrder()}>
          Make Order
        </Button>
        <br />
        <Button variant="primary" onClick={() => setCart(false)} className="cart-close">
          Close
        </Button>
      </div>
    </>
  );
}
