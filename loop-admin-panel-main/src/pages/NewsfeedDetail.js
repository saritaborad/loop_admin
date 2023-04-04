import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout/layout";
import Back from "../images/back_arw.svg";
import { Dropdown, Modal } from "react-bootstrap";
import HeartEmpty from "../images/empty_heart.svg";
import HeartFilled from "../images/filled_heart.svg";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import moment from "moment";
import toastr from "toastr";
import loaderimg from "../images/loader.gif";
import Moment from "react-moment";
import { useNavigate } from 'react-router-dom';

export default function NewsfeedDetail() {
    let location = useLocation()
    const id = location.state.id
    const url = location.state.url
    let navigate = useNavigate();
    const [openreply, setOpenReply] = useState(false);
    const [openId, setOpenId] = useState()
    const [news, setNews] = useState([]);
    const [comment, setComment] = useState([]);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteId, setDeleteId] = useState()
    const [limit, setLimit] = useState(3);
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(true);
    const [postLikelist, setPostLikelist] = useState([]);

    const getNewsDetails = () => {
        let data = {
            id: id,
            page: 1,
            limit: limit,
        }

        const newsdetailspromise = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.getnewsdetails, data))
        });
        newsdetailspromise.then((response) => {
            if (response.status === 200) {
                setNews(response.data.data.news)
                setComment(response.data.data.news.comments)
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    useEffect(() => {
        getNewsDetails();
    }, [limit])

    useEffect(() => {
        if (window.twttr) {
            window.twttr.widgets.load();
        }
    }, [news]);

    const loadmore = () => {
        setLimit((prev) => prev + 3)
    }

    const newsComment = (id) => {
        navigate(`/manage-comments`, { state: { id: id } });
    }

    const redirectToEditNews = (news) => {
        navigate(`/edit-post`, { state: { id: news._id } })
    }

    const postDelete = (id) => {
        setDeleteId(id)
        setDeleteModalShow(true)
    }

    const deletePost = () => {
        let data = {
            id: deleteId
        }
        const DeletePostPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.deletePost, data));
        });
        DeletePostPromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message)
                setDeleteModalShow(false)
                navigate("/news-feed")
            }
        });
    }


    const deleteMultipalComment = (id) => {
        const deleteMultiCommentPromise = new Promise((resolve, rejected) => {
            let data = {
                ids: [id]
            }
            resolve(PostApi(API_Path.deleteMultiComments, data))
        });
        deleteMultiCommentPromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message)
                setNews(response.data.data.news)
                getNewsDetails()
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const deletesubComment = (id) => {
        const data = {
            sub_comment_id: id
        }
        const deleteCommentPromise = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.deleteSubComment, data))
        });
        deleteCommentPromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message)
                getNewsDetails()
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const openReplay = (id) => {
        if (id !== openId) {
            setOpenReply(true);
            setOpenId(id);
        } else {
            setOpenReply(!openreply)
            if (openreply) {
                setOpenId(id);
            }
        }
    }

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


    const handleClose = () => setShow(false);

    const handleShow = (newsId) => {
        setShow(true);
        setLoader(true);
        getLikelist(newsId);
    };



    return (
        <Layout>
            <div className="content-main-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="comn-title-info d-flex align-items-center">
                                <Link to="/news-feed">
                                    <img src={Back} alt="" className="me-2" />
                                </Link>
                                <h1>Newsfeed Details</h1>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="white-box-main">
                                <div className="news-feed-detail-main">
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <div className="latest-news-header">
                                                <div className="d-flex align-items-center">
                                                    <span>{news?.category !== "" && news?.category && news?.category?.charAt(0)}</span>
                                                    <bdi className="text-capitalize">{news?.category}</bdi>
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
                                                                            <Dropdown.Item onClick={() => redirectToEditNews(news)}>Edit</Dropdown.Item>
                                                                        </li>
                                                                        <li>
                                                                            <Dropdown.Item onClick={() => postDelete(news._id)}>Delete</Dropdown.Item>
                                                                        </li>
                                                                    </ul>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="latest-news-small-header py-2">
                                                <h4>{news?.title}</h4>
                                                <div className="latest-news-content pb-2">
                                                    <p className="m-0">
                                                        {news?.caption}
                                                    </p>
                                                </div>
                                                <span>
                                                    <span>&#9679; <Moment fromNow>{news?.scheduleDate}</Moment></span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="preview-top-img mb-3 text-center">
                                                {news?.isEmbeded === 0 && news?.imagesorvideo[0]?.includes("mp4") ?
                                                    <video controls>
                                                        <source src={news?.imagesorvideo[0]} type="video/mp4" />
                                                    </video>
                                                    : news?.isEmbeded === 0 && <img src={news?.imagesorvideo[0]} className="img-fluid" alt="" />
                                                }
                                                {
                                                    news?.isEmbeded === 1 &&
                                                    <div dangerouslySetInnerHTML={{ __html: news?.embededLink }} className="news-twitter"></div>
                                                }
                                            </div>
                                            <div className="img-btm-section d-sm-flex d-block">
                                                <ul className="latest-news-ft-sec">
                                                    <li className="me-3">
                                                        {news.like_count > 0 ? (
                                                            <span onClick={() => handleShow(news?._id)} >
                                                                <i className="bi bi-heart-fill" /> {news?.like_count}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <i className="bi bi-heart" /> {news?.like_count}
                                                            </span>
                                                        )}
                                                    </li>

                                                    {/* <li className="me-3">
                                                        <span>
                                                            <i className="bi bi-heart-fill" /> {news?.like_count}
                                                        </span>
                                                    </li> */}
                                                    <li>
                                                        <p>{news?.comment_count} Comments</p>
                                                    </li>
                                                </ul>
                                                {url !== "hide" && comment.length > 0 ? (
                                                    <ul className="latest-news-ft-sec ms-auto">
                                                        <li className="ms-auto managebdr" onClick={() => newsComment(location.state.id)}>
                                                            <Link to="/manage-comments">Manage Comments</Link>
                                                        </li>
                                                    </ul>) : ("")}
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            {comment.length > 0 && comment.map((item, i) => {
                                                return (
                                                    <div className="comn-reply-area mb-3" key={i}>
                                                        <div className="d-flex">
                                                            <div className="d-inline-block w-100">
                                                                <div className="d-sm-flex  border-bottom py-3">
                                                                    <div className="prayer-profile me-sm-3">
                                                                        <img src={item.user?.profile_img} alt="" />
                                                                    </div>
                                                                    <div className="reply-center-part w-100">
                                                                        <div className="reply-top-info mb-2">
                                                                            <span>{item.user?.fname} {item.user?.lname}</span>
                                                                            <bdi className="ms-2">{item.CommentDescription}</bdi>
                                                                        </div>
                                                                        <div className="d-sm-flex align-items-center">
                                                                            <div className="d-flex align-items-center">
                                                                                {/* <label className="like-btn d-inline-block">
                                                                                    <input type="checkbox" checked={true} />
                                                                                    <span className="like-empty">
                                                                                        <img src={HeartEmpty} alt="" />
                                                                                    </span>
                                                                                    <span className="like-filled">
                                                                                        <img src={HeartFilled} alt="" />
                                                                                    </span>
                                                                                    <bdi>{item.like_count}</bdi>
                                                                                </label> */}
                                                                                <ul className="latest-news-ft-sec">
                                                                                    <li className="me-3">
                                                                                        {item.like_count > 0 ? (
                                                                                            <span >
                                                                                                <i className="bi bi-heart-fill" /> {item.like_count}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span>
                                                                                                <i className="bi bi-heart" /> {item.like_count}
                                                                                            </span>
                                                                                        )}
                                                                                    </li>
                                                                                </ul>
                                                                                <div className="ms-2 reply-count " onClick={() => item.subcomment_count > 0 ? openReplay(item._id) : setOpenReply(false) && openId("")}>
                                                                                    <span className="reply-span me-2">Reply</span>
                                                                                    <bdi>{item.subcomment_count}</bdi>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ms-auto reply-side-part">
                                                                                <span className="me-2">
                                                                                    <span></span> Reported
                                                                                </span>
                                                                                <bdi>{moment(item.createdAt).format("DD/MM/YYYY")}</bdi>
                                                                            </div>
                                                                        </div>
                                                                        {openreply && item._id === openId ? (
                                                                            item?.subcomments.map((items, i) => {
                                                                                return (
                                                                                    <div className="mt-2 ms-sm-5 ms-3" key={i}>
                                                                                        <div className="comn-reply-area">
                                                                                            <div className="d-flex">
                                                                                                <div className="d-inline-block w-100">
                                                                                                    <div className="d-sm-flex ">
                                                                                                        <div className="prayer-profile me-sm-3">
                                                                                                            <img src={items.user?.profile_img} alt="" />
                                                                                                        </div>
                                                                                                        <div className="reply-center-part w-100">
                                                                                                            <div className="reply-top-info mb-2">
                                                                                                                <span>{items.user?.fname} {items.user?.lname}</span>
                                                                                                                <bdi> {items.CommentDescription}</bdi>
                                                                                                            </div>
                                                                                                            <div className="d-flex align-items-center">
                                                                                                                {/* <label className="like-btn d-inline-block">
                                                                                                                    <input type="checkbox" checked={true} />
                                                                                                                    <span className="like-empty">
                                                                                                                        <img src={HeartEmpty} alt="" />
                                                                                                                    </span>
                                                                                                                    <span className="like-filled">
                                                                                                                        <img src={HeartFilled} alt="" />
                                                                                                                    </span>
                                                                                                                    <bdi>{item?.user?.like_count}</bdi>
                                                                                                                </label> */}
                                                                                                                <ul className="latest-news-ft-sec">
                                                                                                                    <li className="me-3">
                                                                                                                        {item.like_count > 0 ? (
                                                                                                                            <span>
                                                                                                                                <i className="bi bi-heart-fill" /> {item.like_count}
                                                                                                                            </span>
                                                                                                                        ) : (
                                                                                                                            <span>
                                                                                                                                <i className="bi bi-heart" /> {item.like_count}
                                                                                                                            </span>
                                                                                                                        )}
                                                                                                                    </li>
                                                                                                                </ul>
                                                                                                                <div className="ms-auto reply-side-part">
                                                                                                                    <bdi>{moment(items.createdAt).format("DD/MM/YYYY")}</bdi>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="cust-drop-down">
                                                                                                    <Dropdown>
                                                                                                        <Dropdown.Toggle id="dropdown-basic" className="cust-drop-btn">
                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                                                                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                                                                            </svg>
                                                                                                        </Dropdown.Toggle>
                                                                                                        <Dropdown.Menu>
                                                                                                            <ul>
                                                                                                                {/* <li>
                                                                                                                    <Dropdown.Item href="/">Edit</Dropdown.Item>
                                                                                                                </li> */}
                                                                                                                <li>
                                                                                                                    <Dropdown.Item onClick={() => deletesubComment(items?._id)}>Delete</Dropdown.Item>
                                                                                                                </li>
                                                                                                            </ul>
                                                                                                        </Dropdown.Menu>
                                                                                                    </Dropdown>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>)
                                                                            })
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="cust-drop-down">
                                                                <Dropdown>
                                                                    <Dropdown.Toggle id="dropdown-basic" className="cust-drop-btn">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                                        </svg>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <ul>
                                                                            {/* <li>
                                                                                <Dropdown.Item href="/">Edit</Dropdown.Item>
                                                                            </li> */}
                                                                            <li>
                                                                                <Dropdown.Item onClick={() => deleteMultipalComment(item._id)}>Delete</Dropdown.Item>
                                                                            </li>
                                                                        </ul>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                        </div>
                                        {comment.length > 2 && limit <= comment.length &&
                                            <div className="col-12">
                                                <div className="my-2 reply-more text-center">
                                                    <button onClick={() => loadmore()}>Load More</button>
                                                </div>
                                            </div>
                                        }
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


                                        {/* ==========================likes modal============================================== */}

                                        <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box likes-box" centered show={show} onHide={handleClose} scrollable={true}>
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
                                                                                            <img src={item.user?.profile_img} alt="" className="item-uselikeimg me-2" />
                                                                                        ) : (
                                                                                            <svg className="item-uselikeimg me-2" width={50} height={50} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
                                                                                                            <Moment format="DD MMM, YYYY" date={item.updatedAt} withTitle />
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


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
