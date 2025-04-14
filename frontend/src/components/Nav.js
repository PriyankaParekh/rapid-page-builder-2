import React from 'react'
import { Link, useNavigate } from "react-router-dom";

function Nav() {
  const profile = JSON.parse(localStorage.getItem("userData"));
  const name1 = profile.data.name.slice(0, 1).toUpperCase();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  return (
    <div>
          <div
        className="d-flex flex-column flex-shrink-0 bg-light"
        style={{ width: "4.5rem", minHeight: "100vh" }}
      >
        <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
          <li>
            <Link
              to="/"
              className="nav-link py-3 border-bottom"
              title=""
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-original-title="Dashboard"
            >
              <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                <path
                  d="M18.1581 1.29367C19.0585 2.12102 16.2358 2.46169 13.2671 11.0758C9.88471 20.9066 11.6124 24.5323 13.2184 26.99C14.3621 28.742 9.3007 28.0363 8.32735 27.063C4.75031 23.5833 9.5197 18.9842 6.64833 17.9379C4.50697 17.1349 6.86734 24.6296 5.11531 24.289C1.4896 23.559 0.34592 15.7965 0.516255 13.4362C0.735258 10.1998 2.07361 10.3215 3.26596 8.8371C4.50697 7.32841 4.94498 5.35739 5.91833 3.67837C7.30534 1.26934 15.8708 -0.799021 18.1581 1.29367ZM11.1987 7.57175C12.0504 6.13607 12.5371 4.62738 11.1257 6.20907C8.88703 8.71543 4.70164 15.6262 8.01102 15.1882C10.2984 14.8718 9.4467 10.5161 11.1987 7.57175Z"
                  fill="#4F46E5"
                />
                <path
                  d="M28.5035 13.6827C28.4305 16.846 16.0447 15.7024 19.3784 18.9387C22.2011 21.6641 24.8291 16.116 27.4571 16.408C29.0145 16.5784 28.4305 18.5494 28.1142 19.5957C26.7271 24.1705 21.9577 28.5748 17.164 28.5748C11.7133 28.5748 12.1513 17.2354 14.171 11.3953C16.7747 3.90054 19.5001 1.51585 21.1547 2.09985C24.7805 3.34087 28.4305 7.89126 28.0168 11.152C27.7248 13.488 16.9694 13.123 19.427 14.4127C21.3007 15.386 28.5278 12.685 28.5035 13.6827Z"
                  fill="#4F46E5"
                />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to="/addpage"
              className="nav-link py-3 border-bottom"
              title=""
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-original-title="Dashboard"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M7.5 1H1V9H7.5V1Z"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 9H10.5V17H17V9Z"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 1H10.5V6H17V1Z"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 11.9998H1V16.9998H7.5V11.9998Z"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to="/list"
              className="nav-link py-3 border-bottom"
              title=""
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-original-title="Dashboard"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 17L16.2333 15.0271C16.4917 14.9751 16.75 14.7154 16.75 14.4039V1.42329C16.75 1.16368 16.5433 0.95609 16.2333 1.00801L9 2.98096"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 2.98438L9 16.4842"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 17L1.76667 15.0271C1.50833 14.9751 1.25 14.7154 1.25 14.4039V1.42329C1.25 1.16368 1.45667 0.95609 1.76667 1.00801L9 2.98096"
                  fill="#6C6B80"
                />
                <path
                  d="M9 17L1.76667 15.0271C1.50833 14.9751 1.25 14.7154 1.25 14.4039V1.42329C1.25 1.16368 1.45667 0.95609 1.76667 1.00801L9 2.98096"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.32031 4.90625L6.93698 5.63311"
                  stroke="#EEF2FF"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.32031 7.5L5.38698 7.91528"
                  stroke="#EEF2FF"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
        </ul>
        <div className="border-top">
          <a
            href="#"
            className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none"
            title=""
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            data-bs-original-title="Dashboard"
          >
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path
                d="M12.8672 9.85332V5.8C12.8672 3.13333 10.721 1 8.03821 1C5.35547 1 3.20927 3.13333 3.20927 5.8V9.85332M3.04838 10.0667L1.06315 13.8533C0.902182 14.12 1.06315 14.3333 1.38508 14.3333H14.6378C14.9598 14.3333 15.0671 14.12 14.9598 13.8533L12.9745 10.0667M10.1845 14.8665C10.1845 16.0398 9.21869 16.9998 8.03829 16.9998C6.85788 16.9998 5.89209 16.0398 5.89209 14.8665"
                stroke="#6C6B80"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#"
            className="d-flex border-top align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle"
            id="dropdownUser3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#6366F1" />
              <circle cx="16" cy="16" r="16" fill="url(#pattern0)" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="16px"
              >
                {name1}
              </text>
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use transform="translate(0 -0.125) scale(0.00260417)" />
                </pattern>
              </defs>
            </svg>
          </a>
          <ul
            className="dropdown-menu text-small shadow"
            aria-labelledby="dropdownUser3"
          >
            <li>
              <button className="dropdown-item" onClick={logout}>
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Nav