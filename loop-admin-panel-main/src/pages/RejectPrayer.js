import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Tick from "../images/bluetick.svg";
import { useEffect } from "react";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import toastr from "toastr";
import defaultImg from "../images/defaultImg.PNG";

function RejectPrayer(props) {
  const [message, setMessage] = useState("");
  const [prayerDetails, setPrayerDetails] = useState();

  useEffect(() => {
    setPrayerDetails(props?.prayerDetails);
  }, []);

  const submitFormData = (formData, resetForm) => {
    let reqObj = {
      prayer_id: prayerDetails._id,
      reason: formData.message,
    };

    const rejectPrayerRequest = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.rejectPrayerRequest, reqObj));
    });

    rejectPrayerRequest.then((response) => {
      if (response.status === 200) {
        toastr.success(response.data.message);
        props.closeModal && props.closeModal();
        props.getParentList && props.getParentList();
      } else {
        toastr.error(response.data.message);
      }
    });
  };

  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  return (
    <>
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title>
          <h1>REJECT</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          // innerRef={this.runforms}
          enableReinitialize
          initialValues={{
            message: message,
          }}
          validationSchema={Yup.object({
            message: Yup.string().required("Write message before submit..."),
          })}
          onSubmit={(formData, { resetForm }) => {
            submitFormData(formData, resetForm);
          }}
        >
          {(runform) => (
            <form className="row mb-0" onSubmit={runform.handleSubmit}>
              {prayerDetails && (
                <div className="col-12 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="prayer-profile me-3">{prayerDetails.user?.profile_img == "" ? <img src={defaultImg} alt="" /> : <img src={prayerDetails.user?.profile_img} alt="" />}</div>
                    <div className="latest-news-small-header py-2">
                      <h4 className="d-flex align-items-center">{prayerDetails.user?.fname + " " + prayerDetails.user?.lname}</h4>
                      <span>
                        {prayerDetails.user?.fname + " " + prayerDetails.user?.lname} <span>&#9679; {prayerDetails.timeElapsed}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-12 mb-3">
                <label className="lbl-frnt-side">Write Reason</label>
                <textarea className="form-control frnt-input-style h-auto" rows="4" name="message" {...formAttr(runform, "message")} defaultValue="" />
                {errorContainer(runform, "message")}
              </div>
              <div className="col-sm-4">
                <button className="btn-comn-all w-100" type="submit">
                  <span className="position-relative">SUBMIT</span>
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </>
  );
}

export default RejectPrayer;
