import React from "react";
import Layout from "../components/Layout/layout";
import UserDetailImage from "../images/user-detail-image.png";
import { Formik } from "formik";
import * as Yup from "yup";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useState } from "react";

export default function EditUserDetail() {
    const [fname, setFirstname] = useState("");
    const [lname, setLastname] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [parish, setParish] = useState("");
    const [number, setNumber] = useState("");
    const [address, setAddress] = useState("");

    const submitFormData = (formData, resetForm) => {
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
            <Layout>
                <div className="content-main-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="comn-title-info">
                                    <h1>Users</h1>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="white-box-main">
                                    <div className="white-bx-hdr">Edit Details</div>
                                    <Formik
                                        // innerRef={this.runforms}
                                        enableReinitialize
                                        initialValues={{
                                            fname: fname,
                                            lname: lname,
                                            address: address,
                                            number: number,
                                            nickname: nickname,
                                            parish: parish,
                                            age: age,
                                            email: email,
                                        }}
                                        validationSchema={Yup.object({
                                            fname: Yup.string().required("First Name is required."),
                                            lname: Yup.string().required("Last Name is required."),
                                            nickname: Yup.string().required("Nick Name is required."),
                                            address: Yup.string().required("Address is required."),
                                            age: Yup.string().required("Age is required."),
                                            parish: Yup.string().required("Parish Name is required."),
                                            number: Yup.string().required("Mobile Number is required."),
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
                                                            <div className="dtels-info-imgs" id="member-photo">
                                                                <img src={UserDetailImage} className="member-image img-fluid w-auto" alt="smith" />
                                                            </div>
                                                            <div className="position-absolute bottom-0 end-0">
                                                                <label htmlFor="profile-upload" className="upload-image-div">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                                                                        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                                                        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                                                    </svg>
                                                                </label>
                                                                <input id="profile-upload" accept="image/*" name="upload_cont_img" type="file" hidden />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">User First Name</label>
                                                        <input type="text" name="fname" {...formAttr(runform, "fname")} className="form-control frnt-input-style" placeholder="Enter Your First Name." />
                                                        {errorContainer(runform, "fname")}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">User Last Name</label>
                                                        <input type="text" name="lname" {...formAttr(runform, "lname")} className="form-control frnt-input-style" placeholder="Enter Your Last Name." />
                                                        {errorContainer(runform, "lname")}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">User Nickname</label>
                                                        <input type="text" name="nickname" {...formAttr(runform, "nickname")} className="form-control frnt-input-style" placeholder="Enter Your Nickname." />
                                                        {errorContainer(runform, "nickname")}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">Birthdate</label>
                                                        <input type="date" name="bdate" className="form-control frnt-input-style" />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">Age</label>
                                                        <input type="number" name="age" {...formAttr(runform, "age")} className="form-control frnt-input-style" placeholder="Enter Your Age." />
                                                        {errorContainer(runform, "age")}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">Parish</label>
                                                        <input type="text" name="parish" {...formAttr(runform, "parish")} className="form-control frnt-input-style" placeholder="Enter Parish Name." />
                                                        {errorContainer(runform, "parish")}
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
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">Address</label>
                                                        <input type="text" name="address" {...formAttr(runform, "address")} className="form-control frnt-input-style" placeholder="Enter Your Address." />
                                                        {errorContainer(runform, "address")}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">Status</label>
                                                        <bdi className="d-block">
                                                            <div className="custom-switch-toggle-menu">
                                                                <label className="switch">
                                                                    <input type="checkbox" name="status" defaultChecked/>
                                                                    <span className="slider round"></span>
                                                                    <bdi className="active-info-switch">Active</bdi>
                                                                    <bdi className="inactive-info-switch">disable</bdi>
                                                                </label>
                                                            </div>
                                                        </bdi>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="row">
                                                        <div className="col-sm-6 mb-2">
                                                            <button type="button" className="btn-comn-all-2 w-100">
                                                                <span className="position-relative">cancel</span>
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
                    </div>
                </div>
            </Layout>
        </>
    );
}
