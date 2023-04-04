import { Dropdown } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import Profile from "../../images/profile.png";
import Search from "../../images/search-icon.svg";
import Left from "../../images/left-arrow-icon.svg";
import { Link } from "react-router-dom";
import Logo from "../../images/logo.svg";
import { withRouter } from "../../Navigate";
import { PostApi } from "../../ApiService";
import { API_Path } from "../../const";
import Context from "../../contex/Context";
import defaultImg from "../../images/defaultImg.PNG";

function Header(props) {
  const context = useContext(Context);
  const [profile, setprofile] = useState([]);

  const isLogged_in = localStorage.getItem("loop_token") ? true : false;

  let userPermission = null;
  let loginUser = null;
  let userRole = "";

  if (isLogged_in) {
    loginUser = JSON.parse(localStorage.getItem("userData"));

    userRole = loginUser?.role;
    if (userRole === 2) {
      userPermission = JSON.parse(localStorage.getItem("userPermission"));
    }
  }
  const addmainclass = () => {
    document.getElementById("root").classList.toggle("dash-main-class-add");
  };

  const openUserinfo = () => {
    document.getElementById("user-detail").classList.toggle("active-user-info");
  };
  const logout = () => {
    localStorage.clear();
    props.navigate("/login");
  };

  useEffect(() => {
    const profilepromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getprofile));
    });
    profilepromise.then((response) => {
      if (response.status === 200) {
        setprofile(response.data.data.user);
      } else {
      }
    });
  }, []);

  return (
    <>
      <header className="header-fix-top-section">
        <div onClick={addmainclass} className="d-xl-none">
          <img src={Left} className="me-md-3 me-0 img-fluid" alt="arrow" />
        </div>
        <div className="d-xl-none pe-sm-3 pe-1 respo-logo-top ps-sm-3 ps-2">
          <Link to="/dashboard" className="d-inline-flex align-items-center cursor-pointer justify-content-center">
            <a>
              <img src={Logo} className="img-fluid" alt="logo" />
            </a>
          </Link>
        </div>

        <div className="ms-auto mobile-responsive-info" id="user-detail">
          <div className="mobile-responsive-info-inr">
            <div className="dropdown-header p-0 ms-3">
              <Dropdown>
                <Dropdown.Toggle id="dropdown">
                  {profile.profile_img == "" ? <img src={defaultImg} alt="profile" /> : <img src={profile.profile_img} alt="profile" />}
                  <div className="ps-2 text-start">
                    <span className="d-block">{profile.fname}</span>
                    <bdi className="d-block">{userRole === 1 ? "Admin" : "User"} </bdi>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                  <Dropdown.Item href="/" onClick={logout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="d-md-none" onClick={openUserinfo}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
          </svg>
        </div>
      </header>
    </>
  );
}

export default withRouter(Header);
