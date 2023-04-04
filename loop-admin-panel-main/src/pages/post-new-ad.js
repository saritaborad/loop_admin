import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/layout';
import Back from "../images/back_arw.svg";
import Upload from "../images/cloud-upload.svg";
import { Formik } from "formik";
import * as Yup from "yup";
import "toastr/build/toastr.min.css";
import { useState } from "react";

export default function PostNewAd() {
    const [pub_date, setPublishDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [url, setURL] = useState("");
    const [location, setLocation] = useState("");
    const [img, setImage] = useState("");

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
    <Layout>
        <div className='content-main-section'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='comn-title-info d-flex align-items-center'>
                            <Link to="/advertising">
                                <img src={Back} alt="" className='me-2'/>
                            </Link>
                            <h1>Post New Ad</h1>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className='white-box-main p-0'>
                            <div className='white-bx-hdr p-3 mb-0'>ADS Management</div>
                            <div className='add-content-main p-3'>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                         <Formik
                                        // innerRef={this.runforms}
                                        enableReinitialize
                                        initialValues={{
                                            pub_date: pub_date,
                                            end_date: end_date,
                                            url: url,
                                            location: location,
                                            img: img,
                                        }}
                                        validationSchema={Yup.object({
                                            pub_date: Yup.string().required("Publish Date is required."),
                                            end_date: Yup.string().required("End Date is required."),
                                            url: Yup.string().required("URL is required."),
                                            location: Yup.string().required("Location Within The App is required."),
                                            img: Yup.mixed().required('Image is required'),
                                        })}
                                        onSubmit={(formData, { resetForm }) => {
                                            submitFormData(formData, resetForm);
                                        }}
                                    >
                                        {(runform) => (
                                            <form className="row mb-0" onSubmit={runform.handleSubmit}>
                                            <div className='col-12 mb-3'>
                                                <label className='lbl-frnt-side'>Topic</label>
                                                <select className='frnt-input-style form-select'>
                                                    <option>Select topic</option>
                                                </select>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='lbl-frnt-side'>Publish Date</label>
                                                <input className='form-control frnt-input-style' type="date" name="pub_date" {...formAttr(runform, "pub_date")}/>
                                                {errorContainer(runform, "pub_date")}
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='lbl-frnt-side'>End Date</label>
                                                <input className='form-control frnt-input-style' type="date" name="end_date" {...formAttr(runform, "end_date")}/>
                                                {errorContainer(runform, "end_date")}
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label className="lbl-frnt-side">
                                                Image 
                                                </label>
                                                <label className="upload-img-box" htmlFor="file-upload">
                                                    <div className="upload-img-in">
                                                        <div className="m-auto text-center">
                                                            <img src={Upload} alt="upload" className="img-fluid" />
                                                            <p>Upload JPG, PNG</p>
                                                            <span className="d-inline-block lbl-table-tag">Choose File</span>
                                                            <input id="file-upload" accept="image/*," type="file" hidden {...formAttr(runform, "img")} name="img"/>
                                                        </div>
                                                    </div>
                                                </label>
                                                {errorContainer(runform, "img")}
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <label className='lbl-frnt-side'>URL</label>
                                                <input className='form-control frnt-input-style' type="url" name="url" {...formAttr(runform, "url")}/>
                                                {errorContainer(runform, "url")}
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <label className='lbl-frnt-side'>Location within the App</label>
                                                <input className='form-control frnt-input-style' type="text" name="location" {...formAttr(runform, "location")}/>
                                                {errorContainer(runform, "location")}
                                            </div>
                                            <div className='col-sm-6'>
                                                <div className='row'>
                                                    <div className='col-lg-7'>
                                                        <button className='btn-comn-all w-100' type='submit'>UPLOAD</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>)}</Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}
