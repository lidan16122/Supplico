import React from "react";
import { Card } from "react-bootstrap";

export default function MyProfile() {
  return (
    <>
      <div className="text-center text-black">
        <h1>
          My Profile: <b>{localStorage.getItem("fullName")}</b>
        </h1>
        <h3>Here you can view your profile card</h3>
      </div>
      <Card>

      </Card>
    </>
  );
}
