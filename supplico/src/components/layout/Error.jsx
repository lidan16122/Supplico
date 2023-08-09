import React from "react";
import siteImg from "../../assets/logo.png";

export default function Error() {
  return (
    <>
      <div className="error-page-background">
        <div className="container error-page pt-5 pb-5">
          <h1 className="pb-4">Error 404 Page Not Found<br /> Unknow URL</h1>
          <img src={siteImg} alt="site image" id="error-img" />
        </div>
      </div>
    </>
  );
}
