import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/layout';
import { Accordion, Dropdown, Modal, Offcanvas, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Formik } from "formik";
import * as Yup from "yup";
import toastr from "toastr";
import { GetApi, PostApi } from '../ApiService';
import { API_Path } from '../const';
import loaderimg from "../images/loader.gif"
import ReactPaginate from 'react-paginate';


function Faq(props) {
    const [show, setShow] = useState("");
    const [editshowfaq, setEditshowfaq] = useState("");
    const [deleteshowfaq, setdeleteshowfaq] = useState("");
    const [loader, setLoader] = useState(true);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [editquestion, seteditQuestion] = useState("");
    const [editanswer, seteditAnswer] = useState("");
    const [id, setId] = useState("");

    const [faq, setFaq] = useState([]);

    const isLogged_in = localStorage.getItem("loop_token") ? true : false;

    let loginUser = null;
    let userRole = "";

    if (isLogged_in) {
        loginUser = JSON.parse(localStorage.getItem("userData"));
        userRole = loginUser?.role;

    }

    const [option1, set_option1] = useState({
        sizePerPage1: 10,
        search1: "",
        totalRecord1: '',
        page1: 0,
        sort1: "",
        order1: "",
    });


    const formAttr = (form, field) => ({
        onBlur: form.handleBlur,
        onChange: form.handleChange,
        value: form.values[field],
    });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClosefaq = () => setEditshowfaq(false);
    const handleShowfaq = (id, item) => {
        setEditshowfaq(true)
        setId(id)
        if (id !== "") {
            let data = {
                id: id
            }
            const specificfaqpromise = new Promise((resolve, reject) => {
                resolve(PostApi(API_Path.specificfaq, data));
            });
            specificfaqpromise.then((response) => {
                if (response.status === 200) {
                    seteditQuestion(response.data.data[0].question);
                    seteditAnswer(response.data.data[0].answer)
                } else {
                    toastr.error(response.data.message);
                }
            });
        }
    };

    const handleClosedeletefaq = () => setdeleteshowfaq(false);
    const handleShowdeletefaq = (id) => {
        setId(id)
        setdeleteshowfaq(true)
    };
    const errorContainer = (form, field) => {
        return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
    };

    const submitFormData = (formData, resetForm) => {
        const faqpromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.faq, formData));
        });
        faqpromise.then((response) => {
            if (response.status === 200) {
                setShow(false)
                toastr.success(response.data.message);
                getfaq()
            } else {
                toastr.error(response.data.message);
            }
        });
    };

    const edithandleSubmit = (formData) => {
        let data = {
            id: id,
            question: formData.editquestion,
            answer: formData.editanswer,
        }
        const editfaqpromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.editfaq, data));
        });
        editfaqpromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message);
                setEditshowfaq(false);
                getfaq(option1.page1)
            } else {
                toastr.error(response.data.message);
            }
        });
    }

    const deletefaq = () => {
        let data = {
            id: id,
        }
        const deletefaqpromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.deletefaq, data));
        });
        deletefaqpromise.then((response) => {
            if (response.status === 200) {
                toastr.success(response.data.message);
                setdeleteshowfaq(false);
                getfaq(option1.page1)
            } else {
                toastr.error(response.data.message);
            }
        });
    }

    useEffect(() => {
        getfaq(option1.page1)
    }, []);

    const handlePageClick1 = (e) => {
        getfaq(e.selected)
    }

    const getfaq = (page1) => {
        let data = {
            page: page1 + 1,
            limit: 10
        }
        const faqpromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.getfaq, data));
        });
        faqpromise.then((response) => {
            if (response.status === 200) {
                setFaq(response.data.data.faqs)
                set_option1({
                    totalRecord1: response.data.data.totalfaqs,
                    page1: page1,
                    sizePerPage1: 10
                })
                setLoader(false)
            } else {
                toastr.error(response.data.message);
            }
        });
    }

    return (
        <Layout>
            {loader &&
                <div className='cust-loader'>
                    <img src={loaderimg} className="loader" alt='' />
                </div>
            }
            <div className='content-main-section'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className="comn-title-info d-sm-flex align-items-center">
                                <h1>FAQ</h1>
                                {userRole === 1 &&
                                    <div className="ms-auto mt-2 mt-sm-0">
                                        <button className="btn-comn-all w-100" onClick={handleShow}>ADD FAQ</button>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='col-md-12'>
                            <Accordion defaultActiveKey="0" className='cust-accordian cust-accordian-faq'>
                                {faq.length > 0 && faq.map((item, i) => {
                                    return (
                                        <div key={i}>
                                            <Accordion.Item eventKey={i}>
                                                <Accordion.Header>
                                                    <p className='mb-0'> {item.question}</p>
                                                    <div className="table-cust-drop cust-drop-down">
                                                        {userRole === 1 &&
                                                            <Dropdown drop="left">
                                                                <Dropdown.Toggle className="table-dropdown-btn" id="dropdown-table">
                                                                    <i className="bi bi-three-dots"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <ul>
                                                                        <li>
                                                                            <Dropdown.Item>
                                                                                <bdi className="d-flex align-items-center" onClick={() => handleShowfaq(item._id)}>
                                                                                    <i className="bi bi-pencil"></i>
                                                                                    <span className="ms-2">Edit</span>
                                                                                </bdi>
                                                                            </Dropdown.Item>
                                                                        </li>
                                                                        <li>
                                                                            <Dropdown.Item>
                                                                                <bdi className="d-flex align-items-center" onClick={() => handleShowdeletefaq(item._id)}>
                                                                                    <i className="bi bi-trash3" />
                                                                                    <span className="ms-2">Delete</span>
                                                                                </bdi>
                                                                            </Dropdown.Item>
                                                                        </li>
                                                                    </ul>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        }
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <p>
                                                        {item.answer}
                                                    </p>
                                                </Accordion.Body>

                                            </Accordion.Item>
                                        </div>
                                    )
                                })}
                            </Accordion>

                            {option1.totalRecord1 &&
                                <div className='d-flex align-items-center justify-content-center mt-3'>
                                    <div className="pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center">
                                        <ReactPaginate
                                            className="pagination"
                                            pageClassName="page-item"
                                            activeClassName="active"
                                            breakLabel="..."
                                            breakLinkClassName="page-link"
                                            breakClassName="page-item"
                                            previousLabel={
                                                <span aria-hidden="true">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="18px"
                                                        height="18px"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-chevron-left me-2"
                                                    >
                                                        <polyline points="15 18 9 12 15 6"></polyline>
                                                    </svg>
                                                </span>
                                            }
                                            previousClassName="page-item"
                                            nextLabel={
                                                <span aria-hidden="true">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="18px"
                                                        height="18px"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-chevron-right ms-2"
                                                    >
                                                        <polyline points="9 18 15 12 9 6"></polyline>
                                                    </svg>
                                                </span>
                                            }
                                            nextClassName="page-item"
                                            pageLinkClassName="page-link"
                                            pageRangeDisplayed={2}
                                            onPageActive={option1.page1}
                                            pageCount={option1.totalRecord1 / option1.sizePerPage1}
                                            renderOnZeroPageCount={null}
                                            onPageChange={(e) => handlePageClick1(e)}
                                            forcePage={0}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>



            <Offcanvas show={show} onHide={handleClose} placement="end" className="cust-modal header">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add FAQ</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='cust-body-question'>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                question: question,
                                answer: answer
                            }}
                            validationSchema={Yup.object({
                                question: Yup.string().required("question is required."),
                                answer: Yup.string().required("answer is required."),

                            })}
                            onSubmit={(formData, { resetForm }) => {
                                submitFormData(formData, resetForm);
                            }}
                        >
                            {(runform) => (
                                <form className="row mb-0" onSubmit={runform.handleSubmit} data-hs-cf-bound="true">
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className='lbl-frnt-side'>Questions
                                                {/* <OverlayTrigger
                                                    overlay={
                                                        <Tooltip id='my-tooltip-id'>
                                                            My tooltip
                                                        </Tooltip>
                                                    }
                                                >
                                                    <svg className='ms-2' width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.5">
                                                            <circle cx={8} cy={8} r="7.5" fill="#5D5F5E" />
                                                            <path d="M7 4.29668C7 3.99424 7.13647 3.76556 7.40941 3.61065C7.53481 3.53688 7.66759 3.5 7.80775 3.5C8.11757 3.5 8.34993 3.63647 8.50484 3.90941C8.57123 4.03481 8.60443 4.1639 8.60443 4.29668C8.60443 4.6065 8.46796 4.83887 8.19502 4.99378C8.06962 5.06017 7.94053 5.09336 7.80775 5.09336C7.49055 5.09336 7.2545 4.9532 7.09959 4.67289C7.0332 4.55486 7 4.42946 7 4.29668ZM7.07746 11.5V5.5249H8.56017V11.5H7.07746Z" fill="white" />
                                                        </g>
                                                    </svg>
                                                </OverlayTrigger> */}
                                            </label>
                                            <textarea className='form-control frnt-input-style h-auto' name="question" rows={5} placeholder="write Your questions" {...formAttr(runform, "question")}></textarea>
                                            {errorContainer(runform, "question")}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className='lbl-frnt-side'>Answers</label>
                                            <textarea className='form-control frnt-input-style h-auto' name="answer" rows={5} placeholder="write Your answer" {...formAttr(runform, "answer")}></textarea>
                                            {errorContainer(runform, "answer")}
                                        </div>
                                    </div>
                                    <div className="col-12 pt-4 text-center">
                                        <button type="submit" className="btn-comn-all w-100">
                                            <span className="position-relative">Save</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>

                </Offcanvas.Body>
            </Offcanvas>


            <Modal show={editshowfaq} onHide={handleClosefaq} centered contentClassName="deactive-alert-box likes-box">
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title><h1>Edit FAQ</h1></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            editquestion: editquestion,
                            editanswer: editanswer
                        }}
                        validationSchema={Yup.object({
                            editquestion: Yup.string().required("question is required."),
                            editanswer: Yup.string().required("answer is required."),

                        })}
                        onSubmit={(formData, { resetForm }) => {
                            edithandleSubmit(formData, resetForm);
                        }}
                    >
                        {(runform) => (
                            <form className="row mb-0" onSubmit={runform.handleSubmit} data-hs-cf-bound="true">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className='lbl-frnt-side'>Questions</label>
                                        <textarea className='form-control frnt-input-style h-auto' name="editquestion" rows={5} placeholder="write Your questions" {...formAttr(runform, "editquestion")}></textarea>
                                        {errorContainer(runform, "editquestion")}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className='lbl-frnt-side'>Answers</label>
                                        <textarea className='form-control frnt-input-style h-auto' name="editanswer" rows={5} placeholder="write Your answer" {...formAttr(runform, "editanswer")}></textarea>
                                        {errorContainer(runform, "editanswer")}
                                    </div>
                                </div>
                                <div className="col-12 pt-4 text-center">
                                    <button type="submit" className="btn-comn-all w-100">
                                        <span className="position-relative">Save</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>


            <Modal show={deleteshowfaq} onHide={handleClosedeletefaq} centered contentClassName="deactive-alert-box likes-box">
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="common-title-in text-center">
                        <h5>Delete FAQ</h5>
                        <p>Are you sure you want to Delete FAQ? <br />A Delete FAQ should not have access to the platform anymore.</p>
                    </div>
                    <Modal.Footer>
                        <div className="">
                            <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={handleClosedeletefaq}>
                                <span className="position-relative">NO</span>
                            </button>
                        </div>
                        <div className="ms">
                            <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={deletefaq}>
                                <span className="position-relative">YES</span>
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>

        </Layout>
    );
}

export default Faq;