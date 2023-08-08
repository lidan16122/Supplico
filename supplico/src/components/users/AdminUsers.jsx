import React, { useEffect, useState } from "react";
import axios from "axios";
import { SupplicoWebAPI_URL } from "../../utils/settings";
import { Button } from "react-bootstrap";
import "../../styles/components.css";
import CustomModal from "../layout/CustomModal";
import { Keys, getItem } from "../../utils/storage";
import Loading from "../layout/Loading";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImg, setShowImg] = useState();
  const [filter, setFilter] = useState(false);
  const [search, setSearch] = useState("");

  const handleFilter = () => {
    if (!filter) {
      setFilter(true);
      setUsers(
        originalUsers.filter(
          (u) =>
            u.isAccepted == false &&
            u.fullName.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilter(false);
      if (!search) {
        setUsers(originalUsers);
      } else {
        setUsers(
          originalUsers.filter((u) =>
            u.fullName.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }
  };

  function handleSearch() {
    if (!search) {
      if (!filter) {
        setUsers(originalUsers);
      } else {
        setUsers(originalUsers.filter((u) => u.isAccepted == false));
      }
    } else {
      if (filter) {
        setUsers(
          originalUsers.filter(
            (u) =>
              u.fullName.toLowerCase().includes(search.toLowerCase()) &&
              u.isAccepted == false
          )
        );
      } else {
        setUsers(
          originalUsers.filter((u) =>
            u.fullName.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    let options = {
      headers: {
        Authorization: `Bearer ${getItem(Keys.accessToken)}`,
      },
    };
    axios
      .get(SupplicoWebAPI_URL + "/users", options)
      .then((res) => {
        if (res.data) {
          setUsers(res.data);
          setOriginalUsers(res.data);
          setLoading(false);
        } else console.log("empty response.data");
      })
      .catch((err) => {
        setErrorMessage(err.message);
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
      setErrorMessage(err.response.data + ", " + err.message);
    }
  }

  function deleteUser(id) {
    axios
      .delete(SupplicoWebAPI_URL + "/users/" + id)
      .then((res) => {
        getUsers();
      })
      .catch((err) => {
        setErrorMessage(err.response.data + ", " + err.message);
      });
  }

  if (!loading) {
    return (
      <>
        <img
          src={showImg ? showImg : ""}
          className="focused-img"
          onClick={() => setShowImg("")}
        />
        <div className="text-center mt-5 mb-5 admin-title">
          <h1>Users</h1>
          <h2>Showing All Users</h2>
          <label className="mb-2">
            <input type="checkbox" name="filter" onChange={handleFilter} />
            Show Unapproved Only
          </label>
          <br />
          <input
            type="text"
            name="search bar"
            placeholder="search name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button> <br />
        </div>

        <div style={{ overflowX: "auto" }}>
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
                  <td style={{ fontSize: "16px" }}>
                    <Button
                      variant={u.isAccepted ? "success" : "danger"}
                      onClick={() => changeActivation(u)}
                    >
                      {u.isAccepted ? "Accepted" : "Not Accepted"}
                    </Button>{" "}
                    *{" "}
                    <Button
                      variant="primary"
                      onClick={() => deleteUser(u.userId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  } else {
    return (
      <>
        {errorMessage ? (
          <CustomModal title="Error" body={errorMessage} defaultShow={true} />
        ) : (
          ""
        )}
        <Loading />
      </>
    );
  }
}
