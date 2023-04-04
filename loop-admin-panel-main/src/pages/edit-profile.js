import React, { useEffect, useState, useMemo, useRef } from "react";
import Layout from "../components/Layout/layout";
import { Formik } from "formik";
import * as Yup from "yup";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { PostApi } from "../ApiService";
import loaderimg from "../images/loader.gif";
import { API_Path } from "../const";
import country_List from "react-select-country-list";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import defaultImg from "../images/defaultImg.PNG";

export default function EditProfile() {
  const [loader, setLoader] = useState(true);
  const [fname, setFirstName] = useState("");
  const [lname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

  const [profileimg, setProfileimg] = useState("");
  const [img, setimgobj] = useState("");
  const [profileimglive, setprofileimglive] = useState("");

  const [profilePic, setprofilepic] = useState("");
  const options = useMemo(() => country_List().getData(), []);

  const countryRef = useRef();

  const UpdateProfile = (formData) => {
    if (profileimg !== "") {
      liveimgupload(formData);
    }
    const updateProfilepromise = new Promise((resolve, reject) => {
      let updateProfileId = {
        profile_img: profilePic,
        email: formData.email,
        fname: formData.fname,
        lname: formData.lname,
        address: formData.address,
        country: formData.country,
      };
      resolve(PostApi(API_Path.updateProfile, updateProfileId));
    });
    updateProfilepromise.then((response) => {
      if (response.status === 200) {
        navigate("/profile")
        toastr.success(response.data.message);
      } else {
        toastr.error(response.data.message);
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
        setprofilepic(response.data.data.image);
        setLoader(false);
      }
    });
  };


  //imgprev
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
            setprofilepic(response.data.data.image);
        }
      });   
    }
  };

  
  const navigate = useNavigate();



  const changeHandler = (value, event) => {
    setCountry(value.label);
    countryRef.current.setFieldValue("country", event);
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
    const profilepromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getprofile));
    });
    profilepromise.then((response) => {
      if (response.status === 200) {
        setprofilepic(response.data.data.user.profile_img);
        setFirstName(response.data.data.user.fname);
        setLastName(response.data.data.user.lname);
        setEmail(response.data.data.user.email);
        setAddress(response.data.data.user.address);
        setCountry(response.data.data.user.country);
        setLoader(false);
      }
    });
  }, []);

 

  return (
    <>
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
                <div className="comn-title-info">
                  <h1>My Profile</h1>
                </div>
              </div>
              <div className="col-12">
                <div className="white-box-main">
                  <div className="white-bx-hdr">Edit Profile</div>
                  <Formik
                    innerRef={countryRef}
                    enableReinitialize
                    initialValues={{
                      fname: fname,
                      email: email,
                      lname: lname,
                      address: address,
                      country: country,
                    }}
                    validationSchema={Yup.object({
                      fname: Yup.string().required("First Name is required."),
                      lname: Yup.string().required("Last Name is required."),
                      email: Yup.string().email("Enter Valid Email Address.").required("Email Address is required."),
                      address: Yup.string().required("Address is required."),
                      country: Yup.string().required("Country Name is required."),
                    })}
                    onSubmit={(formData) => {
                      UpdateProfile(formData);
                    }}
                  >
                    {(runform) => (
                      <form className="row mb-0" onSubmit={runform.handleSubmit}>
                        <div className="col-12">
                          <div className="mb-3">
                            <div className="edit-member-image position-relative">
                              {profilePic === "" ? (
                                <div className="dtels-info-imgs" id="member-photo">
                                  <img src={defaultImg} className="member-image img-fluid w-auto" alt="Profile" />
                                </div>
                              ) : (
                                <div className="dtels-info-imgs" id="member-photo">
                                  <img src={profilePic} className="member-image img-fluid w-auto" alt="Profile" />
                                </div>
                              )}
                           
                              <div className="position-absolute bottom-0 end-0">
                                <label htmlFor="profile-upload" className="upload-image-div">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                  </svg>
                                </label>
                                <input id="profile-upload" accept=".png, .jpg, .jpeg" onChange={(e) => profileimgupdate(e)} name="upload_cont_img" type="file" hidden />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">First Name</label>
                            <input type="text" id="fname" name="fname" className="form-control frnt-input-style" {...formAttr(runform, "fname")} placeholder="Enter Your First Name" />
                            {errorContainer(runform, "fname")}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Last Name</label>
                            <input type="text" id="lname" name="lname" className="form-control frnt-input-style" {...formAttr(runform, "lname")} placeholder="Enter Your Last Name" />
                            {errorContainer(runform, "lname")}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Email</label>
                            <input type="email" id="email" name="email" className="form-control frnt-input-style" {...formAttr(runform, "email")} placeholder="Enter Your Email Address" disabled readOnly />
                            {errorContainer(runform, "email")}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Address</label>
                            <input type="text" id="address" name="address" className="form-control frnt-input-style" {...formAttr(runform, "address")} placeholder="Enter Your Address" />
                            {errorContainer(runform, "address")}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="lbl-frnt-side">Country</label>

                            <Select options={options} className="" placeholder={country} defaultInputValue={country} onChange={(e) => changeHandler(e)} />
                            {errorContainer(runform, "country")}
                          </div>
                        </div>

                        <div className="col-lg-6 mt-md-5 mt-3">
                          <div className="row">
                            <div className="col-sm-6 mb-2">
                              <button type="submit" className="btn-comn-all w-100">
                                <span className="position-relative">Save</span>
                              </button>
                            </div>
                            <div className="col-sm-6 mb-2">
                              <button type="button" className="btn-comn-all-2 w-100">
                                <span className="position-relative" onClick={() => navigate("/dashboard")}>
                                  cancel
                                </span>
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
      </Layout>
    </>
  );
}
