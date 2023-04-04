import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/layout";
import { Formik } from "formik";
import * as Yup from "yup";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Upload from "../images/cloud-upload.svg";
import { Modal } from "react-bootstrap";
import { API_Path } from "./../const";
import { GetApi, PostApi } from "./../ApiService";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import toastr from "toastr";
import moment from "moment";

let dangourhtml = "";
function createMarkup() {
  return {
    __html: dangourhtml,
  };
}

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

function EditPost() {
  const location = useLocation();
  const id = location.state.id;
  const url = location.state.url;
  const [file, setFile] = useState("");
  const [imgprev, setimgprev] = useState('');
  const [thumnImg, setThumnImg] = useState('')
  const [open, setOpenForm] = useState(false);
  const [schedulemodalShow, setScheduleModalShow] = useState(false);
  const [editData, setEditData] = useState({});
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(0);
  const [interestlist, setInterestlist] = useState([]);
  const [defaultInterestlist, setDefaultInterestlist] = useState([]);
  const [interest, setInterest] = useState([]);
  const [post_status, setPost_status] = useState(1);
  const [btn, setBtn] = useState();
  const [notification, setNotification] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [embededlink, setembededlink] = useState("");

  const [link, setLink] = useState("");

  const navigate = useNavigate();

  function handleOnEnter(text) {
  }

  const submitFormData = (formData, resetForm) => {
    formData.preventDefault()
    if (editData.title === "") {
      document.getElementById("commentaryErr").style.display = "block";
    }
    if (editData.caption === "") {
      document.getElementById("captionErr").style.display = "block";
    }
    if (editData.category === "") {
      document.getElementById("taggedErr").style.display = "block";
    }
    // if (editData.link === "") {
    //   document.getElementById("linkErr").style.display = "block";
    // }

    if (btn === 0 || btn === 1) {


      if (editData.title !== "" && editData.caption !== "" && editData.category !== "") {
        const editPostPromisenew = new Promise((resolve, reject) => {
          let data = {
            newsid: id,
            title: editData.title,
            caption: editData.caption,
            category: editData.category,
            link: link ? link : editData.link,
            age_min: ageMin ? ageMin : editData.age_min,
            age_max: ageMax ? ageMax : editData.max_age,
            interest: interest.length > 0 || defaultInterestlist.length > 0 ? [...interest, ...defaultInterestlist] : defaultInterestlist,
            notification: notification,
            post_status: post_status,
            imagesorvideo: imgprev != "" ? imgprev : editData.imagesorvideo,
            thumnImg: thumnImg != "" ? thumnImg : editData.thumnImg,
            embededLink: embededlink,
          }
          resolve(PostApi(API_Path.editPost, data));
        });
        editPostPromisenew.then((response) => {
          if (response.status === 200) {
            toastr.success(response.data.message);
            if (btn === 1) {
              navigate("/news-feed");
            }
            if (btn === 0) {
              navigate("/drafted-post");
            }
            resetForm();
          }
        })
      }
    }

  };

  useEffect(() => {
    const getDataPromise = new Promise((resolve, reject) => {
      let editId = {
        id: id,
      };
      resolve(PostApi(API_Path.byIdGetNewsDetails, editId));
    });
    getDataPromise.then((response) => {
      if (response.status === 200) {
        let data = response.data?.data?.news;
        if (data.interest.length > 0) {
          setDefaultInterestlist(data.interest)
        }

        setDate(moment(data.scheduleDate).format('YYYY-MM-DD'))
        setTime(moment(data.scheduleDate).format('HH:mm'))
        setEditData(data);
        setNotification(data.notification);
        if (data.notification === 0) {
          document.getElementById("push-no").checked = true;
        } else {
          document.getElementById("push-yes").checked = true;
        }
        setOpenForm(data.notification === 1 ? true : false);
        setembededlink(data.embededLink);
        dangourhtml = data.embededLink;
      }
    });
  }, []);


  useEffect(() => {
    if (file !== "") {
      let data = new FormData();
      data.append("image", file);
      const imguploadpromise = new Promise((resolve, reject) => {
        resolve(PostApi(API_Path.addliveimg, data));
      });
      imguploadpromise.then((response) => {
        if (response.status === 200) {
          setimgprev(response.data.data.image)
          setThumnImg(response.data.data.thumnImg)
        }
      });
    }
  }, [file]);

  useEffect(() => {
    const getinterestsListpromise = new Promise((resolve, reject) => {
      resolve(GetApi(API_Path.getinterest));
    });
    getinterestsListpromise.then((response) => {
      if (response.status === 200) {
        let intrestData = response.data.data.Interest.map((intdata, i) => {
          return (intdata.interest)
        })
        if (editData.interest?.length > 0) {
          let filterdata = intrestData.filter((item) => !editData.interest.includes(item));
          setInterestlist(filterdata);
        } else {
          setInterestlist(intrestData)
        }
      }
    });
  }, [editData]);

  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? (
      <span className="error text-danger">{form.errors[field]}</span>
    ) : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const interestpost = (e) => {
    let temp = interest;
    if (e.target.checked) {
      temp.push(e.target.id)
      setInterest(temp)
    } else {
      let defaultData = defaultInterestlist.filter((x) => x !== e.target.id)
      setDefaultInterestlist(defaultData)
    }
  }

  const showScheduleModal = () => {
    setScheduleModalShow(true);
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();
    var maxDate = year + "-" + month + "-" + day;
    var maxtime = dtToday.getHours() + ":" + dtToday.getMinutes();
    document.getElementById("txtDate").setAttribute("min", maxDate);
    document.getElementById("txtTime").setAttribute("min", maxtime);
  };

  const setvalue = (e) => {
    if (e.target.value) {
      document.getElementById("commentaryErr").style.display = "none"
    }
    setEditData((prev) => {
      return { ...prev, title: e.target.value };
    });
  };

  const savadraft = (e) => {
    setPost_status(0);
    setBtn(0);
    submitFormData()
  };

  const savePublish = (e) => {
    e.preventDefault()
    setPost_status(2);
    setBtn(2);
    showScheduleModal();
  };

  const savePublishNow = () => {
    setPost_status(1);
    setBtn(1);
    submitFormData()

  };

  const setcaptionvalue = (e) => {
    if (e.target.value) {
      document.getElementById("captionErr").style.display = "none"
    }
    setEditData((prev) => {
      return { ...prev, caption: e.target.value };
    });
  };

  const selecttag = (e) => {
    if (e.target.value) {
      document.getElementById("taggedErr").style.display = "none"
    }
    setEditData((prev) => {
      return { ...prev, category: e.target.value };
    });
  };

  const setLinkHandle = (e) => {
    // if (e.target.value) {
    //   document.getElementById("linkErr").style.display = "none"
    // }
    setEditData((prev) => {
      return { ...prev, link: e.target.value };
    });
  }

  const imgvideo = (e) => {
    setFile(e.target.files[0]);
  };


  const submitScheduleData = (formData, resetForm) => {

    var date = formData.date;
    var time = formData.time;


    var dateObj = new Date(date + " " + time + ":00").toISOString();

    if (editData.title === "") {
      document.getElementById("commentaryErr").style.display = "block";
    }
    if (editData.caption === "") {
      document.getElementById("captionErr").style.display = "block";
    }
    if (editData.category === "") {
      document.getElementById("taggedErr").style.display = "block";
    }
    // if (editData.link === "") {
    //   document.getElementById("linkErr").style.display = "block";
    // }
    if (editData.title !== "" && editData.caption !== "" && editData.category !== "") {
      const createPostEditPromise = new Promise((resolve, reject) => {
        let data = {
          newsid: id,
          title: editData.title,
          caption: editData.caption,
          category: editData.category,
          link: link ? link : editData.link,
          age_min: ageMin ? ageMin : editData.age_min,
          age_max: ageMax ? ageMax : editData.max_age,
          interest: interest.length > 0 || defaultInterestlist.length > 0 ? [...interest, ...defaultInterestlist] : defaultInterestlist,
          notification: notification,
          post_status: post_status,
          imagesorvideo: imgprev != "" ? imgprev : editData.imagesorvideo,
          thumnImg: thumnImg != "" ? thumnImg : editData.thumnImg,
          embededLink: embededlink,
          scheduleDate: dateObj
        }
        resolve(PostApi(API_Path.editPost, data));
      });
      createPostEditPromise.then((response) => {
        if (response.status === 200) {
          setScheduleModalShow(false);
          toastr.success(response.data.message);
          navigate("/queued-post");
        }
      });
    } else {
      setScheduleModalShow(false);
    }

  };

  const setOpenFormmenu = (e, value) => {
    if (value === 1) {
      setOpenForm(true);
      setNotification(1);
      setAgeMin(13);
      setAgeMax(30);
    }
    if (value === 0) {
      setOpenForm(false);
      setNotification(0);
      setInterest([])
      setAgeMin("");
      setAgeMax("");

    }
  };

  const handlerangeChange = (e) => {
    setAgeMin(e[0]);
    setAgeMax(e[1]);
  };

  const setembededvalue = (e) => {
    dangourhtml = e.target.value;
    setembededlink(e.target.value);
  };

  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }, [embededlink]);
  return (
    <Layout>
      <div className="content-main-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="comn-title-info d-sm-flex align-items-center">
                <h1>Edit Post</h1>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <div className="white-box-main p-0">
                  {/* <div className="white-bx-hdr p-3 mb-0">Edit Details</div> */}
                  <div className="d-flex white-bx-hdr pb-0">
                    <div className="p-3 mb-0">Edit Details</div>

                    {editData.isEmbeded === 1 && (
                      <div className="custom-switch-toggle-menu ms-auto me-2">
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="status"
                            defaultChecked
                            disabled
                          />
                          <span className="slider round"></span>
                          <bdi>Social Embeded</bdi>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="add-content-main p-3">
                    <form
                      className="row mb-0"
                      onSubmit={(e) => submitFormData(e)}
                    >
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="lbl-frnt-side">
                            Commentary Title
                            {/* <span>(optional)</span> */}
                          </label>
                          <input
                            className="form-control frnt-input-style"
                            type="text"
                            name="title"
                            placeholder="On Brink Of War?"
                            defaultValue={editData.title}
                            onChange={(e) => setvalue(e)}
                          />
                          <span id="commentaryErr" className="red-txt" style={{ display: 'none', color: 'red' }}>
                            commentary title is required.
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="lbl-frnt-side">
                            Commentary Caption
                            {/* <span>(optional)</span> */}
                          </label>
                          <textarea
                            className="form-control frnt-input-style h-auto"
                            rows="5"
                            name="caption"
                            placeholder="Add commentary caption here..."
                            defaultValue={editData.caption}
                            onChange={(e) => setcaptionvalue(e)}
                          />
                          <span id="captionErr" className="red-txt" style={{ display: 'none', color: 'red' }}>
                            commentary caption is required.
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="lbl-frnt-side">
                            Tagged Category
                          </label>
                          <select
                            className="form-select frnt-input-style"
                            name="category"
                            value={editData.category}
                            onChange={(e) => selecttag(e)}
                          >
                            <option>Featured</option>
                            <option>Trending</option>
                            <option>ProLife</option>
                            <option>Politics</option>
                            <option>Faith</option>
                          </select>
                          <span id="taggedErr" className="red-txt" style={{ display: 'none', color: 'red' }}>
                            Tagged category required.
                          </span>
                        </div>
                      </div>
                      {editData.isEmbeded === 0 && (
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">
                              Image/Video
                              {/* <span>(optional)</span> */}
                            </label>
                            <div className="row">
                              {editData.imagesorvideo?.length > 0 &&
                                editData.imagesorvideo.map((item, i) => {

                                  return (
                                    <div
                                      className="col-xl-3 col-lg-4 col-sm-3 col-6 mb-3"
                                      key={i}
                                    >
                                      <div className="edit_upload_img">
                                        {(imgprev?.length > 0 && imgprev?.includes("mp4")) || (item?.includes("mp4") && imgprev.length === 0) ?
                                          <video width="130" height="130" autoPlay >
                                            <source src={imgprev.length != "" ? imgprev : item} type="video/mp4" />
                                          </video> : <img
                                            src={imgprev?.length > 0 ? imgprev : item}
                                            className="img-fluid w-100" alt="" />
                                        }
                                        {/* <img
                                          src={
                                            imgprev.length > 0
                                              ? imgprev
                                              : editData.imagesorvideo
                                          }
                                          alt=""
                                        /> */}
                                        {/* <span>x</span> */}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            <label
                              className="upload-img-box"
                              htmlFor="file-upload"
                            >
                              <div className="upload-img-in">
                                <div className="m-auto text-center">
                                  <img
                                    src={Upload}
                                    alt="upload"
                                    className="img-fluid"
                                  />
                                  <p>Upload JPG, PNG, JPEG, Video</p>
                                  <span className="d-inline-block lbl-table-tag">
                                    Choose File
                                  </span>
                                  <input
                                    id="file-upload"
                                    accept=".png, .jpg, .jpeg, video/*"
                                    type="file"
                                    hidden
                                    onChange={(e) => imgvideo(e)}
                                  />
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                      {editData.isEmbeded === 1 && (
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">
                              Social Embeded
                            </label>
                            <textarea
                              className="form-control frnt-input-style h-auto"
                              rows="5"
                              name="embededLink"
                              onChange={(e) => setembededvalue(e)}
                              placeholder="Add Social Embeded link here..."
                              data-lt-tmp-id="lt-887429"
                              spellCheck="false"
                              data-gramm="false"
                              required
                            >
                              {editData.embededLink}
                            </textarea>

                          </div>
                        </div>
                      )}
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="lbl-frnt-side">
                            {/*  <span>(optional)</span> */}
                            URL Link
                            <bdi>
                              {/* <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Tooltip on</Tooltip>}
                              >
                                <span className="ps-3">
                                  <svg
                                    width={18}
                                    height={18}
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8.16602 4.83317H9.83268V6.49984H8.16602V4.83317ZM8.16602 8.1665H9.83268V13.1665H8.16602V8.1665ZM8.99935 0.666504C4.39935 0.666504 0.666016 4.39984 0.666016 8.99984C0.666016 13.5998 4.39935 17.3332 8.99935 17.3332C13.5993 17.3332 17.3327 13.5998 17.3327 8.99984C17.3327 4.39984 13.5993 0.666504 8.99935 0.666504ZM8.99935 15.6665C5.32435 15.6665 2.33268 12.6748 2.33268 8.99984C2.33268 5.32484 5.32435 2.33317 8.99935 2.33317C12.6743 2.33317 15.666 5.32484 15.666 8.99984C15.666 12.6748 12.6743 15.6665 8.99935 15.6665Z"
                                      fill="#030303"
                                    />
                                  </svg>
                                </span>
                              </OverlayTrigger> */}
                            </bdi>
                          </label>
                          <input
                            type="url"
                            className="form-control frnt-input-style"
                            name="link"
                            placeholder="add URL link here..."
                            defaultValue={editData.link}
                            onChange={(e) => setLinkHandle(e)}
                          />
                          {/* <span id="linkErr" className="red-txt" style={{ display: 'none', color: 'red' }}>
                            URL link is required.
                          </span> */}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="lbl-frnt-side">
                            Send Push Notification? (No/Yes)
                          </label>
                          <div className="comn-radio-btn">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="notification"
                                id="push-no"
                                value={notification}
                                onChange={(e) => setOpenFormmenu(e, 0)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="push-no"
                              >
                                No
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="notification"
                                id="push-yes"
                                value={notification}
                                onChange={(e) => setOpenFormmenu(e, 1)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="push-yes"
                              >
                                YES
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        {open ? (
                          <div className="row">
                            <div className="col-12 mb-3">
                              <label className="lbl-frnt-side">
                                Age Range
                              </label>
                              <div className="slider-range-text d-flex align-items-center">

                                <Range
                                  min={0}
                                  max={100}
                                  defaultValue={[editData?.age_min, editData?.age_max]}
                                  tipFormatter={(value) => `${value}`}
                                  tipProps={{
                                    placement: "bottom",
                                    visible: true,
                                  }}
                                  onChange={(e) => handlerangeChange(e)}
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <label className="lbl-frnt-side mt-3" >
                                Interests
                              </label>
                              <div
                                className="gyb-tags-main-part btn-group"
                                id="interest-list"
                              >
                                {interestlist.length > 0 &&
                                  interestlist.map((item, i) => {
                                    return (
                                      <>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id={item}
                                          key={i}
                                          onClick={(e) => interestpost(e)}
                                        />
                                        <label
                                          className="select-tag-class"
                                          htmlFor={item}
                                        >
                                          <bdi>{item}</bdi>
                                        </label>
                                      </>
                                    );
                                  })}
                                {editData?.interest?.length > 0 &&
                                  editData.interest.map((item, i) => {
                                    return (
                                      <>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id={item}
                                          key={i}
                                          defaultChecked
                                          onClick={(e) => interestpost(e)}
                                        />
                                        <label
                                          className="select-tag-class"
                                          htmlFor={item}
                                        >
                                          <bdi>{item}</bdi>
                                        </label>
                                      </>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-sm-6 mb-3">
                        {url != "queued-post" &&
                          <button
                            type="submit"
                            className="btn-comn-all-2 w-100"
                            onClick={(e) => savadraft(e)}
                          >
                            <span className="position-relative">
                              SAVE AS A DRAFT
                            </span>
                          </button>
                        }
                      </div>

                      <div className="col-sm-6 mb-3">
                        <button
                          type="submit"
                          className="btn-comn-all w-100"
                          onClick={(e) => savePublish(e)}
                        >
                          <span className="position-relative">
                            PUBLISH LATER
                          </span>
                        </button>
                      </div>

                      <div className="col-12 text-center">
                        {url != "queued-post" && <button
                          type="submit"
                          className="btn-comn-all w-100"
                          onClick={() => savePublishNow()}
                        >
                          <span className="position-relative">
                            PUBLISH NOW
                          </span>
                        </button>
                        }
                        <button
                          type="submit"
                          className="d-none"
                          id="submitBtn"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="white-box-main h-100 p-0">
                <div className="white-bx-hdr p-3 mb-0">Preview</div>
                <div className="preview-content-part p-3">
                  <div className="latest-news-header">
                    <div className="d-flex align-items-center">
                      {editData?.category && (
                        <span>{editData?.category?.charAt(0)}</span>
                      )}
                      <bdi>{editData?.category}</bdi>
                    </div>
                  </div>
                  <div className="latest-news-small-header py-2">
                    <h4>{editData?.title}</h4>
                  </div>
                  <div className="latest-newsdetail-content pb-2">
                    <bdi>{editData?.caption}</bdi>
                  </div>
                  <div className="latest-news-small-header py-2">
                    <span>
                      CatholicVote <span>● 10h</span>
                    </span>
                  </div>
                </div>
                {editData.isEmbeded === 0 &&
                  editData.imagesorvideo.length > 0 &&
                  editData.imagesorvideo.map((item, i) => {
                    return (
                      <div className="py-2 text-center" key={i}>
                        {(imgprev?.length > 0 && imgprev?.includes("mp4")) || (item.includes("mp4") && imgprev?.length === 0) ?
                          <video width="750" height="500" autoPlay  >
                            <source src={imgprev.length != "" ? imgprev : item} type="video/mp4" />
                          </video> : <img
                            src={imgprev?.length > 0 ? imgprev : item}
                            className="img-fluid w-100"
                            alt=""
                          />}

                      </div>
                    );
                  })}

                {editData.isEmbeded === 1 && (
                  <div
                    className="embeded d-flex align-items-center justify-content-center"
                    dangerouslySetInnerHTML={createMarkup()}
                  ></div>
                )}

                {/* <div className="px-3 employee-side-post">
									<div className="d-flex align-items-center mb-2">
										<label className="like-btn d-flex">
											<input type="checkbox" />
											<span className="like-empty">
												<img src={HeartEmpty} alt="" />
											</span>

											<span className="like-filled">
												<img src={HeartFilled} alt="" />
											</span>
											<bdi>15</bdi>
										</label>
										<label className="ms-auto save-btn-post">
											<input type="checkbox" />
											<span className="save-empty">
												<img src={Unsaved} alt="" />
											</span>
											<span className="save-filled">
												<img src={Saved} alt="" />
											</span>
										</label>
										<div className="">
											<button className="btn">
												<svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M21.1834 27.3328C19.7157 27.3495 18.3246 26.6902 17.4238 25.5511C16.523 24.412 16.2162 22.9241 16.5947 21.5301L8.10357 16.7595C6.63632 18.0808 4.48559 18.3605 2.71928 17.4596C0.952975 16.5587 -0.0526918 14.6691 0.201626 12.7291C0.455944 10.789 1.91608 9.21177 3.85703 8.78045C5.79798 8.34913 7.80632 9.15561 8.88486 10.7995L16.5933 6.46746C16.4936 6.09704 16.4408 5.71594 16.436 5.33279C16.4166 3.10174 17.9929 1.16365 20.2112 0.691221C22.4294 0.218794 24.6804 1.34178 25.6021 3.38068C26.5238 5.41958 25.863 7.81442 24.0196 9.11613C22.1762 10.4178 19.6565 10.2689 17.985 8.75946L9.64174 13.4461C9.63348 13.7919 9.58432 14.1355 9.49525 14.4701L17.985 19.2395C19.548 17.8295 21.8735 17.6119 23.6791 18.7066C25.4846 19.8012 26.3305 21.9418 25.7502 23.9475C25.17 25.9532 23.3048 27.3358 21.1834 27.3328ZM21.1834 20.6661C20.0597 20.6661 19.1488 21.5616 19.1488 22.6661C19.1488 23.7707 20.0597 24.6661 21.1834 24.6661C22.3071 24.6661 23.218 23.7707 23.218 22.6661C23.218 21.5616 22.3071 20.6661 21.1834 20.6661ZM4.90651 11.3328C3.78283 11.3328 2.8719 12.2282 2.8719 13.3328C2.8719 14.4374 3.78283 15.3328 4.90651 15.3328C6.0302 15.3328 6.94113 14.4374 6.94113 13.3328C6.94113 12.2282 6.0302 11.3328 4.90651 11.3328ZM21.1834 3.33279C20.0597 3.33279 19.1488 4.22822 19.1488 5.33279C19.1488 6.43736 20.0597 7.33279 21.1834 7.33279C22.3071 7.33279 23.218 6.43736 23.218 5.33279C23.218 4.22822 22.3071 3.33279 21.1834 3.33279Z" fill="#7B838A" />
												</svg>
											</button>
										</div>
									</div>
									<p className="view-com-employee">View All 10 Comments</p>
									<div className="employee-chatbox">
										<div className="custom-chatbox w-100">
											<InputEmoji value={text} onChange={setText} cleanOnEnter borderRadius={12} onEnter={handleOnEnter} placeholder="Type Something...." />
											<button className="btn gif-btn">
												<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M13.5778 2.24381C10.8047 2.24381 8.03155 2.2388 5.2584 2.24506C3.57799 2.25007 2.39798 3.50665 2.39682 5.30318C2.391 10.6276 2.38983 15.9509 2.39798 21.2753C2.40031 23.0305 3.59312 24.3059 5.22815 24.3084C10.7942 24.3146 16.3603 24.3159 21.9252 24.3096C23.5858 24.3071 24.7496 23.018 24.7542 21.2114C24.7554 20.9195 24.7402 20.6251 24.76 20.3345C24.7996 19.7456 25.1987 19.3096 25.6735 19.3109C26.1251 19.3122 26.5417 19.7231 26.5859 20.2731C26.8768 23.8749 24.7589 26.2853 21.7495 26.2903C16.3393 26.3016 10.928 26.2978 5.51791 26.2928C2.51319 26.2903 0.547665 24.1468 0.548829 20.9007C0.551156 15.8068 0.55232 10.7116 0.548829 5.61764C0.547665 2.42171 2.52366 0.264362 5.49115 0.260604C10.9211 0.253087 16.351 0.255592 21.7809 0.260604C24.5494 0.263109 26.5952 2.47057 26.5964 5.4435C26.5987 8.88874 26.5987 12.3327 26.5975 15.778C26.5975 16.7401 26.2903 17.2463 25.7003 17.2676C25.0882 17.2901 24.753 16.7527 24.753 15.7717C24.7542 12.2638 24.7577 8.75719 24.7507 5.24931C24.7472 3.53671 23.5544 2.25258 21.9543 2.24757C19.1625 2.23629 16.3708 2.24381 13.5778 2.24381Z" fill="#A6A6A6" stroke="#A6A6A6" strokeWidth="0.325523" />
													<path d="M10.9397 15.1688C10.3427 15.1688 9.78296 15.1738 9.22437 15.1676C8.81009 15.1625 8.47145 14.9909 8.46679 14.4986C8.46214 13.9962 8.7647 13.7594 9.22554 13.7606C10.0588 13.7619 10.8931 13.7519 11.7264 13.7719C12.3606 13.787 12.6271 14.0889 12.6411 14.7854C12.6562 15.5158 12.6888 16.2512 12.6259 16.9754C12.5968 17.3099 12.4351 17.7408 12.1977 17.925C10.4032 19.3206 7.50788 19.5888 5.72972 18.2871C4.16684 17.1433 3.73626 15.4332 3.83518 13.5264C3.91431 11.9917 4.36584 10.5822 5.63313 9.71905C7.29958 8.584 9.08589 8.45621 10.8943 9.33569C11.6077 9.68272 12.1151 10.2753 12.335 11.1172C12.4595 11.592 12.3106 11.9491 11.93 12.1708C11.5495 12.3926 11.1794 12.3287 10.8792 11.9729C10.7884 11.8664 10.7128 11.7424 10.6441 11.6171C10.0762 10.5873 9.23136 10.1701 8.14328 10.3242C6.96443 10.4908 6.22197 11.2124 5.87751 12.4327C5.61102 13.376 5.59822 14.3269 5.817 15.2728C6.25223 17.1595 7.81045 18.0891 9.66775 17.4539C11.2388 16.9165 11.0549 17.1884 10.9397 15.1688Z" fill="#A6A6A6" stroke="#A6A6A6" strokeWidth="0.325523" />
													<path d="M18.2684 10.4901C18.2684 11.4122 18.2684 12.219 18.2684 13.1273C19.0959 13.1273 19.9023 13.1273 20.7076 13.1273C20.9788 13.1273 21.2499 13.1261 21.5211 13.1348C21.9563 13.1474 22.2181 13.3629 22.2065 13.8615C22.196 14.3263 21.9388 14.5355 21.535 14.5417C20.7798 14.5543 20.0245 14.5493 19.2692 14.5505C18.962 14.5518 18.6548 14.5505 18.3045 14.5505C18.2812 14.7522 18.2487 14.9088 18.2487 15.0654C18.2428 16.0451 18.2533 17.0248 18.2382 18.0045C18.2277 18.6961 17.9042 19.097 17.3782 19.122C16.8487 19.1483 16.5089 18.7913 16.4298 18.0935C16.3972 17.8053 16.4076 17.5109 16.4076 17.219C16.4065 14.9878 16.4007 12.7577 16.41 10.5265C16.4158 9.20727 16.6218 8.98803 17.8192 8.98301C19.1948 8.97675 20.5691 8.98552 21.9446 8.98051C22.416 8.978 22.8081 9.09451 22.8686 9.68334C22.9164 10.1544 22.5684 10.4714 21.9598 10.4826C20.9532 10.5014 19.9454 10.4876 18.9387 10.4889C18.7316 10.4901 18.5233 10.4901 18.2684 10.4901Z" fill="#A6A6A6" stroke="#A6A6A6" strokeWidth="0.325523" />
													<path d="M15.4396 13.9909C15.4396 15.2825 15.4675 16.5742 15.4221 17.8633C15.4093 18.2216 15.265 18.6589 15.0381 18.9069C14.618 19.3654 13.8732 19.0948 13.6928 18.4697C13.6195 18.2166 13.5904 17.9385 13.5893 17.6716C13.5811 15.2149 13.5811 12.7569 13.5881 10.3001C13.5893 10.0332 13.566 9.705 13.694 9.51206C13.886 9.22141 14.1711 8.90069 14.4702 8.82176C14.86 8.71778 15.2231 8.97461 15.3453 9.44566C15.4012 9.6624 15.4337 9.89292 15.4349 10.1172C15.4442 11.4088 15.4396 12.7005 15.4396 13.9909Z" fill="#A6A6A6" stroke="#A6A6A6" strokeWidth="0.325523" />
												</svg>
											</button>
										</div>

										<button className="send-btn">
											<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M18.5373 7.25356L2.8973 0.769335C2.23841 0.496136 1.49404 0.616318 0.954713 1.08282C0.415388 1.5494 0.189815 2.2683 0.366094 2.95894L1.75819 8.41354H8.57408C8.88772 8.41354 9.14203 8.6676 9.14203 8.98101C9.14203 9.29439 8.88776 9.54848 8.57408 9.54848H1.75819L0.366094 15.003C0.189815 15.6937 0.41535 16.4126 0.954713 16.8792C1.49513 17.3466 2.23959 17.4653 2.89734 17.1927L18.5373 10.7085C19.2494 10.4132 19.6917 9.75132 19.6917 8.98101C19.6917 8.21071 19.2494 7.54874 18.5373 7.25356Z" fill="white" />
											</svg>
										</button>
									</div>
								</div> */}
              </div>
            </div>
          </div>
          <Modal
            show={schedulemodalShow}
            onHide={() => setScheduleModalShow(false)}
            size="md"
            scrollable={true}
            contentClassName="deactive-alert-box likes-box"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            centered
          >
            <Modal.Header closeButton className="border-bottom">
              <Modal.Title>
                <h1>Schedule Post</h1>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                // innerRef={this.runforms}
                enableReinitialize
                initialValues={{
                  date: date,
                  time: time,
                }}
                validationSchema={Yup.object({
                  date: Yup.string().required("Enter The Schedule Date..."),
                  time: Yup.string().required("Enter The Schedule Time..."),
                })}
                onSubmit={(formData, { resetForm }) => {
                  submitScheduleData(formData, resetForm);
                }}
              >
                {(runform) => (
                  <form className="row mb-0" onSubmit={runform.handleSubmit}>
                    <div className="col-12 mb-3">
                      <label className="lbl-frnt-side">Select Date</label>
                      <input
                        type="date"
                        className="form-control frnt-input-style"
                        name="date"
                        id="txtDate"
                        {...formAttr(runform, "date")}
                      />
                      {errorContainer(runform, "date")}
                    </div>
                    <div className="col-12 mb-3">
                      <label className="lbl-frnt-side">Select Time</label>
                      <input
                        type="time"
                        className="form-control frnt-input-style"
                        name="time"
                        id="txtTime"
                        {...formAttr(runform, "time")}
                      />
                      {errorContainer(runform, "time")}
                    </div>
                    <div className="col-12">
                      <button
                        className="btn-comn-all w-100"
                        type="submit"
                        onClick={() => {
                          submitFormData();
                        }}
                      >
                        <span className="position-relative">save</span>
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}

export default EditPost;
