import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Blog() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const hasImage = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorHtml, "text/html");
    const images = doc.querySelectorAll("img");
    return images.length > 0;
  };

  const handleClick = () => {
    // Assuming you want to pass formData to the Preview component
    navigate("/", { state: { formData, editorHtml } });
  };
  // Custom component to render content with minimized image
  const MinimizedImage = ({ htmlContent }) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");

    if (images.length > 0) {
      // Set maximum width for images to 200px
      images.forEach((image) => {
        image.style.maxWidth = "200px";
      });
    }

    return <div dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
  };
  useEffect(() => {
    fetchdata();
  }, [params.url]);
  const [formData, setFormData] = useState({});
  const [editorHtml, setEditorHtml] = useState("");
  const [author, setAuthor] = useState("");
  const fetchdata = async () => {
    console.log(params.url);
    try {
      const response = await fetch(
        `http://localhost:5000/v1/getblog/${params.url}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (!responseData.success) {
        toast.error("Data not found");
        navigate("/");
      } else {
        console.log(responseData);
        setData(responseData.data.data[0]); // Update state with fetched data
        setFormData({
          title: responseData.data.data[0].title,
          subtext: responseData.data.data[0].subtext,
          attach: responseData.data.data[0].attach,
          url: responseData.data.data[0].url,
          showAuthor: responseData.data.data[0].showAuthor,
        });
        setEditorHtml(responseData.data.data[0].body);
        // console.log(responseData.data.data[0].attach);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex overflow-hidden">
      <div
        className="d-flex justify-content-center align-items-center ms-auto me-auto"
        style={{ minHeight: "100vh", maxWidth: "90rem" }}
      >
        <div className="border p-5">
          <button className="btn btn-primary mb-3" onClick={handleClick}>
            Back
          </button>
          <div className="blog">
            {/* https://sheknowsseo.co/wp-content/uploads/2022/12/laptop-digital-nomad-table.jpg */}
            <img className="imgg mb-2" src={formData.attach} alt="" />
            <h3 className="form-control">Title: {formData.title}</h3>
            <h5 className="form-control">Subtext: {formData.subtext}</h5>
            <div className="">
              <div className="form-control border p-4 d-flex justify-content-center align-items-center">
                <MinimizedImage htmlContent={editorHtml} />
                {!hasImage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
