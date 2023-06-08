import React from "react";
import { useNavigate } from "react-router-dom";
//some contact information, about us page and copyrights.
const Footer = () => {
  let navigate = useNavigate();
  return (
    <>
      <footer>
        <div className="container pt-4">
          <h3 className="contact">Contact Us:</h3>
          <hr />
          <div className="row justify-content-center">
            <a
              href="https://www.facebook.com/lidan.sassonker.1"
              className="col-lg-2 col-md-6 facebook fa fa-facebook icons"
            ></a>

            <a
              href="https://www.instagram.com/lidan16122/"
              className="col-lg-2 col-md-6 instagram fa fa-instagram icons"
            ></a>

            <a
              href="https://api.whatsapp.com/send?phone=972548193161&text=Hey,%20how%20can%20I%20help%20you?"
              className="col-lg-2 col-md-6 whatsapp fa fa-whatsapp icons"
            ></a>

            <a
              href="mailto:lidan16122@gmail.com"
              className="col-lg-2 col-md-6 email fa-envelope-o fa icons"
            ></a>
          </div>

          <div className="row justify-content-center">
            <h3
              className="about mt-4 col-lg-3"
              onClick={() => navigate("about")}
            >
              About Us
            </h3>

            <h3
              className="about mt-4 col-lg-3"
              onClick={() => navigate("policy")}
            >
              Privacy Policy
            </h3>
          </div>
        </div>
      </footer>

      <div className="copyrights">
        <b>Copyrights © by Lidan</b>
      </div>
    </>
  );
};

export default Footer;
