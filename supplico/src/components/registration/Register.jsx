import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Register () {
    let [registerRole,setRegisterrRole] = useState('business');
    function imageText(){
        if(registerRole == "business")
        {
            return "business"
        }
        else if(registerRole == "driver")
        {
            return "driver"
        }
        else
        {
            return "export and import"
        }
    }
    console.log(registerRole);
    return(
        <div className="registration">
        <p style={{visibility:"hidden"}}>2</p>
        <Form className="registration-form">
          <h1 className="registration-title">Register</h1>
          <h3 className="mb-2">What is your role?</h3>

          <Form.Select className="mb-2" value={registerRole} onChange={(e) => setRegisterrRole(e.target.value)} required>
            <option value="business">Business</option>
            <option value="driver">Driver</option>
            <option value="supplier">Supplier</option>
          </Form.Select>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className="register-image-text">Please upload a valid {imageText()} license</Form.Label>
            <Form.Control required type="file" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Enter user name"
              value={"enteredUserName"}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={"enteredPassword"}
              required
            />
          </Form.Group>
          <p style={{color:"red",fontWeight:"bold"}}>*Note that a admin will be examine your user application*</p>
          <Button variant="primary" type="button" className="registration-btn mb-2">
            Register
          </Button>
        </Form>
      </div>
    )
}

export default Register;