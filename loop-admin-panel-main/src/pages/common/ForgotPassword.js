import React from "react";
import { withRouter } from "../../Navigate";
import Logo from "../../images/logo.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { API_Path } from "../../const";
import { PostApi } from "../../ApiService";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");


    const submitFormData = (formData, resetForm) => {
        const LoginPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.forgotPassword, formData));
        });
        LoginPromise.then((response) => {
            if (response.data.success === true) {

                localStorage.setItem('user-email', formData.email);
                resetForm(formData)
                toastr.success(response.data.message);
                navigate("/email-verification");
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
                                        <h1>Forgot Password</h1>
                                        <p>
                                            Please enter your email and we will send you a link to update password.
                                        </p>
                                    </div>
                                    <div className="log-box-main-inner-white">
                                        {/* <span className="top-text-hdr text-center d-block pb-3">Magic Link</span>
                                        <p className="top-text-ctr"> Login without password: send the one time unique login link to your email and login with 1 click.</p>
                                        <bdi className="top-text-btm pb-3">If the magic link was older than 1 minute, You have to login again.</bdi> */}
                                        <Formik
                                            enableReinitialize
                                            initialValues={{
                                                email: email,
                                            }}
                                            validationSchema={Yup.object({
                                                email: Yup.string().email("Enter Valid Email Address.").required("Email is required."),
                                            })}
                                            onSubmit={(formData, { resetForm }) => {
                                                submitFormData(formData, resetForm);
                                            }}
                                        >
                                            {(runform) => (
                                                <form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit} data-hs-cf-bound="true">
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="lbl-frnt-side">
                                                                Email Address<mark className="p-0 bg-transparent star-mark-text">*</mark>
                                                            </label>
                                                            <bdi className="d-block position-relative">
                                                                <input type="email" id="email" name="email" className="form-control frnt-input-style" {...formAttr(runform, "email")} placeholder="you@example.com" />
                                                                <svg className="fix-tb-icon" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1.5 3.79962L8.0755 8.18329C8.63533 8.55651 9.36467 8.55651 9.9245 8.18329L16.5 3.79962M3.16667 12.9663H14.8333C15.7538 12.9663 16.5 12.2201 16.5 11.2996V2.96629C16.5 2.04581 15.7538 1.29962 14.8333 1.29962H3.16667C2.24619 1.29962 1.5 2.04581 1.5 2.96629V11.2996C1.5 12.2201 2.24619 12.9663 3.16667 12.9663Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                </svg>
                                                            </bdi>
                                                            {errorContainer(runform, "email")}
                                                        </div>
                                                    </div>

                                                    <div className="col-12 pt-4 text-center">
                                                        <button type="submit" className="btn-comn-all w-100">
                                                            <span className="position-relative">Submit</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                        <div className="text-center pt-3">
                                            <p className="mb-0 btm-login-link">
                                                <a href="/login">
                                                    Login
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default withRouter(ForgotPassword);