import React from "react";
import Logo from "../../images/logo.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import toastr from "toastr";
import { useState } from "react";
import { PostApi } from "../../ApiService";
import { API_Path } from "../../const";
import { withRouter } from "../../Navigate";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const submitFormData = (formData, resetForm) => {
    const loginpromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.login, formData));
    });
    loginpromise.then((response) => {

      if (response.status === 200) {

        var userDetails = response.data.data.user != null ? JSON.stringify(response.data.data.user) : "";
        var userRole = response.data.data.user.role != null ? JSON.stringify(response.data.data.user.role) : "";

        var permissions = response.data.data.permissionData != null ? JSON.stringify(response.data.data.permissionData) : "";
        localStorage.setItem("loop_token", response.data.data.token);
        localStorage.setItem("userData", userDetails);
        localStorage.setItem("userPermission", permissions)

        toastr.success(response.data.message);
        if (userRole == 1) {
          props.navigate("/dashboard");
        } else {
          props.navigate("/news-feed");
        }
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



  const passwordShow = (e) => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    document.getElementById("password").classList.toggle("click-password-show");
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
                    <h1>Sign in to your account</h1>
                    <p>
                      <span>Welcome Back!</span> Please Log in Your Account
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
                        password: password,
                      }}
                      validationSchema={Yup.object({
                        email: Yup.string().email("Enter Valid Email Address.").required("Email is required."),
                        password: Yup.string().required("Password is required."),
                      })}
                      onSubmit={(formData, { resetForm }) => {
                        submitFormData(formData, resetForm);
                      }}
                    >
                      {(runform) => (
                        <form className="row mb-0" onSubmit={runform.handleSubmit} data-hs-cf-bound="true">
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">
                                Email Address<mark className="p-0 bg-transparent star-mark-text">*</mark>
                              </label>
                              <bdi className="d-block position-relative">
                                <input type="email" id="email" name="email" className="form-control  frnt-input-style" {...formAttr(runform, "email")} placeholder="you@example.com" />
                                {/* <svg className="fix-tb-icon" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.5 3.79962L8.0755 8.18329C8.63533 8.55651 9.36467 8.55651 9.9245 8.18329L16.5 3.79962M3.16667 12.9663H14.8333C15.7538 12.9663 16.5 12.2201 16.5 11.2996V2.96629C16.5 2.04581 15.7538 1.29962 14.8333 1.29962H3.16667C2.24619 1.29962 1.5 2.04581 1.5 2.96629V11.2996C1.5 12.2201 2.24619 12.9663 3.16667 12.9663Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg> */}
                              </bdi>
                              {errorContainer(runform, "email")}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="lbl-frnt-side">
                                password<mark className="p-0 bg-transparent star-mark-text">*</mark>
                              </label>
                              <bdi className="d-block position-relative">
                                <div className="mb-3">
                                  <bdi className="d-block position-relative show-class">
                                    <input type="password" id="password" className="form-control frnt-input-style" {...formAttr(runform, "password")} name="password" placeholder="Enter Your Password." />

                                    <span className="show-pwd" onClick={(e) => passwordShow(e)}>
                                      <i className="bi bi-eye-slash"></i>
                                    </span>
                                  </bdi>
                                  {errorContainer(runform, "password")}
                                </div>
                                {/* <input type="password" id="password" name="password" className="form-control frnt-input-style click-password-show" {...formAttr(runform, "password")} placeholder="Enter Your Password" />
                                <svg className="fix-tb-icon" width={14} height={19} viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 6.66668H11.1667V5.00001C11.1667 2.70001 9.30004 0.833344 7.00004 0.833344C4.70004 0.833344 2.83337 2.70001 2.83337 5.00001V6.66668H2.00004C1.08337 6.66668 0.333374 7.41668 0.333374 8.33334V16.6667C0.333374 17.5833 1.08337 18.3333 2.00004 18.3333H12C12.9167 18.3333 13.6667 17.5833 13.6667 16.6667V8.33334C13.6667 7.41668 12.9167 6.66668 12 6.66668ZM4.50004 5.00001C4.50004 3.61668 5.61671 2.50001 7.00004 2.50001C8.38337 2.50001 9.50004 3.61668 9.50004 5.00001V6.66668H4.50004V5.00001ZM12 16.6667H2.00004V8.33334H12V16.6667ZM7.00004 14.1667C7.91671 14.1667 8.66671 13.4167 8.66671 12.5C8.66671 11.5833 7.91671 10.8333 7.00004 10.8333C6.08337 10.8333 5.33337 11.5833 5.33337 12.5C5.33337 13.4167 6.08337 14.1667 7.00004 14.1667Z" fill="#9CA3AF" />
                                </svg>
                                <span className="show-pwd" onClick={(e) => passwordShow(e)}>
                                  <i className="bi bi-eye-slash"></i>
                                </span> */}
                              </bdi>
                              {/* {errorContainer(runform, "password")} */}
                            </div>
                          </div>
                          <div className="col-12 pt-4 text-center">
                            <button type="submit" className="btn-comn-all w-100">
                              <span className="position-relative">login</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                    <div className="text-center pt-3">
                      <p className="mb-0 btm-login-link">
                        <a href="/forgot-password">
                          Forgot Password?
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="text-center pt-3">
                                <p className="mb-0 btm-login-link">
                                    Don’t have an account?
                                    <Link to="/sign-up">Sign Up</Link>
                                </p>
                            </div> */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
