import React from "react";
import Tick from "../images/bluetick.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import { GetApi, PostApi } from "../ApiService";
import { API_Path } from "../const";
import toastr from "toastr";
import { Modal } from "react-bootstrap";
import defaultLoopImg from "../images/defaultLoopImg.png";
import defaultImg from "../images/defaultImg.PNG";

function SharedAsPostPrayer(props) {
  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };


  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  const submitFormData = (formData, resetForm) => {

    const shareToNewsFeedRequest = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.shareToNewsFeed, formData));
    });

    shareToNewsFeedRequest.then((response) => {
      if (response.status == 200) {
        toastr.success(response.data.message);
        props.closeModal && props.closeModal();
        props.getParentList && props.getParentList();
        props.getDraftList && props.getDraftList();
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  return (
    <>
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title>
          <h1>Share as a post</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          initialValues={{
            title: "",
            category: "",
            caption: props.prayerDetails.description,
            id: props.prayerDetails?._id,
          }}
          validationSchema={Yup.object({
            caption: Yup.string().required("Write Commentary before submit..."),
            category: Yup.string().required("select any category."),
            title: Yup.string().required("Title is required."),
          })}
          onSubmit={(formData, { resetForm }) => {
            submitFormData(formData, resetForm);
          }}
        >
          {(runform) => (
            <form className="row mb-0" onSubmit={runform.handleSubmit}>
              <input type="hidden" name="id" />
              <div className="col-12 mb-3">
                <div className="modal-in-img">
                  {props.prayerDetails?.prayer_image == "" ||
                  props.prayerDetails.hasOwnProperty("prayer_image") ==
                    false ? (
                    <img
                      src={defaultLoopImg}
                      className="img-fluid w-100 news-img"
                      alt=""
                    />
                  ) : props.prayerDetails.prayer_image?.[0]?.includes(".mp4") ||
                    props.prayerDetails.prayer_image?.[0]?.includes(".mp3") ? (
                    <video width="420" height="235" controls>
                      <source
                        src={props.prayerDetails?.prayer_image}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      src={props.prayerDetails?.prayer_image}
                      className="img-fluid w-100 news-img"
                      alt=""
                    />
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <div className="prayer-profile me-3">
                    {props.prayerDetails?.user?.profile_img == "" ? (
                      <img src={defaultImg} alt="" />
                    ) : (
                      <img
                        src={props.prayerDetails?.user?.profile_img}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="latest-news-small-header py-2">
                    <h4 className="d-flex align-items-center">
                      {props.prayerDetails?.user?.fname +
                        " " +
                        props.prayerDetails?.user?.lname}
                    </h4>
                    <span>
                      {props.prayerDetails?.user?.fname +
                        " " +
                        props.prayerDetails?.user?.lname}
                      <span>&#9679; {props.prayerDetails?.timeElapsed}</span>
                    </span>
                  </div>
                </div>
                <div className="latest-news-content pb-2">
                  <bdi>{props.prayerDetails?.description}</bdi>
                </div>
              </div>
              <div className="col-12 mb-3">
                <label className="lbl-frnt-side">Title</label>
                <input
                  type="type"
                  className="form-control frnt-input-style"
                  name="title"
                  {...formAttr(runform, "title")}
                  placeholder="Enter title"
                />
                {errorContainer(runform, "title")}
              </div>
              <div className="col-12 mb-3">
                <label className="lbl-frnt-side">Category</label>
                <select
                  className="form-select frnt-input-style"
                  name="category"
                  {...formAttr(runform, "category")}
                >
                  <option value="" selected>
                    Select category
                  </option>
                  <option value="Featured">Featured</option>
                  <option value="Trending">Trending</option>
                  <option value="ProLife">ProLife</option>
                  <option value="Politics">Politics</option>
                  <option value="Faith">Faith</option>
                </select>
                {errorContainer(runform, "category")}
              </div>
              <div className="col-12 mb-3">
                <label className="lbl-frnt-side">Add Commentary</label>
                <textarea
                  className="form-control frnt-input-style h-auto"
                  rows="4"
                  name="caption"
                  {...formAttr(runform, "caption")}
                />
                {errorContainer(runform, "caption")}
              </div>
              <div className="col-12 pt-3 pb-2 text-center">
                <button className="btn-comn-all px-4" type="submit">
                  <span className="position-relative">SHARE NOW</span>
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </>
  );
}

export default SharedAsPostPrayer;
