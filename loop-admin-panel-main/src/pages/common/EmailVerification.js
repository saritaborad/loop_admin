import React, { useState } from "react";
import { withRouter } from "../../Navigate";
import Logo from "../../images/logo.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input";
import { API_Path } from "../../const";
import { PostApi } from "../../ApiService";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";

function EmailVerification() {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");


    const verifyOtp = (otpdata) => {
        var email = localStorage.getItem("user-email")
        let data = {
            email: email,
            otp: otpdata
        }

        const LoginPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.forgotPassword, data));
        });
        LoginPromise.then((response) => {
            if (response.status == 200) {
                toastr.success(response.data.message);
                navigate("/reset-password");
            } else {
                toastr.error(response.data.message);
            }
        });
    };


    const handleChange = (otp) => {
        setOtp(otp)
        if (otp.length === 6) {
            verifyOtp(otp);
        }
    };

    const resendCode = () => {
        var email = localStorage.getItem("user-email")
        let data = {
            email: email,
        }

        const resetcode = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.forgotPassword, data));
        });
        resetcode.then((response) => {
            if (response.status == 200) {
                toastr.success(response.data.message);
            } else {
                toastr.error(response.data.message);
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
                                        <h1>Forgot Password</h1>
                                        <p>
                                            Please enter the security code we send to .
                                        </p>
                                    </div>
                                    <div className="log-box-main-inner-white">
                                        <form className="row mb-0">
                                            <div className="col-12">
                                                <span className="lbl-frnt-side">
                                                    Please enter one time passcode.
                                                </span>
                                            </div>
                                            <div className="col-12 mb-3 mx-auto">
                                                <ul className="row pt-3 otp-verify-class me-0">
                                                    <li>
                                                        <OtpInput
                                                            value={otp}
                                                            onChange={handleChange}
                                                            numInputs={6}
                                                            separator={<span style={{ width: "8px" }}></span>}
                                                            isInputNum={true}
                                                            shouldAutoFocus={true}
                                                            inputStyle={{
                                                                border: "1px solid rgba(106, 110, 131, 0.3)",
                                                                background: "#F4F5F9",
                                                                borderRadius: "10px",
                                                                width: "50px",
                                                                height: "50px",
                                                                fontSize: "14px",
                                                                color: "#000",
                                                                fontWeight: "400",
                                                            }}
                                                            containerStyle={{
                                                                justifyContent: "center",
                                                            }}
                                                            focusStyle={{
                                                                border: "1px solid rgba(106, 110, 131, 0.3)",
                                                                outline: "none",
                                                            }}
                                                        />

                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-12 pt-4 text-center">
                                                <button type="submit" onClick={() => verifyOtp()} className="btn-comn-all w-100">
                                                    <span className="position-relative">Submit</span>
                                                </button>
                                            </div>
                                        </form>
                                        <div className="text-center mt-3">
                                            <p className="login-btm-link res-code-link">
                                                <span onClick={() => resendCode()}>Resend Code</span>
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
export default withRouter(EmailVerification);