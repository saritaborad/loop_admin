import React from "react";
import Layout from "../components/Layout/layout";
import Facebook from "../images/fb-icon.svg";
import Google from "../images/google-icon.svg";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import Moment from "react-moment";
import defaultImg from "../images/defaultImg.PNG";

function EmployeeDetail(props) {
  const [modalShow, setModalShow] = useState(false);
  const [userActionId, setUserActionId] = useState();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [fname, setFirstname] = useState("");
  const [lname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [address, setAddress] = useState("");
  const [profile, setprofile] = useState("");
  const [access, setAccess] = useState("");
  const [DOB, setDOB] = useState("");

  useEffect(() => {
    const editEmployeepromise = new Promise((resolve, reject) => {
      let editEmployeeId = {
        id: props.data_function,
      };
      resolve(PostApi(API_Path.getByIdEmployeeDetails, editEmployeeId));
    });
    editEmployeepromise.then((response) => {
      if (response.status === 200) {
        setprofile(response.data.data.employee.profile_img);
        setFirstname(response.data.data.employee.fname);
        setLastname(response.data.data.employee.lname);
        setEmail(response.data.data.employee.email);
        setContact_no(response.data.data.employee.contact_no);
        setDOB(response.data.data.employee.DOB);
        setAddress(response.data.data.employee.address);
        setAccess(response.data.data.permission.accessEnabled);

        if (response.data.data.permission.accessEnabled === 0) {
          document.getElementById("_access").checked = false;
        } else {
          document.getElementById("_access").checked = true;
        }
      }
    });
  }, []);

  const employeeDelete = (id) => {
    setUserActionId(id);
    setDeleteModalShow(true);
  };

  const deleteemployee = () => {
    let data = {
      id: userActionId,
    };
    const employeeDeletePromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.deleteEmployee, data));
    });
    employeeDeletePromise.then((response) => {
      if (response.status === 200) {
        setDeleteModalShow(false);
        props.onHide();
        props.update();
      }
    });
  };

  return (
    <Layout>
      <Modal show={props.show} onHide={props.onHide} size="lg" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" backdrop="static" centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>
            <h1> Employee</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <div className="white-box-main">
                <div className="white-bx-hdr">View Details</div>
                <div className="dtels-info-main">
                  <div className="dtels-info-imgs me-md-5">{profile === "" ? <img src={defaultImg} className="w-100 h-100" alt="" /> : <img src={profile} className="w-100 h-100" alt="" />}</div>
                  <div className="dtels-info-text w-100">
                    <div className="dtels-info-text-inr">
                      <p className="d-block">First Name</p>
                      <bdi className="d-block">: {fname} </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Last Name</p>
                      <bdi className="d-block">: {lname} </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Email Address</p>
                      <bdi className="d-block">: {email}</bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Date</p>
                      <bdi className="d-block">
                        : <Moment date={DOB} format="DD/MM/YYYY" />{" "}
                      </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Phone</p>
                      <bdi className="d-block">: {contact_no} </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Location</p>
                      <bdi className="d-block">: {address} </bdi>
                    </div>
                    {/* <div className="dtels-info-text-inr">
                      <p className="d-block">Status</p>
                      <bdi className="d-block">
                        <div className="custom-switch-toggle-menu">
                          <label className="switch">
                            <input type="checkbox" name="status" onClick={() => setModalShow(true)} defaultChecked disabled />
                            <span className="slider round"></span>
                            <bdi className="active-info-switch">Active</bdi>
                            <bdi className="inactive-info-switch">disable</bdi>
                          </label>
                        </div>
                      </bdi>
                    </div> */}
                    <div className="dtels-info-text-inr">
                      <bdi className="d-block">
                        <div className="custom-switch-toggle-menu">
                          <label className="switch">
                            <input type="checkbox" name="status" id="_access" value={access} disabled />
                            <span className="slider round"></span>
                            <bdi className="active-info-switch">Enable Employee Access</bdi>
                            <bdi className="inactive-info-switch">Disable Employee Access</bdi>
                          </label>
                        </div>
                      </bdi>
                    </div>
                    {/* <div>
                      <div className="white-bx-hdr border-0 pb-0">Social Media Account</div>
                      <div className="bdr-acc-info d-flex align-items-center">
                        <img src={Facebook} alt="" />
                        <span className="ms-auto text-end">Monica Sayra</span>
                      </div>
                      <div className="bdr-acc-info mt-3 d-flex align-items-center">
                        <img src={Google} alt="" />
                        <span className="ms-auto text-end">monicasayra@gmail.com</span>
                      </div>
                    </div> */}
                    <div className="mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-sm-6 mb-2">
                              <button type="submit" className="btn-red-class w-100" onClick={() => employeeDelete(props.data_function)}>
                                <span className="position-relative">Delete</span>
                              </button>
                            </div>

                            <div className="col-sm-6 mb-2">
                              <button type="button" className="btn-comn-all w-100" onClick={props.onHide}>
                                <span className="position-relative">close</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={modalShow} onHide={() => setModalShow(false)}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <div className="common-title-in text-center">
                <h5>deactivate an employee</h5>
                <p>Are you sure you want to Deactivate this employee? A deactivated employee should not have access to the platform anymore.</p>
              </div>
              <Modal.Footer>
                <div className="">
                  <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100">
                    <span className="position-relative">NO</span>
                  </button>
                </div>
                <div className="ms">
                  <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100">
                    <span className="position-relative">YES</span>
                  </button>
                </div>
              </Modal.Footer>
            </Modal.Body>
          </Modal>

          <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <div className="common-title-in text-center">
                <h5>Delete Employee</h5>
                <p>Are you sure you want to delete this Employee? A deleted employee should not have access to the platform anymore.</p>
              </div>
              <Modal.Footer>
                <div className="">
                  <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setDeleteModalShow(false)}>
                    <span className="position-relative">NO</span>
                  </button>
                </div>
                <div className="ms">
                  <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={() => deleteemployee()}>
                    <span className="position-relative">YES</span>
                  </button>
                </div>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default EmployeeDetail;
