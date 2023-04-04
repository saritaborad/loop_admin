import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout/layout";
import { Tabs, Tab } from "react-bootstrap";
import AWS from "../images/aws.svg";
import Twilio from "../images/twilio.svg";
import Stripe from "../images/stripe.svg";
import Google_Analytics from "../images/google-analytics.svg";
import { GetApi, PostApi } from "../ApiService";
import { API_Path } from "../const";
import toastr from "toastr";
import AdminUsers from "./AdminUsers";
import defaultImg from "../images/defaultImg.PNG";
import moment from "moment";
import loaderimg from "../images/loader.gif";

export default function Settings() {
  const [Interestlist, setInterestlist] = useState([]);
  const [interest, setinterest] = useState("");
  const [activityData, setActivityData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const monthRef = useRef(null);
  const [loader, setLoader] = useState(true);

  const isLogged_in = localStorage.getItem("loop_token") ? true : false;

  let userPermission = null;
  let loginUser = null;
  let userRole = "";
  let viewActivityLog = "";
  let viewSystemStatus = "";

  if (isLogged_in) {
    loginUser = JSON.parse(localStorage.getItem("userData"));
    userRole = loginUser?.role;
    if (userRole === 2) {
      userPermission = JSON.parse(localStorage.getItem("userPermission"));
      viewActivityLog = userPermission?.viewActivityLog;
      viewSystemStatus = userPermission?.viewSystemStatus;
    }
  }

  var d = "";

  {
    userRole == 1 ? (d = "admin-users") : viewActivityLog == 1 ? (d = "activity-logs") : (d = "system-status");
  }

  useEffect(() => {
    getinterest();
  }, []);

  useEffect(() => {
    userRole == 1 && getDateApi();
  }, [0]);

  useEffect(() => {
    d == "activity-logs" && getDateApi();
  }, [0]);

  const getDateApi = (startDate, endDate) => {
    const addemployeepromise = new Promise((resolve) => {
      let data = {
        startDate: startDate === "" ? "" : startDate,
        endDate: endDate === "" ? "" : endDate,
      };
      resolve(PostApi(API_Path.getempActivities, data));
    });
    addemployeepromise.then((response) => {
      setLoader(false);
      if (response.data.success) {
        setActivityData(response.data.data);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const selectStartDate = (e) => {
    monthRef.current.value = "";
    let startValue = moment(e.target?.value).format("YYYY-MM-DD");
    setStartDate(startValue);
  };
  const selectEndDate = (e) => {
    let endValue = moment(e.target?.value).format("YYYY-MM-DD");
    setEndDate(endValue);
    getDateApi(startDate, endValue);
  };

  const selectMonth = (e) => {
    startDateRef.current.value = "";
    endDateRef.current.value = "";

    var startDate = `${moment().year()}-${moment(e.target.value).format("MM")}-01`;
    var endDate = `${moment().year()}-${moment(e.target.value).format("MM")}-31`;

    getDateApi(startDate, endDate);
  };

  const getinterest = () => {
    const getinterestsListpromise = new Promise((resolve, reject) => {
      resolve(GetApi(API_Path.getinterest));
    });
    getinterestsListpromise.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        setInterestlist(response.data.data.Interest);
      }
    });
  };

  const removeinterest = (id) => {
    let data = {
      id: id,
    };
    const removeinterestpromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.removeinterest, data));
    });
    removeinterestpromise.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        toastr.success(response.data.message);
        getinterest();
      } else {
        toastr.error(response.data.message);
      }
    });
  };
  const handleChangeinterest = (e) => {
    setinterest(e.target.value);
  };

  const addinterest = (e) => {
    if (interest == "") {
      toastr.error("Interest name is required");
    }
    if (interest !== "") {
      let data = {
        interest: interest.toLowerCase(),
      };
      const addinterestpromise = new Promise((resolve, reject) => {
        resolve(PostApi(API_Path.addinterest, data));
      });
      addinterestpromise.then((response) => {
        setLoader(false);
        if (response.status === 200) {
          toastr.success(response.data.message);
          setinterest("");
          getinterest();
        } else {
          toastr.error(response.data.message);
        }
      });
    }
  };

  const interestform = (e) => {
    e.preventDefault();
    return false;
  };

  const pressinterest = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    } else {
    }
  };
  var dtToday = moment(new Date()).format("YYYY-MM-DD");

  return (
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
              <div className="comn-title-info">
                <h1>Settings</h1>
              </div>
            </div>
            <div className="col-12">
              <div className="common-tabs-class">
                <Tabs defaultActiveKey={d} className="">
                  {userRole === 1 && (
                    <Tab eventKey="admin-users" title="Admin Users">
                      <AdminUsers />
                    </Tab>
                  )}
                  {userRole === 1 || viewActivityLog == 1 ? (
                    <Tab eventKey="activity-logs" title="Activity Logs">
                      <div className="tabs-content-part">
                        <div className="d-lg-flex d-block align-items-center">
                          <div className="comn-title-info">
                            <h2>Activity</h2>
                          </div>
                          <div className="ms-auto">
                            <div className="d-md-flex align-items-center">
                              <div className="mb-3 ms-2">
                                <label className="lbl-frnt-side">Select Date Range </label>
                              </div>
                              <div className="mb-3 ms-2">
                                <div className="inr-date-range" onChange={selectStartDate}>
                                  <input type="date" ref={startDateRef} max={dtToday} className="form-control comn-class" placeholder="02/15/2022" />
                                </div>
                              </div>
                              <div className="mb-3 ms-2">
                                <div className="inr-date-range" onChange={selectEndDate}>
                                  <input type="date" ref={endDateRef} max={dtToday} className="form-control comn-class" placeholder="03/15/2022" />
                                </div>
                              </div>
                              <div className="">
                                <div className="mb-3 ms-2">
                                  <select className="frnt-input-style form-select w-100" ref={monthRef} name="monthRange" onChange={(e) => selectMonth(e)}>
                                    <option value="" selected hidden>
                                      Month
                                    </option>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="comn-box-in">
                          {activityData == "" ? (
                            <div className="text-center">
                              <i>
                                <b>--- Data not found --- </b>
                              </i>
                            </div>
                          ) : (
                            activityData &&
                            activityData.map((userActivity, i) => (
                              <div key={i}>
                                <div className="activity-date">{userActivity.date}</div>
                                <div className="act-detail-main">
                                  <div className="d-inline-block">{userActivity.user == null || userActivity.user.profile_img == "" ? <img src={defaultImg} className="user-tabl-image" alt="" /> : <img src={userActivity.user.profile_img} className="user-tabl-image" alt="" />}</div>
                                  <div className="ms-sm-3">
                                    <bdi>
                                      {userActivity?.user?.fname} <span>{userActivity?.message}</span>
                                    </bdi>
                                    <span className="d-block">{userActivity?.time}</span>
                                  </div>
                                </div>
                                <div />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </Tab>
                  ) : (
                    ""
                  )}

                  {userRole === 1 || viewSystemStatus == 1 ? (
                    <Tab eventKey="system-status" title="System Status">
                      <div className="tabs-content-part">
                        <div className="comn-title-info">
                          <h2>Status</h2>
                        </div>
                        <div className="comn-box-in">
                          <div className="set-status-main">
                            <div className="set-status-img">
                              <img src={AWS} alt="aws" />
                            </div>
                            <div className="ms-sm-4 my-sm-0 my-3">
                              <h5>AWS</h5>
                              <p>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6.33301 3.66634H7.66634V4.99967H6.33301V3.66634ZM6.33301 6.33301H7.66634V10.333H6.33301V6.33301ZM6.99967 0.333008C3.31967 0.333008 0.333008 3.31967 0.333008 6.99968C0.333008 10.6797 3.31967 13.6663 6.99967 13.6663C10.6797 13.6663 13.6663 10.6797 13.6663 6.99968C13.6663 3.31967 10.6797 0.333008 6.99967 0.333008ZM6.99967 12.333C4.05967 12.333 1.66634 9.93968 1.66634 6.99968C1.66634 4.05967 4.05967 1.66634 6.99967 1.66634C9.93967 1.66634 12.333 4.05967 12.333 6.99968C12.333 9.93968 9.93967 12.333 6.99967 12.333Z" fill="#030303" />
                                </svg>
                                Your AWS account is not active.
                              </p>
                            </div>
                            <div className="ms-auto">
                              <div className="set-status-class not-active-class">Not Active</div>
                            </div>
                          </div>
                        </div>
                        <div className="comn-box-in">
                          <div className="set-status-main">
                            <div className="set-status-img">
                              <img src={Twilio} alt="Twilio" />
                            </div>
                            <div className="ms-sm-4 my-sm-0 my-3">
                              <h5>Twilio</h5>
                              <p>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6.33301 3.66634H7.66634V4.99967H6.33301V3.66634ZM6.33301 6.33301H7.66634V10.333H6.33301V6.33301ZM6.99967 0.333008C3.31967 0.333008 0.333008 3.31967 0.333008 6.99968C0.333008 10.6797 3.31967 13.6663 6.99967 13.6663C10.6797 13.6663 13.6663 10.6797 13.6663 6.99968C13.6663 3.31967 10.6797 0.333008 6.99967 0.333008ZM6.99967 12.333C4.05967 12.333 1.66634 9.93968 1.66634 6.99968C1.66634 4.05967 4.05967 1.66634 6.99967 1.66634C9.93967 1.66634 12.333 4.05967 12.333 6.99968C12.333 9.93968 9.93967 12.333 6.99967 12.333Z" fill="#030303" />
                                </svg>
                                Your Twilio account is not active.
                              </p>
                            </div>
                            <div className="ms-auto">
                              <div className="set-status-class not-active-class">Not Active</div>
                            </div>
                          </div>
                        </div>
                        <div className="comn-box-in">
                          <div className="set-status-main">
                            <div className="set-status-img">
                              <img src={Stripe} alt="Stripe" />
                            </div>
                            <div className="ms-sm-4 my-sm-0 my-3">
                              <h5>Stripe</h5>
                            </div>
                            <div className="ms-auto">
                              <div className="set-status-class active-class">Active</div>
                            </div>
                          </div>
                        </div>
                        <div className="comn-box-in">
                          <div className="set-status-main">
                            <div className="set-status-img">
                              <img src={Google_Analytics} alt="Google Analytics" />
                            </div>
                            <div className="ms-sm-4 my-sm-0 my-3">
                              <h5>Google Analytics</h5>
                              <p>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6.33301 3.66634H7.66634V4.99967H6.33301V3.66634ZM6.33301 6.33301H7.66634V10.333H6.33301V6.33301ZM6.99967 0.333008C3.31967 0.333008 0.333008 3.31967 0.333008 6.99968C0.333008 10.6797 3.31967 13.6663 6.99967 13.6663C10.6797 13.6663 13.6663 10.6797 13.6663 6.99968C13.6663 3.31967 10.6797 0.333008 6.99967 0.333008ZM6.99967 12.333C4.05967 12.333 1.66634 9.93968 1.66634 6.99968C1.66634 4.05967 4.05967 1.66634 6.99967 1.66634C9.93967 1.66634 12.333 4.05967 12.333 6.99968C12.333 9.93968 9.93967 12.333 6.99967 12.333Z" fill="#030303" />
                                </svg>
                                Your Google Analytics account is not active.
                              </p>
                            </div>
                            <div className="ms-auto">
                              <div className="set-status-class not-active-class">Not Active</div>
                            </div>
                          </div>
                        </div>
                        <div className="comn-box-in">
                          <div className="set-status-main">
                            <div className="set-status-img">
                              {/* <img src={Google_AdWords} alt="Google AdWords" /> */}
                              <svg width="41" height="38" viewBox="0 0 41 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M29.7415 37.8484H38.8108L26.3975 0.608398V36.4297C27.2588 37.2911 28.4241 37.8484 29.7415 37.8484Z" fill="#0F9D59" />
                                <path d="M20.165 19.2028L25.3837 34.7575C25.5864 35.4162 25.9917 35.9735 26.4477 36.4295V0.506836L20.165 19.2028Z" fill="#0A6E3D" />
                                <path d="M13.9329 0.557617L1.51953 37.7976H10.5889C11.9062 37.7976 13.0715 37.2403 13.9329 36.3789C14.3889 35.9229 14.7435 35.3656 14.9969 34.7069L26.3969 0.557617H13.9329Z" fill="#4284F4" />
                              </svg>
                            </div>
                            <div className="ms-sm-4 my-sm-0 my-3">
                              <h5>Google AdWords</h5>
                            </div>
                            <div className="ms-auto">
                              <div className="set-status-class active-class">Active</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  ) : (
                    ""
                  )}

                  {userRole === 1 && (
                    <Tab eventKey="edit-interests" title="Edit Interests">
                      <div className="tabs-content-part">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <div className="comn-title-info">
                                <h2>Interests</h2>
                              </div>
                              <form onSubmit={(e) => interestform(e)}>
                                <div className="d-sm-flex">
                                  <div className="add-parish-in w-50">
                                    <input type="text" className="form-control frnt-input-style" placeholder="Add New Interests" value={interest} onChange={(e) => handleChangeinterest(e)} onKeyPress={(e) => pressinterest(e)} />
                                  </div>
                                  <div className="ms-sm-2  mt-sm-0 mt-3">
                                    <button type="button" className="btn-comn-all px-4 w-100" onClick={(e) => addinterest(e)}>
                                      <span className="position-relative">Add</span>
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="add-parish-main">
                              {Interestlist.length > 0 &&
                                Interestlist.map((item, i) => {
                                  return (
                                    <>
                                      <label className="add-data-box" id={item.interest} key={i}>
                                        <bdi>
                                          {item.interest}
                                          <span className="ms-2 cursor-pointer" onClick={() => removeinterest(item._id)}>
                                            x
                                          </span>
                                        </bdi>
                                      </label>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
