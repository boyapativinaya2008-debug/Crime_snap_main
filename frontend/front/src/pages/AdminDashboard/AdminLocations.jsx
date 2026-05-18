import { useEffect, useState } from "react";

import API from "../../api/api";

import "../../styles/adminlocations.css";

export default function AdminLocations() {

  /* STATES */

  const [locations, setLocations] = useState([]);

  const [message, setMessage] = useState("");

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    stationName: "",
    area: "",
    city: "",
    state: "Andhra Pradesh",
    pincode: "",
  });

  /* MESSAGE */

  const showMessage = (text) => {

    setMessage(text);

    setTimeout(() => {

      setMessage("");

    }, 3000);
  };

  /* FETCH LOCATIONS */

  const fetchLocations = async () => {

    try {

      const res = await API.get(
        "/locations"
      );

      setLocations(res.data);

    } catch (err) {

      console.error(err);

      showMessage(
        "Failed To Fetch Locations"
      );
    }
  };

  /* LOAD */

  useEffect(() => {

    fetchLocations();

  }, []);

  /* HANDLE INPUT */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  /* ADD + UPDATE */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      /* UPDATE */

      if (editId) {

        await API.put(
          `/locations/${editId}`,
          form
        );

        showMessage(
          "Location Updated Successfully"
        );

      } else {

        /* ADD */

        await API.post(
          "/locations",
          form
        );

        showMessage(
          "Location Added Successfully"
        );
      }

      /* RESET */

      setForm({
        stationName: "",
        area: "",
        city: "",
        state: "Andhra Pradesh",
        pincode: "",
      });

      setEditId(null);

      fetchLocations();

      /* SCROLL TOP */

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (err) {

      console.error(err);

      showMessage(
        editId
          ? "Update Failed"
          : "Add Failed"
      );
    }
  };

  /* EDIT */

  const handleEdit = (location) => {

    setEditId(location._id);

    setForm({
      stationName:
        location.stationName || "",
      area: location.area,
      city: location.city,
      state: location.state,
      pincode: location.pincode,
    });

    /* SCROLL TO TOP */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* DELETE */

  const handleDelete = async (id) => {

    try {

      await API.delete(
        `/locations/${id}`
      );

      showMessage(
        "Location Deleted Successfully"
      );

      fetchLocations();

    } catch (err) {

      console.error(err);

      showMessage(
        "Delete Failed"
      );
    }
  };

  /* CANCEL EDIT */

  const cancelEdit = () => {

    setEditId(null);

    setForm({
      stationName: "",
      area: "",
      city: "",
      state: "Andhra Pradesh",
      pincode: "",
    });
  };

  return (

    <div className="admin-page">

      <h1>
        Manage Locations
      </h1>

      {/* MESSAGE */}

      {
        message && (

          <div className="message-box">

            {message}

          </div>
        )
      }

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="add-location-form"
      >

        <input
          type="text"
          name="stationName"
          placeholder="Police Station Name"
          value={form.stationName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="area"
          placeholder="Area Name"
          value={form.area}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
        />

        {/* TOGGLE BUTTON */}

        <button
          type="submit"
          className="add-btn"
        >
          {
            editId
              ? "Update Location"
              : "Add Location"
          }
        </button>

        {/* CANCEL BUTTON */}

        {
          editId && (

            <button
              type="button"
              onClick={cancelEdit}
              className="cancel-btn"
            >
              Cancel
            </button>
          )
        }

      </form>

      {/* TABLE */}

      <table className="admin-table">

        <thead>

          <tr>

            <th>#</th>

            <th>
              Police Station
            </th>

            <th>Area</th>

            <th>City</th>

            <th>State</th>

            <th>Pincode</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {
            locations.length > 0 ? (

              locations.map(
                (
                  location,
                  index
                ) => (

                  <tr
                    key={location._id}
                  >

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {
                        location.stationName
                      }
                    </td>

                    <td>
                      {location.area}
                    </td>

                    <td>
                      {location.city}
                    </td>

                    <td>
                      {location.state}
                    </td>

                    <td>
                      {location.pincode}
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(
                            location
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            location._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                )
              )

            ) : (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  No Locations Found
                </td>

              </tr>
            )
          }

        </tbody>

      </table>

    </div>
  );
}