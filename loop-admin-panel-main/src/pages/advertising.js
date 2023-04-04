import React, { useState } from "react";
import Layout from "../components/Layout/layout";
import { Dropdown } from "react-bootstrap";
import RtdDatatable from "../components/DataTable/RtdDatatable";

const data = [
	{
		Posted_Date: "03/22/2022",
		Ads_Topic: "Electronics",
		action: "",
		Status: "",
	},
	{
		Posted_Date: "03/22/2022",
		Ads_Topic: "Electronics",
		action: "",
		Status: "",
	},
	{
		Posted_Date: "03/22/2022",
		Ads_Topic: "Electronics",
		action: "",
		Status: "",
	},
	{
		Posted_Date: "03/22/2022",
		Ads_Topic: "Electronics",
		action: "",
		Status: "",
	},
	{
		Posted_Date: "03/22/2022",
		Ads_Topic: "Electronics",
		action: "",
		Status: "",
	},
	{
		Posted_Date: "03/22/2022",
		Ads_Topic: "Electronics",
		action: "",
		Status: "",
	},
];

export default function Advertising() {
	const [option, set_option] = useState({
		sizePerPage: 10,
		search: "",
		totalRecord: 0,
		page: 0,
		sort: "id",
		order: "ASC",
	});

	const columns = [
		{
			value: "Ads_Topic",
			label: "Ads Topic",
			options: {
				filter: false,
				sort: true,
			},
		},
		{
			value: "Posted_Date",
			label: "Posted Date",
			options: {
				filter: false,
				sort: true,
			},
		},
		{
			value: "Status",
			label: "Status",
			options: {
				filter: false,
				sort: true,
				customBodyRender: (data, i) => {
					return (
						<bdi className="d-block">
							<div className="custom-switch-toggle-menu">
								<label className="switch">
									<input type="checkbox" name="status" defaultChecked />
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
			value: "action",
			label: "Actions",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data) => {
					return (
						<div className="cust-drop-down">
							<Dropdown drop="left">
								<Dropdown.Toggle className="cust-drop-btn" id="dropdown">
									<i className="bi bi-three-dots-vertical"></i>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<ul>
										<li>
											<Dropdown.Item>Ban User</Dropdown.Item>
										</li>
										<li>
											<Dropdown.Item>Delet User</Dropdown.Item>
										</li>
										<li>
											<Dropdown.Item>Send Reset Password</Dropdown.Item>
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

	const tableCallBack = (option) => {
		set_option(option);
	};

	return (
		<Layout>
			<div className="content-main-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-info d-sm-flex align-items-center">
								<h1>Advertising</h1>
								<div className="ms-auto mt-2 mt-sm-0">
									<button className="btn-comn-all w-100" onClick={() => window.open("/post-new-ad", "_self")}>
										POST ADS
									</button>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="white-box-main p-0">
								<RtdDatatable data={data} columns={columns} option={option} tableCallBack={tableCallBack} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
