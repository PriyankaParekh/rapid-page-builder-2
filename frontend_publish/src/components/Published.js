import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Published() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/v1/getPublishedPages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      console.log(responseData.data.data);
      // console.log(data);
      setData(responseData.data.data); // Update state with fetched data

      // setAuthor(responseData.data.data.author);
      setOriginalData(responseData.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div>
      <h3 className="d-flex justify-content-center align-items-center mt-5">
        Published Pages
      </h3>
      <table className="table container mt-3 table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">TITLE</th>
            <th scope="col">URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              <td><Link className="text-dark" style={{textDecoration:"none"}} to={`/blog/${item.url}`}>{item.title}</Link></td>
              <td>{item.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Published;
