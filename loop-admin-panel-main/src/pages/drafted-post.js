import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/layout";
import { Dropdown, Modal } from "react-bootstrap";
import { GetApi, PostApi } from "../ApiService";
import { API_Path } from "../const";
import toastr from "toastr";
import loaderimg from "../images/loader.gif";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function DraftedPost() {
  const [listGrid, setListGrid] = useState(true);
  const [drafted_posts, setDrafted_posts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [priority, setPriority] = useState(1);

  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: "",
    page: 0,
    sort: "",
    order: "",
  });

  useEffect(() => {
    draftPost(option.page);
  }, []);

  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }, [drafted_posts]);

  let navigate = useNavigate();
  const listview = () => {
    document.getElementById("list").classList.add("active");
    document.getElementById("grid").classList.remove("active");
    document.getElementById("grid-view-id").classList.remove("grid-view-active");
  };
  const gridview = () => {
    document.getElementById("grid").classList.add("active");
    document.getElementById("list").classList.remove("active");
    document.getElementById("grid-view-id").classList.add("grid-view-active");
  };

  const draftPost_filter = (e, page) => {
    setPriority(e.target.value);
    draftPost(page, e.target.value);
  };

  const draftPost = (page, priority_value) => {
    const getDraftedPromise = new Promise((resolve, rejected) => {
      let data = {
        page: page + 1,
        limit: 10,
        newest: parseInt(priority_value) ? parseInt(priority_value) : 1,
      };
      resolve(PostApi(API_Path.getDraftedPost, data));
    });
    getDraftedPromise.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        setDrafted_posts(response.data.data.drafted_posts);
        set_option({
          totalRecord: response.data.data.totaldraftpost,
          page: page,
          sizePerPage: 10,
        });
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const handlePageClick = (e) => {
    draftPost(e.selected);
  };

  const newsDetails = (id) => {
    navigate(`/newsfeed-detail`, { state: { id: id } });
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
        draftPost();
        setDeleteModalShow(false);
      }
    });
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
                <h1>Drafted Posts</h1>
              </div>
            </div>
            <div className="col-12">
              <div className="diff-view-tabs">
                <ul>
                  <li className="manage-comments-hdr">
                    <select className="form-select frnt-input-style" onChange={(e) => draftPost_filter(e)}>
                      <option value={1}>Newest</option>
                      <option value={-1}>Oldest</option>
                    </select>
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
                {listGrid && (
                  <div className="col-12">
                    <div id="grid-view-id" className="">
                      <ul className="grid-view-ul">
                        {drafted_posts.length > 0 ?
                          drafted_posts.map((item, i) => {
                            return (
                              <li className="my-3 grid-view-li" key={i}>
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
                                            createdAt On: <Moment format="DD/MM/YYYY hh:mm a" date={item.createdAt} />
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
                            <div className="text-center">
                              <i>
                                <b>--- Data not found --- </b>
                              </i>
                            </div>
                          )}
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
