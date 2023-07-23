import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import AdminOrderItems from "./AdminOrderItems";
import MyOrderItems from "./MyOrderItems";

export default function OrderItems() {
  let { roleID } = useContext(AuthContext);
  if (roleID == 4) return <AdminOrderItems />;
  else return <MyOrderItems />
}
