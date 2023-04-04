import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChangePassword from "./pages/change-password";
import EditUserDetail from "./pages/edit-user-detail";
import Login from "./pages/common/login";
import SignUp from "./pages/common/sign-up";
import Dashboard from "./pages/dashboard";
import EditProfile from "./pages/edit-profile";
import Profile from "./pages/profile";
import User from "./pages/user";
import UserDetail from "./pages/user-detail";
import AddEmployee from "./pages/add-employee";
import EditEmployee from "./pages/edit-employee";
import EmployeeDetail from "./pages/employee-detail";
import Settings from "./pages/settings";
import Newsfeed from "./pages/Newsfeed";
import AddPost from "./pages/AddPost";
import Advertising from "./pages/advertising";
import PostNewAd from "./pages/post-new-ad";
import EditPost from "./pages/EditPost";
import PrayerRequest from "./pages/PrayerRequest";
import SuggestedContent from "./pages/SuggestedContent";
import SubmittedTipsByUsers from "./pages/SubmittedTipsByUsers";
import NewsDetail from "./pages/news-detail";
import NewsfeedDetail from "./pages/NewsfeedDetail";
import ManageComments from "./pages/manage-comments";
import QueuedPost from "./pages/queued-post";
import DraftedPost from "./pages/drafted-post";
import EmployeeSubmittedTips from "./pages/EmployeeSubmittedTips";
import EmployeeSuggestedContent from "./pages/EmployeeSuggestedContent";
import Faq from "./pages/Faq";
import { ContextProvider } from "./contex/Context";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/common/ForgotPassword";
import EmailVerification from "./pages/common/EmailVerification";
import ResetPassword from "./pages/common/ResetPassword"





function Protected({ children }) {
    let token = localStorage.getItem('loop_token')
    return token !== undefined && token !== '' && token !== null ? children : <Navigate to={"/login"} />;
}
export default function RouterContainer() {

    return (
        <>
            <ContextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/email-verification" element={<EmailVerification />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/dashboard" element={<Protected > <Dashboard /></Protected>} />
                        <Route path="/faq" element={<Protected><Faq /></Protected>} />
                        <Route path="/user" element={<Protected><User /></Protected>} />
                        <Route path="/user-detail" element={<Protected><UserDetail /></Protected>} />
                        <Route path="/profile" element={<Protected><Profile /></Protected>} />
                        <Route path="/edit-profile" element={<Protected><EditProfile /></Protected>} />
                        <Route path="/change-password" element={<Protected><ChangePassword /></Protected>} />
                        <Route path="/edit-user-detail" element={<Protected><EditUserDetail /></Protected>} />
                        <Route path="/add-employee" element={<Protected><AddEmployee /></Protected>} />
                        <Route path="/edit-employee" element={<Protected><EditEmployee /></Protected>} />
                        <Route path="/employee-detail" element={<Protected><EmployeeDetail /></Protected>} />
                        <Route path="/settings" element={<Protected><Settings /></Protected>} />
                        <Route path="/news-feed" element={<Protected><Newsfeed /></Protected>} />
                        <Route path="/add-post" element={<Protected><AddPost /></Protected>} />
                        <Route path="/advertising" element={<Protected><Advertising /></Protected>} />
                        <Route path="/post-new-ad" element={<Protected><PostNewAd /></Protected>} />
                        <Route path="/edit-post" element={<Protected><EditPost /></Protected>} />
                        <Route path="/prayer-request" element={<Protected><PrayerRequest /></Protected>} />
                        <Route path="/suggested-content" element={<Protected><SuggestedContent /></Protected>} />
                        <Route path="/submitted-tips-by-users" element={<Protected><SubmittedTipsByUsers /></Protected>} />
                        <Route path="/news-detail" element={<Protected><NewsDetail /></Protected>} />
                        <Route path="/newsfeed-detail" element={<Protected><NewsfeedDetail /></Protected>} />
                        <Route path="/manage-comments" element={<Protected><ManageComments /></Protected>} />
                        <Route path="/queued-post" element={<Protected><QueuedPost /></Protected>} />
                        <Route path="/drafted-post" element={<Protected> <DraftedPost /></Protected>} />
                        <Route path="/employee-submitted-tips" element={<Protected><EmployeeSubmittedTips /></Protected>} />
                        <Route path="/employee-suggested-content" element={<Protected><EmployeeSuggestedContent /></Protected>} />

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Router>
            </ContextProvider>
        </>
    );
}
