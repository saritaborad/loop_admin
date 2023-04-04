import React from "react";
import Layout from "../components/Layout/layout";
import news_img_1 from "../images/tips-image.png";

export default function EmployeeSubmittedTips() {
    return (
        <Layout>
            <div className="content-main-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="comn-title-info d-sm-flex align-items-center">
                                <h1>Submitted Tips By Users</h1>
                            </div>
                        </div>
                        <div className="col-12">
                            <ul>
                                <li className="my-3">
                                    <div className="news-feed-main-box">
                                        <div className="row m-0">
                                            <div className="col-md-3 px-0">
                                                <img src={news_img_1} className="img-fluid w-100 news-img" alt="" />
                                            </div>
                                            <div className="col-md-9 p-0">
                                                <div className="latest-news-main-content-div">
                                                    <div className="latest-news-header">
                                                        <p>Description</p>
                                                    </div>
                                                    <div className="latest-news-content-emp pb-2">
                                                        <p>
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. survived not only five centuries, but also
                                                        </p>
                                                    </div>
                                                    <div className="btm-link-news mt-auto">
                                                        <bdi>Link:<a href="/"> www.example@mail.com</a></bdi>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="my-3">
                                    <div className="news-feed-main-box">
                                        <div className="row m-0">
                                            <div className="col-md-3 px-0">
                                                <img src={news_img_1} className="img-fluid w-100 news-img" alt="" />
                                            </div>
                                            <div className="col-md-9 p-0">
                                                <div className="latest-news-main-content-div">
                                                    <div className="latest-news-header">
                                                        <p>Description</p>
                                                    </div>
                                                    <div className="latest-news-content-emp pb-2">
                                                        <p>
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. survived not only five centuries, but also
                                                        </p>
                                                    </div>
                                                    <div className="btm-link-news mt-auto">
                                                        <bdi>Link:<a href="/"> www.example@mail.com</a></bdi>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="my-3">
                                    <div className="news-feed-main-box">
                                        <div className="row m-0">
                                            <div className="col-md-3 px-0">
                                                <img src={news_img_1} className="img-fluid w-100 news-img" alt="" />
                                            </div>
                                            <div className="col-md-9 p-0">
                                                <div className="latest-news-main-content-div">
                                                    <div className="latest-news-header">
                                                        <p>Description</p>
                                                    </div>
                                                    <div className="latest-news-content-emp pb-2">
                                                        <p>
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. survived not only five centuries, but also
                                                        </p>
                                                    </div>
                                                    <div className="btm-link-news mt-auto">
                                                        <bdi>Link:<a href="/"> www.example@mail.com</a></bdi>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
