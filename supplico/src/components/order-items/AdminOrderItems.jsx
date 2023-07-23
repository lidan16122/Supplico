import React,{useEffect, useState} from "react";
import CustomModal from "../layout/CustomModal";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import axios from "axios";

export default function AdminOrderItems() {
    const [orderItems, setOrderItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      getOrderItems();
    }, []);
  
    function getOrderItems() {
      axios
        .get(SupplicoWebAPI_URL + "/orderItems")
        .then((res) => {
          if (res.data){
            setOrderItems(res.data);
            setLoading(false)
            console.log(res.data)
          } 
          else console.log("empty response.data");
        })
        .catch((err) => {
            setErrorMessage(err.message + ", "+ err.response.data);
        });
    }
  
  if(!loading){
  
    return (
      <>
        <div className="text-center mt-5 mb-5 admin-title">
          <h1>Order Items</h1>
          <h2>Showing All Items In Orders</h2>
        </div>
  
        <table className="table text-center admin-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Order Id</th>
              <th>Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.productId}</td>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>{o.orderId}</td>
                <td>{o.transaction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
  else{
    return (
      <>
        {errorMessage ? <CustomModal title="Error" body={errorMessage} defaultShow={true}  /> : ""}
        <h1 className="text-center">LOADING...</h1>
      </>
    );
  }
  }