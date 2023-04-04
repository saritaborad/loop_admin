import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout/layout";
import { Tabs, Tab } from "react-bootstrap";
import { GetApi, PostApi } from "../ApiService";
import { API_Path } from "../const";
import loaderimg from "../images/loader.gif";
import Context from "../contex/Context";
import defaultImg from "../images/defaultImg.PNG";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const context = useContext(Context);
  const navigate = useNavigate();
  const [profile, setprofile] = useState([]);
  const [loader, setLoader] = useState(true);
  const [parish, setParish] = useState("");
  const [parishList, setParishList] = useState([]);

  useEffect(() => {
    const profilepromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getprofile));
    });
    profilepromise.then((response) => {
      if (response.status === 200) {
        setprofile(response.data.data.user);
        setLoader(false);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    getParish();
  }, []);

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

  const parishForm = (e) => {
    e.preventDefault();
    return false;
  };

  const handleChangeParish = (e) => {
    setParish(e.target.value);
  };

  const pressParish = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    } else {
    }
  };

  const getParish = () => {
    const getParishListpromise = new Promise((resolve, reject) => {
      resolve(GetApi(API_Path.getParish));
    });
    getParishListpromise.then((response) => {
      if (response.status === 200) {
        setParishList(response.data.data);
      }
    });
  };

  const addParish = (e) => {
    if (parish == "") {
      toastr.error("Parish name is required");
    }
    if (parish != "") {
      let data = {
        parish: parish.toLowerCase(),
      };
      const addParishpromise = new Promise((resolve, reject) => {
        resolve(PostApi(API_Path.addParish, data));
      });
      addParishpromise.then((response) => {
        if (response.status === 200) {
          toastr.success(response.data.message);
          setParish("");
          getParish();
        } else {
          toastr.error(response.data.message);
        }
      });
    }
  };

  const removeParish = (id) => {
    let data = {
      id: id,
    };
    const removeParishPromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.removeParish, data));
    });
    removeParishPromise.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        toastr.success(response.data.message);
        getParish();
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  return (
    <>
      <Layout>
        {loader && (
          <div className="cust-loader">
            <img src={loaderimg} className="loader" />
          </div>
        )}
        <div className="content-main-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="common-tabs-class">
                  <Tabs defaultActiveKey="my-profile" className="my-3">
                    <Tab eventKey="my-profile" title="My Profile">
                      <div className="white-box-main">
                        <div className="dtels-info-main">
                          <div className="dtels-info-imgs me-md-5">{loader == true || profile.profile_img == "" ? <img src={defaultImg} alt="Profile placeholder image" className="w-100 h-100" /> : <img src={profile.profile_img} alt="Profile placeholder image" className="w-100 h-100" />}</div>
                          <div className="dtels-info-text w-100">
                            <div className="dtels-info-text-inr">
                              <p className="d-block">First Name</p>
                              <bdi className="d-block">: {profile?.fname} </bdi>
                            </div>
                            <div className="dtels-info-text-inr">
                              <p className="d-block">Last Name</p>
                              <bdi className="d-block">: {profile?.lname} </bdi>
                            </div>
                            <div className="dtels-info-text-inr">
                              <p className="d-block">Email</p>
                              <bdi className="d-block">: {profile?.email} </bdi>
                            </div>
                            <div className="dtels-info-text-inr">
                              <p className="d-block">Address</p>
                              <bdi className="d-block">: {profile?.address} </bdi>
                            </div>
                            <div className="dtels-info-text-inr">
                              <p className="d-block">Country</p>
                              <bdi className="d-block">: {profile?.country} </bdi>
                            </div>

                            {userRole === 1 ? (
                              ""
                            ) : (
                              <div className="common-title-in mt-4">
                                <h5>Permissions</h5>
                                <div className="row">
                                  <div className="col-lg-3 col-sm-6 mb-2">
                                    <span className="d-block">Newsfeed</span>
                                    <p>{userPermission.allowToSendPushNotification === 1 ? "Allow To Send PushNotification" : ""}</p>
                                    <p>{userPermission.allowToPostToNewsFeed === 1 ? "Allow To Post To News Feed" : ""}</p>
                                  </div>
                                  <div className="col-lg-3 col-sm-6 mb-2">
                                    <span className="d-block">User</span>
                                    <p>{userPermission.viewUsers === 1 ? "View Users" : ""}</p>
                                    <p>{userPermission.editUsers === 1 ? "Edit Users" : ""}</p>
                                  </div>
                                  <div className="col-lg-3 col-sm-6 mb-2">
                                    <span className="d-block">Submissions</span>
                                    <p>{userPermission.viewSubmissions === 1 ? "View Submissions" : ""}</p>
                                    <p>{userPermission.respondToSubmissions === 1 ? "Respond To Submissions" : ""}</p>
                                  </div>
                                  <div className="col-lg-3 col-sm-6 mb-2">
                                    <span className="d-block">Settings</span>
                                    <p>{userPermission.viewActivityLog === 1 ? "View Activity Log" : ""}</p>
                                    <p>{userPermission.viewSystemStatus === 1 ? "View System Status" : ""}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="mt-md-5 mt-3">
                              <div className="row">
                                <div className="col-lg-7">
                                  <div className="row">
                                    <div className="col-sm-6 mb-2">
                                      <button type="button" className="btn-comn-all w-100" onClick={() => navigate("/edit-profile")}>
                                        <span className="position-relative">edit Profile</span>
                                      </button>
                                    </div>
                                    <div className="col-sm-6 mb-2">
                                      <button type="button" className="btn-comn-all-2 w-100" onClick={() => navigate("/change-password")}>
                                        <span className="position-relative">Change Passoword</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="parish" title="Parish">
                      <div className="tabs-content-part">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <div className="comn-title-info">
                                <h2>Parish</h2>
                              </div>
                              <form onSubmit={(e) => parishForm(e)}>
                                <div className="d-sm-flex">
                                  <div className="add-parish-in w-50">
                                    <input type="text" className="form-control frnt-input-style" placeholder="Add New Parish" value={parish} onChange={(e) => handleChangeParish(e)} onKeyPress={(e) => pressParish(e)} />
                                  </div>
                                  <div className="ms-sm-2  mt-sm-0 mt-3">
                                    <button type="button" className="btn-comn-all px-4 w-100" onClick={(e) => addParish(e)}>
                                      <span className="position-relative">Add</span>
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="add-parish-main">
                              {parishList &&
                                parishList.map((item, i) => {
                                  return (
                                    <label className="add-data-box" id={item.parish} key={i}>
                                      <bdi>
                                        {item.parish}
                                        <span className="ms-2 cursor-pointer" onClick={() => removeParish(item._id)}>
                                          x
                                        </span>
                                      </bdi>
                                    </label>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
