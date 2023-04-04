import React from "react";
import { withRouter } from "../../Navigate";
import Logo from "../../images/logo.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { PostApi } from "../../ApiService";
import { API_Path } from "../../const";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";




function ResetPassword() {
    const navigate = useNavigate();
    const [password, setpassword] = useState("");
    const [confirm_password, setconfirm_password] = useState("");



    const errorContainer = (form, field) => {
        return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
    };

    const formAttr = (form, field) => ({
        onBlur: form.handleBlur,
        onChange: form.handleChange,
        value: form.values[field],
    });

    const newpasswordshow = (e) => {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
        document.getElementById("password").classList.toggle("click-password-show");
    };

    const confirmpasswordshow = (e) => {
        var x = document.getElementById("confirm_password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
        document.getElementById("confirm_password").classList.toggle("click-password-show");
    };

    const submitFormData = (formData, resetForm) => {
        var email = localStorage.getItem("user-email");
        var reqObj = {
            email: email,
            password: formData.password
        }

        const resetPasswordPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.forgotPassword, reqObj));
        });

        resetPasswordPromise.then((res) => {
            if (res) {
                if (res.status == 200) {
                    toastr.success(res.data.message);
                    localStorage.setItem("token", res.data.token);
                    navigate("/login");
                } else {
                    toastr.error(res.data.message);
                }
            }
        });
    };

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
                                        <h1>Reset Password</h1>
                                        <p>
                                            Set a new password
                                        </p>
                                    </div>
                                    <div className="log-box-main-inner-white">

                                        <Formik
                                            enableReinitialize
                                            initialValues={{
                                                password: password,
                                                confirm_password: confirm_password,
                                            }}
                                            validationSchema={Yup.object({
                                                password: Yup.string().required(
                                                    'Password is required.'
                                                ),
                                                confirm_password: Yup.string()
                                                    .when('password', {
                                                        is: (val) =>
                                                            val && val.length > 0 ? true : false,
                                                        then: Yup.string().oneOf(
                                                            [Yup.ref('password')],
                                                            'Password must match.'
                                                        ),
                                                    })
                                                    .required('Confirmation of Password is required.'),
                                            })}
                                            onSubmit={(formData, { resetForm }) => {
                                                submitFormData(formData, resetForm);
                                            }}
                                        >
                                            {(runform) => (
                                                <form className="row mb-0  " onSubmit={runform.handleSubmit} data-hs-cf-bound="true">
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="lbl-frnt-side">Password</label>
                                                            <bdi className="d-block position-relative show-class">
                                                                <input type="password" id="password" className="form-control frnt-input-style" {...formAttr(runform, "password")} name="password" placeholder="Enter Your new password." />

                                                                <span className="show-pwd" onClick={(e) => newpasswordshow(e)}>
                                                                    <i className="bbi bi-eye-slash"></i>
                                                                </span>
                                                            </bdi>
                                                            {errorContainer(runform, "password")}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="lbl-frnt-side">
                                                                Confirm password<mark className="p-0 bg-transparent star-mark-text"></mark>
                                                            </label>
                                                            <bdi className="d-block position-relative">
                                                                <input type="password" id="confirm_password" name="confirm_password" className="form-control frnt-input-style" {...formAttr(runform, "confirm_password")} placeholder="Confirm password" />

                                                                <span className="show-pwd" onClick={(e) => confirmpasswordshow(e)}>
                                                                    <i className="bi bi-eye-slash"></i>
                                                                </span>
                                                            </bdi>
                                                            {errorContainer(runform, "confirm_password")}
                                                        </div>

                                                    </div>

                                                    <div className="col-12 pt-4 text-center">
                                                        <button type="submit" className="btn-comn-all w-100">
                                                            <span className="position-relative">Login</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
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
export default withRouter(ResetPassword);