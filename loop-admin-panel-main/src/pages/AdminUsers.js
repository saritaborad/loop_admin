import React, { useState, useEffect } from "react";
import RtdDatatable from "../components/DataTable/RtdDatatable";
import { Dropdown, Modal } from "react-bootstrap";
import AddEmployee from "./add-employee";
import { API_Path } from "./../const";
import { PostApi } from "./../ApiService";
import EditEmployee from "./edit-employee";
import EmployeeDetail from "./employee-detail";
import Moment from "react-moment";
import defaultLoopImg from "../images/defaultLoopImg.png";

function AdminUsers() {
  const [adminUserData, setAdminUserData] = useState([]);
  const [add, setAdd] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [dataId, setDataId] = useState({});
  const [userActionId, setUserActionId] = useState();
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: "",
    page: 0,
    sort: "email",
    order: "ASC",
  });

  const handleCloseAdd = () => {
    setAdd(false);
  };

  const handleCloseEdit = () => {
    setEditModal(false);
  };

  const handleCloseViewDetails = () => {
    setViewDetailsModal(false);
  };

  useEffect(() => {
    getAdminUser(option.sizePerPage, option.page, option.sort, option.order);
  }, []);

  const columns = [
    {
      value: "profile_img",
      label: "Image",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (data, i) => {
          return data[i].profile_img === "" ? <img src={defaultLoopImg} className="user-tabl-image" alt="" /> : <img src={data[i].profile_img} className="user-tabl-image" alt="" />;
        },
      },
    },
    {
      value: "fname",
      label: "Employees Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (data, i) => {
          return (
            <span>
              {data[i].fname} {data[i].lname}
            </span>
          );
        },
      },
    },
    {
      value: "email",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      value: "dob",
      label: "Date Of Birth",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          if (data[i].DOB !== undefined) {
            return <Moment date={data[i].DOB} format="DD/MM/YYYY" />;
          } else {
            return <span>-</span>;
          }
        },
      },
    },
    {
      value: "access",
      label: "Access",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          return (
            <bdi className="d-block" key={data[i]._id}>
              <div className="custom-switch-toggle-menu">
                <label className="switch">
                  <input type="checkbox" name="status" id={"chk_"} defaultChecked={data[i].status == 2 ? false : true} onChange={() => statusChange(data[i])} />

                  <span className="slider round"></span>
                  <bdi className="active-info-switch">Enable</bdi>
                  <bdi className="inactive-info-switch">Disable</bdi>
                </label>
              </div>
            </bdi>
          );
        },
      },
    },
    {
      value: "_id",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data, i) => {
          return (
            <div className="cust-drop-down">
              <Dropdown drop="left">
                <Dropdown.Toggle className="cust-drop-btn" id="dropdown">
                  <i className="bi bi-three-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ul>
                    <li>
                      <Dropdown.Item
                        onClick={() => {
                          redirectToViewEmployee(data, i);
                        }}
                      >
                        View Detail
                      </Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item onClick={() => employeeDelete(data[i]._id)}>Delete Employee</Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item
                        onClick={() => {
                          redirectToEditEmployee(data, i);
                        }}
                      >
                        Edit Employee
                      </Dropdown.Item>
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        },
      },
    },
  ];

  const getAdminUser = (sizePerPage, page, sort, order) => {
    let data = {
      limit: sizePerPage,
      page: page + 1,
      sort: sort,
      order: order,
    };
    const getAdminUserpromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getAdminUsers, data));
    });
    getAdminUserpromise.then((response) => {
      if (response.status === 200) {
        setAdminUserData(response.data.data?.userList);
        set_option({
          sizePerPage: sizePerPage,
          search: "",
          totalRecord: response.data?.data?.totalUsers,
          page: page,
          sort: sort,
          order: order,
        });
      }
    });
  };

  const tableCallBack = (option) => {
    getAdminUser(option.sizePerPage, option.page, option.sort, option.order);
  };

  const updateStatus = (id) => {
    let idData = {
      id: id,
    };

    const enabledDisabledEmployeDataPromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.enabledDisabledEmployee, idData));
    });
    enabledDisabledEmployeDataPromise.then((response) => {
      if (response.status === 200) {
        getAdminUser(option.sizePerPage, option.page, option.sort, option.order);
      }
    });
  };

  const statusChange = (data) => {
    updateStatus(data._id);
  };

  const redirectToEditEmployee = (data, i) => {
    if (data[i]?._id) {
      setDataId(data[i]._id);
      setEditModal(true);
    }
  };

  const redirectToViewEmployee = (data, i) => {
    if (data[i]?._id) {
      setDataId(data[i]._id);
      setViewDetailsModal(true);
    }
  };

  const employeeDelete = (id) => {
    setUserActionId(id);
    setDeleteModalShow(true);
  };

  const deleteemployee = () => {
    let data = {
      id: userActionId,
    };
    const employeeDeletePromise = new Promise((resolve) => {
      resolve(PostApi(API_Path.deleteEmployee, data));
    });
    employeeDeletePromise.then((response) => {
      if (response.status === 200) {
        setDeleteModalShow(false);
        getAdminUser(option.sizePerPage, option.page, option.sort, option.order);
      }
    });
  };

  return (
    <>
      <div className="tabs-content-part white-box-main">
        <div className="d-sm-flex d-block align-items-center">
          <div className="comn-title-info">
            <h2>Employees</h2>
          </div>
          <div className="ms-auto">
            <button type="button" className="btn-comn-all w-100">
              <span className="position-relative" onClick={() => setAdd(true)}>
                add Employees
              </span>
            </button>
          </div>
        </div>
        <RtdDatatable data={adminUserData} columns={columns} option={option} tableCallBack={tableCallBack} />
      </div>

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

      {add ? <AddEmployee show={true} onHide={handleCloseAdd} update={() => getAdminUser(option.sizePerPage, option.page, option.sort, option.order)} /> : null}
      {editModal ? <EditEmployee show={true} onHide={handleCloseEdit} data_function={dataId} update={() => getAdminUser(option.sizePerPage, option.page, option.sort, option.order)} /> : null}
      {viewDetailsModal ? <EmployeeDetail show={true} onHide={handleCloseViewDetails} data_function={dataId} update={() => getAdminUser(option.sizePerPage, option.page, option.sort, option.order)} /> : null}
    </>
  );
}

export default AdminUsers;
