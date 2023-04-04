import React  from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/logo.svg";
import Facebook from "../../images/fb-icon-square.svg";
import Google from "../../images/google-icon-square.svg";
import Apple from "../../images/app-icon-square.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import "toastr/build/toastr.min.css";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SignUp() {
    const [phone, setPhone] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");

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
        <div className="container-fluid login-bg-image">
            <div className="row align-items-center h-100">
                <div className="col-md-6 p-0 d-lg-block d-none">
                    <div className="log-box-left-side">
                        <img src={Logo} alt="" />
                    </div>
                </div>
                <div className="col-md-6 mx-auto">
                    <div className="log-box-main">
                        <div className="log-box-main-scroll">
                            <div className="log-box-main-inner mx-auto">
                                <div className="log-box-fix-width">
                                    <div className="text-center pb-4">
                                        <h1>Create an Account</h1>
                                        <p>Fill in the details & create your account</p>
                                    </div>
                                    <div className="log-box-main-inner-white">
                                        <Formik
                                            enableReinitialize
                                            initialValues={{
                                                first: first,
                                                last: last,
                                                number: number,
                                                email: email,
                                            }}
                                            validationSchema={Yup.object({
                                                first: Yup.string().required("First name is required."),
                                                last: Yup.string().required("Last name is required."),
                                                number: Yup.string().required("Number is required."),
                                                email: Yup.string().required("Email is required."),
                                            })}
                                            onSubmit={(formData, { resetForm }) => {
                                                submitFormData(formData, resetForm);
                                            }}
                                        >
                                            {(runform) => (
                                                <form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit} data-hs-cf-bound="true">
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="lbl-frnt-side">First Name</label>
                                                            <bdi className="d-block position-relative">
                                                                <input type="text" id="first" name="first" className="form-control frnt-input-style" {...formAttr(runform, "first")} placeholder="John" />
                                                                <svg className="fix-tb-icon" width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M2.83325 4.66667C2.83325 2.36548 4.69873 0.5 6.99992 0.5C9.3011 0.5 11.1666 2.36548 11.1666 4.66667C11.1666 6.96785 9.3011 8.83333 6.99992 8.83333C4.69873 8.83333 2.83325 6.96785 2.83325 4.66667ZM6.99992 7.16667C8.38063 7.16667 9.49992 6.04738 9.49992 4.66667C9.49992 3.28596 8.38063 2.16667 6.99992 2.16667C5.61921 2.16667 4.49992 3.28596 4.49992 4.66667C4.49992 6.04738 5.61921 7.16667 6.99992 7.16667Z" fill="#7B838A" />
                                                                    <path d="M2.28587 11.6193C1.03563 12.8695 0.333252 14.5652 0.333252 16.3333H1.99992C1.99992 15.0073 2.5267 13.7355 3.46438 12.7978C4.40207 11.8601 5.67383 11.3333 6.99992 11.3333C8.326 11.3333 9.59777 11.8601 10.5355 12.7978C11.4731 13.7355 11.9999 15.0073 11.9999 16.3333H13.6666C13.6666 14.5652 12.9642 12.8695 11.714 11.6193C10.4637 10.369 8.76803 9.66667 6.99992 9.66667C5.23181 9.66667 3.53612 10.369 2.28587 11.6193Z" fill="#7B838A" />
                                                                </svg>
                                                            </bdi>
                                                            {errorContainer(runform, "first")}
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="lbl-frnt-side">Last Name</label>
                                                            <bdi className="d-block position-relative">
                                                                <input type="text" id="last" name="last" className="form-control frnt-input-style" {...formAttr(runform, "last")} placeholder="doe" />
                                                                <svg className="fix-tb-icon" width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M2.83325 4.66667C2.83325 2.36548 4.69873 0.5 6.99992 0.5C9.3011 0.5 11.1666 2.36548 11.1666 4.66667C11.1666 6.96785 9.3011 8.83333 6.99992 8.83333C4.69873 8.83333 2.83325 6.96785 2.83325 4.66667ZM6.99992 7.16667C8.38063 7.16667 9.49992 6.04738 9.49992 4.66667C9.49992 3.28596 8.38063 2.16667 6.99992 2.16667C5.61921 2.16667 4.49992 3.28596 4.49992 4.66667C4.49992 6.04738 5.61921 7.16667 6.99992 7.16667Z" fill="#7B838A" />
                                                                    <path d="M2.28587 11.6193C1.03563 12.8695 0.333252 14.5652 0.333252 16.3333H1.99992C1.99992 15.0073 2.5267 13.7355 3.46438 12.7978C4.40207 11.8601 5.67383 11.3333 6.99992 11.3333C8.326 11.3333 9.59777 11.8601 10.5355 12.7978C11.4731 13.7355 11.9999 15.0073 11.9999 16.3333H13.6666C13.6666 14.5652 12.9642 12.8695 11.714 11.6193C10.4637 10.369 8.76803 9.66667 6.99992 9.66667C5.23181 9.66667 3.53612 10.369 2.28587 11.6193Z" fill="#7B838A" />
                                                                </svg>
                                                            </bdi>
                                                            {errorContainer(runform, "last")}
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="lbl-frnt-side">Phone Number</label>
                                                            <bdi className="d-block position-relative">
                                                                <bdi className="d-block position-relative tel-input-info">
                                                                    <PhoneInput country={"in"} value={phone} />
                                                                </bdi>
                                                            </bdi>
                                                            {errorContainer(runform, "number")}
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="lbl-frnt-side">
                                                                Email Address<mark className="p-0 bg-transparent star-mark-text">*</mark>
                                                            </label>
                                                            <bdi className="d-block position-relative">
                                                                <input type="email" id="email" name="email" className="form-control frnt-input-style" {...formAttr(runform, "email")} placeholder="catholicvote@gmail.com" />
                                                                <svg className="fix-tb-icon" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1.5 3.79962L8.0755 8.18329C8.63533 8.55651 9.36467 8.55651 9.9245 8.18329L16.5 3.79962M3.16667 12.9663H14.8333C15.7538 12.9663 16.5 12.2201 16.5 11.2996V2.96629C16.5 2.04581 15.7538 1.29962 14.8333 1.29962H3.16667C2.24619 1.29962 1.5 2.04581 1.5 2.96629V11.2996C1.5 12.2201 2.24619 12.9663 3.16667 12.9663Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                </svg>
                                                            </bdi>
                                                            {errorContainer(runform, "email")}
                                                        </div>
                                                    </div>
                                                    <div className="col-12 py-4 text-center">
                                                        <button type="submit" className="btn-comn-all w-100">
                                                            <span className="position-relative">Sign Up</span>
                                                        </button>
                                                    </div>
                                                    <div className="col-12 text-center">
                                                        <span className="d-block text-center pb-4 or-text-info">Or Continue with</span>
                                                        <ul>
                                                            <li className="d-inline-block px-2">
                                                                <Link to="/" target="_blank">
                                                                    <img src={Facebook} alt="facebook" />
                                                                </Link>
                                                            </li>
                                                            <li className="d-inline-block px-2">
                                                                <Link to="/" target="_blank">
                                                                    <img src={Google} alt="google" />
                                                                </Link>
                                                            </li>
                                                            <li className="d-inline-block px-2">
                                                                <Link to="/" target="_blank">
                                                                    <img src={Apple} alt="appple" />
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center pt-3">
                                <p className="mb-0 btm-login-link">
                                    Already have an account?
                                    <Link to="/login"> Sign In</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
