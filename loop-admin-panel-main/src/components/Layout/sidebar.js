import { Accordion } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.svg";
import React, { useContext, Component, useEffect } from "react";
import { withRouter } from "../../Navigate";
import Context from "../../contex/Context";

function Sidebar(props) {
  const context = useContext(Context);
  const navigate = useNavigate();

  const sidebar_change = (name) => {
    if (name) {
      navigate("/" + name);
      document.getElementById("root").classList.remove("dash-main-class-add");
    }
  };

  const urlName = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);

  const [show, setShow] = React.useState(false);
  const [sub_show, setSubShow] = React.useState(false);

  const logout = () => {
    localStorage.clear();
    props.navigate("/");
  };

  const isLogged_in = localStorage.getItem("loop_token") ? true : false;

  let userPermission = null;
  let loginUser = null;
  let userRole = "";

  if (isLogged_in) {
    loginUser = JSON.parse(localStorage.getItem("userData"));

    userRole = loginUser?.role;
    if (userRole === 2) {
      userPermission = JSON.parse(localStorage.getItem("userPermission"));
    }
  }

  return (
    <>
      <div className="sidebar-main-section">
        <div className="brand-title justify-content-center">
          {userRole === 1 ? (
            <Link to="/dashboard" className="d-inline-flex align-items-center cursor-pointer justify-content-center">
              <img src={Logo} className="img-fluid" alt="logo" />
            </Link>
          ) : (
            <Link to="/news-feed" className="d-inline-flex align-items-center cursor-pointer justify-content-center">
              <img src={Logo} className="img-fluid" alt="logo" />
            </Link>
          )}
        </div>
        <div className="sidebar-main-section-inner pt-xl-3">
          <div className="sidebar-main-inner-menu">
            <div className="sidebar-main-inner-list">
              <ul>
                {userRole === 1 ? (
                  <li
                    onClick={() => {
                      sidebar_change("dashboard");
                    }}
                  >
                    <bdi className={urlName === "dashboard" ? "active" : ""}>
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 18.5V7.63205L10 2.83205L2 7.63205V18.5H6V15.7501C6 14.6892 6.42143 13.6718 7.17157 12.9216C7.92172 12.1715 8.93913 11.7501 10 11.7501C11.0609 11.7501 12.0783 12.1715 12.8284 12.9216C13.5786 13.6718 14 14.6892 14 15.7501V18.5H18ZM12 20.5V15.7501C12 15.2196 11.7893 14.7109 11.4142 14.3358C11.0391 13.9608 10.5304 13.7501 10 13.7501C9.46957 13.7501 8.96086 13.9608 8.58579 14.3358C8.21071 14.7109 8 15.2196 8 15.7501V20.5H2C1.46957 20.5 0.960859 20.2893 0.585786 19.9143C0.210714 19.5392 0 19.0305 0 18.5V7.63205C-3.32274e-06 7.28668 0.0894306 6.94719 0.259593 6.64665C0.429755 6.3461 0.674847 6.09474 0.971 5.91705L8.971 1.11705C9.28183 0.930549 9.63751 0.832031 10 0.832031C10.3625 0.832031 10.7182 0.930549 11.029 1.11705L19.029 5.91705C19.3252 6.09474 19.5702 6.3461 19.7404 6.64665C19.9106 6.94719 20 7.28668 20 7.63205V18.5C20 19.0305 19.7893 19.5392 19.4142 19.9143C19.0391 20.2893 18.5304 20.5 18 20.5H12Z" fill="white" />
                      </svg>
                      <span>Dashboard</span>
                    </bdi>
                  </li>
                ) : (
                  ""
                )}

                <li>
                  <div className="d-flex align-items-center">
                    <bdi
                      onClick={() => {
                        sidebar_change("news-feed");
                      }}
                      className={urlName === "news-feed" || urlName === "add-post" || urlName === "queued-post" || urlName === "drafted-post" ? "active" : ""}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H5C5.53043 1 6.03914 1.21071 6.41421 1.58579C6.78929 1.96086 7 2.46957 7 3V5C7 5.53043 6.78929 6.03914 6.41421 6.41421C6.03914 6.78929 5.53043 7 5 7H3C2.46957 7 1.96086 6.78929 1.58579 6.41421C1.21071 6.03914 1 5.53043 1 5V3ZM11 3C11 2.46957 11.2107 1.96086 11.5858 1.58579C11.9609 1.21071 12.4696 1 13 1H15C15.5304 1 16.0391 1.21071 16.4142 1.58579C16.7893 1.96086 17 2.46957 17 3V5C17 5.53043 16.7893 6.03914 16.4142 6.41421C16.0391 6.78929 15.5304 7 15 7H13C12.4696 7 11.9609 6.78929 11.5858 6.41421C11.2107 6.03914 11 5.53043 11 5V3ZM1 13C1 12.4696 1.21071 11.9609 1.58579 11.5858C1.96086 11.2107 2.46957 11 3 11H5C5.53043 11 6.03914 11.2107 6.41421 11.5858C6.78929 11.9609 7 12.4696 7 13V15C7 15.5304 6.78929 16.0391 6.41421 16.4142C6.03914 16.7893 5.53043 17 5 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15V13ZM11 13C11 12.4696 11.2107 11.9609 11.5858 11.5858C11.9609 11.2107 12.4696 11 13 11H15C15.5304 11 16.0391 11.2107 16.4142 11.5858C16.7893 11.9609 17 12.4696 17 13V15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17H13C12.4696 17 11.9609 16.7893 11.5858 16.4142C11.2107 16.0391 11 15.5304 11 15V13Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Newsfeed</span>
                    </bdi>
                    {userRole === 1 || userPermission?.allowToPostToNewsFeed === 1 ?
                    <div className="ms-auto me-2" onClick={() => setShow(!show)}>
                      <i className="bi bi-caret-right-fill chevron-color" />
                    </div> : ""}

                  </div>

                  {userRole === 1 || userPermission?.allowToPostToNewsFeed === 1 ?
                  (show || urlName === "add-post" || urlName === "queued-post" || urlName === "drafted-post" ? (
                    <ul className="custom-accordian-sidebar">
                      <li
                        onClick={() => {
                          sidebar_change("add-post");
                        }}
                      >
                        <bdi className={urlName === "add-post" ? "active" : ""}>
                          <span>Add A Post</span>
                        </bdi>
                      </li>
                      <li
                        onClick={() => {
                          sidebar_change("queued-post");
                        }}
                      >
                        <bdi className={urlName === "queued-post" ? "active" : ""}>
                          <span>Queued Posts</span>
                        </bdi>
                      </li>
                      <li
                        onClick={() => {
                          sidebar_change("drafted-post");
                        }}
                      >
                        <bdi className={urlName === "drafted-post" ? "active" : ""}>
                          <span>Drafted Posts</span>
                        </bdi>
                      </li>
                    </ul>
                  ) : (
                    ""
                  ))
                  :
                  "" }
                     

                </li>

                <li></li>

                {userRole === 1 || userPermission?.viewUsers === 1 ? (
                  <li
                    onClick={() => {
                      sidebar_change("user");
                    }}
                  >
                    <bdi className={urlName === "user" ? "active" : ""}>
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.1212 15.8969C16.679 14.8496 16.0374 13.8984 15.2321 13.0961C14.4292 12.2915 13.4781 11.65 12.4313 11.207C12.4219 11.2023 12.4126 11.2 12.4032 11.1953C13.8633 10.1406 14.8126 8.42266 14.8126 6.48438C14.8126 3.27344 12.211 0.671875 9.00006 0.671875C5.78912 0.671875 3.18756 3.27344 3.18756 6.48438C3.18756 8.42266 4.13678 10.1406 5.59693 11.1977C5.58756 11.2023 5.57819 11.2047 5.56881 11.2094C4.51881 11.6523 3.57662 12.2875 2.76803 13.0984C1.96344 13.9013 1.32194 14.8524 0.878965 15.8992C0.443783 16.924 0.209079 18.0228 0.187559 19.1359C0.186933 19.161 0.191321 19.1858 0.200463 19.2091C0.209605 19.2324 0.223317 19.2537 0.240791 19.2716C0.258264 19.2895 0.279146 19.3037 0.302206 19.3134C0.325265 19.3231 0.350036 19.3281 0.375059 19.3281H1.78131C1.88443 19.3281 1.96647 19.2461 1.96881 19.1453C2.01568 17.3359 2.74225 15.6414 4.02662 14.357C5.35553 13.0281 7.12037 12.2969 9.00006 12.2969C10.8797 12.2969 12.6446 13.0281 13.9735 14.357C15.2579 15.6414 15.9844 17.3359 16.0313 19.1453C16.0337 19.2484 16.1157 19.3281 16.2188 19.3281H17.6251C17.6501 19.3281 17.6749 19.3231 17.6979 19.3134C17.721 19.3037 17.7419 19.2895 17.7593 19.2716C17.7768 19.2537 17.7905 19.2324 17.7997 19.2091C17.8088 19.1858 17.8132 19.161 17.8126 19.1359C17.7891 18.0156 17.5571 16.9258 17.1212 15.8969ZM9.00006 10.5156C7.92428 10.5156 6.91178 10.0961 6.15006 9.33438C5.38834 8.57266 4.96881 7.56016 4.96881 6.48438C4.96881 5.40859 5.38834 4.39609 6.15006 3.63437C6.91178 2.87266 7.92428 2.45312 9.00006 2.45312C10.0758 2.45312 11.0883 2.87266 11.8501 3.63437C12.6118 4.39609 13.0313 5.40859 13.0313 6.48438C13.0313 7.56016 12.6118 8.57266 11.8501 9.33438C11.0883 10.0961 10.0758 10.5156 9.00006 10.5156Z" fill="#fff" />
                      </svg>
                      <span>Users</span>
                    </bdi>
                  </li>
                ) : (
                  ""
                )}

                {userRole === 1 || userPermission?.viewSubmissions === 1 ? (
                  <li
                    onClick={() => {
                      sidebar_change("");
                    }}
                  >
                    <div className="d-flex align-items-center" onClick={() => setSubShow(!sub_show)}>
                      <bdi className={urlName === "prayer-request" || urlName === "suggested-content" || urlName === "submitted-tips-by-users" ? "active" : ""}>
                        <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.5 1.625C1.5 1.39294 1.59219 1.17038 1.75628 1.00628C1.92038 0.842187 2.14294 0.75 2.375 0.75H11.125L15.5 5.125V17.375C15.5 17.6071 15.4078 17.8296 15.2437 17.9937C15.0796 18.1578 14.8571 18.25 14.625 18.25H2.375C2.14294 18.25 1.92038 18.1578 1.75628 17.9937C1.59219 17.8296 1.5 17.6071 1.5 17.375V1.625Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                          <path d="M5 7.75H12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5 11.25H12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Submissions</span>
                      </bdi>
                      <div className="ms-auto me-2">
                        <i className="bi bi-caret-right-fill chevron-color" />
                      </div>
                    </div>
                    {sub_show || urlName === "prayer-request" || urlName === "suggested-content" || urlName === "submitted-tips-by-users" ? (
                      <ul className="custom-accordian-sidebar">
                        <li
                          onClick={() => {
                            sidebar_change("prayer-request");
                          }}
                        >
                          <bdi className={urlName === "prayer-request" ? "active" : ""}>
                            <span>Prayer Requests</span>
                          </bdi>
                        </li>
                        <li
                          onClick={() => {
                            sidebar_change("suggested-content");
                          }}
                        >
                          <bdi className={urlName === "suggested-content" ? "active" : ""}>
                            <span>Suggested Content</span>
                          </bdi>
                        </li>
                        <li
                          onClick={() => {
                            sidebar_change("submitted-tips-by-users");
                          }}
                        >
                          <bdi className={urlName === "submitted-tips-by-users" ? "active" : ""}>
                            <span>Submitted Tips By Users</span>
                          </bdi>
                        </li>
                      </ul>
                    ) : (
                      ""
                    )}
                  </li>
                ) : (
                  ""
                )}

                {/* <li
                                    onClick={() => {
                                        sidebar_change("advertising");
                                    }}
                                >
                                    <bdi className={urlName === "advertising" ? "active" : ""}>
                                        <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.5 1.625C1.5 1.39294 1.59219 1.17038 1.75628 1.00628C1.92038 0.842187 2.14294 0.75 2.375 0.75H11.125L15.5 5.125V17.375C15.5 17.6071 15.4078 17.8296 15.2437 17.9937C15.0796 18.1578 14.8571 18.25 14.625 18.25H2.375C2.14294 18.25 1.92038 18.1578 1.75628 17.9937C1.59219 17.8296 1.5 17.6071 1.5 17.375V1.625Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                                            <path d="M5 7.75H12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5 11.25H12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>Advertising</span>
                                    </bdi>
                 
                                </li> */}

                {userRole === 1 || userPermission?.viewActivityLog === 1 || userPermission?.viewSystemStatus === 1 ? (
                  <li
                    onClick={() => {
                      sidebar_change("settings");
                    }}
                  >
                    <bdi className={urlName === "settings" ? "active" : ""}>
                      <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.675 13.6645L18.1398 12.352C18.2125 11.9067 18.25 11.452 18.25 10.9973C18.25 10.5426 18.2125 10.0879 18.1398 9.64259L19.675 8.33009C19.7908 8.23096 19.8736 8.09894 19.9126 7.95157C19.9515 7.8042 19.9447 7.64847 19.893 7.50509L19.8719 7.44415C19.4492 6.26296 18.8164 5.16798 18.0039 4.21211L17.9617 4.16289C17.8631 4.047 17.7318 3.96369 17.5849 3.92394C17.4381 3.8842 17.2826 3.88988 17.139 3.94024L15.2336 4.61758C14.5305 4.04102 13.7453 3.58633 12.8969 3.26758L12.5289 1.27539C12.5011 1.12549 12.4284 0.987584 12.3204 0.879995C12.2124 0.772406 12.0742 0.700227 11.9242 0.673047L11.8609 0.661328C10.6398 0.441016 9.35546 0.441016 8.13436 0.661328L8.07108 0.673047C7.92108 0.700227 7.78289 0.772406 7.67488 0.879995C7.56687 0.987584 7.49416 1.12549 7.4664 1.27539L7.09608 3.27696C6.25442 3.59577 5.47062 4.05022 4.77577 4.62227L2.85624 3.94024C2.71272 3.88948 2.55716 3.88359 2.41021 3.92336C2.26327 3.96313 2.13191 4.04668 2.03359 4.16289L1.9914 4.21211C1.17987 5.16866 0.547123 6.26345 0.12343 7.44415L0.102336 7.50509C-0.00313247 7.79806 0.0835863 8.12618 0.320305 8.33009L1.87421 9.65665C1.80155 10.0973 1.7664 10.5473 1.7664 10.9949C1.7664 11.4449 1.80155 11.8949 1.87421 12.3332L0.320305 13.6598C0.204514 13.7589 0.12164 13.8909 0.082705 14.0383C0.0437695 14.1857 0.0506167 14.3414 0.102336 14.4848L0.12343 14.5457C0.547649 15.727 1.17577 16.8168 1.9914 17.7778L2.03359 17.827C2.13215 17.9429 2.26352 18.0262 2.41037 18.0659C2.55723 18.1057 2.71268 18.1 2.85624 18.0496L4.77577 17.3676C5.47421 17.9418 6.25468 18.3965 7.09608 18.7129L7.4664 20.7145C7.49416 20.8644 7.56687 21.0023 7.67488 21.1099C7.78289 21.2175 7.92108 21.2896 8.07108 21.3168L8.13436 21.3285C9.36668 21.55 10.6286 21.55 11.8609 21.3285L11.9242 21.3168C12.0742 21.2896 12.2124 21.2175 12.3204 21.1099C12.4284 21.0023 12.5011 20.8644 12.5289 20.7145L12.8969 18.7223C13.745 18.4044 14.5345 17.9482 15.2336 17.3723L17.139 18.0496C17.2826 18.1004 17.4381 18.1063 17.5851 18.0665C17.732 18.0267 17.8634 17.9432 17.9617 17.827L18.0039 17.7778C18.8195 16.8145 19.4476 15.727 19.8719 14.5457L19.893 14.4848C19.9984 14.1965 19.9117 13.8684 19.675 13.6645ZM16.4758 9.91915C16.5344 10.2731 16.5648 10.6363 16.5648 10.9996C16.5648 11.3629 16.5344 11.7262 16.4758 12.0801L16.3211 13.0199L18.0719 14.5176C17.8064 15.1291 17.4714 15.7079 17.0734 16.2426L14.8984 15.4715L14.1625 16.0762C13.6023 16.5356 12.9789 16.8965 12.3039 17.1496L11.4109 17.4848L10.9914 19.7582C10.3294 19.8332 9.66115 19.8332 8.99921 19.7582L8.57968 17.4801L7.69374 17.1403C7.02577 16.8871 6.40468 16.5262 5.84921 16.0692L5.11327 15.4621L2.92421 16.2403C2.52577 15.7035 2.19296 15.1246 1.92577 14.5153L3.6953 13.0035L3.54296 12.066C3.48671 11.7168 3.45624 11.3559 3.45624 10.9996C3.45624 10.641 3.48437 10.2824 3.54296 9.93321L3.6953 8.99571L1.92577 7.48399C2.19062 6.87227 2.52577 6.29571 2.92421 5.75899L5.11327 6.53712L5.84921 5.93008C6.40468 5.47305 7.02577 5.11211 7.69374 4.85899L8.58202 4.52383L9.00155 2.24571C9.66014 2.17071 10.3328 2.17071 10.9937 2.24571L11.4133 4.51915L12.3062 4.8543C12.9789 5.10743 13.6047 5.46837 14.1648 5.92774L14.9008 6.53243L17.0758 5.76133C17.4742 6.29805 17.807 6.87696 18.0742 7.48634L16.3234 8.98399L16.4758 9.91915ZM9.99999 6.64024C7.72186 6.64024 5.87499 8.48712 5.87499 10.7652C5.87499 13.0434 7.72186 14.8903 9.99999 14.8903C12.2781 14.8903 14.125 13.0434 14.125 10.7652C14.125 8.48712 12.2781 6.64024 9.99999 6.64024ZM11.8562 12.6215C11.6128 12.8657 11.3234 13.0593 11.0049 13.1912C10.6863 13.3231 10.3448 13.3908 9.99999 13.3903C9.29921 13.3903 8.64061 13.116 8.14374 12.6215C7.89958 12.378 7.70596 12.0887 7.57403 11.7701C7.4421 11.4516 7.37445 11.1101 7.37499 10.7652C7.37499 10.0645 7.64921 9.40587 8.14374 8.90899C8.64061 8.41212 9.29921 8.14024 9.99999 8.14024C10.7008 8.14024 11.3594 8.41212 11.8562 8.90899C12.1004 9.15246 12.294 9.4418 12.426 9.76036C12.5579 10.0789 12.6255 10.4204 12.625 10.7652C12.625 11.466 12.3508 12.1246 11.8562 12.6215Z" fill="white" />
                      </svg>
                      <span>Settings</span>
                    </bdi>
                  </li>
                ) : (
                  ""
                )}

                <li
                  onClick={() => {
                    sidebar_change("faq");
                  }}
                >
                  <bdi className={urlName === "faq" ? "active" : ""}>
                    <svg width={21} height={20} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.5 2V16L5.3 12.4C5.64582 12.1396 6.06713 11.9992 6.5 12H14.5C15.6046 12 16.5 11.1046 16.5 10V2C16.5 0.89543 15.6046 0 14.5 0H2.5C1.39543 0 0.5 0.89543 0.5 2ZM2.5 12V2H14.5V10H5.834C5.40107 9.99884 4.97964 10.1393 4.634 10.4L2.5 12Z" fill="white" />
                      <path d="M20.5 20V7C20.5 5.89543 19.6046 5 18.5 5V16L16.366 14.4C16.0204 14.1393 15.5989 13.9988 15.166 14H5.5C5.5 15.1046 6.39543 16 7.5 16H14.5C14.9329 15.9992 15.3542 16.1396 15.7 16.4L20.5 20Z" fill="white" />
                    </svg>

                    <span>FAQ</span>
                  </bdi>
                </li>
              </ul>
            </div>
            <div className="sidebar-log-fix">
              <button type="button" className="border-0 bg-transparent" onClick={logout}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 18H2C0.89543 18 0 17.1046 0 16V12H2V16H16V2H2V6H0V2C0 0.89543 0.89543 0 2 0H16C17.1046 0 18 0.89543 18 2V16C18 17.1046 17.1046 18 16 18ZM8 13V10H0V8H8V5L13 9L8 13Z" fill="#00ACC8" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(Sidebar);
