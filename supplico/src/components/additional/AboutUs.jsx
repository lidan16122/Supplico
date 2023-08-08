import React from "react";
import siteImg from "../../assets/logo.png";
import "../../styles/home.css";

export default function AboutUs() {
  return (
    <>
      <div className="additional-background">
        <div className="container color-black pt-5 additional">
          <h1 className="additional-title">About Us</h1>
          <p className="pt-4 pb-5">
            We are Supplico a delivery company that works as a "middle man"
            between transactions.
            <br />
            We connect between the Business to the Supplier and Drivers can pick
            any incomplete order and deliver the shipment.
            <br />
            We use our unique way to ease ordering, publishing, and delivery
            products.
            <br />
            Everything is digital and stored in a secured server, and that is
            more environmentally friendly.
            <br />
            The author got the idea from his previous job, he was a warehouse
            manager and he had 4 diffrent suppliers, 2 of them were the main
            suppliers and he had little connection between each other. No idea
            who is the driver and even sometimes doesn't get any shipment paper,
            to know what is in this shipment.
            <br />
            So that how Supplico was created, to simplify all of this
            bureaucracy.
          </p>
          <img src={siteImg} alt="site image" />
        </div>
      </div>
    </>
  );
}
