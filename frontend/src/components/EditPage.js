import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import moment from "moment-timezone";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
// import { param } from "../../../../Routes/Pages";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
import Nav from "./Nav";

function EditPage() {
//   const status = "draft";

  const params = useParams();
  const profile = JSON.parse(localStorage.getItem("userData"));
  const token=profile.authToken;
  const id = profile.data.id;
  const [id2, setId2] = useState('');
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const author = profile.data.name.split(" ")[0];
//   const [author2,setAuthor2]=("All");
  const [editorHtml, setEditorHtml] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtext: "",
    attach: "",
    url: "",
    showAuthor: false,
    createdBy: id,
    pubDate: "", // Initialize pubDate and pubTime
    pubTime: "", // Initialize pubDate and pubTime
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };
  const handleImage = (files) => {
    // Update formData with new attachments
    setSelectedFiles(files);
    setFormData((prevFormData) => ({
        ...prevFormData,
        attach: files.map((file) => file.base64), // Update attach with base64 strings
    }));
};

  const handleDownload = (e) => {
    e.preventDefault();
    const byteCharacters = atob(selectedFiles.base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" }); // Change the type if necessary
  
    // Create download link for the Blob
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = selectedFiles.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const handlePreviewClick = () => {
    // Assuming you want to pass formData to the Preview component
    navigate("/preview", { state: { formData, editorHtml, author } });
  };
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };
  const handleEditorChange = async (e) => {
    setEditorHtml(e);
  };
  useEffect(() => {
    fetchdata();
  }, [params.id]);
  
const fetchdata = async () => {
  try {
      // Fetch data from the database
      const response = await fetch(
          `http://localhost:5000/v1/getone/${params.id}`,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      const responseData = await response.json();

      // Update component state with fetched data
      setData(responseData.data.data[0]);
      setFormData({
          title: responseData.data.data[0].title,
          subtext: responseData.data.data[0].subtext,
          attach: responseData.data.data[0].attach,
          url: responseData.data.data[0].url,
          showAuthor: responseData.data.data[0].showAuthor,
      });
      setEditorHtml(responseData.data.data[0].body);

      // Set selected files based on attachments retrieved
      setSelectedFiles(responseData.data.data[0].attach.map(file => ({
          base64: file, // Assuming attach contains base64 strings
          name: "", // You might want to provide the name if available
      })));
  } catch (error) {
      console.log(error);
  }
};


  const data2 = async () => {
    console.log(token);
    if (!token) {
      // Handle the case where token is not available
      toast.error("invalid token");
      return null;
    }
        const status="draft";
    let result = await fetch(`http://localhost:5000/v1/editpage/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: formData.title,
        subtext: formData.subtext,
        attach: formData.attach,
        url: formData.url,
        showAuthor: formData.showAuthor,
        body: editorHtml,
        author: author,
        id: id,
        createdBy: id,
        modifiedBy: author,
        status: status,
        published: "",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    result = await result.json();
    console.log(result);
    navigate("/list");
  };

  const handleSubmitOnPublish = async () => {
    if (!token) {
      toast.error("Invalid token");
      return;
  }
  
  // Parse pubDate and pubTime from formData
  const pubDate = formData.pubDate;
  const pubTime = formData.pubTime;
  console.log(pubDate, pubTime);
  
  // Validate pubDate and pubTime
  if (!pubDate || !pubTime) {
      toast.error("Publication date and time are required");
      return;
  }
  
  // Combine pubDate and pubTime to create publishDateTime
  const publishDateTime = new Date(`${pubDate}T${pubTime}`);
  
  // Check if publishDateTime is a valid date
  if (isNaN(publishDateTime.getTime())) {
      toast.error("Invalid publication date and time");
      return;
  }
  
  // Determine status based on currentDateTime and publishDateTime
  const currentDateTime = new Date();
  let status;
  if (currentDateTime >= publishDateTime) {
      status = "Published";
  } else {
      status = "scheduled";
  }
  
  // Construct the request body
  const requestBody = {
    title: formData.title,
    subtext: formData.subtext,
    attach: formData.attach,
    url: formData.url,
    showAuthor: formData.showAuthor,
    body: editorHtml,
    author: author,
    id: id,
    createdBy: id,
    modifiedBy: formData.modifiedBy || "-",
    status: status,
    published: moment(publishDateTime).format("YYYY-MM-DD HH:mm:ss"), // Format datetime value
};
  
  // Send the request to update the page
  try {
      const response = await fetch(`http://localhost:5000/v1/editpage/${params.id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
      });
      const json = await response.json();
  
      if (!json.success) {
          toast.error("Invalid data");
      } else {
          navigate("/list");
      }
  } catch (error) {
      console.error("Error updating page:", error.message);
      toast.error("An error occurred while updating the page");
  }
  
};


  return (
    <div className="d-flex overflow-hidden">
     <Nav/>
      <div className="container-fluid p-0 m-0">
        <nav className="navbar mainnav navbar-expand-lg navbar-light bg-light">
          <Link to="/list" className="alreadyACC">
            <svg
              className="ms-5 me-2"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="14"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                stroke="#000"
                strokeWidth="2"
              />
            </svg>
          </Link>
          <Link className="navbar-brand" to="/list">
          {formData.title}
          </Link>

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
                  <button
                    className="btn btn-outline-secondary me-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ...
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                    <button className="dropdown-item"
                  onClick={handlePreviewClick}>Preview
                </button>
                    </li>
                    <li>
                      <a className="dropdown-item text-danger" href="#">
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="btnDiv">
                  <button
                    className="btn btn-outline-secondary my-2 mx-2 my-sm-0"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
                <div className="btnDiv">
                    <Link to="/list">
                  <button
                    className="btnReg my-2 mx-2 py-2 my-sm-0"
                    type="button"
                    onClick={data2}
                  >
                    Save
                  </button>
                  </Link>
                </div>
                <div className="btnDiv">
                  <button
                    className="btn btn-success my-2 mx-2 my-sm-0"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Publish
                  </button>

                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header bg-dark">
                          <h1
                            className="modal-title fs-5 text-light"
                            id="exampleModalLabel"
                          >
                            Publish
                          </h1>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <label htmlFor="pubDate" className="mb-2">
                            Publish Date<span className="req">*</span>
                          </label>
                          <br />
                          <input
                            type="date"
                            id="pubDate"
                            className="form-control"
                            value={formData.pubDate}
                            onChange={handleChange}
                            name="pubDate"
                          />
                          <br />
                          <label htmlFor="pubTime" className="mb-2">
                            Publish Time<span className="req">*</span>
                          </label>
                          <br />
                          <input
                            type="time"
                            id="pubTime"
                            className="form-control"
                            value={formData.pubTime}
                            onChange={handleChange}
                            name="pubTime"
                          />
                          <br />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleSubmitOnPublish}
                          >
                            Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </nav>
        <hr className="m-0" />
        <div className="row">
          <div className="maincontainer col-md-9">
            <form className="p-5">
              <div className="mb-3">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control grey"
                  name="title"
                  id="title"
                  placeholder="Title"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="subtext">Sub Text</label>
                <input
                  type="text"
                  value={formData.subtext}
                  onChange={handleChange}
                  className="form-control grey"
                  name="subtext"
                  placeholder="Sub Text"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="body">Body</label>
                <ReactQuill
                  style={{ height: "15rem" }}
                  placeholder="Blog content will go here"
                  theme="snow" // Specify theme ('snow' is one of the available themes)
                  value={editorHtml} // Set initial content
                  onChange={handleEditorChange} // Handle content changes
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                  ]}
                />
              </div>
              <br />
              <div className="mt-5">
              <FileBase64 multiple={true} onDone={handleImage} value={selectedFiles}/>
                  {/* Render selected image */}
                  {selectedFiles && (
                  <div>
                    <img
                      src={selectedFiles.base64}
                      alt={selectedFiles.name}
                      width="200"
                    />
                    <br />
                    {/* Download link for the selected image */}
                    <button onClick={handleDownload}>Download</button>
                  </div>
                )}
                <label className="grey mt-2" htmlFor="">
                  Supported files: JPEG. PNG. PDF. DOC. XLX. PPT.
                </label>
              </div>
            </form>
          </div>
          <div className="rightSideBar col-md-3 p-5">
            <h4>Configurations</h4>
            <div className="mb-3">
              <label htmlFor="URL">URL</label>
              <div className="input-group">
                <span className="input-group-text">/</span>
                <input
                  type="text"
                  className="form-control grey"
                  name="url"
                  placeholder="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                disabled
                value={author}
                onChange={handleChange}
                className="form-control grey"
                name="author"
                placeholder="Author"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="checkbox"
                value={formData.isChecked}
                onChange={handleChange}
                className="grey me-2"
                name="showAuthor"
                placeholder="showAuthor"
                required
              />
              <label htmlFor="showAuthor">Show Author</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
