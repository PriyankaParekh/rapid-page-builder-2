import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import Nav from "./Nav";

function List() {
  const [data, setData] = useState([]);
  let [filterText, setFilterText] = useState("");
  const [author, setAuthor] = useState("All");
  const [status, setStatus] = useState("All");
  const [originalData, setOriginalData] = useState([]);
  const profile = JSON.parse(localStorage.getItem("userData"));
  const token = profile.authToken;
  const formattedDateTime = (createdAt) => {
    if(createdAt===null){
      return "-";
    } else{
      const date = new Date(createdAt);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour format
      };
  
      return date.toLocaleString("en-IN", options);
    }
    
  };

  const fetchData = async () => {
    try {
      console.log(token);
    if (!token) {
      // Handle the case where token is not available
      toast.error("invalid token");
      return null;
    }
      const response = await fetch("http://localhost:5000/v1/getallpage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      console.log(responseData);
      console.log(responseData.data.data);
      // console.log(data);
      setData(responseData.data.data); // Update state with fetched data

      // setAuthor(responseData.data.data.author);
      setOriginalData(responseData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const delData = async (id) => {
    let result = await fetch(`http://localhost:5000/v1/deleteData/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    result = await result.json();
    if (result) {
      toast.success("Record is Deleted Successfully");
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleStatus = (e) => {
    setStatus(e.target.textContent);
  };
  const handleAuthor = (e) => {
    console.log(e.target.innerText);
    setAuthor(e.target.innerText);
  };
  const getUniqueAuthors = () => {
    const uniqueAuthors = new Set();
    data.forEach((item) => uniqueAuthors.add(item.author));
    return [...Array.from(uniqueAuthors)];
  };

  const filterData = (data, status, author, filterText) => {
    return data.filter((item) => {
      const statusMatch =
        status === "All" || item.status.toLowerCase() === status.toLowerCase();
      const textMatch = Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(filterText.toLowerCase())
      );
      const authorMatch =
        author === "All" || item.author.toLowerCase() === author.toLowerCase();

      return statusMatch && textMatch && authorMatch;
    });
  };

  const filteredData = filterData(originalData, status, author, filterText);
  console.log(filteredData);
  // const conditionalRowStyles = [
  //   {
  //     when: (row) => row.status === "draft",
  //     style: {
  //       backgroundColor: "yellow",
  //       // color:"#D97706"
  //     },

  //   },{
  //     when: (row) => row.status === "scheduled",
  //     style: {
  //       backgroundColor: "blue",
  //       // color:"#2563EB"
  //     },

  //   },
  //   {
  //     when: (row) => row.status === "published",
  //     style: {
  //       backgroundColor: "green",
  //       color:"#059669"
  //     },
  //   }
  //   // Add more conditions and styles as needed
  // ];

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      style: {
        color: "#4F46E5",
      },
      cell: (row) => (
        <div className="d-flex justify-content-center align-items-center">
          <span>{row.title}</span>
          <div className="dropdown">
            <button
              className="btn ms-2 me-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
              >
                <path
                  fill="black"
                  d="M156 128a28 28 0 1 1-28-28a28 28 0 0 1 28 28M48 100a28 28 0 1 0 28 28a28 28 0 0 0-28-28m160 0a28 28 0 1 0 28 28a28 28 0 0 0-28-28"
                />
              </svg>
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to={`/editpage/${row._id}`}>
                  Edit
                </Link>
              </li>
              <li>
                <a
                  className="dropdown-item text-danger"
                  onClick={() => delData(row._id)}
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      name: "URL",
      selector: (row) => row.url,
      // sortable:true,
    },
    {
      name: "Created By",
      selector: (row) => row.author,
      // sortable:true,
    },
    {
      name: "Created At",
      selector: (row) => formattedDateTime(row.createdAt),
      // sortable:true,
    },
    {
      name: "Modified By",
      selector: (row) => row.modifiedBy||"-",
      // sortable:true,
    },
    {
      name: "Modified At",
      selector: (row) => formattedDateTime(row.modifiedAt),
      // sortable:true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      // sortable:true,
      cell: (row) => (
        <div
          style={{
            color:
              row.status.toLowerCase() === "draft"
                ? "#D97706"
                : row.status.toLowerCase() === "scheduled"
                ? "#2563EB"
                : "#059669",
            background:
              row.status.toLowerCase() === "draft"
                ? "yellow"
                : row.status.toLowerCase() === "scheduled"
                ? "#c9c9f1"
                : "#c1eec1",
            padding: "3px",
            borderRadius: "4px",
          }}
        >
          {row.status}
        </div>
      ),
    },
  ];

  return (
    <div className="d-flex">
     <Nav/>
      <div className="container-fluid p-0 m-0">
        <nav className="navbar mainnav navbar-expand-lg navbar-light bg-light">
          <div className="d-flex mt-4 flexdis">
            <Link to="/" className="alreadyACC">
              <svg
                className="ms-5 me-4"
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.148438 0.998438C0.148438 0.528995 0.528995 0.148438 0.998438 0.148438H16.9984C17.4679 0.148438 17.8484 0.528995 17.8484 0.998438C17.8484 1.46788 17.4679 1.84844 16.9984 1.84844H0.998438C0.528995 1.84844 0.148438 1.46788 0.148438 0.998438ZM0.148438 5.99844C0.148438 5.529 0.528996 5.14844 0.998438 5.14844L10.9984 5.14844C11.4679 5.14844 11.8484 5.529 11.8484 5.99844C11.8484 6.46788 11.4679 6.84844 10.9984 6.84844L0.998437 6.84844C0.528995 6.84844 0.148437 6.46788 0.148438 5.99844ZM0.998438 10.1484C0.528995 10.1484 0.148438 10.529 0.148438 10.9984C0.148438 11.4679 0.528995 11.8484 0.998438 11.8484H16.9984C17.4679 11.8484 17.8484 11.4679 17.8484 10.9984C17.8484 10.529 17.4679 10.1484 16.9984 10.1484H0.998438Z"
                  fill="#201F37"
                />
              </svg>
            </Link>
            <div className="d-block">
              <h4 className="navbar-brand m-0 p-0" href="#">
                Pages
              </h4>
              <p className="grey">Create and publish pages.</p>
            </div>
          </div>
          <button
            className="navbar-toggler me-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="me-5 my-2 my-lg-0 ms-auto">
              <div className="displayPro">
                <div className="dropdown">
                  <Link to="/addpage" type="button" className="btnReg">
                    <span>+</span> <span>Add Page</span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </nav>
        <hr className="m-0" />
        <form action="">
          <div className="first">
            <input
              type="text"
              className="form-control ms-5 mt-3 search2 ps-5 w-auto"
              placeholder="Search"
              value={filterText}
              onChange={handleChange}
            />
            <p className="grey mt-4 ms-3">{filteredData.length} records</p>
            {/* <div className="second d-flex"> */}
            <p className="grey mt-4 ms-auto me-2">Status</p>
            <div class="dropdown mt-2 me-4">
              <a
                class="btn dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                All
              </a>

              <ul class="dropdown-menu" onClick={handleStatus}>
                <li>
                  <a className="dropdown-item">All</a>
                </li>
                <li>
                  <a class="dropdown-item" id="draft">
                    Draft
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="scheduled">
                    Scheduled
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="published">
                    Published
                  </a>
                </li>
              </ul>
            </div>
            <p className="grey mt-4">Created By</p>
            <div class="dropdown mt-2 me-3">
              <a
                className="btn dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {author}
              </a>
              <ul className="dropdown-menu" onClick={handleAuthor}>
                <li>
                  <a className="dropdown-item">All</a>
                </li>
                {/* Map over your list of authors here */}
                {getUniqueAuthors().map((author) => (
                  <li key={author}>
                    <a className="dropdown-item">{author}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* </div> */}
          </div>
          <DataTable
            key={filteredData.length}
            className="ps-5 pe-5 mt-2 tableHead"
            columns={columns}
            data={filteredData}
            // pagination
            // paginationPerPage={5}
            // paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            responsive
          />
        </form>
      </div>
    </div>
  );
}

export default List;
