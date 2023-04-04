import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/layout";
import { Dropdown, Modal } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import ReactPaginate from "react-paginate";
import moment from "moment";

export default function QueuedPost(props) {
  let navigate = useNavigate();
  const [calender, setcalender] = useState(false);
  const [listGrid, setListGrid] = useState(true);
  const [queued_posts, setQueued_posts] = useState([]);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const [option, set_option] = useState({
    sizePerPage: 9,
    search: "",
    totalRecord: "",
    page: 0,
    sort: "",
    order: "",
  });

  useEffect(() => {
    queuedPost(option.page);
  }, []);

  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }, [queued_posts]);

  const handlePageClick = (e) => {
    queuedPost(e.selected);
  };
  const calenderview = () => {
    document.getElementById("calender").classList.add("active");
    document.getElementById("grid").classList.remove("active");
    document.getElementById("list").classList.remove("active");
    setListGrid(false);
    setcalender(true);
  };
  const listview = () => {
    document.getElementById("list").classList.add("active");
    document.getElementById("grid").classList.remove("active");
    document.getElementById("calender").classList.remove("active");
    setcalender(false);
    setListGrid(true);
    setTimeout(() => {
      document.getElementById("grid-view-id").classList.remove("grid-view-active");
    }, 10);
  };
  const gridview = () => {
    document.getElementById("grid").classList.add("active");
    document.getElementById("calender").classList.remove("active");
    document.getElementById("list").classList.remove("active");
    setcalender(false);
    setListGrid(true);
    setTimeout(() => {
      document.getElementById("grid-view-id").classList.add("grid-view-active");
    }, 10);
  };

  // const events = [
  //   {
  //     title: "1",
  //     start: "2022-08-18",
  //   },
  //   {
  //     title: "3",
  //     start: "2022-04-05",
  //   },
  // ];




  const events = queued_posts.map((item, i) => (
    {
      id: item._id,
      title: item.title,
      start: moment(item.scheduleDate).format('YYYY-MM-DD'),
    }
  ))



  const queuedPost = (page) => {
    let data = {
      page: page + 1,
      limit: 9,
    };
    const getQueuedPromise = new Promise((resolve, rejected) => {
      resolve(PostApi(API_Path.getQueuedPost, data));
    });
    getQueuedPromise.then((response) => {
      if (response.status === 200) {
        setQueued_posts(response.data.data.queued_posts);
        set_option({
          totalRecord: response.data.data.totalschpost,
          page: page,
          sizePerPage: 9,
        });
      }
    });
  };

  const newsDetails = (id) => {
    navigate(`/newsfeed-detail`, { state: { id: id, url: "hide" } });
  };

  const redirectToEditNews = (item, i) => {
    navigate(`/edit-post`, { state: { id: item._id, url: "queued-post" } });
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
        queuedPost(option.page);
        toastr.success(response.data.message);
        setDeleteModalShow(false);
      }
    });
  };


  return (
    <Layout>
      <div className="content-main-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="comn-title-info d-sm-flex align-items-center">
                <h1>Queued Posts</h1>
              </div>
            </div>
            <div className="col-12">
              <div className="diff-view-tabs">
                <ul>
                  <li>
                    <div className="tab-part" id="calender" onClick={calenderview}>
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 20H2C0.89543 20 0 19.1046 0 18V4C0 2.89543 0.89543 2 2 2H4V0H6V2H12V0H14V2H16C17.1046 2 18 2.89543 18 4V18C18 19.1046 17.1046 20 16 20ZM2 8V18H16V8H2ZM2 4V6H16V4H2ZM14 16H12V14H14V16ZM10 16H8V14H10V16ZM6 16H4V14H6V16ZM14 12H12V10H14V12ZM10 12H8V10H10V12ZM6 12H4V10H6V12Z" fill="#030303" />
                      </svg>
                    </div>
                  </li>
                  <li>
                    <div className="tab-part" id="grid" onClick={gridview}>
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 19H11.4V11.4H19V19ZM7.6 19H0V11.4H7.6V19ZM19 7.6H11.4V0H19V7.6ZM7.6 7.6H0V0H7.6V7.6Z" fill="#030303" />
                      </svg>
                    </div>
                  </li>
                  <li>
                    <div className="tab-part active" id="list" onClick={listview}>
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 1H18V3H5V1ZM0 0.5H3V3.5H0V0.5ZM0 6.5H3V9.5H0V6.5ZM0 12.5H3V15.5H0V12.5ZM5 7H18V9H5V7ZM5 13H18V15H5V13Z" fill="#030303" />
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="row">
                {calender && (
                  <div className="col-12">
                    <div className="white-box-main px-0 pb-0 calender-view-main mt-3">
                      <FullCalendar
                        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                        // ref={this.calendarComponentRef}
                        defaultView="dayGridMonth"
                        // dateClick={this.handleDateClick}
                        displayEventTime={true}
                        // columnHeaderFormat={{ weekday: "long" }}
                        header={{
                          left: false,
                          center: "prev title next",
                          right: false,
                        }}
                        selectable={false}
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, resourceTimeGridPlugin]}
                        eventClick={(e) => {
                          navigate(`/newsfeed-detail`, { state: { id: e.event._def.publicId, url: "hide" } })
                        }}
                        events={events}

                      // select={this.handleSelectedDates}
                      // eventLimit={3}
                      />
                    </div>
                  </div>
                )}
                {listGrid && (
                  <div className="col-12">
                    <div id="grid-view-id" className="">
                      <ul className="grid-view-ul">
                        {queued_posts.length > 0 ?
                          queued_posts.map((item, i) => {
                            return (
                              <li className="my-3 grid-view-li" key={item._id}>
                                <div className="news-feed-main-box">
                                  <div className="row m-0">
                                    <div className="col-md-3 px-0">
                                      {item.isEmbeded === 1 && <div dangerouslySetInnerHTML={{ __html: item.embededLink }} className="news-twitter"></div>}

                                      {item.isEmbeded === 0 && (item.imagesorvideo[0].includes(".mp4") || item.imagesorvideo[0].includes(".mp3")) ? (
                                        <video width="100%" height="100%" controls>
                                          <source src={item.imagesorvideo} type="video/mp4" />
                                        </video>
                                      ) : (
                                        item.isEmbeded === 0 && <img src={item.imagesorvideo} className="img-fluid w-100 news-img" alt="" />
                                      )}
                                    </div>
                                    <div className="col-md-9 p-0">
                                      <div className="latest-news-main-content-div">
                                        <div className="latest-news-header">
                                          <div className="d-flex align-items-center">
                                            <span>{item.category.charAt(0)}</span>
                                            <bdi>{item.category}</bdi>
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
                                                      <li>
                                                        <Dropdown.Item onClick={() => newsDetails(item._id)}>View Details</Dropdown.Item>
                                                      </li>
                                                      <li>
                                                        <Dropdown.Item
                                                          onClick={() => {
                                                            redirectToEditNews(item, i);
                                                          }}
                                                        >
                                                          Edit
                                                        </Dropdown.Item>
                                                      </li>
                                                      <li>
                                                        <Dropdown.Item onClick={() => postDelete(item._id)}>Delete</Dropdown.Item>
                                                      </li>
                                                    </ul>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="latest-news-small-header py-2">
                                          <h4>{item.title}</h4>
                                          <span>
                                            Publish On: <Moment format="DD/MM/YYYY hh:mm a" date={item.scheduleDate} />
                                          </span>
                                        </div>
                                        <div className="latest-news-content pb-2">
                                          <bdi>{item.caption}</bdi>
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
                      {option.totalRecord > 9 && (
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
                              onPageActive={option.page}
                              pageCount={option.totalRecord / option.sizePerPage}
                              renderOnZeroPageCount={null}
                              onPageChange={(e) => handlePageClick(e)}
                              forcePage={0}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* =======================delete modal============================================ */}

      <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="common-title-in text-center">
            <h5>Delete Post</h5>
            <p>Are you sure you want to Delete this post?</p>
          </div>
          <Modal.Footer>
            <div className="">
              <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setDeleteModalShow(false)}>
                <span className="position-relative">NO</span>
              </button>
            </div>
            <div className="ms">
              <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={() => deletePost()}>
                <span className="position-relative">YES</span>
              </button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
