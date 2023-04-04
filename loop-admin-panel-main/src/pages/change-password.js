import React from "react";
import Layout from "../components/Layout/layout";
import { Formik } from "formik";
import * as Yup from "yup";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useNavigate } from "react-router-dom";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";

export default function ChangePassword() {
    const navigate = useNavigate();
    const errorContainer = (form, field) => {
        return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
    };

    const formAttr = (form, field) => ({
        onBlur: form.handleBlur,
        onChange: form.handleChange,
        value: form.values[field],
    });

    const oldpasswordshow = (e) => {
        var x = document.getElementById("old_password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
        document.getElementById("old_password").classList.toggle("click-password-show");
    };

    const newpasswordshow = (e) => {
        var x = document.getElementById("new_password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
        document.getElementById("new_password").classList.toggle("click-password-show");
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

    const changePassword = (values) => {
        let data = {
            password: values.old_password,
            new_password: values.new_password
        };
        const changePasswordPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.changePassword, data));
        });
        changePasswordPromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.success);
            } else {
                toastr.error(response.data.message);
            }
        });
    };

    const cancelClick = (e) => {
        navigate("/dashboard");
    };

    return (
        <>
            <Layout>
                <div className="content-main-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="comn-title-info">
                                    <h1>Change Password</h1>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="white-box-main">
                                    <Formik
                                        // innerRef={runforms}
                                        enableReinitialize={true}
                                        initialValues={{
                                            old_password: "",
                                            new_password: "",
                                            confirm_password: "",
                                        }}
                                        validationSchema={Yup.object({
                                            old_password: Yup.string().required("Old Password is required."),
                                            new_password: Yup.string()
                                                .when("old_password", {
                                                    is: (val) => (val && val.length > 0 ? true : false),
                                                    then: Yup.string().notOneOf([Yup.ref("old_password")], "Password must be different from old password."),
                                                })
                                                .required("New Password is required."),
                                            confirm_password: Yup.string()
                                                .when("new_password", {
                                                    is: (val) => (val && val.length > 0 ? true : false),
                                                    then: Yup.string().oneOf([Yup.ref("new_password")], "Password must match."),
                                                })
                                                .required("Confirmation of Password is required."),
                                        })}
                                        onSubmit={async (values) => {
                                            changePassword(values);
                                        }}
                                    >
                                        {(runform) => (
                                            <form className="row mb-0" onSubmit={runform.handleSubmit}>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">Old Password</label>
                                                        <bdi className="d-block position-relative show-class">
                                                            <input type="password" id="old_password" className="form-control frnt-input-style" {...formAttr(runform, "old_password")} name="old_password" placeholder="Enter Your Old Password." />
                                                            <span className="show-pwd" onClick={(e) => oldpasswordshow(e)}>
                                                                <i className="bi bi-eye-slash"></i>
                                                            </span>
                                                        </bdi>
                                                        {errorContainer(runform, "old_password")}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">New Password</label>
                                                        <bdi className="d-block position-relative show-class">
                                                            <input type="password" id="new_password" className="form-control frnt-input-style" {...formAttr(runform, "new_password")} name="new_password" placeholder="Enter Your New Password." />
                                                            <span className="show-pwd" onClick={(e) => newpasswordshow(e)}>
                                                                <i className="bi bi-eye-slash"></i>
                                                            </span>
                                                        </bdi>
                                                        {errorContainer(runform, "new_password")}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="lbl-frnt-side">Confirm New Password</label>
                                                        <bdi className="d-block position-relative show-class">
                                                            <input type="password" id="confirm_password" className="form-control frnt-input-style" {...formAttr(runform, "confirm_password")} name="confirm_password" placeholder="Confirm New Password." />
                                                            <span className="show-pwd" onClick={(e) => confirmpasswordshow(e)}>
                                                                <i className="bi bi-eye-slash"></i>
                                                            </span>
                                                        </bdi>
                                                        {errorContainer(runform, "confirm_password")}
                                                    </div>
                                                </div>
                                                <div className="col-lg-5 ms-auto mt-3">
                                                    <div className="row">
                                                        <div className="col-sm-6 mb-2">
                                                            <button type="submit" className="btn-comn-all w-100">
                                                                <span className="position-relative">Save Changes</span>
                                                            </button>
                                                        </div>
                                                        <div className="col-sm-6 mb-2">
                                                            <button type="button" className="btn-comn-all-2 w-100">
                                                                <span className="position-relative" onClick={(e) => cancelClick(e)}>cancel</span>
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
