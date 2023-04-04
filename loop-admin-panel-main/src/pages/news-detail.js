import React from "react";
import Layout from "../components/Layout/layout";
import { Dropdown } from "react-bootstrap";
import news_img_1 from "../images/news-full-img.png";
import { withRouter } from "../Navigate";
import { useLocation } from "react-router-dom";

function NewsDetail() {
    let location = useLocation()
    return (
        <Layout>
            <div className="content-main-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="comn-title-info d-sm-flex align-items-center">
                                <h1>Newsfeed</h1>
                                <div className="ms-auto mt-2 mt-sm-0">
                                    <div className="d-flex align-items-center">
                                        <button className="btn-red-class w-100 btn-fix-width">DELETE</button>
                                        <button className="btn-comn-all ms-2 w-100 btn-fix-width">EDIT</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="white-box-main">
                                <div className="white-bx-hdr d-flex align-items-center">
                                    News Details
                                    <div className="ms-auto">
                                        <div className="cust-drop-down">
                                            <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic" className="cust-drop-btn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                    </svg>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <ul>
                                                        <li>
                                                            <Dropdown.Item href="/">Edit</Dropdown.Item>
                                                        </li>
                                                        <li>
                                                            <Dropdown.Item href="/">Delete</Dropdown.Item>
                                                        </li>
                                                    </ul>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                <div className="preview-content-part">
                                    <div className="preview-top-img mb-3">
                                        <img src={news_img_1} className="" alt="" />
                                    </div>
                                    <div className="latest-news-header">
                                        <div className="d-flex align-items-center">
                                            <span>F</span>
                                            <bdi>FEATURED</bdi>
                                        </div>
                                    </div>
                                    <div className="latest-news-small-header py-2">
                                        <h4>On Brink Of War?</h4>
                                    </div>
                                    <div className="latest-news-small-header py-2">
                                        <span>
                                            CatholicVote <span>● 10h</span>
                                        </span>
                                    </div>
                                    <div className="latest-news-content">
                                        <p>
                                            The White House remained ambiguous on how many Americans are Ukraine as Russian invasion looms Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also
                                            the leap into electronic typesetting, remaining essentially unchanged.
                                        </p>

                                        <p>God honors the many catholic connect foundation fans that replied to the sobs of the hungry during our "End Their Hunger" campaign!</p>
                                        <p>
                                            Hunger has been a particularly severe worry because of the start of the COVID-19 pandemic, as households have battled to cope with task losses and increasing food prices. The good news is, our
                                            Catholic fans have actually stepped up in a huge method this year to fulfill this important requirement.
                                        </p>
                                        <p>Let's take a short consider the impact of all this extraordinary kindness.</p>
                                        <p>
                                            Much of the dietary help Giving Xcelerator disperses to poor neighborhoods is available in the kind of food. These shelf-stable meals are delivered easily and also effectively to creating
                                            countries worldwide. We can load about 272,160 meals in a solitary delivery container, and each meal is packed with vitamins the poor frantically require.
                                        </p>

                                        <p>
                                            Throughout 2021 , which finished June 30, we delivered a total amount of 20.6 million food meals, including 354,300 meals for typhoon catastrophe alleviation. This was an amazing quantity of aid,
                                            and all of it was urgently needed by the ministry companions we offer.
                                        </p>
                                        <p>
                                            Much more lately, we reacted to the Aug. 14 earthquake in Haiti by hurrying food meals to survivors with our network of trusted Haitian ministry companions. Approximately 2.4 million meals will be
                                            dispersed as part of our extensive disaster relief as well as healing plan, which also consists of clinical aid for country health centers and a massive housing project to fix as well as restore
                                            houses.
                                        </p>

                                        <p>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                                            type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
                                            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default withRouter(NewsDetail)
