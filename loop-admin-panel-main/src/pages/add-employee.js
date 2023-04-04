import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useState } from "react";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import { withRouter } from "../Navigate";
import { Modal } from "react-bootstrap";
import defaultImg from "../images/defaultImg.PNG";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/plain.css";
import { useRef } from "react";

function AddEmployee(props) {
  const [profileimg, setProfileimg] = useState("");
  const [img, setimgobj] = useState("");
  const [Phoneno, SetPhoneNo] = useState("");
  const phoneRef = useRef();

  const [permission, setPermission] = useState({
    allowToSendPushNotification: 0,
    allowToPostToNewsFeed: 0,
    viewUsers: 0,
    editUsers: 0,
    viewSubmissions: 0,
    respondToSubmissions: 0,
    viewActivityLog: 0,
    viewSystemStatus: 0,
  });


  const HandleChange = (e) => {
    if (e.target.checked) {
      setPermission((prev) => {
        return { ...prev, [e.target.name]: 1 };
      });
    } else {
      setPermission((prev) => {
        return { ...prev, [e.target.name]: 0 };
      });
    }

    // if (e.target.checked) {
    //   setPermission((prev) => {
    //     return { ...prev, allowToPostToNewsFeed: 1, allowToSendPushNotification:1};
    //   });
    // }else {
    //     setPermission((prev) => {
    //     return { ...prev, allowToPostToNewsFeed: 0, allowToSendPushNotification:0};
    //   });
    // }
  };


  const addEmployee = (formData, resetForm) => {
    let data = {
      profile_img: profileimg,
      email: formData.email,
      contact_no: formData.number,
      fname: formData.fname,
      lname: formData.lname,
      DOB: formData.DOB,
      address: formData.address,
      device_type: 0,
      permission: permission,
    };

    const addemployeepromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.addEmployeeData, data));
    });
    addemployeepromise.then((response) => {
      if (response.data.success) {
        toastr.success(response.data.message);
        props.onHide();
        props.update();
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

  const uploadeImg = (e) => {
    setimgobj(e.target.files[0]);

    if (e.target.files.length > 0) {
      let data = new FormData();
      data.append("image", e.target.files[0]);
      const imguploadpromise = new Promise((resolve, reject) => {
        resolve(PostApi(API_Path.addliveimg, data));
      });
      imguploadpromise.then((response) => {
        if (response.status === 200) {
          setProfileimg(response.data.data.image);
        }
      });
    }
  };

  // const handleContactNo = (e) => {
  //   phoneRef.current.setFieldValue("Phoneno", e);
  // };
  const handleContactNo = (e) => {
    SetPhoneNo(e);
  };

  var yearsago = moment(new Date()).subtract(18, "years").format("YYYY-MM-DD");

  return (
    <>
      <Modal show={props.show} onHide={props.onHide} size="lg" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" backdrop="static" centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>
            <h1>Add Employee</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="">
              <div className="row">
                <div className="col-12">
                  <div className="comn-title-info">
                    <h5>Add Details</h5>
                  </div>
                </div>
                <div className="col-12">
                  <div className="white-box-main">

                    <Formik
                      enableReinitialize
                      initialValues={{
                        fname: "",
                        lname: "",
                        address: "",
                        number: "",
                        email: "",
                        DOB: "",
                      }}
                      validationSchema={Yup.object({
                        fname: Yup.string().required("First Name is required."),
                        lname: Yup.string().required("Last Name is required."),
                        address: Yup.string().required("Address is required."),
                        number: Yup.string()
                          .required("Phone number is Required")
                          .max(15)
                          .matches(
                            /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                            "Phone number is not valid"),
                        // Phoneno: Yup.string()
                        //   .required("Phone number is required.")
                        //   .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid"),
                        DOB: Yup.date()
                          .max(new Date(Date.now() - 567648000000), "You must be at least 18 years")
                          .required("Date of Birth is required."),
                        email: Yup.string().email("Enter Valid Email Address.").required("Email Address is required."),
                      })}
                      onSubmit={(formData, { resetForm }) => {
                        addEmployee(formData, resetForm);
                      }}
                    >
                      {(runform) => (
                        <form className="row mb-0" onSubmit={runform.handleSubmit}>
                          <div className="col-12">
                            <div className="mb-3">
                              <div className="edit-member-image position-relative">
                                {/* {profileimg ? (
                                  <div className="dtels-info-imgs" id="member-photo">
                                    <img src={profileimg} className="member-image img-fluid w-auto" alt="smith" />
                                  </div>
                                ) : (
                                  <div className="dtels-info-imgs" id="member-photo">
                                    <img src={defaultImg} className="member-image img-fluid w-auto" alt="smith" />
                                  </div>
                                )} */}
                                {profileimg === "" ? (
                                  <div className="dtels-info-imgs" id="member-photo">
                                    <img src={defaultImg} className="member-image img-fluid w-auto" alt="smith" />
                                  </div>
                                ) : (
                                  <div className="dtels-info-imgs" id="member-photo">
                                    <img src={profileimg} className="member-image img-fluid w-auto" alt="smith" />
                                  </div>
                                )}
                                <div className="position-absolute bottom-0 end-0">
                                  <label htmlFor="profile-upload" className="upload-image-div">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                                      <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                      <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                    </svg>
                                  </label>
                                  <input id="profile-upload" accept=".png, .jpg, .jpeg" name="upload_cont_img" onChange={(e) => uploadeImg(e)} type="file" hidden />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">Employee First Name</label>
                              <input type="text" name="fname" {...formAttr(runform, "fname")} className="form-control frnt-input-style" placeholder="Enter Your First Name." />
                              {errorContainer(runform, "fname")}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">Employee Last Name</label>
                              <input type="text" name="lname" {...formAttr(runform, "lname")} className="form-control frnt-input-style" placeholder="Enter Your Last Name." />
                              {errorContainer(runform, "lname")}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">Email Address</label>
                              <input type="email" name="email" {...formAttr(runform, "email")} className="form-control frnt-input-style" placeholder="Enter Your Email." />
                              {errorContainer(runform, "email")}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">Mobile Number</label>
                              <input type="tel" name="number" {...formAttr(runform, "number")} className="form-control frnt-input-style" placeholder="Enter Your Mobile Number." />
                              {errorContainer(runform, "number")}
                              {/* <PhoneInput
                                className="form-control-PhoneInput"
                                disableAreaCodes country={"us"}
                                value={Phoneno}
                                placeholder="Enter Your Mobile Number."
                                onChange={(e) => handleContactNo(e)}
                              /> */}
                              {/* <PhoneInput className="form-control-PhoneInput" {...formAttr(formik, "Phoneno")} name="Phoneno" onChange={handleChange} disableAreaCodes country={"us"} placeholder="Enter your phone number" />
                              {errorContainer(runform, "Phoneno")} */}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">Date of Birth</label>
                              <input type="date" max={yearsago} className="form-control frnt-input-style" id="_DOB" data-date-format="YYYY-MM-DD" name="DOB" {...formAttr(runform, "DOB")} />
                              {errorContainer(runform, "DOB")}
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">Address</label>
                              <input type="text" name="address" {...formAttr(runform, "address")} className="form-control frnt-input-style" placeholder="Enter Your Address." />
                              {errorContainer(runform, "address")}
                            </div>
                          </div>
                          <div className="col-12 mb-3">
                            <div className="common-title-in mt-4">
                              <h5>Permissions</h5>
                              <div className="row">
                                <div className="col-lg-3 col-sm-6 mb-2">
                                  <span className="d-block">Newsfeed</span>

                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="allow-post" name="allowToPostToNewsFeed" onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      Allow To Post To Newsfeed
                                    </label>
                                  </div>

                                  {permission.allowToPostToNewsFeed === 1 ? (
                                    <div className="custom-checkbox mt-3">
                                      <label className="custom-lbl-part">
                                        <input type="checkbox" id="allow-send-notification" name="allowToSendPushNotification" onChange={(e) => HandleChange(e)} />
                                        <span className="custom-checkbox-class"></span>
                                        Allow To Send Push Notifications
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="custom-checkbox mt-3">
                                      <label style={{ color: "#c8cacf" }} className="custom-lbl-part ">
                                        <input disabled type="checkbox" id="allow-send-notification" name="allowToSendPushNotification" onChange={(e) => HandleChange(e)} />
                                        <span className=""></span>
                                        Allow To Send Push Notifications
                                      </label>
                                    </div>
                                  )}
                                </div>
                                <div className="col-lg-3 col-sm-6 mb-2">
                                  <span className="d-block">User</span>
                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="view-users" name="viewUsers" onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      View Users
                                    </label>
                                  </div>
                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="edit-users" name="editUsers" onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      Edit Users
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 mb-2">
                                  <span className="d-block">Submissions</span>
                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="view-submission" name="viewSubmissions" onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      View Submissions
                                    </label>
                                  </div>
                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="respond-submission" name="respondToSubmissions" onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      Respond To Submissions
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 mb-2">
                                  <span className="d-block">Settings</span>
                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="view-activity-log" name="viewActivityLog" onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      View Activity Log
                                    </label>
                                  </div>
                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="view-sys-status" name="viewSystemStatus" onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      View System Status
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <bdi className="d-block">
                                <div className="custom-switch-toggle-menu">
                                  <label className="switch">
                                    <input type="checkbox" name="status" defaultChecked disabled />
                                    <span className="slider round"></span>
                                    <bdi className="active-info-switch">Enable Employee Access</bdi>
                                    <bdi className="inactive-info-switch">Disable Employee Access</bdi>
                                  </label>
                                </div>
                              </bdi>
                            </div>
                          </div>
                          <div className="col-md-5">
                            <div className="row">
                              <div className="col-sm-6 mb-2">
                                <button type="button" className="btn-comn-all-2 w-100" onClick={props.onHide}>
                                  <span className="position-relative">cancel</span>
                                </button>
                              </div>
                              <div className="col-sm-6 mb-2">
                                <button type="submit" className="btn-comn-all w-100">
                                  <span className="position-relative">Add</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default withRouter(AddEmployee);
