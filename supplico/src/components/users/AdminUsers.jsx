import React, { useEffect, useState } from "react";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Button, Modal } from "react-bootstrap";
import "../../styles/users.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [show, setShow] = useState();
  const [showImg, setShowImg] = useState();
  const [filter, setFilter] = useState(false);

  const handleClose = () => setShow(false);
  const handleFilter = () => {
    if (!filter) {
      setFilter(true);
      setOriginalUsers(users);
      setUsers(users.filter((u) => u.isAccepted == false));
    } else {
      setFilter(false);
      setUsers(originalUsers);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    axios
      .get(SupplicoWebAPI_URL + "/users")
      .then((res) => {
        if (res.data) setUsers(res.data);
        else console.log("empty response.data");
      })
      .catch((err) => {
        setShow(true);
        setErrorMessage(err.response.data);
      });
  }

  async function changeActivation(user) {
    try {
      const response = await axios({
        method: "put",
        url: `${SupplicoWebAPI_URL}/users`,
        data: user,
        headers: { "Content-Type": "application/json" },
      });
      getUsers();
    } catch (err) {
      setShow(true);
      setErrorMessage(err.response.data);
    }
  }

  function deleteUser(id) {
    axios
      .delete(SupplicoWebAPI_URL + "/users/" + id)
      .then((res) => {
        getUsers();
      })
      .catch((err) => {
        setShow(true);
        setErrorMessage(err.response.data);
      });
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <img
        src={showImg ? showImg : ""}
        className="focused-img"
        onClick={() => setShowImg("")}
      />
      <div className="text-center mt-5 mb-5 admin-title">
        <h1>Users</h1>
        <label>
          <input type="checkbox" onChange={handleFilter} />
          Show Unapproved Only
        </label>
      </div>
      <table className="table text-center admin-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Password (Hashed)</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Role</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.userName}</td>
              <td>{u.password}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.phoneNumber}</td>
              <td>{u.roleId}</td>
              <td>
                <img
                  src={u.imageData}
                  alt={u.imageName}
                  className="table-users-img"
                  onClick={(e) => setShowImg(e.target.src)}
                />
              </td>
              <td>
                <Button
                  variant={u.isAccepted ? "success" : "danger"}
                  onClick={() => changeActivation(u)}
                >
                  {u.isAccepted ? "Accepted" : "Not Accepted"}
                </Button>{" "}
                *{" "}
                <Button variant="primary" onClick={() => deleteUser(u.userId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
