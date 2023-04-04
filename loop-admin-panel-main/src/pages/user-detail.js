import React, { useEffect } from "react";
import Layout from "../components/Layout/layout";
import Facebook from "../images/fb-icon.svg";
import Google from "../images/google-icon.svg";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Back from "../images/back_arw.svg";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import Moment from "react-moment";
import toastr from "toastr";
import { withRouter } from "../Navigate";
import defaultImg from "../images/defaultImg.PNG";
import loaderimg from "../images/loader.gif"

function UserDetail(props) {
  let location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [userdetails, Setuserdetails] = useState([]);
  const [deletemodalshow, setDeleteModalShow] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getuserdetails();
  }, []);
  const getuserdetails = () => {
    let data = {
      id: location.state.id,
    };
    const getuserdetailspromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getuserdetails, data));
    });
    getuserdetailspromise.then((response) => {
      setLoader(false)
      if (response.status === 200) {
        Setuserdetails(response.data.data);
      }
    });
  };

  const deActiveUser = () => {
    let data = {
      id: location.state.id,
    };
    const userstatuspromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.manageUserStatus, data));
    });
    userstatuspromise.then((response) => {
      if (response.status === 200) {
        setModalShow(false);
        getuserdetails();
        toastr.success(response.data.message);
      }
    });
  };

  const useractive = (e) => {
    if (e.target.checked) {
      deActiveUser();
    }
  };

  const deleteuser = () => {
    let data = {
      id: location.state.id,
    };

    const userdeletepromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.deleteUser, data));
    });
    userdeletepromise.then((response) => {
      setLoader(false)
      if (response.status === 200) {
        props.navigate("/user");
        toastr.success(response.data.message);
      }
    });
  };

  return (
    <Layout>
      {loader &&
        <div className='cust-loader'>
          <img src={loaderimg} className="loader" />
        </div>
      }
      <div className="content-main-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="comn-title-info d-flex align-items-center">
                <Link to="/user">
                  <img src={Back} alt="" className="me-2" />
                </Link>
                <h1>User Details</h1>
              </div>
            </div>
            <div className="col-12">
              <div className="white-box-main">
                <div className="white-bx-hdr">View Details</div>
                <div className="dtels-info-main">
                  <div className="dtels-info-imgs me-md-5">{userdetails.profile_img === "" ? <img src={defaultImg} className="w-100 h-100" alt="" /> : <img src={userdetails.profile_img} className="w-100 h-100" alt="" />}</div>
                  <div className="dtels-info-text w-100">
                    <div className="dtels-info-text-inr">
                      <p className="d-block">First Name</p>
                      <bdi className="d-block">: {userdetails.fname} </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Last Name</p>
                      <bdi className="d-block">: {userdetails.lname} </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Birthdate</p>
                      <bdi className="d-block">
                        : {userdetails.DOB ? <Moment date={userdetails.DOB} format="DD/MM/YYYY" /> : null }
                      </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Age</p>
                      <bdi className="d-block">: {userdetails.age}</bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Parish </p>
                      <bdi className="d-block">: {userdetails.parish}</bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Email Address</p>
                      <bdi className="d-block">: {userdetails.email}</bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Phone</p>
                      <bdi className="d-block">: {userdetails.contact_no}</bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Location</p>
                      <bdi className="d-block">: {userdetails.address} </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Interests</p>
                      <bdi className="d-block">
                        : 
                          {userdetails.interest &&
                          userdetails.interest
                            .map((item, i) => {
                              return item;
                            })
                            .join(",")}
                      </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Status</p>
                      <bdi className="d-block">
                        <div className="custom-switch-toggle-menu">
                          <label className="switch">
                            <input type="checkbox" name="status" onChange={(e) => useractive(e)} onClick={() => (userdetails.status === 1 ? setModalShow(true) : setModalShow(false))} checked={userdetails.status === 1 ? true : false} />
                            <span className="slider round"></span>
                            <bdi className="active-info-switch">Active</bdi>
                            <bdi className="inactive-info-switch">disable</bdi>
                          </label>
                        </div>
                      </bdi>
                    </div>
                    <div className="dtels-info-text-inr">
                      <p className="d-block">Label</p>
                      <bdi className="d-block">
                        <span className="d-inline-block lbl-table-tag">App Users</span>
                      </bdi>
                    </div>
                    <div className="mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-sm-6 mb-2">
                              <button type="submit" className="btn-red-class w-100" onClick={() => setDeleteModalShow(true)}>
                                <span className="position-relative">Delete</span>
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
        </div>
      </div>

      <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="common-title-in text-center">
            <h5>Deactivate An User</h5>
            <p>Are you sure you want to Deactivate this user? A deactivated user should not have access to the platform anymore.</p>
          </div>
          <Modal.Footer>
            <div className="">
              <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setModalShow(false)}>
                <span className="position-relative">NO</span>
              </button>
            </div>
            <div className="ms">
              <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={(e) => deActiveUser()}>
                <span className="position-relative">YES</span>
              </button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deletemodalshow} onHide={() => setDeleteModalShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="common-title-in text-center">
            <h5>Delete User</h5>
            <p>Are you sure you want to delete this user? A deleted user should not have access to the platform anymore.</p>
          </div>
          <Modal.Footer>
            <div className="">
              <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setDeleteModalShow(false)}>
                <span className="position-relative">NO</span>
              </button>
            </div>
            <div className="ms">
              <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={() => deleteuser()}>
                <span className="position-relative">YES</span>
              </button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default withRouter(UserDetail);
