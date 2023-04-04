import React from "react";
import Tick from "../images/bluetick.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import toastr from "toastr";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";

function ScheduleTips(props) {

    useEffect(() => {
        var dtToday = new Date();
        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();
        var maxDate = year + '-' + month + '-' + day;
        var maxtime = dtToday.getHours() + ":" + dtToday.getMinutes();
        document.getElementById("txtDate").setAttribute('min', maxDate)
        document.getElementById("txtTime").setAttribute('min', maxtime)
    }, [])

    const errorContainer = (form, field) => {
        return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
    };

    const formAttr = (form, field) => ({
        onBlur: form.handleBlur,
        onChange: form.handleChange,
        value: form.values[field],
    });

    const submitFormData = (formData, resetForm) => {
        var date = formData.date
        var time = formData.time

        var dateObj = new Date(date + ' ' + time + ":00").toISOString();

        var requestObj = {
            id: props.tipDetails._id,
            title: formData.title,
            category: formData.category,
            caption: formData.caption,
            scheduleDate: dateObj
        }

        const scheduleTips = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.scheduleTip, requestObj));
        });

        scheduleTips.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message);
                props.closeModal && props.closeModal();
                props.getParentList && props.getParentList();
            }
            else {
                toastr.error(response.data.message);
            }
        })

    };

    return (
        <>
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title>
                    <h1>Schedule Tips</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    // innerRef={this.runforms}
                    enableReinitialize
                    initialValues={{
                        title: '',
                        category: '',
                        caption: '',
                        id: props.tipDetails?._id,
                        date: "",
                        time: "",
                    }}
                    validationSchema={Yup.object({
                        caption: Yup.string().required("Write Commentary before submit..."),
                        category: Yup.string().required("select any category."),
                        title: Yup.string().required("Title is required."),
                        date: Yup.string().required("Enter The Schedule Date..."),
                        time: Yup.string().required("Enter The Schedule Time..."),
                    })}
                    onSubmit={(formData, { resetForm }) => {
                        submitFormData(formData, resetForm);
                    }}
                >
                    {(runform) => (
                        <form className="row mb-0" onSubmit={runform.handleSubmit}>
                            <input type="hidden" name="id" />
                            <div className="col-12 mb-3">
                                <div className="modal-in-img">
                                    <img src={props.tipDetails?.image} className="img-fluid w-100 " alt="" />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="d-flex align-items-center">
                                    <div className="prayer-profile me-3">
                                        <img src={props.tipDetails?.user?.profile_img} alt="" />
                                    </div>
                                    <div className="latest-news-small-header py-2">
                                        <h4 className="d-flex align-items-center">
                                            {props.tipDetails?.user?.fname + " " + props.tipDetails?.user?.lname}
                                            <span className="ps-2">
                                                <img src={Tick} alt="" />
                                            </span>
                                        </h4>
                                        <span>
                                            <span>&#9679; {props.tipDetails?.timeElapsed}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="latest-news-content pb-2">
                                    <bdi>{props.tipDetails?.description}</bdi>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label className="lbl-frnt-side">Title</label>
                                <input type="type" className="form-control frnt-input-style" name="title" {...formAttr(runform, "title")} placeholder="Enter title" />
                                {errorContainer(runform, "title")}
                            </div>
                            <div className="col-12 mb-3">
                                <label className="lbl-frnt-side">Category</label>
                                <select className="form-select frnt-input-style" name="category" {...formAttr(runform, "category")}>
                                    <option value="" selected>Select category</option>
                                    <option value="Featured">Featured</option>
                                    <option value="Trending">Trending</option>
                                    <option value="ProLife">ProLife</option>
                                    <option value="Politics">Politics</option>
                                    <option value="Faith">Faith</option>
                                </select>
                                {errorContainer(runform, "category")}
                            </div>
                            <div className="col-12 mb-3">
                                <label className="lbl-frnt-side">Add Commentary</label>
                                <textarea className="form-control frnt-input-style h-auto" rows="4" name="caption" {...formAttr(runform, "caption")} />
                                {errorContainer(runform, "caption")}
                            </div>
                            <div className="col-12 mb-3">
                                <label className="lbl-frnt-side">Select Date</label>
                                <input type="date" className="form-control frnt-input-style" name="date" id="txtDate" {...formAttr(runform, "date")} />
                                {errorContainer(runform, "date")}
                            </div>
                            <div className="col-12 mb-3">
                                <label className="lbl-frnt-side">Select Time</label>
                                <input type="time" className="form-control frnt-input-style" name="time" id="txtTime" {...formAttr(runform, "time")} />
                                {errorContainer(runform, "time")}
                            </div>
                            <div className="col-12 pt-3 pb-2 text-center">
                                <button className="btn-comn-all px-4" type="submit">
                                    <span className="position-relative">Submit</span>
                                </button>
                            </div>

                        </form>
                    )}
                </Formik>
            </Modal.Body>
        </>
    )
}

export default ScheduleTips;