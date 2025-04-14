import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const checkHandle = () => {
    setIsChecked(!isChecked);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.fname + " " + formData.lname,
        email: formData.email,
        password: formData.password,
        newsletter: isChecked,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (!json.success) {
      toast.error("User Already Present");
    } else {
      console.log(formData);
      navigate("/login");
    }
  };

  return (
    <div className="container2 mt-5 d-flex flex-column align-items-center jusify-content-center">
      <div className="header d-flex align-items-center jusify-content-center">
        <svg
          width="29"
          height="29"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.1581 1.29367C19.0585 2.12102 16.2358 2.46169 13.2671 11.0758C9.88471 20.9066 11.6124 24.5323 13.2184 26.99C14.3621 28.742 9.3007 28.0363 8.32735 27.063C4.75031 23.5833 9.5197 18.9842 6.64833 17.9379C4.50697 17.1349 6.86734 24.6296 5.11531 24.289C1.4896 23.559 0.34592 15.7965 0.516255 13.4362C0.735258 10.1998 2.07361 10.3215 3.26596 8.8371C4.50697 7.32841 4.94498 5.35739 5.91833 3.67837C7.30534 1.26934 15.8708 -0.799021 18.1581 1.29367ZM11.1987 7.57175C12.0504 6.13607 12.5371 4.62738 11.1257 6.20907C8.88703 8.71543 4.70164 15.6262 8.01102 15.1882C10.2984 14.8718 9.4467 10.5161 11.1987 7.57175Z"
            fill="#4F46E5"
          />
          <path
            d="M28.5035 13.6827C28.4305 16.846 16.0447 15.7024 19.3784 18.9387C22.2011 21.6641 24.8291 16.116 27.4571 16.408C29.0145 16.5784 28.4305 18.5494 28.1142 19.5957C26.7271 24.1705 21.9577 28.5748 17.164 28.5748C11.7133 28.5748 12.1513 17.2354 14.171 11.3953C16.7747 3.90054 19.5001 1.51585 21.1547 2.09985C24.7805 3.34087 28.4305 7.89126 28.0168 11.152C27.7248 13.488 16.9694 13.123 19.427 14.4127C21.3007 15.386 28.5278 12.685 28.5035 13.6827Z"
            fill="#4F46E5"
          />
        </svg>
        <h2 className="ms-2 d-flex align-items-center poppins">
          Rapid Page Builder
        </h2>
      </div>
      <div className="container mt-2 d-flex justify-content-center">
        <div className="reg border p-5" style={{ width: "720px" }}>
          <h4 className="mb-4">Register</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fname">
                First Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-control grey"
                name="fname"
                id="fname"
                placeholder="First Name"
                value={formData.fname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lname">
                Last Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-control grey"
                name="lname"
                placeholder="Last Name"
                value={formData.lname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                Email <span className="req">*</span>
              </label>
              <input
                type="email"
                className="form-control grey"
                name="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fname">
                Password <span className="req">*</span>
              </label>
              <input
                type="password"
                className="form-control grey"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <input
                type="checkbox"
                name="newsletter"
                className="grey me-2"
                placeholder="checkbox"
                checked={isChecked}
                onChange={checkHandle}
              />
              <label className="grey">Subscribe to our newsletter</label>
            </div>
            <div className="mb-3">
              <p className="grey">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our privacy policy.
              </p>
            </div>

            <button type="submit" className="btnReg">
              Register
            </button>
            <Link to="/login" className="alreadyACC">
              Already Have Account?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
