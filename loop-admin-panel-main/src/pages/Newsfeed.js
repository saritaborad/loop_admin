import React, { useEffect, useState, useContext } from "react";
import { Dropdown, Modal, Nav, Tab } from "react-bootstrap";
import Layout from "../components/Layout/layout";
import treading_icn from "../images/treading-icn.svg";
import like_person from "../images/like-person.png";
import Delete from "../images/delete.svg";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import loaderimg from "../images/loader.gif";
import toastr from "toastr";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function Newsfeed() {
  let navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(true);
  const [comment, setComment] = useState(true);
  const [allId, setId] = useState();

  const [getNews, setGetNews] = useState([]);
  const [getTrendingNews, setTrendingNews] = useState([]);
  const [postLikelist, setPostLikelist] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [commentModal, setCommentsShow] = useState(false);
  const [reportedCommentModal, setReportedCommentsShow] = useState(false);
  const [showCommentLoadMore, setShowCommentLoadMore] = useState(false);
  const [commentPerPage, setCommentPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: "",
    page: 0,
    sort: "",
    order: "",
  });

  const [option1, set_option1] = useState({
    sizePerPage1: 10,
    search1: "",
    totalRecord1: "",
    page1: 0,
    sort1: "",
    order1: "",
  });

  useEffect(() => {
    getNewsList(option.page);
    getTrandingNews(option1.page1);
  }, []);

  const getTrandingNews = (page1) => {
    let data = {
      page: page1 + 1,
      limit: 10,
    };
    const newsListPromise = new Promise((resolve, rejected) => {
      resolve(PostApi(API_Path.gettrendingnews, data));
    });
    newsListPromise.then((response) => {
      if (response.status === 200) {
        setTrendingNews(response.data.data.Trandingnews);
        set_option1({
          totalRecord1: response.data.data.totalnews,
          page1: page1,
          sizePerPage1: 10,
        });
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const getLikelist = (newsId) => {
    const getLikeNewsPromise = new Promise((resolve, rejected) => {
      let data = {
        id: newsId,
      };
      resolve(PostApi(API_Path.getNewslikeList, data));
    });
    getLikeNewsPromise.then((response) => {
      if (response.status === 200) {
        setPostLikelist(response.data.data);
        setLoader(false);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const getNewsList = (page) => {
    let data = {
      page: page + 1,
      limit: 10,
    };
    const getNewsPromise = new Promise((resolve, rejected) => {
      resolve(PostApi(API_Path.getnews, data));
    });
    getNewsPromise.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        setGetNews(response.data.data.News);
        set_option({
          totalRecord: response.data.data.totalnews,
          page: page,
          sizePerPage: 10,
        });
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }, [option, option1]);

  const showComment = (id) => {
    setId(id);
    getComment(id);
  };

  const deleteHandleComment = (e, id) => {
    let data = {
      ids: [id],
    };
    const deleteCommentPromise = new Promise((resolve, rejected) => {
      resolve(PostApi(API_Path.deleteMultiComments, data));
    });
    deleteCommentPromise.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        getComment(allId);
        getNewsList(option.page);
        getTrandingNews(option1.page1);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const getComment = (id) => {
    let data = {
      news_id: id !== null || id != "" ? id : allId,
      page: activePage,
      limit: commentPerPage,
      // limit: 10
    };
    const getCommentDataPromise = new Promise((resolve, rejected) => {
      resolve(PostApi(API_Path.showNewsComment, data));
    });
    getCommentDataPromise.then((response) => {
      if (response.status === 200) {
        let loadMore =
          response.data.data.totalPage === activePage ? false : true;
        setShowCommentLoadMore(loadMore);
        setComment(response.data.data.commentlist);
      } else {
        setShowCommentLoadMore(false);
        toastr.error(response.data.message);
      }
      setCommentsShow(true);
    });
  };

  const viewMoreComment = () => {
    var currentPage = activePage + 1;
    setActivePage(currentPage);
    let data = {
      news_id: allId,
      page: currentPage,
      limit: commentPerPage,
      // limit: 10
    };
    const getCommentDataPromise = new Promise((resolve, rejected) => {
      resolve(PostApi(API_Path.showNewsComment, data));
    });
    getCommentDataPromise.then((response) => {
      if (response.status === 200) {
        let loadMore =
          response.data.data.totalPage === currentPage ? false : true;
        setShowCommentLoadMore(loadMore);
        setComment([...comment, ...response.data.data.commentlist]);
        // setCommentrecord(response.data.data.totalcomment);
      } else {
        setShowCommentLoadMore(false);
        toastr.error(response.data.message);
      }
    });
  };

  const closeCommentModal = () => {
    setActivePage(1);
    setComment([]);
    setCommentsShow(false);
    setId("");
  };

  const newsDetails = (id) => {
    navigate(`/newsfeed-detail`, { state: { id: id } });
  };

  const handlePageClick = (e) => {
    getNewsList(e.selected);
  };
  const handlePageClick1 = (e) => {
    getTrandingNews(e.selected);
  };

  const redirectToEditNews = (item, i) => {
    navigate(`/edit-post`, { state: { id: item._id } });
  };

  const postDelete = (id) => {
    setDeleteId(id);
    setDeleteModalShow(true);
  };

  const deletePost = () => {
    let data = {
      id: deleteId,
    };
    const DeletePostPromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.deletePost, data));
    });
    DeletePostPromise.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        getNewsList(option.page);
        getTrandingNews(option1.page1);
        setDeleteModalShow(false);
      }
    });
  };

  const handleClose = () => setShow(false);

  const handleShow = (newsId) => {
    setShow(true);
    setLoader(true);
    getLikelist(newsId);
  };

  const markAsTrending = (data) => {
    var params = {
      id: data._id,
    };

    const markDoneContentData = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.markAsTrending, params));
    });

    markDoneContentData.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        getNewsList(option.page);
        getTrandingNews(option1.page1);
      } else {
        toastr.error(response.data.message);
      }
    });
  };

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

  const handleTabChange = (tab) => {
    if (tab === "latestnews") {
      getNewsList();

      set_option("");
    } else if (tab === "treandingnews") {
      getTrandingNews();
      set_option1("");
    } else {
      getNewsList();
    }
  };

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
                <h1>Newsfeed</h1>
                <div className="ms-auto mt-2 mt-sm-0">
                  {userRole === 1 ||
                  userPermission?.allowToPostToNewsFeed === 1 ? (
                    <button
                      className="btn-comn-all w-100"
                      onClick={() => navigate("/add-post")}
                    >
                      CREATE A POST
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey="latestnews"
                onSelect={(k) => handleTabChange(k)}
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="white-box-commn-tab">
                      <Nav>
                        <Nav.Item>
                          <Nav.Link eventKey="latestnews">Latest News</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="treandingnews"
                            className="trending"
                          >
                            <img src={treading_icn} alt="" className="me-2" />
                            Trending
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <div className="col-md-12 py-3">
                    <Tab.Content>
                      <Tab.Pane eventKey="latestnews">
                        <ul>
                          {getNews.length > 0 &&
                            getNews.map((item, i) => {
                              return (
                                <li className="my-3" key={item._id}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {item.isEmbeded === 1 && (
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: item.embededLink,
                                            }}
                                            className="news-twitter"
                                          ></div>
                                        )}

                                        {item?.isEmbeded === 0 &&
                                        (item?.imagesorvideo?.[0]?.includes(
                                          ".mp4"
                                        ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".mp3"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".mov"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".mkv"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".wmv"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".avi"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".avchd"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".flv"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".f4v"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".swf"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".mebm"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".htm5"
                                          ) ||
                                          item?.imagesorvideo?.[0]?.includes(
                                            ".mpeg-2"
                                          )) ? (
                                          <video
                                            width="100%"
                                            height="100%"
                                            controls
                                          >
                                            <source
                                              src={item?.imagesorvideo}
                                              type="video/mp4"
                                            />
                                          </video>
                                        ) : (
                                          item?.isEmbeded === 0 &&
                                          (item?.imagesorvideo?.[0]?.includes(
                                            ".jpg"
                                          ) ||
                                            item?.imagesorvideo?.[0]?.includes(
                                              ".jpeg"
                                            ) ||
                                            item?.imagesorvideo?.[0]?.includes(
                                              ".png"
                                            ) ||
                                            item?.imagesorvideo?.[0]?.includes(
                                              ".PNG"
                                            ) ||
                                            item?.imagesorvideo?.[0]?.includes(
                                              ".JPG"
                                            ) ||
                                            item?.imagesorvideo?.[0]?.includes(
                                              ".JPEG"
                                            )) && (
                                            <img
                                              src={item.imagesorvideo}
                                              className="img-fluid w-100 news-img"
                                              alt=""
                                            />
                                          )
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="latest-news-header">
                                            <div className="d-flex align-items-center">
                                              <span>
                                                {item?.category?.charAt(0)}
                                              </span>
                                              <bdi className="text-capitalize">
                                                {item.category}
                                              </bdi>
                                              <div className="ms-auto">
                                                {userRole === 1 ||
                                                userPermission?.allowToPostToNewsFeed ===
                                                  1 ? (
                                                  <div className="cust-drop-down">
                                                    <Dropdown>
                                                      <Dropdown.Toggle
                                                        id="dropdown-basic"
                                                        className="cust-drop-btn"
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width={20}
                                                          height={20}
                                                          fill="currentColor"
                                                          className="bi bi-three-dots"
                                                          viewBox="0 0 16 16"
                                                        >
                                                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                        </svg>
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu>
                                                        <ul>
                                                          <li>
                                                            <Dropdown.Item
                                                              onClick={() =>
                                                                newsDetails(
                                                                  item._id
                                                                )
                                                              }
                                                            >
                                                              View Details
                                                            </Dropdown.Item>
                                                          </li>
                                                          <li>
                                                            <Dropdown.Item
                                                              onClick={() => {
                                                                redirectToEditNews(
                                                                  item,
                                                                  i
                                                                );
                                                              }}
                                                            >
                                                              Edit
                                                            </Dropdown.Item>
                                                          </li>

                                                          <li>
                                                            <Dropdown.Item
                                                              onClick={() =>
                                                                postDelete(
                                                                  item._id
                                                                )
                                                              }
                                                            >
                                                              Delete
                                                            </Dropdown.Item>
                                                          </li>
                                                          {userRole === 1 ? (
                                                            <li>
                                                              <Dropdown.Item
                                                                onClick={() =>
                                                                  markAsTrending(
                                                                    item
                                                                  )
                                                                }
                                                              >
                                                                Trending
                                                              </Dropdown.Item>
                                                            </li>
                                                          ) : (
                                                            ""
                                                          )}
                                                        </ul>
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="latest-news-small-header py-2">
                                            <h4>{item.title}</h4>
                                            <span>
                                              {item.user && item.user.fname}{" "}
                                              <span>
                                                &#9679;{" "}
                                                <Moment
                                                  date={item.scheduleDate}
                                                  fromNow
                                                />
                                              </span>
                                            </span>
                                          </div>
                                          <div className="latest-news-content pb-2">
                                            <bdi>{item.caption}</bdi>
                                          </div>
                                          <div className="mt-auto">
                                            <ul className="latest-news-ft-sec">
                                              <li className="me-3">
                                                {item.like_count > 0 ? (
                                                  <span
                                                    onClick={() =>
                                                      handleShow(item._id)
                                                    }
                                                  >
                                                    <i className="bi bi-heart-fill" />{" "}
                                                    {item.like_count}
                                                  </span>
                                                ) : (
                                                  <span>
                                                    <i className="bi bi-heart" />{" "}
                                                    {item.like_count}
                                                  </span>
                                                )}
                                              </li>
                                              <li>
                                                <bdi
                                                  onClick={() =>
                                                    item.comment_count === 0
                                                      ? setCommentsShow(false)
                                                      : showComment(item._id) &&
                                                        setId(item._id)
                                                  }
                                                >
                                                  {item.comment_count == 0
                                                    ? ""
                                                    : `view All `}{" "}
                                                  {item.comment_count} Comments
                                                </bdi>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                        {option.totalRecord > 10 && (
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
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18px"
                                      height="18px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-chevron-left me-2"
                                    >
                                      <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                previousClassName="page-item"
                                nextLabel={
                                  <span aria-hidden="true">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18px"
                                      height="18px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-chevron-right ms-2"
                                    >
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                nextClassName="page-item"
                                pageLinkClassName="page-link"
                                pageRangeDisplayed={2}
                                onPageActive={option.page}
                                pageCount={
                                  option.totalRecord / option.sizePerPage
                                }
                                renderOnZeroPageCount={null}
                                onPageChange={(e) => handlePageClick(e)}
                                forcePage={0}
                              />
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="treandingnews">
                        <ul>
                          {getTrendingNews.length > 0 ? (
                            getTrendingNews.map((item, i) => {
                              return (
                                <li className="my-3" key={item._id}>
                                  <div className="news-feed-main-box">
                                    <div className="row m-0">
                                      <div className="col-md-3 px-0">
                                        {item.isEmbeded === 1 && (
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: item.embededLink,
                                            }}
                                            className="news-twitter"
                                          ></div>
                                        )}
                                        {(item.isEmbeded === 0 &&
                                          (item.imagesorvideo[0].includes(
                                            ".mp4"
                                          ) ||
                                            item.imagesorvideo[0].includes(
                                              ".mp3"
                                            ) ||
                                            item.imagesorvideo[0].includes(
                                              ".mov"
                                            ) ||
                                            item.imagesorvideo[0].includes(
                                              ".mkv"
                                            ))) ||
                                        item.imagesorvideo[0].includes(
                                          ".wmv"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".avi"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".avchd"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".flv"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".f4v"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".swf"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".webm"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".html5"
                                        ) ||
                                        item.imagesorvideo[0].includes(
                                          ".mpeg-2"
                                        ) ? (
                                          <video
                                            width="100%"
                                            height="100%"
                                            controls
                                          >
                                            <source
                                              src={item.imagesorvideo}
                                              type="video/mp4"
                                            />
                                          </video>
                                        ) : (
                                          item.isEmbeded === 0 &&
                                          (item.imagesorvideo[0].includes(
                                            ".jpg"
                                          ) ||
                                            item.imagesorvideo[0].includes(
                                              ".jpeg"
                                            ) ||
                                            item.imagesorvideo[0].includes(
                                              ".png"
                                            ) ||
                                            item.imagesorvideo[0].includes(
                                              ".PNG"
                                            ) ||
                                            item.imagesorvideo[0].includes(
                                              ".JPG"
                                            ) ||
                                            item.imagesorvideo[0].includes(
                                              ".JPEG"
                                            )) && (
                                            <img
                                              src={item.imagesorvideo}
                                              className="img-fluid w-100 news-img"
                                              alt=""
                                            />
                                          )
                                        )}
                                      </div>
                                      <div className="col-md-9 p-0">
                                        <div className="latest-news-main-content-div">
                                          <div className="latest-news-header">
                                            <div className="d-flex align-items-center">
                                              <span>
                                                {item.category?.charAt(0)}
                                              </span>
                                              <bdi className="text-capitalize">
                                                {item.category}
                                              </bdi>
                                              <div className="ms-auto">
                                                {userRole === 1 ||
                                                userPermission?.allowToPostToNewsFeed ===
                                                  1 ? (
                                                  <div className="cust-drop-down">
                                                    <Dropdown>
                                                      <Dropdown.Toggle
                                                        id="dropdown-basic"
                                                        className="cust-drop-btn"
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width={20}
                                                          height={20}
                                                          fill="currentColor"
                                                          className="bi bi-three-dots"
                                                          viewBox="0 0 16 16"
                                                        >
                                                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                        </svg>
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu>
                                                        <ul>
                                                          <li>
                                                            <Dropdown.Item
                                                              onClick={() =>
                                                                newsDetails(
                                                                  item._id
                                                                )
                                                              }
                                                            >
                                                              View Details
                                                            </Dropdown.Item>
                                                          </li>
                                                          <li>
                                                            <Dropdown.Item
                                                              onClick={() => {
                                                                redirectToEditNews(
                                                                  item,
                                                                  i
                                                                );
                                                              }}
                                                            >
                                                              Edit
                                                            </Dropdown.Item>
                                                          </li>
                                                          {/* <li>
                                                                                                                <Dropdown.Item onClick={() => setModalShow(true)}>Deactive Post</Dropdown.Item>
                                                                                                            </li> */}
                                                          <li>
                                                            <Dropdown.Item
                                                              onClick={() =>
                                                                postDelete(
                                                                  item._id
                                                                )
                                                              }
                                                            >
                                                              Delete
                                                            </Dropdown.Item>
                                                          </li>
                                                          {/* <li>
                                                                                                                <Dropdown.Item onClick={() => setReportedCommentsShow(true)}>Reported Comment</Dropdown.Item>
                                                                                                            </li> */}
                                                        </ul>
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="latest-news-small-header py-2">
                                            <h4>{item.title}</h4>
                                            <span>
                                              {item.user && item.user.fname}{" "}
                                              <span>
                                                &#9679;{" "}
                                                <Moment
                                                  date={item.createdAt}
                                                  fromNow
                                                />
                                              </span>
                                            </span>
                                          </div>
                                          <div className="latest-news-content pb-2">
                                            <bdi>{item.caption}</bdi>
                                          </div>
                                          <div className="mt-auto">
                                            <ul className="latest-news-ft-sec">
                                              <li className="me-3">
                                                {item.like_count > 0 ? (
                                                  <span
                                                    onClick={() =>
                                                      handleShow(item._id)
                                                    }
                                                  >
                                                    <i className="bi bi-heart-fill" />{" "}
                                                    {item.like_count}
                                                  </span>
                                                ) : (
                                                  <span>
                                                    <i className="bi bi-heart" />{" "}
                                                    {item.like_count}
                                                  </span>
                                                )}
                                              </li>
                                              <li>
                                                <bdi
                                                  onClick={() =>
                                                    item.comment_count === 0
                                                      ? setCommentsShow(false)
                                                      : showComment(item._id) &&
                                                        setId(item._id)
                                                  }
                                                >
                                                  {item.comment_count == 0
                                                    ? ""
                                                    : `view All `}{" "}
                                                  {item.comment_count} Comments
                                                </bdi>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
                          ) : (
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
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18px"
                                      height="18px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-chevron-left me-2"
                                    >
                                      <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                previousClassName="page-item"
                                nextLabel={
                                  <span aria-hidden="true">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18px"
                                      height="18px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-chevron-right ms-2"
                                    >
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                  </span>
                                }
                                nextClassName="page-item"
                                pageLinkClassName="page-link"
                                pageRangeDisplayed={2}
                                onPageActive={option1.page1}
                                pageCount={
                                  option1.totalRecord1 / option1.sizePerPage1
                                }
                                renderOnZeroPageCount={null}
                                onPageChange={(e) => handlePageClick1(e)}
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
        </div>
      </div>

      {/* =======================deactive modal============================================ */}
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName="deactive-alert-box"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="common-title-in text-center">
            <h5>Deactivate Post</h5>
            <p>
              Are you sure you want to Deactivate this post? A deactivated post
              should not have access to the platform anymore.
            </p>
          </div>
          <Modal.Footer>
            <div className="">
              <button
                type="button"
                className="btn-comn-all-2 px-sm-5 px-4 w-100"
              >
                <span className="position-relative">NO</span>
              </button>
            </div>
            <div className="ms">
              <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100">
                <span className="position-relative">YES</span>
              </button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      {/* =======================delete modal============================================ */}

      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName="deactive-alert-box"
        centered
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="common-title-in text-center">
            <h5>Delete Post</h5>
            <p>Are you sure you want to Delete this post?</p>
          </div>
          <Modal.Footer>
            <div className="">
              <button
                type="button"
                className="btn-comn-all-2 px-sm-5 px-4 w-100"
                onClick={() => setDeleteModalShow(false)}
              >
                <span className="position-relative">NO</span>
              </button>
            </div>
            <div className="ms">
              <button
                type="submit"
                className="btn-comn-all px-sm-5 px-4 w-100"
                onClick={() => deletePost()}
              >
                <span className="position-relative">YES</span>
              </button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
      {/* =====================view all comment modal======================================== */}
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName="deactive-alert-box likes-box"
        centered
        show={commentModal}
        onHide={closeCommentModal}
        scrollable={true}
      >
        <Modal.Header closeButton className="border-bottom">
          <h1>Comments</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <ul>
                {comment.length > 0 &&
                  comment.map((item, i) => {
                    return (
                      <li key={i}>
                        <div className="like-modal-info d-flex">
                          <div>
                            {item.user?.profile_img !== null ? (
                              <img
                                src={item.user?.profile_img}
                                alt=""
                                className="item-uselikeimg me-2"
                              />
                            ) : (
                              <svg
                                className="item-uselikeimg me-2"
                                width={50}
                                height={50}
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M959.68 921.024c-15.232-181.696-139.648-331.968-307.84-386.624 70.464-45.632 117.248-124.48 117.248-214.464C769.152 178.624 654.208 64 512.512 64 370.752 64 255.808 178.624 255.808 319.936c0 89.984 46.784 168.832 117.248 214.528-168.192 54.592-292.544 204.864-307.84 386.56-0.192 3.456-0.64 5.44 0 10.176C66.496 947.2 80.64 960 96.704 960c17.92 0 32.064-14.656 32.064-32 16.704-197.76 182.272-351.936 383.744-351.936 201.408 0 366.976 154.176 383.68 351.936 0 17.344 14.144 32 32.064 32 16.064 0 30.208-12.8 31.424-28.8C960.32 926.464 959.936 924.416 959.68 921.024zM320 319.936C320 213.952 406.208 128 512.512 128s192.448 85.952 192.448 191.936c0 106.048-86.144 192-192.448 192S320 425.984 320 319.936z" />
                              </svg>
                            )}
                          </div>
                          <div className="w-100">
                            <div className="d-flex h-100">
                              <div className="d-flex flex-column">
                                <span>
                                  <bdi className="me-2">
                                    {item.user?.fname} {item.user?.lname}
                                  </bdi>
                                  {item.CommentDescription}
                                </span>
                                <div className="mt-2">
                                  <div className="d-flex flex-sm-row flex-column ">
                                    <span className="mt-sm-0 mt-1 me-2">
                                      <Moment
                                        format="DD MMM, YYYY"
                                        date={item.updatedAt}
                                        withTitle
                                      />
                                    </span>
                                    <div className="d-flex align-items-center ms-sm-auto mt-sm-0 mt-2">
                                      <span>{item.subcomment_count} Reply</span>
                                      <span className="ms-auto ms-sm-4">
                                        {item.like_count} Liked
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="ms-auto">
                                {userRole === 1 ||
                                userPermission?.allowToPostToNewsFeed === 1 ? (
                                  <button
                                    className="btn"
                                    onClick={(e) =>
                                      deleteHandleComment(e, item._id)
                                    }
                                  >
                                    <img src={Delete} alt="" />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                {showCommentLoadMore && (
                  <li>
                    <button
                      className="btn-comn-all w-100"
                      onClick={() => viewMoreComment()}
                    >
                      View More
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* ======================reported comment modal======================================= */}

      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName="deactive-alert-box likes-box"
        centered
        show={reportedCommentModal}
        onHide={() => setReportedCommentsShow(false)}
        scrollable={true}
      >
        <Modal.Header closeButton className="border-bottom">
          <h1>Reported Comments</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <ul>
                <li>
                  <div className="like-modal-info d-flex">
                    <div>
                      <img src={like_person} alt="" className="me-3" />
                    </div>
                    <div className="w-100">
                      <div className="d-flex h-100">
                        <div className="d-flex flex-column">
                          <span>
                            <bdi>Adam Clark </bdi>Lorem ipsum is dummy
                          </span>
                          <div className="mt-auto">
                            <div className="d-block">
                              <span>22 March,2021</span>
                            </div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span>
                            <bdi>Reported</bdi>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="like-modal-info d-flex">
                    <div>
                      <img src={like_person} alt="" className="me-3" />
                    </div>
                    <div className="w-100">
                      <div className="d-flex h-100">
                        <div className="d-flex flex-column">
                          <span>
                            <bdi>Adam Clark </bdi>Lorem ipsum is dummy
                          </span>
                          <div className="mt-auto">
                            <div className="d-block">
                              <span>22 March,2021</span>
                            </div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span>
                            <bdi>Reported</bdi>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="like-modal-info d-flex">
                    <div>
                      <img src={like_person} alt="" className="me-3" />
                    </div>
                    <div className="w-100">
                      <div className="d-flex h-100">
                        <div className="d-flex flex-column">
                          <span>
                            <bdi>Adam Clark </bdi>Lorem ipsum is dummy
                          </span>
                          <div className="mt-auto">
                            <div className="d-block">
                              <span>22 March,2021</span>
                            </div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span>
                            <bdi>Reported</bdi>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="like-modal-info d-flex">
                    <div>
                      <img src={like_person} alt="" className="me-3" />
                    </div>
                    <div className="w-100">
                      <div className="d-flex h-100">
                        <div className="d-flex flex-column">
                          <span>
                            <bdi>Adam Clark </bdi>Lorem ipsum is dummy
                          </span>
                          <div className="mt-auto">
                            <div className="d-block">
                              <span>22 March,2021</span>
                            </div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span>
                            <bdi>Reported</bdi>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="like-modal-info d-flex">
                    <div>
                      <img src={like_person} alt="" className="me-3" />
                    </div>
                    <div className="w-100">
                      <div className="d-flex h-100">
                        <div className="d-flex flex-column">
                          <span>
                            <bdi>Adam Clark </bdi>Lorem ipsum is dummy
                          </span>
                          <div className="mt-auto">
                            <div className="d-block">
                              <span>22 March,2021</span>
                            </div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span>
                            <bdi>Reported</bdi>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="like-modal-info d-flex">
                    <div>
                      <img src={like_person} alt="" className="me-3" />
                    </div>
                    <div className="w-100">
                      <div className="d-flex h-100">
                        <div className="d-flex flex-column">
                          <span>
                            <bdi>Adam Clark </bdi>Lorem ipsum is dummy
                          </span>
                          <div className="mt-auto">
                            <div className="d-block">
                              <span>22 March,2021</span>
                            </div>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <span>
                            <bdi>Reported</bdi>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* ==========================likes modal============================================== */}

      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName="deactive-alert-box likes-box"
        centered
        show={show}
        onHide={handleClose}
        scrollable={true}
      >
        <Modal.Header closeButton className="border-bottom">
          <h1>Likes</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              {loader ? (
                <img src={loaderimg} className="loader" width={100} />
              ) : (
                <ul>
                  {postLikelist.length > 0 &&
                    postLikelist.map((item, i) => {
                      return (
                        <li key={i}>
                          <div className="like-modal-info d-flex">
                            <div>
                              {item.user?.profile_img !== null ? (
                                <img
                                  src={item.user?.profile_img}
                                  alt=""
                                  className="item-uselikeimg me-2"
                                />
                              ) : (
                                <svg
                                  className="item-uselikeimg me-2"
                                  width={50}
                                  height={50}
                                  viewBox="0 0 1024 1024"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M959.68 921.024c-15.232-181.696-139.648-331.968-307.84-386.624 70.464-45.632 117.248-124.48 117.248-214.464C769.152 178.624 654.208 64 512.512 64 370.752 64 255.808 178.624 255.808 319.936c0 89.984 46.784 168.832 117.248 214.528-168.192 54.592-292.544 204.864-307.84 386.56-0.192 3.456-0.64 5.44 0 10.176C66.496 947.2 80.64 960 96.704 960c17.92 0 32.064-14.656 32.064-32 16.704-197.76 182.272-351.936 383.744-351.936 201.408 0 366.976 154.176 383.68 351.936 0 17.344 14.144 32 32.064 32 16.064 0 30.208-12.8 31.424-28.8C960.32 926.464 959.936 924.416 959.68 921.024zM320 319.936C320 213.952 406.208 128 512.512 128s192.448 85.952 192.448 191.936c0 106.048-86.144 192-192.448 192S320 425.984 320 319.936z" />
                                </svg>
                              )}
                            </div>
                            <div className="w-100">
                              <div className="d-flex h-100">
                                <div className="d-flex flex-column">
                                  <span>
                                    <bdi className="me-2">
                                      {item.user?.fname} {item.user?.lname}
                                    </bdi>
                                    Liked Your Post
                                  </span>
                                  <div className="mt-2">
                                    <div className="d-flex flex-sm-row flex-column ">
                                      <span className="mt-sm-0 mt-1 me-2">
                                        <Moment
                                          format="DD MMM, YYYY"
                                          date={item.updatedAt}
                                          withTitle
                                        />
                                      </span>
                                      <div className="d-flex align-items-center ms-sm-auto mt-sm-0 mt-2"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
export default Newsfeed;
