import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Workflow from "./Workflow";
import homeVideo from "../../assets/Supplico-video.mp4";
import "../../styles/home.css";

const Home = (props) => {
  let navigate = useNavigate();
  return (
      <main>
      <div className="main-article">
        <video src={homeVideo} autoPlay muted loop id="homeVideo"></video>
        <div className="main-title text-center">
          <img src={props.siteImg} alt="Site Image" id="titleImg" />
          <h2 className="mt-4">
            "Fast on time deliveries with no trouble"
          </h2>
          <h2 className="mb-4">"Environmentally friendly, everything is digital"</h2>
          <Button
            className="main-article-button"
            onClick={() => navigate("register")}
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="why-article pt-5">
        <h3 className="why-article-title">Why Supplico?</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="120"
          fill="currentColor"
          className="bi bi-arrow-down-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="120"
          fill="currentColor"
          className="bi bi-arrow-down"
          viewBox="0 0 16 16"
          style={{ margin: "0 150px" }}
        >
          <path
            fillRule="evenodd"
            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="120"
          fill="currentColor"
          className="bi bi-arrow-down-right"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0v6z"
          />
        </svg>
        <div className="container">
          <div className="row justify-content-center">
            <p className="col-lg-3 why-article-p">
              Easy to use with no problems
            </p>
            <p
              className="col-lg-3 why-article-p"
              style={{ marginLeft: "10px", marginRight: "10px" }}
            >
              Better for the environment
            </p>
            <p className="col-lg-3 why-article-p">
              Fastest and most perfect deliveries
            </p>
          </div>
        </div>
      </div>

      <div className="what-article pt-5">
        <h3 className="what-article-title mb-5">What Is Supplico?</h3>
        <ul>
          <li>We are a delivery company, we use a unique way to connect the shipment to the supplier, the
            business and the driver.</li>
          <li>
            There are 3 roles Businesses, Drivers, Suppliers.
          </li>
          <li>
            Businesses can browse in any suppliers products and make order instantly, Suppliers can publish their products very easily<br /> and Drivers can search for open deliveries and just take it, simple as that.
          </li>
          <li>
            We are good for the environment, we don't use any paper and
            everything is digital.
          </li>
          <li>Very easy to use.</li>
          <li>Every shipment has a receipt that is stored in our server.</li>
          <li>
            Every business, supplier or driver has to be confirmed by the system
            before using Supplico.
          </li>
        </ul>
      </div>

      <div className="how-article">
        <h3 className="how-article-title">How Does It Work?</h3>
        <h3 className="workflow">Workflow</h3>
        <Workflow />
      </div>

      <div className="join-article">
        <h3 className="join-article-title">So what are you waiting for?</h3>
        <p className="join-article-p">Start order, delivery and supply shipments!<br /> and enjoy perfect shipments!</p>
        <Button className="join-article-button" onClick={() => navigate("register")}>Register Now!</Button>
        <br />
        <img src={props.siteImg} alt="Site Image" id="titleImg" style={{width:"30%"}}/>
      </div>
      </main>
  );
};

export default Home;
