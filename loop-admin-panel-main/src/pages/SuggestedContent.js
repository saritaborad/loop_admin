import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout/layout";
import { Modal, Nav, Tab } from "react-bootstrap";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import SharedAsPostContent from "./SharedAsPostContent";
import toastr from "toastr";
import ReactPaginate from "react-paginate";
import defaultImg from "../images/defaultImg.PNG";
import defaultLoopImg from "../images/defaultLoopImg.png";
import loaderimg from "../images/loader.gif";
import Context from "../contex/Context";

export default function SuggestedContent() {
  const context = useContext(Context);
  const [sharePostModalShow, setSharePostModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState("recent-content-tab");
  const [recentContentList, setRecentContentList] = useState([]);
  const [sharedContentList, setSharedContentList] = useState([]);
  const [doneContentList, setDoneContentList] = useState([]);
  const [selectedContent, setSelectedContent] = useState();
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

  const handlePageClick1 = (e) => {
    getRecentContentList(e.selected);
  };
  const handlePageClick2 = (e) => {
    getSharedContentSuggestionList(e.selected);
  };
  const handlePageClick3 = (e) => {
    getDoneContentList(e.selected);
  };

  useEffect(() => {
    getRecentContentList(option1.page1);
    getSharedContentSuggestionList(option2.page2);
    getDoneContentList(option3.page3);
  }, []);

  // useEffect(() => {
  //   getRecentContentList(option1.page1);
  // }, []);

  const getRecentContentList = (page1, tab) => {
    let data = {
      page: page1 + 1,
      limit: 10,
    };
    const getRecentContentData = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getRecentContents, data));
    });

    getRecentContentData.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var prayers = response.data?.data?.contentSuggestion;
        setRecentContentList(prayers);
        set_option1({
          totalRecord1: response.data.data.totalcontentSuggestion,
          page1: page1,
          sizePerPage1: 10,
        });
      }
    });
  };

  const getSharedContentSuggestionList = (page2, tab) => {
    let data = {
      page: page2 + 1,
      limit: 10,
    };
    const getSharedContentSuggestionData = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getSharedContentSuggestion, data));
    });

    getSharedContentSuggestionData.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var prayers = response.data?.data?.sharedContentSuggestion;
        setSharedContentList(prayers);
        set_option2({
          totalRecord2: response.data.data.totalsharedcontentSuggestion,
          page2: page2,
          sizePerPage2: 10,
        });
      }
    });
  };

  const getDoneContentList = (page3, tab) => {
    let data = {
      page: page3 + 1,
      limit: 10,
    };
    const getDoneContentData = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getDoneList, data));
    });

    getDoneContentData.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        var prayers = response.data?.data?.completedContentSug;
        setDoneContentList(prayers);
        set_option3({
          totalRecord3: response.data.data.totalcompletedcontentSuggestion,
          page3: page3,
          sizePerPage3: 10,
        });
      }
    });
  };

  const handleTabChange = (tab) => {
    if (tab === "recent-content-tab") {
      getRecentContentList();
      set_option1("");
    } else if (tab === "share-to-newsfeed-tab") {
      getSharedContentSuggestionList();
      set_option2("");
    } else if (tab === "complete-tab") {
      getDoneContentList();
      set_option3("");
    } else {
      setActiveTab(option1.page1);
    }
  };

  const showShareNewsFeed_handle = (data) => {
    setSelectedContent(data);
    setSharePostModalShow(true);
  };
  const markAsDone = (data) => {
    var params = {
      id: data._id,
    };

    const markDoneContentData = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getMarkAsDone, params));
    });

    markDoneContentData.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        getDoneContentList(option3.page3);
        getRecentContentList(option1.page1);
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
                <h1>Suggested Content</h1>
              </div>
            </div>
            <div className="col-12">
              <Tab.Container id="left-tabs-example" defaultActiveKey="recent-content-tab" onSelect={(k) => handleTabChange(k)}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="white-box-commn-tab">
                      <Nav>
                        <Nav.Item>
                          <Nav.Link eventKey="recent-content-tab">Recent Content</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="share-to-newsfeed-tab">Shared to Newsfeed</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="complete-tab">Completed</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <div className="col-md-12 py-3">
                    <Tab.Content>
                      <Tab.Pane eventKey="recent-content-tab">
                        <ul>
                          {recentContentList &&
                            recentContentList.length > 0 ?
                            recentContentList.map((content, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {content.image === "" || content.hasOwnProperty("image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : content.image?.[0]?.includes(".mp4") || content.image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={content.image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={content.image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>

                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex align-items-center">
                                            <div className="prayer-profile me-3">{content.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={content.user?.profile_img} alt="" />}</div>
                                            <div className="latest-news-small-header py-2">
                                              <h4 className="d-flex align-items-center">
                                                {content.user?.fname + " " + content.user?.lname}
                                                {/* <span className="ps-2">
                                                  <img src={Tick} alt="" />
                                                </span> */}
                                              </h4>
                                              <span>
                                                {content.user?.fname + " " + content.user?.lname} <span>&#9679; {content.timeElapsed}</span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <bdi>{content.description}</bdi>
                                          </div>
                                          {userRole === 1 || respondToSubmissions === 1 ? (
                                            <div className="mt-auto">
                                              <div className="row">
                                                <div className="col-xxl-4 col-lg-5 col-sm-6">
                                                  <div>
                                                    <button className="btn-comn-all-2 w-100" type="button" onClick={() => showShareNewsFeed_handle(content)}>
                                                      <span className="position-relative">Share On NewsFeed</span>
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className="col-xl-2 col-sm-3 mt-3 mt-sm-0">
                                                  <div>
                                                    <button className="btn-comn-all w-100" type="button" onClick={() => markAsDone(content)}>
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
                                                    <button hidden className="btn-comn-all-2 w-100" type="button" onClick={() => showShareNewsFeed_handle(content)}>
                                                      <span className="position-relative">Share On NewsFeed</span>
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className="col-xl-2 col-sm-3 mt-3 mt-sm-0">
                                                  <div>
                                                    <button hidden className="btn-comn-all w-100" type="button" onClick={() => markAsDone(content)}>
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
                      <Tab.Pane eventKey="share-to-newsfeed-tab">
                        <ul>
                          {sharedContentList &&
                            sharedContentList.length > 0 ?
                            sharedContentList.map((content, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {content.image === "" || content.hasOwnProperty("image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : content.image?.[0]?.includes(".mp4") || content.image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={content.image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={content.image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex align-items-center">
                                            <div className="prayer-profile me-3">{content.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={content.user?.profile_img} alt="" />}</div>
                                            <div className="latest-news-small-header py-2">
                                              <h4 className="d-flex align-items-center">{content.user?.fname + " " + content.user?.lname}</h4>
                                              <span>
                                                {content.user?.fname + " " + content.user?.lname} <span>&#9679; {content.timeElapsed}</span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <bdi>{content.description}</bdi>
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
                      <Tab.Pane eventKey="complete-tab">
                        <ul>
                          {doneContentList &&
                            doneContentList.length > 0 ?
                            doneContentList.map((content, i) => {
                              return (
                                <li className="my-3" key={i}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {content.image === "" || content.hasOwnProperty("image") === false ? (
                                          <img src={defaultLoopImg} className="img-fluid w-100 news-img" alt="" />
                                        ) : content.image?.[0]?.includes(".mp4") || content.image?.[0]?.includes(".mp3") ? (
                                          <video width="100%" height="100%" controls>
                                            <source src={content.image} type="video/mp4" />
                                          </video>
                                        ) : (
                                          <img src={content.image} className="img-fluid w-100 news-img" alt="" />
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="d-flex align-items-center">
                                            <div className="prayer-profile me-3">{content.user?.profile_img === "" ? <img src={defaultImg} alt="" /> : <img src={content.user?.profile_img} alt="" />}</div>
                                            <div className="latest-news-small-header py-2">
                                              <h4 className="d-flex align-items-center">{content.user?.fname + " " + content.user?.lname}</h4>
                                              <span>
                                                {content.user?.fname + " " + content.user?.lname} <span>&#9679; {content.timeElapsed}</span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="latest-news-content pb-2">
                                            <bdi>{content.description}</bdi>
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
            {selectedContent !== undefined && <SharedAsPostContent contentDetails={selectedContent} getParentList={() => getRecentContentList(activeTab, option1.page1)} closeModal={() => setSharePostModalShow(false)} />}
          </Modal>
        </div>
      </div>
    </Layout>
  );
}
