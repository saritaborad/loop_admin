import React, { useEffect, useRef } from "react";
import Layout from "../components/Layout/layout";
import { Formik } from "formik";
import * as Yup from "yup";
import "toastr/build/toastr.min.css";
import { useState } from "react";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import { useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import moment from "moment";
import defaultImg from "../images/defaultImg.PNG";

export default function EditEmployee(props) {
  const location = useLocation();
  const [loader, setLoader] = useState(true);
  const [fname, setFirstname] = useState("");
  const [lname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [address, setAddress] = useState("");
  const [access, setAccess] = useState("");
  const [DOB, setDOB] = useState("");
  const [img, setimgobj] = useState("");

  const [profilePic, setProfilePic] = useState("");

  const [permission, setPermission] = useState({});

  const date = useRef();

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
  };

  const submitFormData = (formData, resetForm) => {
    if (profilePic !== "") {
      liveimgupload(formData);
    }

    const editEmployeepromise = new Promise((resolve, reject) => {
      let editEmployeeId = {
        id: props.data_function,
        profile_img: profilePic,
        email: formData.email,
        contact_no: formData.contact_no,
        fname: formData.fname,
        lname: formData.lname,
        DOB: formData.DOB,
        address: formData.address,
        device_type: 0,
        permission: permission,
      };
      resolve(PostApi(API_Path.editEmployee, editEmployeeId));
    });
    editEmployeepromise.then((response) => {
      if (response.status === 200) {
        props.onHide();
        props.update();
      }
    });
  };

  const liveimgupload = (formData) => {
    setLoader(true);
    let data = new FormData();
    data.append("image", img);
    const imguploadpromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.addliveimg, data));
    });
    imguploadpromise.then((response) => {
      if (response.status === 200) {
        setProfilePic(response.data.data.image);
        setLoader(false);
      }
    });
  };

  const profileimgupdate = (e) => {
    setimgobj(e.target.files[0]);
    if (e.target.files.length > 0) {
      let data = new FormData();
      data.append("image", e.target.files[0]);
      const imguploadpromise = new Promise((resolve, reject) => {
        resolve(PostApi(API_Path.addliveimg, data));
      });
      imguploadpromise.then((response) => {
        if (response.status === 200) {
          setProfilePic(response.data.data.image);
        }
      });
    }
  };

  const errorContainer = (form, field) => {
    return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
  };

  const formAttr = (form, field) => ({
    onBlur: form.handleBlur,
    onChange: form.handleChange,
    value: form.values[field],
  });

  useEffect(() => {
    editEmployee();
  }, []);

  const editEmployee = () => {
    const editEmployeepromise = new Promise((resolve, reject) => {
      let editEmployeeId = {
        id: props.data_function,
      };
      resolve(PostApi(API_Path.getByIdEmployeeDetails, editEmployeeId));
    });
    editEmployeepromise.then((response) => {
      if (response.status === 200) {
        setProfilePic(response.data.data.employee.profile_img);
        setFirstname(response.data.data.employee.fname);
        setLastname(response.data.data.employee.lname);
        setEmail(response.data.data.employee.email);
        setContact_no(response.data.data.employee.contact_no);
        setDOB(moment(response.data.data.employee.DOB).format("yyyy-MM-DD"));
        setAddress(response.data.data.employee.address);
        setPermission(response.data.data.permission);
        setAccess(response.data.data.permission.accessEnabled);

        if (response.data.data.permission.accessEnabled === 0) {
          document.getElementById("_access").checked = false;
        } else {
          document.getElementById("_access").checked = true;
        }
      }
    });
  };

  const handleDate = (e) => {
    date.current.setFieldValue("DOB", e.target.value);
  };

  var yearsago = moment(new Date()).subtract(18, "years").format("YYYY-MM-DD");

  return (
    <>
      <Layout>
        <Modal show={props.show} onHide={props.onHide} size="lg" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" backdrop="static" centered>
          <Modal.Header closeButton className="border-bottom">
            <Modal.Title>
              <h1>Edit Employee</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="white-box-main">
                  <Formik
                    innerRef={date}
                    enableReinitialize
                    initialValues={{
                      fname: fname,
                      lname: lname,
                      address: address,
                      DOB: DOB,
                      contact_no: contact_no,
                      email: email,
                    }}
                    validationSchema={Yup.object({
                      fname: Yup.string().required("First Name is required."),
                      lname: Yup.string().required("Last Name is required."),
                      address: Yup.string().required("Address is required."),
                      contact_no: Yup.string()
                        .max(15)
                        .required("Mobile Number is required.")
                        .matches(
                          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                          "Phone number is not valid"),
                      DOB: Yup.date()
                        .max(new Date(Date.now() - 567648000000), "You must be at least 18 years")
                        .required("Date of Birth is required."),
                      email: Yup.string().email("Enter Valid Email Address.").required("Email Address is required."),
                    })}
                    onSubmit={(formData, { resetForm }) => {
                      submitFormData(formData, resetForm);
                    }}
                  >
                    {(runform) => (
                      <form className="row mb-0" onSubmit={runform.handleSubmit}>
                        <div className="col-12">
                          <div className="mb-3">
                            <div className="edit-member-image position-relative">
                              {profilePic === "" ? (
                                <div className="dtels-info-imgs" id="member-photo">
                                  <img src={defaultImg} className="member-image img-fluid w-auto" alt="smith" />
                                </div>
                              ) : (
                                <div className="dtels-info-imgs" id="member-photo">
                                  <img src={profilePic} className="member-image img-fluid w-auto" alt="smith" />
                                </div>
                              )}
                              <div className="position-absolute bottom-0 end-0">
                                <label htmlFor="profile-upload" className="upload-image-div">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                  </svg>
                                </label>
                                <input id="profile-upload" accept=".png, .jpg, .jpeg" name="upload_cont_img" onChange={(e) => profileimgupdate(e)} type="file" hidden />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Employee First Name</label>
                            <input type="text" name="fname" id="fname" className="form-control frnt-input-style" placeholder="Enter Your First Name." {...formAttr(runform, "fname")} />
                            {errorContainer(runform, "fname")}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Employee Last Name</label>
                            <input type="text" name="lname" id="lname" className="form-control frnt-input-style" placeholder="Enter Your Last Name." {...formAttr(runform, "lname")} />
                            {errorContainer(runform, "lname")}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Email Address</label>
                            <input type="email" name="email" id="email" className="form-control frnt-input-style" placeholder="Enter Your Email." {...formAttr(runform, "email")} disabled readOnly />
                            {errorContainer(runform, "email")}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Mobile Number</label>
                            <input type="tel" name="contact_no" id="contact_no" className="form-control frnt-input-style" placeholder="Enter Your Mobile Number." {...formAttr(runform, "contact_no")} />
                            {errorContainer(runform, "contact_no")}
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Date of Birth</label>
                            <input type="date" max={yearsago} className="form-control frnt-input-style" id="DOB" name="DOB" {...formAttr(runform, "DOB")} />
                            {errorContainer(runform, "DOB")}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Address</label>
                            <input type="text" name="address" id="address" className="form-control frnt-input-style" placeholder="Enter Your Address." {...formAttr(runform, "address")} />
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
                                    <input type="checkbox" id="allow-post" name="allowToPostToNewsFeed" checked={permission.allowToPostToNewsFeed === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                    <span className="custom-checkbox-class"></span>
                                    Allow To Post To Newsfeed
                                  </label>
                                </div>

                                {permission.allowToPostToNewsFeed == 1 ? (
                                  <div className="custom-checkbox mt-3">
                                    <label className="custom-lbl-part">
                                      <input type="checkbox" id="allow-send-notification" name="allowToSendPushNotification" checked={permission.allowToSendPushNotification === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                      <span className="custom-checkbox-class"></span>
                                      Allow To Send Push Notifications
                                    </label>
                                  </div>
                                ) : (
                                  <div className="custom-checkbox mt-3">
                                    <label style={{ color: "#c8cacf" }} className="custom-lbl-part">
                                      <input type="checkbox" id="allow-send-notification" name="allowToSendPushNotification" checked={permission.allowToSendPushNotification === 1 ? true : false} onChange={(e) => HandleChange(e)} />
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
                                    <input type="checkbox" id="view-users" name="viewUsers" checked={permission.viewUsers === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                    <span className="custom-checkbox-class"></span>
                                    View Users
                                  </label>
                                </div>
                                <div className="custom-checkbox mt-3">
                                  <label className="custom-lbl-part">
                                    <input type="checkbox" id="edit-users" name="editUsers" checked={permission.editUsers === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                    <span className="custom-checkbox-class"></span>
                                    Edit Users
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-3 col-sm-6 mb-2">
                                <span className="d-block">Submissions</span>
                                <div className="custom-checkbox mt-3">
                                  <label className="custom-lbl-part">
                                    <input type="checkbox" id="view-submission" name="viewSubmissions" checked={permission.viewSubmissions === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                    <span className="custom-checkbox-class"></span>
                                    View Submissions
                                  </label>
                                </div>
                                <div className="custom-checkbox mt-3">
                                  <label className="custom-lbl-part">
                                    <input type="checkbox" id="respond-submission" name="respondToSubmissions" checked={permission.respondToSubmissions === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                    <span className="custom-checkbox-class"></span>
                                    Respond To Submissions
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-3 col-sm-6 mb-2">
                                <span className="d-block">Settings</span>

                                <div className="custom-checkbox mt-3">
                                  <label className="custom-lbl-part">
                                    <input type="checkbox" id="view-activity-log" name="viewActivityLog" checked={permission.viewActivityLog === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                    <span className="custom-checkbox-class"></span>
                                    View Activity Log
                                  </label>
                                </div>
                                <div className="custom-checkbox mt-3">
                                  <label className="custom-lbl-part">
                                    <input type="checkbox" id="view-sys-status" name="viewSystemStatus" checked={permission.viewSystemStatus === 1 ? true : false} onChange={(e) => HandleChange(e)} />
                                    <span className="custom-checkbox-class"></span>
                                    View System Status
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div className="row">
                            <div className="col-sm-6 mb-2">
                              <button type="button" className="btn-comn-all-2 w-100">
                                <span className="position-relative" onClick={props.onHide}>
                                  cancel
                                </span>
                              </button>
                            </div>
                            <div className="col-sm-6 mb-2">
                              <button type="submit" className="btn-comn-all w-100">
                                <span className="position-relative">Update</span>
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
          </Modal.Body>
        </Modal>
      </Layout>
    </>
  );
}
