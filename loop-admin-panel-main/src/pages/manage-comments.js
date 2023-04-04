import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout/layout";
import Back from "../images/back_arw.svg";
import { Dropdown, Modal, Nav, Tab } from 'react-bootstrap';
import Search from "../images/search-icon.svg";
import HeartEmpty from "../images/empty_heart.svg";
import HeartFilled from "../images/filled_heart.svg";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import toastr from "toastr";
import Moment from "react-moment";
import moment from "moment";

var timeout;
export default function ManageComments() {

    let location = useLocation()
    const [key, setKey] = useState("all");
    const [openreply, setOpenReply] = useState(false);
    const [reportReply, setReportReply] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState();
    const [deleteCommentModal, setDeleteCommentModal] = useState(false)
    const [ReportCommentModal, setReportCommentModal] = useState(false)
    const [commentList, setCommentList] = useState([]);
    const [reportList, setReportList] = useState([]);
    const [deleteList, setDeleteList] = useState([]);
    const [unReviewList, setUnReviewList] = useState([]);
    // const [adminApproveCommentList, setApproveCommentList] = useState([]);
    // const [adminApproveComment, setAdminApproveComment] = useState(true);
    const [replyComment, setReplyComment] = useState("");
    const [report_Id, setReport_Id] = useState("");
    const [ids, setIds] = useState([]);
    const [limit, setLimit] = useState(5);
    const [deleteLimit, setDeleteLimit] = useState(5);
    const [reportLimit, setReportLimit] = useState(5);
    const [unreviewLimit, setUnreviewLimit] = useState(5);
    const [openId, setOpenId] = useState()
    const [checkedReport, setCheckedReport] = useState("");
    const [searchComment, setSearchComment] = useState("");
    const [priority, setPriority] = useState(0)
    const [date, setDate] = useState()
    const [reportSearch, setReportSearch] = useState("")
    const [reportPriority, setReportPriority] = useState(0)
    const [selectReportDate, setSelectReportDate] = useState()
    const [deleteSearch, setDeleteSearch] = useState("")
    const [deleteDate, setDeleteDate] = useState()
    const [deletePriority, setDeletePriority] = useState(0)
    const [unreviewSearch, setUnreviewSearch] = useState("")
    const [unreviewDate, setUnreviewDate] = useState()
    const [unreviewPriority, setUnreviewPriority] = useState(0)
    const [deActiveModalShow, setDeActiveModalShow] = useState(false);
    const [userStatus, setUserStatus] = useState();
    const [selectedUser, setSelectedUser] = useState();


    useEffect(() => {
        getCommentList();
        getReportList();
        getDeleteCommentList();
        getUnReviewCommentList();
        // getApproveCommentList();
    }, [])


    const filterdComment = () => {
        let data = {
            id: location.state.id,
            page: 1,
            limit: limit,
            message: searchComment,
            priority: parseInt(priority),
            date: date
        }
        const adminCommentList = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.adminCommentList, data))
        });
        adminCommentList.then((response) => {
            if (response.status === 200) {
                setCommentList(response.data.data.commentlist)
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    useEffect(() => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(() => {
            filterdComment();
        }, 500);
    }, [searchComment])


    useEffect(() => {
        let data = {
            id: location.state.id,
            page: 1,
            limit: limit,
            message: searchComment,
            priority: parseInt(priority),
            date: date
        }

        const adminCommentList = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.adminCommentList, data))
        });
        adminCommentList.then((response) => {
            if (response.status === 200) {
                setCommentList(response.data.data.commentlist)
            } else {
                toastr.error(response.data.message)
            }
        })

    }, [limit, priority, date])

    const getCommentList = () => {
        let data = {
            id: location.state.id,
            page: 1,
            limit: limit
        }
        const adminCommentList = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.adminCommentList, data))
        });

        adminCommentList.then((response) => {
            if (response.status === 200) {
                setCommentList(response.data.data.commentlist)
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const UnreviewedCommentHandle = (id) => {
        let data = {
            ids: id,
        }

        const unreviewComment = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.unreviewComments, data))
        });
        unreviewComment.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message)
                getUnReviewCommentList()
                getCommentList();
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const UnreviewedMultiCommentHandle = () => {
        const UnreviewedMultiCommentPromice = new Promise((resolve, rejected) => {
            let data = {
                ids: ids
            }
            resolve(PostApi(API_Path.unreviewComments, data))
        });
        UnreviewedMultiCommentPromice.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message)
                getUnReviewCommentList()
                getCommentList();
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const reportCommentOpen = (id) => {
        setReport_Id(id)
        setReportCommentModal(true)
    }


    const handleCheckedReport = (e) => {
        setCheckedReport(e.target.value)
    }

    const reportComment = () => {
        let data = {
            _id: report_Id,
            message: checkedReport,
        }

        if (checkedReport != "") {
            const reportCommentPromise = new Promise((resolve, rejected) => {
                resolve(PostApi(API_Path.reportedComment, data))
            });
            reportCommentPromise.then((response) => {
                if (response.status === 200) {
                    toastr.success(response.data.message)
                    setReportCommentModal(false)
                    getReportList()
                    setCheckedReport("")
                } else {
                    toastr.error(response.data.message)
                }
            })
        } else {
            toastr.error("please select any report")
        }

    }

    const getReportList = () => {
        let data = {
            news_id: location.state.id,
            page: 1,
            limit: reportLimit,
            message: reportSearch,
            priority: parseInt(reportPriority),
            date: selectReportDate,
        }
        const adminReportList = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.adminReportComments, data))
        });
        adminReportList.then((response) => {
            if (response.status === 200) {
                setReportList(response.data.data.comment)
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    // report filterd useEffect

    useEffect(() => {
        getReportList()
    }, [reportSearch, reportPriority, selectReportDate, reportLimit])


    const getDeleteCommentList = () => {
        let data = {
            news_id: location.state.id,
            page: 1,
            limit: deleteLimit,
            priority: parseInt(deletePriority),
            date: deleteDate,
            message: deleteSearch
        }
        const adminDeleteList = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.adminDeleteComments, data))
        });
        adminDeleteList.then((response) => {
            if (response.status === 200) {
                setDeleteList(response.data.data.comment)
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const showDeActiveModal = (id, status) => {
        setSelectedUser(id);
        setUserStatus(status);
        setDeActiveModalShow(true);
    };


    useEffect(() => {
        getDeleteCommentList()
    }, [deleteSearch, deletePriority, deleteDate, deleteLimit])


    const getUnReviewCommentList = () => {
        let data = {
            news_id: location.state.id,
            page: 1,
            limit: unreviewLimit,
            priority: parseInt(unreviewPriority),
            date: unreviewDate,
            message: unreviewSearch
        }
        const adminUnReviewList = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.adminUnReviewedComments, data))
        });
        adminUnReviewList.then((response) => {
            if (response.status === 200) {
                setUnReviewList(response.data.data.comment)
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    useEffect(() => {
        getUnReviewCommentList()
    }, [unreviewSearch, unreviewDate, unreviewPriority, unreviewLimit])


    const addReplyComment = (id) => {
        let data = {
            id: id,
            CommentDescription: replyComment,
        }
        const adminUnReviewList = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.adminReplyComment, data))
        });
        adminUnReviewList.then((response) => {
            if (response.status === 200) {
                getCommentList();
                setUnReviewList(response.data.data)
                setOpenReply(false)
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const deActiveUser = () => {
        let data = {
            id: selectedUser,
        };
        const deActiveUserPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.manageUserStatus, data));
        });
        deActiveUserPromise.then((response) => {
            if (response.status === 200) {
                setDeActiveModalShow(false);
                toastr.success(response.data.message);
                getReportList()
            } else {
                toastr.error(response.data.message)
            }
        });
    };

  

    const deleteComment = (item) => {
        setDeleteCommentId(item._id)
        setDeleteCommentModal(true)
    }

    const deleteHandleComment = () => {
        let data = {
            ids: [deleteCommentId]
        }
        const deleteCommentPromise = new Promise((resolve, rejected) => {
            resolve(PostApi(API_Path.deleteMultiComments, data))
        });
        deleteCommentPromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message)
                setDeleteCommentModal(false)
                getReportList()
                getCommentList()
                getDeleteCommentList();
            } else {
                toastr.error(response.data.message)
            }
        })
    }


    const handleDeschange = (e) => {
        setReplyComment(e.target.value)
    }

    const selectMultiCheckHandle = (e, id) => {
        let temp = ids;
        let checkExistIds = ids.filter(x => x === id);
        if (checkExistIds.length > 0 && !e.target.checked) {
            let removeEle = temp.filter(x => x !== id)
            setIds(removeEle);
        } else {
            temp.push(id);
            setIds(temp);
        }
    }

    const deleteMultipalComment = () => {
        const deleteMultiCommentPromise = new Promise((resolve, rejected) => {
            let data = {
                ids: ids
            }
            resolve(PostApi(API_Path.deleteMultiComments, data))
        });
        deleteMultiCommentPromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message)
                getCommentList();
                getReportList();
            } else {
                toastr.error(response.data.message)
            }
        })
    }

    const selectDate = (e) => {
        if (e.target.value === "PastDay") {
            let dateFrom = moment().subtract(1, 'd').format('MM-DD-YYYY')
            setDate(dateFrom)
        } else if (e.target.value === "PastWeek") {
            let dateFrom = moment().subtract(7, 'd').format('MM-DD-YYYY')
            setDate(dateFrom)
        } else if (e.target.value === "PastMonth") {
            let dateFrom = moment().subtract(1, 'M').format('MM-DD-YYYY')
            setDate(dateFrom)
        } else if (e.target.value === "PastYear") {
            let dateFrom = moment().subtract(1, 'Y').format('MM-DD-YYYY')
            setDate(dateFrom)
        } else {
            setDate("")
        }
    }

    const selectReportedDate = (e) => {
        if (e.target.value === "PastDay") {
            let dateFrom = moment().subtract(1, 'd').format('MM-DD-YYYY')
            setSelectReportDate(dateFrom)
        } else if (e.target.value === "PastWeek") {
            let dateFrom = moment().subtract(7, 'd').format('MM-DD-YYYY')
            setSelectReportDate(dateFrom)
        } else if (e.target.value === "PastMonth") {
            let dateFrom = moment().subtract(1, 'M').format('MM-DD-YYYY')
            setSelectReportDate(dateFrom)
        } else if (e.target.value === "PastYear") {
            let dateFrom = moment().subtract(1, 'Y').format('MM-DD-YYYY')
            setSelectReportDate(dateFrom)
        } else {
            setSelectReportDate("")
        }
    }

    const selectDeleteDate = (e) => {
        if (e.target.value === "PastDay") {
            let dateFrom = moment().subtract(1, 'd').format('MM-DD-YYYY')
            setDeleteDate(dateFrom)
        } else if (e.target.value === "PastWeek") {
            let dateFrom = moment().subtract(7, 'd').format('MM-DD-YYYY')
            setDeleteDate(dateFrom)
        } else if (e.target.value === "PastMonth") {
            let dateFrom = moment().subtract(1, 'M').format('MM-DD-YYYY')
            setDeleteDate(dateFrom)
        } else if (e.target.value === "PastYear") {
            let dateFrom = moment().subtract(1, 'Y').format('MM-DD-YYYY')
            setDeleteDate(dateFrom)
        } else {
            setDeleteDate("")
        }
    }
    const selectUnreviewDate = (e) => {
        if (e.target.value === "PastDay") {
            let dateFrom = moment().subtract(1, 'd').format('MM-DD-YYYY')
            setUnreviewDate(dateFrom)
        } else if (e.target.value === "PastWeek") {
            let dateFrom = moment().subtract(7, 'd').format('MM-DD-YYYY')
            setUnreviewDate(dateFrom)
        } else if (e.target.value === "PastMonth") {
            let dateFrom = moment().subtract(1, 'M').format('MM-DD-YYYY')
            setUnreviewDate(dateFrom)
        } else if (e.target.value === "PastYear") {
            let dateFrom = moment().subtract(1, 'Y').format('MM-DD-YYYY')
            setUnreviewDate(dateFrom)
        } else {
            setUnreviewDate("")
        }
    }
    const loadmore = () => {
        setLimit((prev) => prev + 5)
    }

    const deleteLoadmore = () => {
        setDeleteLimit((prev) => prev + 5)
    }

    const reportLoadmore = () => {
        setReportLimit((prev) => prev + 5)
    }

    const unreviewLoadmore = () => {
        setUnreviewLimit((prev) => prev + 5)
    }

    const openReplay = (id) => {
        setOpenId(id);
        setOpenReply(true)
    }

    const openReportReply = (id) => {
        setOpenId(id);
        setReportReply(true)
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
                getCommentList()
            } else {
                toastr.error(response.data.message)
            }
        })
    }

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
                                <h1>Manage Comments</h1>
                            </div>
                        </div>
                        <div className="col-12">
                            <Tab.Container id="left-tabs-example" activeKey={key} onSelect={(k) => setKey(k)}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="white-box-commn-tab">
                                            <Nav>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="all">All</Nav.Link>
                                                </Nav.Item>
                                                {/* <Nav.Item>
                                                    <Nav.Link eventKey="approved">Approved</Nav.Link>
                                                </Nav.Item> */}
                                                <Nav.Item>
                                                    <Nav.Link eventKey="reported">Reported</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="deleted">Deleted</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="unreviewed">Unreviewed</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </div>
                                    </div>
                                    <div className="col-md-12 py-3">
                                        <Tab.Content>
                                            <Tab.Pane eventKey="all">
                                                <div className="white-box-main p-0">
                                                    <div className="p-3 border-bottom">
                                                        <div className="manage-comments-hdr">
                                                            {/* <div className="custom-checkbox position-relative me-3">
                                                                <label className="custom-lbl-part position-static">
                                                                    <input type="checkbox" />
                                                                    <span className="custom-checkbox-class"></span>
                                                                </label>
                                                            </div> */}
                                                            <div className="hdr-top-info d-flex align-items-center position-relative me-3">
                                                                <input type="search" className="form-control frnt-input-style" placeholder="Search here..." value={searchComment} onChange={(e) => setSearchComment(e.target.value)} />
                                                                <div className="hdr-top-info-fix">
                                                                    <img src={Search} alt="" />
                                                                </div>
                                                            </div>
                                                            {/* <div className="me-3">
                                                                <select className="form-select frnt-input-style">
                                                                    <option>Expand</option>
                                                                </select>
                                                            </div> */}
                                                            {/* <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-funnel"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0">
                                                                        <option>Filter by</option>
                                                                        <option>No Issue</option>
                                                                        <option>Guest</option>
                                                                        <option>Contains Link</option>
                                                                        <option>Low Rep</option>
                                                                    </select>
                                                                </div>
                                                            </div> */}
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-calendar"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => selectDate(e)}>
                                                                        <option value="PastDay">Past Day</option>
                                                                        <option value="PastWeek">Past Week</option>
                                                                        <option value="PastMonth">Past Month</option>
                                                                        <option value="PastYear">Past Year</option>
                                                                        <option value="alltime">All Time</option>
                                                                        {/* <option>Custom</option> */}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-filter"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => setPriority(e.target.value)}>
                                                                        <option value={0}>Newest</option>
                                                                        <option value={1}>Oldest</option>
                                                                        <option value={2}>Priority</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 border-bottom">
                                                        <div className="manage-select-part d-flex align-items-center">
                                                            <div className="selected-data me-auto">Comments Selected</div>
                                                            <span className="manage-comn-btn ms-3" onClick={() => UnreviewedMultiCommentHandle()}>Unreviewed</span>
                                                            <span className="manage-comn-btn ms-3" onClick={() => deleteMultipalComment()}>Delete</span>
                                                            {/* <span className="manage-comn-btn ms-3">Report</span> */}
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        {commentList.length > 0 ? commentList.map((item, i) => {
                                                            return (
                                                                <div className="comn-reply-area mb-3" key={item._id}>
                                                                    <div className="d-flex">
                                                                        <div className="custom-checkbox position-relative me-3 mt-3">
                                                                            <label className="custom-lbl-part position-static">
                                                                                <input type="checkbox" onClick={(e) => selectMultiCheckHandle(e, item._id)} />
                                                                                <span className="custom-checkbox-class"></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="d-inline-block w-100  border-bottom py-3">
                                                                            <div className="d-sm-flex ">
                                                                                <div className="prayer-profile me-3">
                                                                                    <img src={item?.user?.profile_img} alt="" />
                                                                                </div>
                                                                                <div className="reply-center-part w-100">
                                                                                    <div className="reply-top-info mb-2">
                                                                                        <span>{item?.user?.fname} {item?.user?.lname}</span>
                                                                                        <bdi> {item?.CommentDescription}</bdi>
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
                                                                                            <div className="ms-2 reply-count " onClick={() => openReplay(item._id)}>
                                                                                                <span className="reply-span me-2">Reply</span>
                                                                                            </div>
                                                                                            {item.subcomments.length}
                                                                                        </div>
                                                                                        <div className="ms-auto reply-side-part">
                                                                                            <span className="me-2">
                                                                                                <span>{item?.reported_Users_count}</span> Reported
                                                                                            </span>
                                                                                            <bdi><Moment format="DD/MM/YYYY" date={item?.createdAt} withTitle /></bdi>
                                                                                        </div>
                                                                                    </div>
                                                                                    {item.subcomments.length > 0 ? (
                                                                                        item?.subcomments.map((items, i) => {
                                                                                            return (
                                                                                                <div className="mt-2 ms-sm-5 ms-3">
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
                                                                                                                                <bdi>{items.like_count}</bdi>
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
                                                                                                                                <bdi><Moment format="DD/MM/YYYY" date={items.createdAt} withTitle /></bdi>
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
                                                                                                                                <Dropdown.Item onClick={() => deletesubComment(items._id)}>Delete</Dropdown.Item>
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

                                                                                    {openreply && item._id === openId ? (
                                                                                        <div className="mt-2">
                                                                                            <div className="reply-text-part">
                                                                                                <textarea className="form-control frnt-input-style h-auto w-100" rows="5" onChange={(e) => handleDeschange(e)} />
                                                                                                <div className="button-reply">
                                                                                                    <div className="d-sm-flex align-items-center">
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 w-100 mb-sm-0 mb-2" onClick={() => addReplyComment(item._id)}>Post Reply</button>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 ms-sm-2 w-100 mb-sm-0 mb-2" onClick={() => setOpenReply(false)}>Cancel</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                    <div className="d-sm-flex align-items-center mt-3">
                                                                                        <div className="d-flex align-items-center">
                                                                                            <span className="manage-comn-btn" onClick={() => deleteComment(item)}>Delete</span>
                                                                                            <span className="manage-comn-btn ms-2" onClick={() => reportCommentOpen(item._id)}>Report</span>
                                                                                            <span className="manage-comn-btn ms-2" onClick={() => UnreviewedCommentHandle(item._id)}>Unreviewed</span>
                                                                                            {/* <span className="manage-comn-btn ms-2" onClick={()=>reportComment(item._id)}>Report</span> */}
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }) : (
                                                            <div className="news-feed-main-box py-5">
                                                                <div className="text-center">
                                                                    <i>
                                                                        <b>--- Data not found --- </b>
                                                                    </i>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {commentList.length > 0 && limit <= commentList.length &&
                                                            <div className="col-12">
                                                                <div className="my-2 reply-more text-center">
                                                                    <button onClick={() => loadmore()}>Load More</button>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                            {/* <Tab.Pane eventKey="approved">
                                                <div className="white-box-main p-0">
                                                    <div className="p-3 border-bottom">
                                                        <div className="manage-comments-hdr">
                                                            <div className="custom-checkbox position-relative me-3">
                                                                <label className="custom-lbl-part position-static">
                                                                    <input type="checkbox" />
                                                                    <span className="custom-checkbox-class"></span>
                                                                </label>
                                                            </div>
                                                            <div className="hdr-top-info d-flex align-items-center position-relative me-3">
                                                                <input type="search" className="form-control frnt-input-style" placeholder="Search here..." />
                                                                <div className="hdr-top-info-fix">
                                                                    <img src={Search} alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="me-3">
                                                                <select className="form-select frnt-input-style">
                                                                    <option>Expand</option>
                                                                </select>
                                                            </div>
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-funnel"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0">
                                                                        <option>Filter by</option>
                                                                        <option>No Issue</option>
                                                                        <option>Guest</option>
                                                                        <option>Contains Link</option>
                                                                        <option>Low Rep</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-calendar"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0">
                                                                        <option>Past Day</option>
                                                                        <option>Past Week</option>
                                                                        <option>Past Month</option>
                                                                        <option>Past Year</option>
                                                                        <option>All Time</option>
                                                                        <option>Custom</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-filter"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0">
                                                                        <option>Newest</option>
                                                                        <option>Oldest</option>
                                                                        <option>Priority</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 border-bottom">
                                                        <div className="manage-select-part d-flex align-items-center">
                                                            <div className="selected-data me-auto"> Comments Selected</div>
                                                            <span className="manage-comn-btn ms-3">Approve</span>
                                                            <span className="manage-comn-btn ms-3">Report</span>

                                                        </div>
                                                    </div>
                                                    {adminApproveCommentList.length > 0 && adminApproveCommentList.map((item, i) => {
                                                        return (
                                                            <div className="p-3">
                                                                <div className="comn-reply-area mb-3">
                                                                    <div className="d-flex">
                                                                        <div className="custom-checkbox position-relative me-3 mt-3">
                                                                            <label className="custom-lbl-part position-static">
                                                                                <input type="checkbox" />
                                                                                <span className="custom-checkbox-class"></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="d-inline-block w-100  border-bottom py-3">
                                                                            <div className="d-sm-flex ">
                                                                                <div className="prayer-profile me-3">
                                                                                    <img src={item?.user?.profile_img} alt="" />
                                                                                </div>
                                                                                <div className="reply-center-part w-100">
                                                                                    <div className="reply-top-info mb-2">
                                                                                        <span>{item?.user?.fname} {item?.user?.lname}</span>
                                                                                        <bdi> {item?.CommentDescription}</bdi>
                                                                                    </div>
                                                                                    <div className="d-sm-flex align-items-center">
                                                                                        <div className="d-flex align-items-center">
                                                                                            <label className="like-btn d-inline-block">
                                                                                                <input type="checkbox" />
                                                                                                <span className="like-empty">
                                                                                                    <img src={HeartEmpty} alt="" />
                                                                                                </span>

                                                                                                <span className="like-filled">
                                                                                                    <img src={HeartFilled} alt="" />
                                                                                                </span>
                                                                                                <bdi>{item?.like_count}</bdi>
                                                                                            </label>
                                                                                            <div className="ms-2 reply-count " onClick={() => setOpenReply(true)}>
                                                                                                <span className="reply-span me-2">Reply</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ms-auto reply-side-part">
                                                                                            <span className="me-2">
                                                                                                <span>{item?.reported_Users_count}</span> Reported
                                                                                            </span>
                                                                                            <bdi><Moment format="DD/MM/YYYY" date={item?.createdAt} withTitle /></bdi>
                                                                                        </div>
                                                                                    </div>
                                                                                    {openreply ? (
                                                                                        <div className="mt-2">
                                                                                            <div className="reply-text-part">
                                                                                                <textarea className="form-control frnt-input-style h-auto w-100" rows="5" />
                                                                                                <div className="button-reply">
                                                                                                    <div className="d-sm-flex align-items-center">
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 w-100 mb-sm-0 mb-2">Post Reply</button>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 ms-sm-2 w-100 mb-sm-0 mb-2" onClick={() => setOpenReply(false)}>Cancel</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                    <div className="d-sm-flex align-items-center mt-3">
                                                                                        <div className="d-flex align-items-center">
                                                                                            <span className="manage-comn-btn approved-class">Approved</span>
                                                                                            <span className="manage-comn-btn ms-2">Report</span>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div></div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Tab.Pane> */}
                                            <Tab.Pane eventKey="reported">
                                                <div className="white-box-main p-0">
                                                    <div className="p-3 border-bottom">
                                                        <div className="manage-comments-hdr">

                                                            <div className="hdr-top-info d-flex align-items-center position-relative me-3">
                                                                <input type="search" className="form-control frnt-input-style" placeholder="Search here..." value={reportSearch} onChange={(e) => setReportSearch(e.target.value)} />
                                                                <div className="hdr-top-info-fix">
                                                                    <img src={Search} alt="" />
                                                                </div>
                                                            </div>
                                                            {/* <div className="me-3">
                                                                <select className="form-select frnt-input-style">
                                                                    <option>Expand</option>
                                                                </select>
                                                            </div> */}
                                                            {/* <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-funnel"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0">
                                                                        <option>Filter by</option>
                                                                        <option>No Issue</option>
                                                                        <option>Guest</option>
                                                                        <option>Contains Link</option>
                                                                        <option>Low Rep</option>
                                                                    </select>
                                                                </div>
                                                            </div> */}
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-calendar"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => selectReportedDate(e)}>
                                                                        <option value="PastDay">Past Day</option>
                                                                        <option value="PastWeek">Past Week</option>
                                                                        <option value="PastMonth">Past Month</option>
                                                                        <option value="PastYear">Past Year</option>
                                                                        <option value="alltime">All Time</option>
                                                                        {/* <option>Custom</option> */}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-filter"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => setReportPriority(e.target.value)}>
                                                                        <option value={0}>Newest</option>
                                                                        <option value={1}>Oldest</option>
                                                                        <option value={2}>Priority</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        {reportList.length > 0 ? reportList.map((item, i) => {
                                                            return (
                                                                <div className="comn-reply-area mb-3" key={i}>
                                                                    <div className="d-flex">
                                                                        <div className="d-inline-block w-100  border-bottom py-3">
                                                                            <div className="d-sm-flex ">
                                                                                <div className="prayer-profile me-3">
                                                                                    <img src={item?.user?.profile_img} alt="" />
                                                                                </div>
                                                                                <div className="reply-center-part w-100">
                                                                                    <div className="reply-top-info mb-2 d-flex justify-content-between align-items-center">
                                                                                        <div>
                                                                                            <span>{item?.user?.fname} {item?.user?.lname}  </span>
                                                                                            <bdi>{item?.CommentDescription}</bdi>

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
                                                                                                        <li>
                                                                                                            <Dropdown.Item onClick={() => deleteComment(item)}>Comment Delete</Dropdown.Item>
                                                                                                        </li>
                                                                                                        <li>
                                                                                                            <Dropdown.Item onClick={() => showDeActiveModal(item?.user?._id, item?.user?.status)}>{item?.user?.status === 1 ? "Block User" : "Unblock User"}</Dropdown.Item>
                                                                                                        </li>
                                                                                                    </ul>
                                                                                                </Dropdown.Menu>
                                                                                            </Dropdown>
                                                                                        </div>
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
                                                                                                <bdi>{item?.like_count}</bdi>
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
                                                                                            {/* <div className="ms-2 reply-count " onClick={() => openReportReply(item._id)}>
                                                                                                <span className="reply-span me-2">Reply</span>
                                                                                            </div> */}
                                                                                        </div>

                                                                                        <div className="ms-auto reply-side-part">
                                                                                            <span className="me-2">
                                                                                                <span>{item?.reported_Users_count}</span> Reported
                                                                                            </span>
                                                                                            <bdi><Moment format="DD/MM/YYYY" date={item?.createdAt} withTitle /></bdi>
                                                                                        </div>

                                                                                    </div>
                                                                                    {reportReply && openId === item._id ? (
                                                                                        <div className="mt-2">
                                                                                            <div className="reply-text-part">
                                                                                                <textarea className="form-control frnt-input-style h-auto w-100" rows="5" />
                                                                                                <div className="button-reply">
                                                                                                    <div className="d-sm-flex align-items-center">
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 w-100 mb-sm-0 mb-2">Post Reply</button>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 ms-sm-2 w-100 mb-sm-0 mb-2" onClick={() => setReportReply(false)}>Cancel</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }) : (
                                                            <div className="news-feed-main-box py-5">
                                                                <div className="text-center">
                                                                    <i>
                                                                        <b>--- Data not found --- </b>
                                                                    </i>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {reportList.length > 0 && reportLimit <= reportList.length &&
                                                            <div className="col-12">
                                                                <div className="my-2 reply-more text-center">
                                                                    <button onClick={() => reportLoadmore()}>Load More</button>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="deleted">
                                                <div className="white-box-main p-0">
                                                    <div className="p-3 border-bottom">
                                                        <div className="manage-comments-hdr">

                                                            <div className="hdr-top-info d-flex align-items-center position-relative me-3">
                                                                <input type="search" className="form-control frnt-input-style" placeholder="Search here..." value={deleteSearch} onChange={(e) => setDeleteSearch(e.target.value)} />
                                                                <div className="hdr-top-info-fix">
                                                                    <img src={Search} alt="" />
                                                                </div>
                                                            </div>
                                                            {/* <div className="me-3">
                                                                <select className="form-select frnt-input-style">
                                                                    <option>Expand</option>
                                                                </select>
                                                            </div>
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-funnel"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0">
                                                                        <option>Filter by</option>
                                                                        <option>No Issue</option>
                                                                        <option>Guest</option>
                                                                        <option>Contains Link</option>
                                                                        <option>Low Rep</option>
                                                                    </select>
                                                                </div>
                                                            </div> */}
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-calendar"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => selectDeleteDate(e)}>
                                                                        <option value="PastDay">Past Day</option>
                                                                        <option value="PastWeek">Past Week</option>
                                                                        <option value="PastMonth">Past Month</option>
                                                                        <option value="PastYear">Past Year</option>
                                                                        <option value="alltime">All Time</option>
                                                                        {/* <option>Custom</option> */}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-filter"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => setDeletePriority(e.target.value)}>
                                                                        <option value={0}>Newest</option>
                                                                        <option value={1}>Oldest</option>
                                                                        <option value={2}>Priority</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-3">
                                                        {deleteList.length > 0 ? deleteList.map((item, i) => {
                                                            return (
                                                                <div className="comn-reply-area mb-3" key={i}>
                                                                    <div className="d-flex">
                                                                        <div className="d-inline-block w-100  border-bottom py-3">
                                                                            <div className="d-sm-flex ">
                                                                                <div className="prayer-profile me-3">
                                                                                    <img src={item?.user?.profile_img} alt="" />
                                                                                </div>
                                                                                <div className="reply-center-part w-100">
                                                                                    <div className="reply-top-info mb-2">
                                                                                        <span>{item?.user?.fname} {item?.user?.lname}  </span>
                                                                                        <bdi>{item?.CommentDescription}</bdi>
                                                                                    </div>
                                                                                    <div className="d-sm-flex align-items-center">
                                                                                        <div className="d-flex align-items-center">
                                                                                            {/* <label className="like-btn d-inline-block">
                                                                                                <input type="checkbox" checked={false} />
                                                                                                <span className="like-empty">
                                                                                                    <img src={HeartEmpty} alt="" />
                                                                                                </span>

                                                                                                <span className="like-filled">
                                                                                                    <img src={HeartFilled} alt="" />
                                                                                                </span>
                                                                                                <bdi>{item?.like_count}</bdi>
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
                                                                                            {/* <div className="ms-2 reply-count " onClick={() => setOpenReply(true)}>
                                                                                                <span className="reply-span me-2">Reply</span>
                                                                                            </div> */}
                                                                                        </div>
                                                                                        <div className="ms-auto reply-side-part">
                                                                                            <span className="me-2">
                                                                                                <span>{item?.reported_Users_count}</span> Reported
                                                                                            </span>
                                                                                            <bdi><Moment format="DD/MM/YYYY" date={item?.createdAt} withTitle /></bdi>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* {openreply ? (
                                                                                        <div className="mt-2">
                                                                                            <div className="reply-text-part">
                                                                                                <textarea className="form-control frnt-input-style h-auto w-100" rows="5" />
                                                                                                <div className="button-reply">
                                                                                                    <div className="d-sm-flex align-items-center">
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 w-100 mb-sm-0 mb-2">Post Reply</button>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 ms-sm-2 w-100 mb-sm-0 mb-2" onClick={() => setOpenReply(false)}>Cancel</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )} */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }) : (
                                                            <div className="news-feed-main-box py-5">
                                                                <div className="text-center">
                                                                    <i>
                                                                        <b>--- Data not found --- </b>
                                                                    </i>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {deleteList.length > 0 && deleteLimit <= deleteList.length &&
                                                            <div className="col-12">
                                                                <div className="my-2 reply-more text-center">
                                                                    <button onClick={() => deleteLoadmore()}>Load More</button>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="unreviewed">
                                                <div className="white-box-main p-0">
                                                    <div className="p-3 border-bottom">
                                                        <div className="manage-comments-hdr">
                                                            {/* <div className="custom-checkbox position-relative me-3">
                                                                <label className="custom-lbl-part position-static">
                                                                    <input type="checkbox" />
                                                                    <span className="custom-checkbox-class"></span>
                                                                </label>
                                                            </div> */}
                                                            <div className="hdr-top-info d-flex align-items-center position-relative me-3">
                                                                <input type="search" className="form-control frnt-input-style" placeholder="Search here..." value={unreviewSearch} onChange={(e) => setUnreviewSearch(e.target.value)} />
                                                                <div className="hdr-top-info-fix">
                                                                    <img src={Search} alt="" />
                                                                </div>
                                                            </div>
                                                            {/* <div className="me-3">
                                                                <select className="form-select frnt-input-style">
                                                                    <option>Expand</option>
                                                                </select>
                                                            </div>
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-funnel"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0">
                                                                        <option>Filter by</option>
                                                                        <option>No Issue</option>
                                                                        <option>Guest</option>
                                                                        <option>Contains Link</option>
                                                                        <option>Low Rep</option>
                                                                    </select>
                                                                </div>
                                                            </div> */}
                                                            <div className="me-3">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-calendar"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => selectUnreviewDate(e)}>
                                                                        <option value="PastDay">Past Day</option>
                                                                        <option value="PastWeek">Past Week</option>
                                                                        <option value="PastMonth">Past Month</option>
                                                                        <option value="PastYear">Past Year</option>
                                                                        <option value="alltime">All Time</option>
                                                                        {/* <option>Custom</option> */}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <div className="input-group">
                                                                    <label className="input-group-text">
                                                                        <i className="bi bi-filter"></i>
                                                                    </label>
                                                                    <select className="form-select frnt-input-style ps-0" onChange={(e) => setUnreviewPriority(e.target.value)}>
                                                                        <option value={0}>Newest</option>
                                                                        <option value={1}>Oldest</option>
                                                                        <option value={2}>Priority</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="p-3 border-bottom">
                                                        <div className="manage-select-part d-flex align-items-center">
                                                            <div className="selected-data me-auto"> Comments Selected</div>
                                                            <span className="manage-comn-btn ms-3">Approve</span>
                                                            <span className="manage-comn-btn ms-3">Report</span>

                                                        </div>
                                                    </div> */}
                                                    <div className="p-3">
                                                        {unReviewList.length > 0 ? unReviewList.map((item, i) => {
                                                            return (
                                                                <div className="comn-reply-area mb-3" key={i}>
                                                                    <div className="d-flex">
                                                                        {/* <div className="custom-checkbox position-relative me-3 mt-3">
                                                                            <label className="custom-lbl-part position-static">
                                                                                <input type="checkbox" />
                                                                                <span className="custom-checkbox-class"></span>
                                                                            </label>
                                                                        </div> */}
                                                                        <div className="d-inline-block w-100  border-bottom py-3">
                                                                            <div className="d-sm-flex ">
                                                                                <div className="prayer-profile me-3">
                                                                                    <img src={item?.user?.profile_img} alt="" />
                                                                                </div>
                                                                                <div className="reply-center-part w-100">
                                                                                    <div className="reply-top-info mb-2">
                                                                                        <span>{item?.user?.fname} {item?.user?.lname}  </span>
                                                                                        <bdi>{item?.CommentDescription}</bdi>
                                                                                    </div>
                                                                                    <div className="d-sm-flex align-items-center">
                                                                                        <div className="d-flex align-items-center">
                                                                                            {/* <label className="like-btn d-inline-block">
                                                                                                <input type="checkbox" checked={false} />
                                                                                                <span className="like-empty">
                                                                                                    <img src={HeartEmpty} alt="" />
                                                                                                </span>
                                                                                                <span className="like-filled">
                                                                                                    <img src={HeartFilled} alt="" />
                                                                                                </span>
                                                                                                <bdi>{item?.like_count}</bdi>
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
                                                                                            <div className="ms-2 reply-count">
                                                                                                <span className="reply-span me-2">{item?.subcomment_count} Reply</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ms-auto reply-side-part">
                                                                                            <span className="me-2">
                                                                                                <span>{item?.reported_Users_count}</span> Reported
                                                                                            </span>
                                                                                            <bdi><Moment format="DD/MM/YYYY" date={item?.createdAt} withTitle /></bdi>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* {openreply ? (
                                                                                        <div className="mt-2">
                                                                                            <div className="reply-text-part">
                                                                                                <textarea className="form-control frnt-input-style h-auto w-100" rows="5" />
                                                                                                <div className="button-reply">
                                                                                                    <div className="d-sm-flex align-items-center">
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 w-100 mb-sm-0 mb-2">Post Reply</button>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <button className="btn-comn-all-2 ms-sm-2 w-100 mb-sm-0 mb-2" onClick={() => setOpenReply(false)}>Cancel</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )} */}
                                                                                    {/* <div className="d-sm-flex align-items-center mt-3">
                                                                                        <div className="d-flex align-items-center">
                                                                                            <span className="manage-comn-btn">Approve</span>
                                                                                            <span className="manage-comn-btn ms-2">Report</span>
                                                                                        </div>

                                                                                    </div> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }) : (
                                                            <div className="news-feed-main-box py-5">
                                                                <div className="text-center">
                                                                    <i>
                                                                        <b>--- Data not found --- </b>
                                                                    </i>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {unReviewList.length > 0 && unreviewLimit <= unReviewList.length &&
                                                            <div className="col-12">
                                                                <div className="my-2 reply-more text-center">
                                                                    <button onClick={() => unreviewLoadmore()}>Load More</button>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </div>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================Delete Comment Modal=========================================== */}

            <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deleteCommentModal} onHide={() => setDeleteCommentModal(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="common-title-in text-center">
                        <h5>Delete Comment</h5>
                        <p>Are you sure you want to Delete this Comment?</p>
                    </div>
                    <Modal.Footer>
                        <div className="">
                            <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setDeleteCommentModal(false)}>
                                <span className="position-relative">NO</span>
                            </button>
                        </div>
                        <div className="ms">
                            <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={() => deleteHandleComment()}>
                                <span className="position-relative" >YES</span>
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>

            <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={ReportCommentModal} onHide={() => setReportCommentModal(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="common-title-in text-center">
                        <h5>Report</h5>
                        <h5>Why are you reporting this comment?</h5>
                    </div>
                    <div className="d-flex row-12 mt-3">
                        <div className="report-dec" onClick={(e) => handleCheckedReport(e)}>
                            <input className="col-3 mb-2" type="radio" value="It's spam" name="report" />
                            <label className="col-9 text-left"> It's spam</label>
                            <input className="col-3 mb-2" type="radio" value="Nudity or sexual activity" name="report" />
                            <label className="col-9"> Nudity or sexual activity</label>
                            <input className="col-3 mb-2" type="radio" value="Bullying or harassment" name="report" />
                            <label className="col-9">Bullying or harassment</label>
                            <input className="col-3 mb-2" type="radio" value="I just don’t like it" name="report" />
                            <label className="col-9"> I just don’t like it</label>
                            <input className="col-3 mb-2" type="radio" value="False information" name="report" />
                            <label className="col-9"> False information</label>
                        </div>
                    </div>

                    <Modal.Footer>
                        <div className="">
                            <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => reportComment()}>
                                <span className="position-relative">Report</span>
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>

            <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deActiveModalShow} onHide={() => setDeActiveModalShow(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="common-title-in text-center">
                        {userStatus === 1 ? (
                            <>
                                <h5>Deactivate An User</h5>
                                <p>Are you sure you want to Deactivate this user? A deactivated user should not have access to the platform anymore.</p>
                            </>
                        ) : (
                            <>
                                <h5>Activate An User</h5>
                                <p>Are you sure you want to Activate this user?</p>
                            </>
                        )}
                    </div>
                    <Modal.Footer>
                        <div className="">
                            <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setDeActiveModalShow(false)}>
                                <span className="position-relative">NO</span>
                            </button>
                        </div>
                        <div className="ms">
                            <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={(e) => deActiveUser()}>
                                <span className="position-relative">YES</span>
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </Layout>
    );
}
