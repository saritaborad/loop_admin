import React, { useState } from "react";
import Layout from "../components/Layout/layout";
import { Dropdown, Modal, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import Tick from "../images/bluetick.svg";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { useEffect } from "react";
import SharedAsPostTip from "./SharedAsPostTip";
import toastr from "toastr";
import { Formik } from "formik";
import * as Yup from "yup";
import ScheduleTips from "./ScheduleTips";
import ReactPaginate from "react-paginate";
import defaultImg from "../images/defaultImg.PNG";
import defaultLoopImg from "../images/defaultLoopImg.png";
import loaderimg from "../images/loader.gif";


export default function SubmittedTipsUser() {

  const [sharePostModalShow, setSharePostModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [scheduleModalShow, setScheduleModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState("recent-tip-tab");
  const [recentTips, setRecentTips] = useState([]);
  const [sharedTips, setSharedTips] = useState([]);
  const [doneTips, setDoneTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [userActionId, setUserActionId] = useState();
  const [loader, setLoader] = useState(true);
  const [option1, set_option1] = useState({
    sizePerPage1: 10,
    search1: "",
    totalRecord1: "",
    page1: 0,
    sort1: "",
    order1: "",
  });

  const [option2, set_option2] = useState({
    sizePerPage2: 10,
    search2: "",
    totalRecord2: "",
    page2: 0,
    sort2: "",
    order2: "",
  });

  const [option3, set_option3] = useState({
    sizePerPage3: 10,
    search3: "",
    totalRecord3: "",
    page3: 0,
    sort3: "",
    order3: "",
  });

  useEffect(() => {
    getRecentTipsData(option1.page1);
    getSharedTipsData(option2.page2);
    getDoneTipsData(option3.page3);
  }, []);

  useEffect(() => {
    getRecentTipsData(option1.page1);
  }, []);

  const handlePageClick1 = (e) => {
    getRecentTipsData(e.selected);
  };

  const handlePageClick2 = (e) => {
    getSharedTipsData(e.selected);
  };

  const handlePageClick3 = (e) => {
    getDoneTipsData(e.selected);
  };

  const getRecentTipsData = (page1, tab) => {
    let data = {
      page: page1 + 1,
      limit: 10,
    };
    const getRecentTipsList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getRecentTips, data));
    });

    getRecentTipsList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var tips = response.data?.data?.tips;
        setRecentTips(tips);
        setActiveTab(tab);
        set_option1({
          totalRecord1: response.data.data.totaltips,
          page1: page1,
          sizePerPage1: 10,
        });
      }
    });
  };

  const getSharedTipsData = (page2, tab) => {
    let data = {
      page: page2 + 1,
      limit: 10,
    };
    const getSharedTipsList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getSharedTips, data));
    });

    getSharedTipsList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var tips = response.data?.data.sharedTips;
        setSharedTips(tips);
        setActiveTab(tab);
        set_option2({
          totalRecord2: response.data.data.totalsharedtips,
          page2: page2,
          sizePerPage2: 10,
        });
      }
    });
  };

  const getDoneTipsData = (page3, tab) => {
    let data = {
      page: page3 + 1,
      limit: 10,
    };
    const getDoneTipsList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getTipsDoneList, data));
    });

    getDoneTipsList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var tips = response.data?.data.completedTips;
        setDoneTips(tips);
        setActiveTab(tab);
        set_option3({
          totalRecord3: response.data.data.totalcompletedtips,
          page3: page3,
          sizePerPage3: 10,
        });
      }
    });
  };

  const showShareNewsFeed_handle = (tipData) => {
    setSelectedTip(tipData);
    setSharePostModalShow(true);
  };

  const markAsDone = (tips) => {
    var params = {
      id: tips._id,
    };

    const markDoneTipData = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.markTipAsDone, params));
    });

    markDoneTipData.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        getDoneTipsData(option3.page3);
        getRecentTipsData(option1.page1);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const handleTabChange = (tab) => {
    if (tab === "recent-tip-tab") {
      getRecentTipsData();
      set_option1("");
    } else if (tab === "shared-newsfeed-tab1") {
      getSharedTipsData();
      set_option2("");
    } else if (tab === "completed-tab") {
      getDoneTipsData();
      set_option3("");
    } else {
      setActiveTab(option1.page1);
    }
  };

  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const editTipLink = (formData, resetForm) => {

    const editLink = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.editTip, formData));
    });

    editLink.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        setEditModalShow(false);
        getRecentTipsData(activeTab, option1.page1);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const dismissTip = () => {
    let id = { id: userActionId._id };

    const dismissTipPromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.dismissTip, id));
    });

    dismissTipPromise.then((response) => {
      if (response.status === 200) {
        setDeleteModalShow(false);
        toastr.success(response.data.message);
        getRecentTipsData(option1.page1);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const editLink_handle = (tip) => {
    setSelectedTip(tip);
    setEditModalShow(true);
  };

  const scheduleTip_handle = (tip) => {
    setSelectedTip(tip);
    setScheduleModalShow(true);
  };

  const scheduleDismissTip_handle = (tip) => {
    setUserActionId(tip);
    setDeleteModalShow(true);
  };

  const isLogged_in = localStorage.getItem("loop_token") ? true : false;

  let userPermission = null;
  let loginUser = null;
  let userRole = "";
  let respondToSubmissions = "";

  if (isLogged_in) {
    loginUser = JSON.parse(localStorage.getItem("userData"));
    userRole = loginUser?.role;
    if (userRole === 2) {
      userPermission = JSON.parse(localStorage.getItem("userPermission"));
      respondToSubmissions = userPermission?.respondToSubmissions;
    }
  }

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
              <div className="comn-title-info d-sm-flex align-items-center">
                <h1>Submitted Tips By Users</h1>
              </div>
            </div>
            <div className="col-12">
              <Tab.Container id="left-tabs-example" defaultActiveKey="recent-tip-tab" onSelect={(k) => handleTabChange(k)}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="white-box-commn-tab">
                      <Nav>
                        <Nav.Item>
                          <Nav.Link eventKey="recent-tip-tab">Recent Tips</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="shared-newsfeed-tab1">Shared to NewsFeed</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="completed-tab">Completed</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <div className="col-md-12 py-3">
                    <Tab.Content>
                      <Tab.Pane eventKey="recent-tip-tab">
                        <ul>
                          {recentTips &&
                            recentTips.length > 0 ?
                            recentTips.map((tip, index) => {
                              return (
                                <li className="my-3" key={index}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {tip.image === "" || tip.hasOwnProperty("image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : tip.image?.[0]?.includes(".mp4") || tip.image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={tip.image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={tip.image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex">
                                            <div className="mb-2 latest-news-small-header">
                                              <div className="d-flex align-items-center mb-1">
                                                <div className="prayer-profile me-3">{tip.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={tip.user?.profile_img} />}</div>
                                                <div className=" py-2">
                                                  <h4 className="m-0">{tip.user?.fname + " " + tip.user?.lname}</h4>
                                                </div>
                                              </div>

                                              <span>
                                                {tip.user?.fname + " " + tip.user?.lname}
                                                <span>&#9679; {tip.timeElapsed}</span>
                                              </span>
                                              {/* <span>
                                                <Moment format="DD/MM/YY | hh:mm a" date={tip.createdAt} />
                                              </span> */}
                                            </div>

                                            {userRole === 1 || respondToSubmissions === 1 ? (
                                              <div className="ms-auto">
                                                <div className="cust-drop-down">
                                                  <Dropdown>
                                                    <Dropdown.Toggle id="dropdown-basic" className="cust-drop-btn">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                      </svg>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                      <ul>
                                                        <li onClick={() => editLink_handle(tip)}>
                                                          <Dropdown.Item>Edit</Dropdown.Item>
                                                        </li>
                                                        {/* <li>
                                                          <Dropdown.Item>Post Tip</Dropdown.Item>
                                                        </li> */}
                                                        <li onClick={() => scheduleTip_handle(tip)}>
                                                          <Dropdown.Item>Schedule Tip</Dropdown.Item>
                                                        </li>
                                                        <li onClick={() => scheduleDismissTip_handle(tip)}>
                                                          <Dropdown.Item>Dismiss Tip</Dropdown.Item>
                                                        </li>
                                                      </ul>
                                                    </Dropdown.Menu>
                                                  </Dropdown>
                                                </div>
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <Link to="/">{tip.link}</Link>
                                            <p>
                                              <ReactReadMoreReadLess charLimit={100} readMoreText={"Read more"} readLessText={"Read less"}>
                                                {tip.hasOwnProperty("description") === false ? "" : tip.description}

                                                {/* {tip.description} */}
                                              </ReactReadMoreReadLess>
                                            </p>
                                          </div>
                                          {userRole === 1 || respondToSubmissions === 1 ? (
                                            <div className="mt-auto">
                                              <div className="row">
                                                <div className="col-xxl-4 col-lg-5 col-sm-6">
                                                  <div>
                                                    <button className="btn-comn-all-2 w-100" type="button" onClick={() => showShareNewsFeed_handle(tip)}>
                                                      <span className="position-relative">Share On NewsFeed</span>
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className="col-xl-2 col-sm-3 mt-3 mt-sm-0">
                                                  <div>
                                                    <button className="btn-comn-all w-100" type="button" onClick={() => markAsDone(tip)}>
                                                      <span className="position-relative">Done</span>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="mt-auto">
                                              <div className="row">
                                                <div className="col-xxl-4 col-lg-5 col-sm-6">
                                                  <div>
                                                    <button hidden className="btn-comn-all-2 w-100" type="button" onClick={() => showShareNewsFeed_handle(tip)}>
                                                      <span className="position-relative">Share On NewsFeed</span>
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className="col-xl-2 col-sm-3 mt-3 mt-sm-0">
                                                  <div>
                                                    <button hidden className="btn-comn-all w-100" type="button" onClick={() => markAsDone(tip)}>
                                                      <span className="position-relative">Done</span>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
                            : (
                              <div className="news-feed-main-box py-5">
                                <div className="text-center">
                                  <i>
                                    <b>--- Data not found --- </b>
                                  </i>
                                </div>
                              </div>
                            )}
                        </ul>
                        {option1.totalRecord1 > 10 && (
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center">
                              <ReactPaginate
                                className="pagination"
                                pageClassName="page-item"
                                activeClassName="active"
                                breakLabel="..."
                                breakLinkClassName="page-link"
                                breakClassName="page-item"
                                previousLabel={
                                  <span aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left me-2">
                                      <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                previousClassName="page-item"
                                nextLabel={
                                  <span aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right ms-2">
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                nextClassName="page-item"
                                pageLinkClassName="page-link"
                                pageRangeDisplayed={2}
                                onPageActive={option1.page1}
                                pageCount={option1.totalRecord1 / option1.sizePerPage1}
                                renderOnZeroPageCount={null}
                                onPageChange={(e) => handlePageClick1(e)}
                                forcePage={0}
                              />
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="shared-newsfeed-tab1">
                        <ul>
                          {sharedTips &&
                            sharedTips.length > 0 ?
                            sharedTips.map((tip, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {tip.image === "" || tip.hasOwnProperty("image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : tip.image?.[0]?.includes(".mp4") || tip.image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={tip.image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={tip.image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex">
                                            <div className="mb-2 latest-news-small-header">
                                              <div className="d-flex align-items-center mb-1">
                                                <div className="prayer-profile me-3">{tip.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={tip.user?.profile_img} />}</div>
                                                <div className=" py-2">
                                                  <h4 className="m-0">{tip.user?.fname + " " + tip.user?.lname}</h4>
                                                </div>
                                              </div>
                                              <span>
                                                {tip.user?.fname + " " + tip.user?.lname}
                                                <span>&#9679; {tip.timeElapsed}</span>
                                              </span>
                                            </div>

                                            {/* <div className="ms-auto">
                                                                                            <div className='cust-drop-down'>
                                                                                                <Dropdown>
                                                                                                    <Dropdown.Toggle id="dropdown-basic" className='cust-drop-btn'>
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                                                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                                                                        </svg>
                                                                                                    </Dropdown.Toggle>
                                                                                                    <Dropdown.Menu>
                                                                                                        <ul>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Edit</Dropdown.Item>
                                                                                                            </li>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Post Tip</Dropdown.Item>
                                                                                                            </li>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Schedule Tip</Dropdown.Item>
                                                                                                            </li>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Dismiss Tip</Dropdown.Item>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </Dropdown.Menu>
                                                                                                </Dropdown>
                                                                                            </div>
                                                                                        </div> */}
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <Link to="/">{tip.link}</Link>
                                            <p>
                                              <ReactReadMoreReadLess charLimit={100} readMoreText={"Read more"} readLessText={"Read less"}>
                                                {tip.description}
                                              </ReactReadMoreReadLess>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
                            : (
                              <div className="news-feed-main-box py-5">
                                <div className="text-center">
                                  <i>
                                    <b>--- Data not found --- </b>
                                  </i>
                                </div>
                              </div>
                            )}
                        </ul>
                        {option2.totalRecord2 > 10 && (
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center">
                              <ReactPaginate
                                className="pagination"
                                pageClassName="page-item"
                                activeClassName="active"
                                breakLabel="..."
                                breakLinkClassName="page-link"
                                breakClassName="page-item"
                                previousLabel={
                                  <span aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left me-2">
                                      <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                previousClassName="page-item"
                                nextLabel={
                                  <span aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right ms-2">
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                nextClassName="page-item"
                                pageLinkClassName="page-link"
                                pageRangeDisplayed={2}
                                onPageActive={option2.page2}
                                pageCount={option2.totalRecord2 / option2.sizePerPage2}
                                renderOnZeroPageCount={null}
                                onPageChange={(e) => handlePageClick2(e)}
                                forcePage={0}
                              />
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="completed-tab">
                        <ul>
                          {doneTips &&
                            doneTips.length > 0 ?
                            doneTips.map((tip, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {tip.image === "" || tip.hasOwnProperty("image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : tip.image?.[0]?.includes(".mp4") || tip.image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={tip.image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={tip.image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex">
                                            <div className="mb-2 latest-news-small-header">
                                              <div className="d-flex align-items-center mb-1">
                                                <div className="prayer-profile me-3">{tip.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={tip.user?.profile_img} />}</div>
                                                <div className=" py-2">
                                                  <h4 className="m-0">{tip.user?.fname + " " + tip.user?.lname}</h4>
                                                </div>
                                              </div>
                                              <span>
                                                {tip.user?.fname + " " + tip.user?.lname}
                                                <span>&#9679; {tip.timeElapsed}</span>
                                              </span>
                                            </div>

                                            {/* <div className="ms-auto">
                                                                                            <div className='cust-drop-down'>
                                                                                                <Dropdown>
                                                                                                    <Dropdown.Toggle id="dropdown-basic" className='cust-drop-btn'>
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                                                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                                                                        </svg>
                                                                                                    </Dropdown.Toggle>
                                                                                                    <Dropdown.Menu>
                                                                                                        <ul>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Edit</Dropdown.Item>
                                                                                                            </li>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Post Tip</Dropdown.Item>
                                                                                                            </li>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Schedule Tip</Dropdown.Item>
                                                                                                            </li>
                                                                                                            <li>
                                                                                                                <Dropdown.Item>Dismiss Tip</Dropdown.Item>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </Dropdown.Menu>
                                                                                                </Dropdown>
                                                                                            </div>
                                                                                        </div> */}
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <Link to="/">{tip.link}</Link>
                                            <p>
                                              <ReactReadMoreReadLess charLimit={100} readMoreText={"Read more"} readLessText={"Read less"}>
                                                {tip.description}
                                              </ReactReadMoreReadLess>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
                            : (
                              <div className="news-feed-main-box py-5">
                                <div className="text-center">
                                  <i>
                                    <b>--- Data not found --- </b>
                                  </i>
                                </div>
                              </div>
                            )}
                        </ul>
                        {option3.totalRecord3 > 10 && (
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center">
                              <ReactPaginate
                                className="pagination"
                                pageClassName="page-item"
                                activeClassName="active"
                                breakLabel="..."
                                breakLinkClassName="page-link"
                                breakClassName="page-item"
                                previousLabel={
                                  <span aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left me-2">
                                      <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                previousClassName="page-item"
                                nextLabel={
                                  <span aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right ms-2">
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                nextClassName="page-item"
                                pageLinkClassName="page-link"
                                pageRangeDisplayed={2}
                                onPageActive={option3.page3}
                                pageCount={option3.totalRecord3 / option3.sizePerPage3}
                                renderOnZeroPageCount={null}
                                onPageChange={(e) => handlePageClick3(e)}
                                forcePage={0}
                              />
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </div>
              </Tab.Container>
            </div>
          </div>
          <Modal show={sharePostModalShow} onHide={() => setSharePostModalShow(false)} size="md" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" centered>
            {selectedTip !== undefined && <SharedAsPostTip tipDetails={selectedTip} getParentList={() => getRecentTipsData(activeTab)} closeModal={() => setSharePostModalShow(false)} />}
          </Modal>

          <Modal show={editModalShow} onHide={() => setEditModalShow(false)} size="md" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" centered>
            {selectedTip !== undefined && (
              <>
                <Modal.Header closeButton className="border-bottom">
                  <Modal.Title>
                    <h1>Edit Link</h1>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Formik
                    // innerRef={this.runforms}
                    enableReinitialize
                    initialValues={{
                      id: selectedTip._id,
                      link: selectedTip.link,
                    }}
                    validationSchema={Yup.object({
                      link: Yup.string().required("link is required"),
                    })}
                    onSubmit={(formData, { resetForm }) => {
                      editTipLink(formData, resetForm);
                    }}
                  >
                    {(runform) => (
                      <form className="row mb-0" onSubmit={runform.handleSubmit}>
                        {selectedTip && (
                          <div className="col-12 mb-3">
                            <div className="d-flex align-items-center">
                              <div className="prayer-profile me-3">
                                <img src={selectedTip.user?.profile_img} alt="" />
                              </div>
                              <div className="latest-news-small-header py-2">
                                <h4 className="d-flex align-items-center">
                                  {selectedTip.user?.fname + " " + selectedTip.user?.lname}
                                  <span className="ps-2">
                                    <img src={Tick} alt="" />
                                  </span>
                                </h4>
                                <span>
                                  {selectedTip.user?.fname + " " + selectedTip.user?.lname} <span>&#9679; {selectedTip.timeElapsed}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="col-12 mb-3">
                          <label className="lbl-frnt-side">Link</label>
                          <input type="text" className="form-control frnt-input-style h-auto" name="link" {...formAttr(runform, "link")} defaultValue="" />
                          {errorContainer(runform, "link")}
                        </div>
                        <div className="col-12 pt-3 pb-2 text-center">
                          <button className="btn-comn-all px-4" type="submit">
                            <span className="position-relative">SUBMIT</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </Modal.Body>
              </>
            )}
          </Modal>

          <Modal show={scheduleModalShow} onHide={() => setScheduleModalShow(false)} size="md" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" backdrop="static" centered>
            {selectedTip !== undefined && <ScheduleTips tipDetails={selectedTip} getParentList={() => getRecentTipsData(activeTab)} closeModal={() => setScheduleModalShow(false)} />}
          </Modal>

          <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <div className="common-title-in text-center">
                <h5>Delete Tip</h5>
                <p>Are you sure you want to dismiss this tip ? A dismissed tip is not show in this platform anymore.</p>
              </div>
              <Modal.Footer>
                <div className="">
                  <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setDeleteModalShow(false)}>
                    <span className="position-relative">NO</span>
                  </button>
                </div>
                <div className="ms">
                  <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={() => dismissTip()}>
                    <span className="position-relative">YES</span>
                  </button>
                </div>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}
