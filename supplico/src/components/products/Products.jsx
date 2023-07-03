import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DriverProducts from "./DriverProducts";
import BusinessProducts from "./BusinessProducts";
import SupplierProducts from "./SupplierProducts";
import AdminProducts from "./AdminProducts";

export default function Products() {
  let { roleID } = useContext(AuthContext);

  if (roleID == 1) return <BusinessProducts />;
  else if (roleID == 2) return <DriverProducts />;
  else if (roleID == 3) return <SupplierProducts />;
  else if (roleID == 4) return <AdminProducts />;
  else return <h1>Something went wrong</h1>;
}
