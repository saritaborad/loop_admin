import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout/layout";
import User from "../images/daily-user-icon.svg";
import Users from "../images/total-users-icon.svg";
import Chart from "react-apexcharts";
import GoogleMapReact from "google-map-react";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import moment from "moment";
import loaderimg from "../images/loader.gif"

function Dashboard() {
    const [userData, setUserData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userChartData, setUserChartData] = useState([]);
    const [chatPrice, setChatPrice] = useState([]);
    const [websiteData, setWebsiteData] = useState("");
    const [appDataCount, setAppDataCount] = useState("");
    const [loader, setLoader] = useState(true);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const monthRef = useRef(null);

    const defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33,
        },
        zoom: 11,
    };

    const chart1 = {
        series: [
            {
                data: chatPrice,
            },
        ],
        fill: {
            opacity: 1,
        },
        chart: {
            height: 400,
            type: "area",
            fontFamily: "Gotham",
            zoom: {
                enabled: true,
            },
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            type: "category",
            categories: userChartData,
        },
        yaxis: {
            labels: {
                formatter: (val) => {
                    return val;
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#00ACC8"],
        stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",
            width: 2,
            dashArray: 0,
        },
    };

    const chartData = {
        series: [appDataCount],
        options: {
            chart: {
                type: "donut",
                height: 300,
                fontFamily: "Montserrat",
                zoom: {
                    enabled: true,
                },
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                show: true,
                curve: "smooth",
                lineCap: "butt",
                width: 0,
                dashArray: 0,
            },
            dataLabels: {
                enabled: false,
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "bottom",
                horizontalAlign: "center",
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                fontSize: "20px",
                            },
                        },
                        size: "80%",
                    },
                },
            },
            labels: ["Mobile"],
            colors: ["#F9A743"],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: "100%",
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        },
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    const AnyReactComponent = ({ text }) => <div>{text}</div>;

    var dtToday = moment(new Date()).format("YYYY-MM-DD");
    const selectMonth = (e) => {
        startDateRef.current.value = "";
        endDateRef.current.value = "";

        var startDate = `${moment(e.target.value).format("MM")}-01-${moment().year()}`;
        var endDate = `${moment(e.target.value).format("MM")}-31-${moment().year()}`;

        getDashboardData(startDate, endDate);
    };

    const getDashboardData = (startDate, endDate) => {
        let date = {
            startDate: startDate === "" ? "" : startDate,
            endDate: endDate === "" ? "" : endDate,
        };
        const getDashboardCountPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.getDashboardData, date));
        });
        getDashboardCountPromise.then((response) => {
            setLoader(false)
            if (response.status === 200) {
                setUserData(response.data.data);

                let responseGPS = response.data.data.userCount;
                let totalVal = parseInt(responseGPS[0].app_type);
                let appPercentage = Number(((parseFloat(responseGPS[0].app_type) / totalVal) * 100).toFixed(2));
                //let webPercentage = Number(((parseFloat(responseGPS[0].web_type) / totalVal) * 100).toFixed(2));
                // setWebsiteData(webPercentage);
                setAppDataCount(appPercentage);

                let tempArr = [];
                let tempArrPrice = [];
                let responseRevenue = response.data.data.chartData;
                responseRevenue.sort((a, b) => Date.parse(a._id) - Date.parse(b._id))
                for (let i = 0; i < responseRevenue.length; i++) {
                    let data = moment(responseRevenue[i]._id).format("DD MMM");
                    let count = responseRevenue[i].count;

                    tempArr.push(data);
                    tempArrPrice.push(count);
                }
                setUserChartData(tempArr);
                setChatPrice(tempArrPrice);
            }
        });
    };

    const selectStartDate = (e) => {
        monthRef.current.value = "";
        let startValue = moment(e.target?.value).format("MM-DD-YYYY");
        setStartDate(startValue);
    };
    const selectEndDate = (e) => {
        let endValue = moment(e.target?.value).format("MM-DD-YYYY");
        setEndDate(endValue);
        getDashboardData(startDate, endValue);
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
                                <h1>Dashboard</h1>
                                {/* <div className="ms-auto">
                                    <button className="btn-comn-all">DOWNLOAD DATA</button>
                                </div> */}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="white-box-main">
                                        <div className="d-flex align-items-center top-dash-box">
                                            <mark className="dash-top-color-1">
                                                <img src={User} alt="user" />
                                            </mark>
                                            <div className="ps-3">
                                                <span className="d-block">{userData.dailyUsers}</span>
                                                <bdi className="d-block">Daily Users</bdi>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 mb-4">
                                    <div className="white-box-main">
                                        <div className="d-flex align-items-center top-dash-box">
                                            <mark className="dash-top-color-2">
                                                <img src={Users} alt="user" />
                                            </mark>
                                            <div className="ps-3">
                                                <span className="d-block">{userData.totalUsers}</span>
                                                <bdi className="d-block">Total Users</bdi>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="title-inr-drop row align-items-center">
                                <div className="col-lg-3">
                                    <h2 className="mb-0">Total Users</h2>
                                </div>
                                <div className="col-lg-9">
                                    <div className="ms-auto">
                                        <div className="date-range-info">
                                            <div className="mb-3 ms-2">
                                                <span>Select Date Range</span>
                                            </div>
                                            <div className="mb-3 ms-2">
                                                <div className="inr-date-range" onChange={selectStartDate}>
                                                    <input type="date" ref={startDateRef} className="form-control comn-class" max={dtToday} placeholder="02/15/2022" />
                                                </div>
                                            </div>
                                            <div className="mb-3 ms-2">
                                                <div className="inr-date-range" onChange={selectEndDate}>
                                                    <input type="date" ref={endDateRef} className="form-control comn-class" max={dtToday} placeholder="03/15/2022" />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="mb-3 ms-2">
                                                    <select className="form-select frnt-input-style w-100" ref={monthRef} name="monthRange" onChange={(e) => selectMonth(e)}>
                                                        <option value="" selected hidden>
                                                            Month
                                                        </option>
                                                        <option value="01">January</option>
                                                        <option value="02">February</option>
                                                        <option value="03">March</option>
                                                        <option value="04">April</option>
                                                        <option value="05">May</option>
                                                        <option value="06">June</option>
                                                        <option value="07">July</option>
                                                        <option value="08">August</option>
                                                        <option value="09">September</option>
                                                        <option value="10">October</option>
                                                        <option value="11">November</option>
                                                        <option value="12">December</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="white-box-main">
                                <Chart options={chart1} series={chart1.series} height={400} type="area" />
                            </div>
                        </div>
                        {/* <div className="col-md-8">
                            <div className="title-inr-drop">
                                <h2 className="mb-0">Map</h2>
                            </div>
                            <div className="white-box-main">
                                <div className="cust-map-info">
                                    <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyASLm3eSo0TMCBNFbPnXOiraORhu4buMiU" }} defaultCenter={defaultProps.center} defaultZoom={defaultProps.zoom}>
                                        <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
                                    </GoogleMapReact>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-md-4 mt-3">
                            <div className="title-inr-drop">
                                <h2 className="mb-0">Daily Visitors</h2>
                            </div>
                            <div className="white-box-main mt-3">
                                <Chart options={chartData.options} series={chartData.series} height={450} type="donut" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
