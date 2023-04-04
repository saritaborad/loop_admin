import React, { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout/layout";
import { useNavigate } from "react-router-dom";
import { Dropdown, Modal } from "react-bootstrap";
import RtdDatatable from "../components/DataTable/RtdDatatable";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import Moment from "react-moment";
import toastr from "toastr";
import defaultImg from "../images/defaultImg.PNG";
import loaderimg from "../images/loader.gif";
import Context from "../contex/Context";
import defaultLoopImg from "../images/defaultLoopImg.png";

export default function User(params) {
  const context = useContext(Context);
  let navigate = useNavigate();
  const [data, setUser] = useState([]);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [userActionId, setUserActionId] = useState();
  const [deActiveModalShow, setDeActiveModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [userStatus, setUserStatus] = useState();
  const [loader, setLoader] = useState(true);

  const [option, set_option] = useState({
    sizePerPage: 10,
    search: "",
    totalRecord: "",
    page: 0,
    sort: "",
    order: "",
  });

  const isLogged_in = localStorage.getItem("loop_token") ? true : false;

  let userPermission = null;
  let loginUser = null;
  let userRole = "";
  let editUsers = "";
  let viewUsers = "";

  if (isLogged_in) {
    loginUser = JSON.parse(localStorage.getItem("userData"));
    userRole = loginUser?.role;
    if (userRole === 2) {
      userPermission = JSON.parse(localStorage.getItem("userPermission"));
      editUsers = userPermission?.editUsers;
      viewUsers = userPermission?.viewUsers;
    }
  }

  useEffect(() => {
    getUserList(option.sizePerPage, option.page, option.sort, option.order);
  }, []);

  const getUserList = (sizePerPage, page, sort, order) => {
    let data = {
      limit: sizePerPage,
      page: page + 1,
      sort: sort,
      order: order,
    };
    const getuserpromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.getuser, data));
    });
    getuserpromise.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        setUser(response.data.data.userList);
        set_option({
          sizePerPage: sizePerPage,
          search: "",
          totalRecord: response.data.data.totalUsers,
          page: page,
          sort: sort,
          order: order,
        });
      }
    });
  };

  const tableCallBack = (option) => {
    getUserList(option.sizePerPage, option.page, option.sort, option.order);
  };

  const userDetails = (e) => {
    navigate(`/user-detail`, { state: { id: e } });
  };

  const userDelete = (id) => {
    setUserActionId(id);
    setDeleteModalShow(true);
  };

  const deleteUser = () => {
    let data = {
      id: userActionId,
    };
    const userDeletePromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.deleteUser, data));
    });
    userDeletePromise.then((response) => {
      setLoader(false);
      if (response.status === 200) {
        setDeleteModalShow(false);
        getUserList(option.sizePerPage, option.page, option.sort, option.order);
        toastr.success(response.data.message);
      }
    });
  };

  const columns1 = [
    {
      name: "profile_img",
      label: "Image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          return value[data].profile_img === "" ? <img src={defaultLoopImg} className="user-tabl-image" alt="" /> : <img src={value[data].profile_img} className="user-tabl-image" alt="" />;
        },
      },
    },
    {
      value: "fname",
      label: "Name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      value: "label",
      label: "Label",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          return <span className="d-inline-block lbl-table-tag">App Users</span>;
        },
      },
    },
    {
      name: "interest",
      label: "Interests",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          if (value[data].interest.length !== 0) {
            var CSVOf_arr = value[data].interest
              .map((item) => {
                return item;
              })
              .join(",");
            return <span>{CSVOf_arr}</span>;
          } else {
            return <span>-</span>;
          }
        },
      },
    },
    {
      value: "DOB",
      label: "Birthdate",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          if (value[data].DOB !== undefined) {
            return <Moment date={value[data].DOB} format="DD/MM/YYYY" />;
          } else {
            return <span>-</span>;
          }
        },
      },
    },

    {
      value: "email",
      label: "Email",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, data, i) => {
          if (value[data].email !== undefined) {
            return <span>{value[data].email}</span>;
          } else {
            return <span>-</span>;
          }
        },
      },
    },
    // {
    //   value: "age",
    //   label: "Age",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (value, data, i) => {
    //       if (value[data].age !== undefined) {
    //         return <span>{value[data].age}</span>;
    //       } else {
    //         return <span>-</span>;
    //       }
    //     },
    //   },
    // },
    {
      value: "createdAt",
      label: "create Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          if (value[data].createdAt !== undefined) {
            return <Moment date={value[data].createdAt} format="DD/MM/YYYY" />;
          } else {
            return <span>-</span>;
          }
        },
      },
    },
    {
      value: "action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          return (
            <div className="cust-drop-down">
              <Dropdown drop="left">
                <Dropdown.Toggle className="cust-drop-btn" id="dropdown">
                  <i className="bi bi-three-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ul>
                    <li>
                      <Dropdown.Item onClick={() => userDetails(value[data]._id)}>User Details</Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item onClick={() => showDeActiveModal(value[data]._id, value[data].status)}>{value[data].status === 1 ? "Ban User" : "Activate User"}</Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item onClick={() => userDelete(value[data]._id)}>Delete User</Dropdown.Item>
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

  const columns2 = [
    {
      name: "profile_img",
      label: "Image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          return value[data].profile_img === "" ? <img src={defaultImg} className="user-tabl-image" alt="" /> : <img src={value[data].profile_img} className="user-tabl-image" alt="" />;
        },
      },
    },
    {
      value: "fname",
      label: "Name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      value: "label",
      label: "Label",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          return <span className="d-inline-block lbl-table-tag">App Users</span>;
        },
      },
    },
    {
      name: "interest",
      label: "Interests",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          if (value[data].interest.length !== 0) {
            var CSVOf_arr = value[data].interest
              .map((item) => {
                return item;
              })
              .join(",");
            return <span>{CSVOf_arr}</span>;
          } else {
            return <span>-</span>;
          }
        },
      },
    },
    {
      value: "DOB",
      label: "Birthdate",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, data, i) => {
          if (value[data].DOB !== undefined) {
            return <Moment date={value[data].DOB} format="DD/MM/YYYY" />;
          } else {
            return <span>-</span>;
          }
        },
      },
    },

    {
      value: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          if (value[data].email !== undefined) {
            return <span>{value[data].email}</span>;
          } else {
            return <span>-</span>;
          }
        },
      },
    },
    // {
    //   value: "age",
    //   label: "Age",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     customBodyRender: (value, data, i) => {
    //       if (value[data].age !== undefined) {
    //         return <span>{value[data].age}</span>;
    //       } else {
    //         return <span>-</span>;
    //       }
    //     },
    //   },
    // },
    {
      value: "createdAt",
      label: "create Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, data, i) => {
          if (value[data].createdAt !== undefined) {
            return <Moment date={value[data].createdAt} format="DD/MM/YYYY" />;
          } else {
            return <span>-</span>;
          }
        },
      },
    },
  ];


  const showDeActiveModal = (id, status) => {
    setSelectedUser(id);
    setUserStatus(status);
    setDeActiveModalShow(true);
  };

  const deActiveUser = () => {
    let data = {
      id: selectedUser,
    };
    const deActiveUserPromise = new Promise((resolve, reject) => {
      resolve(PostApi(API_Path.manageUserStatus, data));
    });
    deActiveUserPromise.then((response) => {
      if (response.status === 200) {
        setDeActiveModalShow(false);
        getUserList(option.sizePerPage, option.page, option.sort, option.order);
        toastr.success(response.data.message);
      }
    });
  };

  return (
    <Layout>
      {loader && (
        <div className="cust-loader">
          <img src={loaderimg} className="loader" />
        </div>
      )}
      <div className="content-main-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="comn-title-info">
                <h1>Users</h1>
              </div>
            </div>
            <div className="col-12">
              <div className="white-box-main p-0">{userRole === 1 || editUsers === 1 ? <RtdDatatable data={data} columns={columns1} option={option} tableCallBack={tableCallBack} /> : <RtdDatatable data={data} columns={columns2} option={option} tableCallBack={tableCallBack} />}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deActiveModalShow} onHide={() => setDeActiveModalShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="common-title-in text-center">
            {userStatus === 1 ? (
              <>
                <h5>Deactivate An User</h5>
                <p>Are you sure you want to Deactivate this user? A deactivated user should not have access to the platform anymore.</p>
              </>
            ) : (
              <>
                <h5>Activate An User</h5>
                <p>Are you sure you want to Activate this user?</p>
              </>
            )}
          </div>
          <Modal.Footer>
            <div className="">
              <button type="button" className="btn-comn-all-2 px-sm-5 px-4 w-100" onClick={() => setDeActiveModalShow(false)}>
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

      <Modal size="md" aria-labelledby="contained-modal-title-vcenter" contentClassName="deactive-alert-box" centered show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
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
              <button type="submit" className="btn-comn-all px-sm-5 px-4 w-100" onClick={() => deleteUser()}>
                <span className="position-relative">YES</span>
              </button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
