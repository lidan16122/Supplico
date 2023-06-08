import React, { Component } from "react";
import homeVideo from "../assets/Supplico-video.mp4";
import { Button } from "react-bootstrap";
import "../styles/home.css";

export default class Home extends Component {
    constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div>
          <video src={homeVideo} autoPlay muted loop id="homeVideo"></video>
          <div className="main-title text-center">
            <img src={this.props.siteImg} alt="Site Image" id="titleImg"/>
            <h1 className="">Supplico</h1>
            <h3 className="mb-5">
              "Get fast on time with no trouble supply to your business"
            </h3>
            <Button className="primary">Get Started</Button>
          </div>
        </div>
      </>
    );
  }
}
