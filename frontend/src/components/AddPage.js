import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import FileBase64 from "react-file-base64";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import Nav from "./Nav";

function AddPage({ selectedFilesProp }) {
  const profile = JSON.parse(localStorage.getItem("userData"));
  const token = profile.authToken;
  const id = profile.data.id;
  const author = profile.data.name.split(" ")[0];
  const [editorHtml, setEditorHtml] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtext: "",
    attach: [],
    url: "",
    showAuthor: false,
    createdBy: id,
    pubDate: "",
    pubTime: "",
  });
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState(selectedFilesProp || []);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };
  const location = useLocation();
  const [formDataInitialized, setFormDataInitialized] = useState(false);

  useEffect(() => {
    if (location.state && !formDataInitialized) {
      const { formData: formDataFromState, editorHtml: editorHtmlFromState } =
        location.state;
      console.log(editorHtml);
      setFormData(formDataFromState);
      setEditorHtml(editorHtmlFromState);
      setFormDataInitialized(true);
    }
  }, [location.state, formDataInitialized]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleEditorChange = async (e) => {
    setEditorHtml(e);
  };
  const handleImage = (files) => {
    setSelectedFiles(files[0]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      attach: [...prevFormData.attach, ...files.map((file) => file.base64)],
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
    const blob = new Blob([byteArray], { type: "image/png" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = selectedFiles.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleSubmit = async () => {
  const status = "draft";
    console.log(token);
    if (!token) {
      // Handle the case where token is not available
      toast.error("invalid token");
      return null;
    }
    const response = await fetch("http://localhost:5000/v1/addpage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
        modifiedBy: formData.modifiedBy || "-",
        status: status,
        published: "",
      }),
    });
    const json = await response.json();
    console.log(json.success);

    if (!json.success) {
      toast.error("Invalid data");
    } else {
      console.log(formData);
      navigate("/list");
    }
    console.log(formData, id, editorHtml);
  };

  const handlePreviewClick = () => {
    // Assuming you want to pass formData to the Preview component
    navigate("/preview", { state: { formData, editorHtml, author } });
  };

  const handleSubmitOnPublish = async () => {
    console.log(token);
    if (!token) {
      // Handle the case where token is not available
      toast.error("invalid token");
      return null;
    }
    const currentDateTime = new Date();
    const publishDateTime = new Date(
      `${formData.pubDate}T${formData.pubTime}`
    );

    let status;
    if (currentDateTime >= publishDateTime) {
      status = "Published";
    } else {
      status = "scheduled";
    }

    const response = await fetch("http://localhost:5000/v1/addpage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
        modifiedBy: formData.modifiedBy || "-",
        status: status,
        published: publishDateTime.toISOString(), // Convert to ISO string for consistent format
      }),
    });
    const json = await response.json();
    console.log(json);

    if (!json.success) {
      toast.error("Invalid data");
    } else {
      console.log(formData);
      navigate("/list");
    }
    console.log(formData, id, editorHtml);
};


  return (
    <div className="d-flex overflow-hidden">
      <Nav />
      <div className="container-fluid p-0 m-0">
        <nav className="navbar mainnav navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="alreadyACC">
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
          <a className="navbar-brand" href="#">
            {formData.title || "No Title"}
          </a>

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
            <form
              className="me-5 my-2 my-lg-0 ms-auto"
              onSubmit={"return false"}
            >
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
                      <button
                        className="dropdown-item"
                        onClick={handlePreviewClick}
                      >
                        Preview
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
                  <button
                    className="btnReg my-2 mx-2 py-2 my-sm-0"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
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
                {/* <label htmlFor="attach">Attachments</label>
              <input
                type="file"
                // value={formData.attach}
                onChange={handleChange}
                className="form-control grey"
                name="attach"
                placeholder="Attach"
                required
              /> */}
<FileBase64 multiple={true} onDone={handleImage} />
                  {/* Render selected image */}
      {selectedFiles && (
        <div>
          <img src={selectedFiles.base64} alt={selectedFiles.name} width="200" />
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
                // value={formData.isChecked}
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

export default AddPage;
