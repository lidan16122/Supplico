import React from "react";
import { useParams } from "react-router-dom";
import siteImg from "../../assets/logo.png";

export default function Error() {
    const { unknownURL } = useParams();
  return (
    <>
      <div className="error-page-background">
        <div className="container error-page pt-5 pb-5">
          <h1 className="pb-4">Error 404 Page Not Found<br /> Unknow URL</h1>
          <img src={siteImg} alt="site image" />
        </div>
      </div>
    </>
  );
}
