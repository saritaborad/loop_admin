import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/layout";
import { Modal, Nav, Tab, TabPane } from "react-bootstrap";

import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import RejectPrayer from "./RejectPrayer";
import toastr from "toastr";
import SharedAsPostPrayer from "./SharedAsPostPrayer";
import ReactPaginate from "react-paginate";
import defaultImg from "../images/defaultImg.PNG";
import defaultLoopImg from "../images/defaultLoopImg.png";
import loaderimg from "../images/loader.gif";


export default function PrayerRequest() {


  const [sharePostModalShow, setSharePostModalShow] = useState(false);

  const [activeTab, setActiveTab] = useState("recent-request-tab");
  const [recentRequestData, setRecentRequestData] = useState([]);
  const [sharedToNewsFeedData, setSharedToNewsFeedData] = useState([]);
  const [approvedPrayersData, setApprovedPrayersData] = useState([]);
  const [draftedPrayersData, setDraftedPrayersData] = useState([]);
  const [rejectedPrayersData, setRejectedPrayersData] = useState([]);
  const [rejectModalShow, setRejectModalShow] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState();
  const [approveModalShow, setApproveModalShow] = useState(false);
  const [loader, setLoader] = useState(true);
  const [rejectFrom, setRejectFrom] = useState("");

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

  const [option4, set_option4] = useState({
    sizePerPage4: 10,
    search4: "",
    totalRecord4: "",
    page4: 0,
    sort4: "",
    order4: "",
  });

  const [option5, set_option5] = useState({
    sizePerPage5: 10,
    search5: "",
    totalRecord5: "",
    page5: 0,
    sort5: "",
    order5: "",
  });

  useEffect(() => {
    getPayerRequestData(option1.page1);
    getSharedToNewsFeedData(option2.page2);
    getApprovedPrayersData(option3.page3);
    getRejectedPrayersData(option4.page4);
    getDraftedPrayersData(option5.page5);
  }, []);

  useEffect(() => {
    getPayerRequestData(option1.page1);
  }, []);

  const handlePageClick1 = (e) => {
    getPayerRequestData(e.selected);
  };
  const handlePageClick2 = (e) => {
    getSharedToNewsFeedData(e.selected);
  };

  const handlePageClick3 = (e) => {
    getApprovedPrayersData(e.selected);
  };

  const handlePageClick4 = (e) => {
    getRejectedPrayersData(e.selected);
  };

  const handlePageClick5 = (e) => {
    getDraftedPrayersData(e.selected);
  };

  const getPayerRequestData = (page1, tab) => {
    let data = {
      page: page1 + 1,
      limit: 10,
    };
    const getPayerRequestList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getRecentPayerRequest, data));
    });

    getPayerRequestList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var prayers = response.data.data.prayerList;
        setRecentRequestData(prayers);
        setActiveTab(tab);
        set_option1({
          totalRecord1: response.data.data.totalprayer,
          page1: page1,
          sizePerPage1: 10,
        });

      }
      else {
        toastr.error(response.data.message);
      }
    });
  };

  const showRejectModal_handle = (data, rejectFrom) => {
    setSelectedPrayer(data);
    setRejectFrom(rejectFrom);
    setRejectModalShow(true);
    getPayerRequestData(activeTab);
  };

  const hideRejectModal_handle = () => {
    setRejectModalShow(false);
  };

  const showApproveModal_handle = (data) => {
    setSelectedPrayer(data);
    setApproveModalShow(true);
    getPayerRequestData(activeTab);
  };

  const draft_PrayerRequest = () => {
    let reqObj = {
      prayer_id: selectedPrayer._id,
    };
    const approvePrayerRequest = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.draftPyayer, reqObj));
    });

    approvePrayerRequest.then((response) => {
      if (response.status === 200) {
        toastr.success("You can Publish anytime from Draft");
        setApproveModalShow(false);
        getPayerRequestData(activeTab);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const showNewsFeed_handle = () => {
    setApproveModalShow(false);
    setSharePostModalShow(true);
  };

  const showNewsFeed_handle_draft = (data) => {
    setSelectedPrayer(data);
    setSharePostModalShow(true);
    getDraftedPrayersData(activeTab);
  };

  const handleTabChange = (tab) => {
    if (tab === "shared-newsFeed-tab") {
      getSharedToNewsFeedData();
      set_option2("");
    } else if (tab === "approved-tab") {
      getApprovedPrayersData();
      set_option3("");
    } else if (tab === "rejected-tab") {
      getRejectedPrayersData();
      set_option4("");
    } else if (tab === "recent-request-tab") {
      getPayerRequestData();
      set_option1("");
    } else if (tab === "drafted-tab") {
      getDraftedPrayersData();
      set_option5("");
    } else {
      setActiveTab(option1.page1);
    }
  };

  const getSharedToNewsFeedData = (page2, tab) => {
    let data = {
      page: page2 + 1,
      limit: 10,
    };
    const getSharedToNewsFeedList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getSharedPrayers, data));
    });

    getSharedToNewsFeedList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var data = response.data?.data?.sharedPrayers;
        setSharedToNewsFeedData(data);
        setActiveTab(tab);
        set_option2({
          totalRecord2: response.data.data.totalsharedprayer,
          page2: page2,
          sizePerPage2: 10,
        });
      }
      else {
        toastr.error(response.data.message);
      }
    });
  };

  const getApprovedPrayersData = (page3, tab) => {
    let data = {
      page: page3 + 1,
      limit: 10,
    };
    const getApprovedPrayersList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getApprovedPrayers, data));
    });

    getApprovedPrayersList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var data = response.data?.data?.approvedPrayers;
        setApprovedPrayersData(data);
        setActiveTab(tab);
        set_option3({
          totalRecord3: response.data.data.totalapprovedprayer,
          page3: page3,
          sizePerPage3: 10,
        });
      }
      else {
        toastr.error(response.data.message);
      }
    });
  };

  const getRejectedPrayersData = (page4, tab) => {
    let data = {
      page: page4 + 1,
      limit: 10,
    };

    const getRejectedPrayersList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getRejectedPrayers, data));
    });

    getRejectedPrayersList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var data = response.data?.data?.rejectedprayers;
        setRejectedPrayersData(data);
        setActiveTab(tab);
        set_option4({
          totalRecord4: response.data.data.totalrejectedprayer,
          page4: page4,
          sizePerPage4: 10,
        });
      }
      else {
        toastr.error(response.data.message);
      }
    });
  };

  const getDraftedPrayersData = (page5, tab) => {
    let data = {
      page: page5 + 1,
      limit: 10,
    };
    const getApprovedPrayersList = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.draftPrayerList, data));
    });

    getApprovedPrayersList.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var data = response.data?.data?.prayer;
        setDraftedPrayersData(data);
        setActiveTab(tab);
        set_option3({
          totalRecord5: response.data.data.totaldraftprayer,
          page5: page5,
          sizePerPage5: 10,
        });
      }
    });
  };

  const getParentCallBack = () => {
    if (rejectFrom === "recentPrayer") {
      getPayerRequestData();
    } else if (rejectFrom === "approvedPrayer") {
      getApprovedPrayersData();
    }
  };

  const draftShareOnNewsFeed_handle = (data) => {
    var params = {
      prayer_id: data._id,
    };

    const markDoneContentData = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.draftTosharedNewsFeed, params));
    });

    markDoneContentData.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        getPayerRequestData(option1.page1);
        getDraftedPrayersData(option5.page5);
      } else {
        toastr.error(response.data.message);
      }
    });
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
                <h1>Prayer Requests</h1>
              </div>
            </div>
            <div className="col-12">
              <Tab.Container id="left-tabs-example" defaultActiveKey="recent-request-tab" onSelect={(k) => handleTabChange(k)}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="white-box-commn-tab">
                      <Nav>
                        <Nav.Item>
                          <Nav.Link eventKey="recent-request-tab">Recent Requests</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="shared-newsFeed-tab">Shared to NewsFeed</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="approved-tab">Approved</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="drafted-tab">Drafted</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="rejected-tab">Rejected</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <div className="col-md-12 py-3">
                    <Tab.Content>
                      <Tab.Pane eventKey="recent-request-tab">
                        <ul>
                          {recentRequestData &&
                            recentRequestData.length > 0 ?
                            recentRequestData.map((prayer, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {prayer.prayer_image === "" || prayer.hasOwnProperty("prayer_image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : prayer.prayer_image?.[0]?.includes(".mp4") || prayer.prayer_image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={prayer.prayer_image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={prayer.prayer_image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex align-items-center">
                                            <div className="prayer-profile me-3">{prayer.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={prayer.user?.profile_img} alt="" />}</div>
                                            <div className="latest-news-small-header py-2">
                                              <h4 className="d-flex align-items-center">{prayer.user?.fname + " " + prayer.user?.lname}</h4>
                                              <span>
                                                {prayer.user?.fname + " " + prayer.user?.lname} <span>&#9679; {prayer.timeElapsed}</span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <bdi>{prayer.description}</bdi>
                                          </div>
                                          <div className="mt-auto">
                                            <div className="row">
                                              <div className="col-lg-4">
                                                {userRole === 1 || respondToSubmissions === 1 ? (
                                                  <div className="d-flex align-items-center">
                                                    <button className="btn-comn-all-2 w-100" onClick={() => showRejectModal_handle(prayer, "recentPrayer")}>
                                                      <span className="position-relative">Reject</span>
                                                    </button>
                                                    <button className="btn-comn-all w-100 ms-3" onClick={() => showApproveModal_handle(prayer)}>
                                                      <span className="position-relative">Approve</span>
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <div className="d-flex align-items-center">
                                                    <button hidden className="btn-comn-all-2 w-100" onClick={() => showRejectModal_handle(prayer, "recentPrayer")}>
                                                      <span className="position-relative">Reject</span>
                                                    </button>
                                                    <button hidden className="btn-comn-all w-100 ms-3" onClick={() => showApproveModal_handle(prayer)}>
                                                      <span className="position-relative">Approve</span>
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            }) : (
                              <div className="news-feed-main-box py-5">

                                <div className="text-center">
                                  <i>
                                    <b>--- Data not found --- </b>
                                  </i>
                                </div>
                              </div>
                            )
                          }
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
                      <Tab.Pane eventKey="shared-newsFeed-tab">
                        <ul>
                          {sharedToNewsFeedData &&
                            sharedToNewsFeedData.length > 0 ?
                            sharedToNewsFeedData.map((sharedNews, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {sharedNews.prayer_image === "" || sharedNews.hasOwnProperty("prayer_image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : sharedNews.prayer_image?.[0]?.includes(".mp4") || sharedNews.prayer_image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={sharedNews.prayer_image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={sharedNews.prayer_image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex align-items-center">
                                            <div className="prayer-profile me-3">{sharedNews.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={sharedNews.user?.profile_img} alt="" />}</div>
                                            <div className="latest-news-small-header py-2">
                                              <h4 className="d-flex align-items-center">{sharedNews.user?.fname + " " + sharedNews.user?.lname}</h4>
                                              <span>
                                                {sharedNews.user?.fname + " " + sharedNews.user?.lname} <span>&#9679; {sharedNews.timeElapsed}</span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <bdi>{sharedNews.description}</bdi>
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
                      <Tab.Pane eventKey="approved-tab">
                        <ul>
                          {
                            approvedPrayersData &&
                              approvedPrayersData.length > 0 ?
                              approvedPrayersData.map((prayer, i) => {
                                return (
                                  <li className="my-3" key={i}>
                                    <div className="news-feed-main-box">
                                      <div className="row m-0">
                                        <div className="col-md-3 px-0">
                                          {prayer.prayer_image === "" || prayer.hasOwnProperty("prayer_image") === false ? (
                                            <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                          ) : prayer.prayer_image?.[0]?.includes(".mp4") || prayer.prayer_image?.[0]?.includes(".mp3") ? (
                                            <video width="100%" height="100%" controls>
                                              <source src={prayer.prayer_image} type="video/mp4" />
                                            </video>
                                          ) : (
                                            <img src={prayer.prayer_image} className="img-fluid w-100 news-img" alt="" />
                                          )}
                                        </div>
                                        <div className="col-md-9 p-0">
                                          <div className="latest-news-main-content-div">
                                            <div className="d-flex align-items-center">
                                              <div className="prayer-profile me-3">{prayer.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={prayer.user?.profile_img} alt="" />}</div>
                                              <div className="latest-news-small-header py-2">
                                                <h4 className="d-flex align-items-center">{prayer.user?.fname + " " + prayer.user?.lname}</h4>
                                                <span>
                                                  {prayer.user?.fname + " " + prayer.user?.lname} <span>&#9679; {prayer.timeElapsed}</span>
                                                </span>
                                              </div>
                                            </div>

                                            <div className="latest-news-content pb-2">
                                              <bdi>{prayer.description}</bdi>
                                            </div>
                                            <div className="mt-auto">
                                              <div className="row">
                                                <div className="col-lg-4">
                                                  <div className="d-flex align-items-center">
                                                    {userRole === 1 || respondToSubmissions === 1 ? (
                                                      <button className="btn-comn-all-2 w-50" onClick={() => showRejectModal_handle(prayer, "approvedPrayer")}>
                                                        <span className="position-relative">Reject</span>
                                                      </button>
                                                    ) : (
                                                      <button hidden className="btn-comn-all-2 w-50" onClick={() => showRejectModal_handle(prayer, "approvedPrayer")}>
                                                        <span className="position-relative">Reject</span>
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
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

                      <Tab.Pane eventKey="drafted-tab">
                        <ul>
                          {draftedPrayersData &&
                            draftedPrayersData.length > 0 ?
                            draftedPrayersData.map((prayer, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {prayer.prayer_image === "" || prayer.hasOwnProperty("prayer_image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : prayer.prayer_image?.[0]?.includes(".mp4") || prayer.prayer_image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={prayer.prayer_image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={prayer.prayer_image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex align-items-center">
                                            <div className="prayer-profile me-3">{prayer.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={prayer.user?.profile_img} alt="" />}</div>
                                            <div className="latest-news-small-header py-2">
                                              <h4 className="d-flex align-items-center">{prayer.user?.fname + " " + prayer.user?.lname}</h4>
                                              <span>
                                                {prayer.user?.fname + " " + prayer.user?.lname} <span>&#9679; {prayer.timeElapsed}</span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <bdi>{prayer.description}</bdi>
                                          </div>
                                          <div className="mt-auto">
                                            <div className="row">
                                              <div className="col-lg-4">
                                                <div className="d-flex align-items-center">
                                                  {userRole === 1 || respondToSubmissions === 1 ? (
                                                    <button className="btn-comn-all-2 w-100" onClick={() => showNewsFeed_handle_draft(prayer)}>
                                                      <span className="position-relative">Shared On News Feed</span>
                                                    </button>
                                                  ) : (
                                                    <button hidden className="btn-comn-all-2 w-100" onClick={() => showNewsFeed_handle_draft(prayer)}>
                                                      <span className="position-relative">Shared On News Feed</span>
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            }) : (
                              <div className="news-feed-main-box py-5">

                                <div className="text-center">
                                  <i>
                                    <b>--- Data not found --- </b>
                                  </i>
                                </div>
                              </div>
                            )}
                        </ul>
                        {option5.totalRecord5 > 10 && (
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
                                onPageActive={option5.page5}
                                pageCount={option5.totalRecord5 / option5.sizePerPage5}
                                renderOnZeroPageCount={null}
                                onPageChange={(e) => handlePageClick5(e)}
                                forcePage={0}
                              />
                            </div>
                          </div>
                        )}
                      </Tab.Pane>

                      <TabPane eventKey="rejected-tab">
                        <ul>
                          {rejectedPrayersData &&
                            rejectedPrayersData.length > 0 ?
                            rejectedPrayersData.map((prayer, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {prayer.prayer_image === "" || prayer.hasOwnProperty("prayer_image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : prayer.prayer_image?.[0]?.includes(".mp4") || prayer.prayer_image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={prayer.prayer_image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={prayer.prayer_image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex align-items-center">
                                            <div className="prayer-profile me-3">{prayer.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={prayer.user?.profile_img} alt="" />}</div>
                                            <div className="latest-news-small-header py-2">
                                              <h4 className="d-flex align-items-center">{prayer.user?.fname + " " + prayer.user?.lname}</h4>
                                              <span>
                                                {prayer.user?.fname + " " + prayer.user?.lname} <span>&#9679; {prayer.timeElapsed}</span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <bdi>{prayer.description}</bdi>
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
                        {option4.totalRecord4 > 10 && (
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
                                onPageActive={option4.page4}
                                pageCount={option4.totalRecord4 / option4.sizePerPage4}
                                renderOnZeroPageCount={null}
                                onPageChange={(e) => handlePageClick4(e)}
                                forcePage={0}
                              />
                            </div>
                          </div>
                        )}
                      </TabPane>
                    </Tab.Content>
                  </div>
                </div>
              </Tab.Container>
            </div>
          </div>
          <Modal show={rejectModalShow} onHide={() => setRejectModalShow(false)} size="md" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" centered>
            {selectedPrayer !== undefined && <RejectPrayer prayerDetails={selectedPrayer} getParentList={getParentCallBack} closeModal={hideRejectModal_handle} />}
          </Modal>
          <Modal show={approveModalShow} onHide={() => setApproveModalShow(false)} size="md" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" centered>
            <>
              <Modal.Header closeButton className="border-bottom">
                <Modal.Title>
                  <h1>Approve</h1>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedPrayer !== undefined && (
                  <>
                    <div className="row mb-0">
                      <div className="col-12 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="prayer-profile me-3">{selectedPrayer.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={selectedPrayer.user?.profile_img} alt="" />}</div>
                          <div className="latest-news-small-header py-2">
                            <h4 className="d-flex align-items-center">{selectedPrayer.user?.fname + " " + selectedPrayer.user?.lname}</h4>
                            <span>
                              {selectedPrayer.user?.fname + " " + selectedPrayer.user?.lname} <span>&#9679; {selectedPrayer.timeElapsed}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div>
                          <button className="btn-comn-all w-100" type="button" onClick={() => showNewsFeed_handle()}>
                            <span className="position-relative">Shared On News Feed</span>
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-6 mt-3 mt-sm-0">
                        <div>
                          <button className="btn-comn-all w-100" type="button" onClick={() => draft_PrayerRequest()}>
                            <span className="position-relative">Later On</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Modal.Body>
            </>
          </Modal>
          <Modal show={sharePostModalShow} onHide={() => setSharePostModalShow(false)} size="md" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" centered>
            {selectedPrayer !== undefined && <SharedAsPostPrayer prayerDetails={selectedPrayer} getDraftList={getDraftedPrayersData} getParentList={getPayerRequestData} closeModal={() => setSharePostModalShow(false)} />}
          </Modal>
        </div>
      </div>
    </Layout>
  );
}
