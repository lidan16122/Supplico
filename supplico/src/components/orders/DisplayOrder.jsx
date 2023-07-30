import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";

export default function DisplayOrder() {
    const [order, setOrder] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  let { orderId } = useParams();

  useEffect(() => {
    getOrder();
  }, []);

  function getOrder() {
    let options = {
      headers: {
        Authorization: `Bearer ${getItem(Keys.accessToken)}`,
      },
    };
    axios
      .get(SupplicoWebAPI_URL + "/orders/display-order/" + orderId, options)
      .then((res) => {
        if (res.data) {
          setOrder(res.data);
          console.log(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message + ", " + err.response.data);
      });
  }

  if (!loading) {
    
      return (
        <>
          <div className="text-center text-black pt-5 mb-5">
            <h1 className="component-title">An Official Shipment Form</h1>
            <h3>Transaction Id: 2</h3>
          </div>
          <div className="container">

          </div>
        </>
      );
  }
  else {
    return (
      <>
        {errorMessage ? (
          <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        ) : (
          ""
        )}
        <h1 className="text-center">LOADING...</h1>
      </>
    );
  }
}
