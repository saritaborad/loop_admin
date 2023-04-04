import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout/layout";
import { Formik } from "formik";
import * as Yup from "yup";
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import Upload from "../images/cloud-upload.svg";
import toastr from "toastr";
import { Modal } from "react-bootstrap";
import country_List from "react-select-country-list";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from 'react-select'
import { API_Path } from "../const";
import { GetApi, PostApi } from "../ApiService";
import { withRouter } from "../Navigate";
import { useNavigate } from "react-router-dom";
import loaderimg from "../images/loader.gif";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

let dangourhtml = ""
function createMarkup() {
	return {
		__html: dangourhtml
	};
}


const embededvalidlink = "<(“[^”]*”|'[^’]*’|[^'”>])*>";
function AddPost(props) {

	const navigate = useNavigate();
	const [commentary_title, setCommentary_title] = useState("");
	const [commentary_caption, setCommentary_caption] = useState("");
	const [tag, setTag] = useState("");
	const [link, setLink] = useState("");
	const [ageMin, setAgeMin] = useState('');
	const [ageMax, setAgeMax] = useState('');
	const [country, setCountry] = useState([]);
	const [CountryList, setCountryList] = useState([]);
	const [file, setFile] = useState('')
	const [imgprev, setimgprev] = useState('')
	const [thumnImg, setThumnImg] = useState('')
	const [defaultImg, setDefaultImg] = useState("https://rentechtest112.s3.amazonaws.com/profile_pic/profile_pic_630c5881daa3e75737817eb5_BeVm3xrpox.jpg");
	const [interest, setInterest] = useState([]);
	const [interestlist, setInterestlist] = useState([]);
	const [notification, setNotification] = useState(0);
	const [post_status, setPost_status] = useState(1);
	const [loader, setLoader] = useState(true);

	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [expier, setexpier] = useState(10);
	const [btn, setBtn] = useState("")

	const options = useMemo(() => country_List().getData(), [])

	const [open, setOpenForm] = React.useState(false);
	const [isEmbebed, setisEmbebed] = useState(0)
	const [schedulemodalShow, setScheduleModalShow] = React.useState(false);
	const [expiermodalShow, setExpierModalShow] = React.useState(false);
	const [embededlink, setembededlink] = useState("");
	const [scheduleDateTime, setScheduleDateTime] = useState("");

	useEffect(() => {
		if (window.twttr) {
			window.twttr.widgets.load();
		}
	}, [embededlink])

	useEffect(() => {
		const getinterestsListpromise = new Promise((resolve, reject) => {
			resolve(GetApi(API_Path.getinterest));
		});
		getinterestsListpromise.then((response) => {
			if (response.status === 200) {
				setInterestlist(response.data.data.Interest)
			}
		})
	}, [])

	const changeHandler = (value, label) => {
		var temp = value
		let result = temp.map(a => a.label);
		setCountryList(result)
		setCountry(value)
	}

	const submitFormData = (formData, resetForm) => {
		if ((isEmbebed === 1 && embededlink != "" && embededlink.match(embededvalidlink))) {
			if (btn === 0 || btn === 1) {
				formData.age_min = ageMin
				formData.age_max = ageMax
				formData.country = CountryList
				formData.interest = interest
				formData.notification = notification
				formData.expier = expier
				formData.post_status = post_status
				formData.isEmbeded = isEmbebed
				formData.imagesorvideo = imgprev ? imgprev : defaultImg
				formData.thumnImg = thumnImg ? thumnImg : defaultImg

				const createpostpromisenew = new Promise((resolve, reject) => {
					resolve(PostApi(API_Path.createnews, formData));
				});


				createpostpromisenew.then((response) => {
					if (response.status === 201) {
						setScheduleModalShow(false)
						toastr.success(response.data.message)
						if (btn === 1) {
							props.navigate('/news-feed')
						}
						if (btn === 0) {
							props.navigate('/drafted-post')
						}
						resetForm()
					}
				})
			} else {
				formData.age_min = ageMin
				formData.age_max = ageMax
				formData.country = CountryList
				formData.interest = interest
				formData.notification = notification
				formData.expier = expier
				formData.post_status = post_status
				formData.isEmbeded = isEmbebed
				formData.imagesorvideo = imgprev ? imgprev : defaultImg
				formData.thumnImg = imgprev ? imgprev : defaultImg
				formData.scheduleDate = scheduleDateTime
				formData.link = link
				const createPostPromise = new Promise((resolve, reject) => {
					resolve(PostApi(API_Path.createnews, formData));
				});
				createPostPromise.then((response) => {
					if (response.status === 200) {
						resetForm()
						setScheduleModalShow(false)
						toastr.success(response.data.message)
						props.navigate('/queued-post');
					}
				})
				// setScheduleModalShow(true)
				// var dtToday = new Date();
				// var month = dtToday.getMonth() + 1;
				// var day = dtToday.getDate();
				// var year = dtToday.getFullYear();
				// if (month < 10)
				// 	month = '0' + month.toString();
				// if (day < 10)
				// 	day = '0' + day.toString();
				// var maxDate = year + '-' + month + '-' + day;
				// var maxtime = dtToday.getHours() + ":" + dtToday.getMinutes();
				// document.getElementById("txtDate").setAttribute('min', maxDate)
				// document.getElementById("txtTime").setAttribute('min', maxtime)
			}
		} else if (isEmbebed === 0) {
			if (btn === 0 || btn === 1) {
				formData.age_min = ageMin
				formData.age_max = ageMax
				formData.country = CountryList
				formData.interest = interest
				formData.notification = notification
				formData.expier = expier
				formData.post_status = post_status
				formData.isEmbeded = isEmbebed
				formData.imagesorvideo = imgprev ? imgprev : defaultImg
				formData.thumnImg = thumnImg ? thumnImg : defaultImg
				formData.link = link
				const createpostpromisenew = new Promise((resolve, reject) => {
					resolve(PostApi(API_Path.createnews, formData));
				});

				createpostpromisenew.then((response) => {
					if (response.status === 201) {
						setScheduleModalShow(false)
						toastr.success(response.data.message)
						if (btn === 1) {
							props.navigate('/news-feed')
						}
						if (btn === 0) {
							props.navigate('/drafted-post')
						}
						resetForm()
					}
				})
			} else {
				formData.age_min = ageMin
				formData.age_max = ageMax
				formData.country = CountryList
				formData.interest = interest
				formData.notification = notification
				formData.expier = expier
				formData.post_status = post_status
				formData.isEmbeded = isEmbebed
				formData.imagesorvideo = imgprev ? imgprev : defaultImg
				formData.thumnImg = imgprev ? imgprev : defaultImg
				formData.scheduleDate = scheduleDateTime
				formData.link = link
				const createPostPromise = new Promise((resolve, reject) => {
					resolve(PostApi(API_Path.createnews, formData));
				});
				createPostPromise.then((response) => {
					if (response.status === 200) {
						resetForm()
						setScheduleModalShow(false)
						toastr.success(response.data.message)
						props.navigate('/queued-post');
					}
				})
			}
		} else {
			document.getElementById("embededlink").style.display = "block";
		}


	};

	const showScheduleModal = () => {
		setScheduleModalShow(true)
		var dtToday = new Date();
		var month = dtToday.getMonth() + 1;
		var day = dtToday.getDate();
		var year = dtToday.getFullYear();
		if (month < 10)
			month = '0' + month.toString();
		if (day < 10)
			day = '0' + day.toString();
		var maxDate = year + '-' + month + '-' + day;
		var maxtime = dtToday.getHours() + ":" + dtToday.getMinutes();
		document.getElementById("txtDate").setAttribute('min', maxDate)
		document.getElementById("txtTime").setAttribute('min', maxtime)
	}

	const submitFormDataexpire = (formData) => {
		setexpier(formData.expier)
		setExpierModalShow(false)
	}

	const errorContainer = (form, field) => {
		return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
	};

	const formAttr = (form, field) => ({
		onBlur: form.handleBlur,
		onChange: form.handleChange,
		value: form.values[field],
	});

	const setvalue = (e) => {
		setCommentary_title(e.target.value)
	}

	const setVluelink = (e) => {
		setLink(e.target.value)
	}
	const setcaptionvalue = (e) => {
		setCommentary_caption(e.target.value)
	}
	const selecttag = (e) => {
		setTag(e.target.value)
	}

	const handlerangeChange = (e) => {
		setAgeMin(e[0])
		setAgeMax(e[1])
	}

	const setOpenFormmenu = (e) => {

		if (e.target.value === "1") {
			setOpenForm(true);
			setNotification(parseInt(e.target.value))
			setAgeMin(13)
			setAgeMax(30)
		} else {
			setOpenForm(false)
			setNotification(0)
			setInterest([])
			setAgeMin('')
			setAgeMax('')
		}
	}

	const interestpost = (e) => {
		var temp = interest;
		var checkExistData = interest.filter(x => x === e.target.id);
		if (checkExistData.length > 0 && !e.target.checked) {
			var removeEle = temp.filter(x => x !== e.target.id)
			setInterest(removeEle);
		} else {
			temp.push(e.target.id);
			setInterest(temp);
		}
	}

	const imgvideo = (e) => {
		setFile(e.target.files[0])
	};

	useEffect(() => {
		if (file !== "") {
			let data = new FormData()
			data.append("image", file)
			const imguploadpromise = new Promise((resolve, reject) => {
				resolve(PostApi(API_Path.addliveimg, data));
			});
			imguploadpromise.then((response) => {
				if (response.status === 200) {
					setimgprev(response.data.data.image)
					setThumnImg(response.data.data.thumnImg)
					setLoader(false);
				}
			})
		}
	}, [file])



	const expiremodel = (e) => {
		if (e.target.checked) {
			setExpierModalShow(true)
		} else {
			setExpierModalShow(false)
			setexpier(10)
		}
	}

	const savadraft = (e) => {
		setPost_status(0)
		setBtn(0)
		document.getElementById("submitBtn").click();
	}

	const savePublish = (formdata) => {
		setPost_status(2)
		setBtn(2)
		showScheduleModal();
	}

	const savePublishNow = () => {
		setPost_status(1)
		setBtn(1)
		document.getElementById("submitBtn").click();
	}

	const setembededvalue = (e) => {
		if (e.target.value) {
			document.getElementById("embededlink").style.display = "none"
		}
		dangourhtml = e.target.value
		setembededlink(e.target.value)
	}

	const submitScheduleData = (formData, resetForm) => {

		var date = formData.date
		var time = formData.time

		var dateObj = new Date(date + ' ' + time + ":00").toISOString();
		setScheduleDateTime(dateObj);
		document.getElementById("submitBtn").click();
		setScheduleModalShow(false);
	}

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

	const url = "<(“[^”]*”|'[^’]*’|[^'”>])*>";
	return (
		<Layout>
			<div className="content-main-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-info d-sm-flex align-items-center">
								<h1>Create A Post</h1>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="mb-3">
								<div className="white-box-main p-0">
									<div className="d-flex white-bx-hdr pb-0">

										<div className="p-3 mb-0">Add Details</div>
										<div className="custom-switch-toggle-menu ms-auto me-2">
											<label className="switch">
												<input type="checkbox" name="status" onChange={(e) => e.target.checked ? setisEmbebed(1) || setimgprev([]) : setisEmbebed(0) || setembededlink("")} />
												<span className="slider round"></span>
												<bdi >Social Embeded</bdi>
											</label>
										</div>

									</div>
									<div className="add-content-main p-3">
										<Formik
											// innerRef={this.runforms}
											enableReinitialize
											initialValues={{
												title: commentary_title,
												caption: commentary_caption,
												category: tag,
												link: link,
												country: country,
												embededLink: embededlink
											}}
											validationSchema={Yup.object({
												title: Yup.string().required("commentary title is required."),
												caption: Yup.string().required("commentary caption is required."),
												category: Yup.string().required("select category."),
												// link: Yup.string().url().required("url is require!")
												// embededLink:Yup.string().required("Embeded link is required").matches(url,"Embeded link is not valid")
											})}
											onSubmit={(formData, { resetForm }) => {
												submitFormData(formData, resetForm);
											}}
										>
											{(runform) => (
												<form className="row mb-0" onSubmit={runform.handleSubmit} >
													<div className="col-12">
														<div className="mb-3">
															<label className="lbl-frnt-side">
																Commentary Title
															</label>
															<input className="form-control frnt-input-style" type="text" name="title" placeholder="On Brink Of War?" onChange={(e) => setvalue(e)} />
															{errorContainer(runform, "title")}
														</div>
													</div>
													<div className="col-12">
														<div className="mb-3">
															<label className="lbl-frnt-side">
																Commentary Caption
															</label>
															<textarea className="form-control frnt-input-style h-auto" rows="5" name="caption" placeholder="Add commentary caption here..." onChange={(e) => setcaptionvalue(e)} />
															{errorContainer(runform, "caption")}
														</div>
													</div>
													<div className="col-12">
														<div className="mb-3 ">
															<div className="d-sm-flex">
																<label className="lbl-frnt-side mb-3 ">
																	Tagged Category
																</label>
																<div className="ms-auto my-sm-0 my-2">
																	<bdi className="d-block">
																		<div className="custom-switch-toggle-menu">
																			<label className="switch">
																				<input type="checkbox" name="status" onChange={(e) => expiremodel(e)} />
																				<span className="slider round"></span>
																				<bdi className="active-info-switch">Automatically Expired</bdi>
																				<bdi className="inactive-info-switch text-secondary">Expired Within 10 Day’s</bdi>
																			</label>
																		</div>
																	</bdi>
																</div>
															</div>
															<select className="form-select frnt-input-style" name="category" onChange={(e) => selecttag(e)} >
																<option selected disabled>Select tag</option>
																<option value="Featured">Featured</option>
																<option value="Trending">Trending</option>
																<option value="ProLife">ProLife</option>
																<option value="Politics">Politics</option>
																<option value="Faith">Faith</option>
															</select>
															{errorContainer(runform, "category")}
														</div>
													</div>
													<div className="col-12">
														<div className="mb-3">
															<label className="lbl-frnt-side">Location</label>
															<Select name="country" options={options} value={country} onChange={(e) => changeHandler(e)} isMulti />
														</div>
													</div>
													{isEmbebed === 0 &&
														<div className="col-12">
															<div className="mb-3">
																<label className="lbl-frnt-side">
																	Image/Video <span>(optional)</span>
																</label>
																<label className="upload-img-box" htmlFor="file-upload">
																	<div className="upload-img-in">
																		<div className="m-auto text-center">
																			<img src={Upload} alt="upload" className="img-fluid" />
																			<p>Upload JPG, PNG, JPEG, Video</p>
																			<span className="d-inline-block lbl-table-tag">Choose File</span>
																			<input id="file-upload" accept=".png, .jpg, .jpeg, .mp3,.mp4,.mkv,.mov,.avi/*" type="file" hidden onChange={(e) => imgvideo(e)} />
																		</div>
																	</div>
																</label>
															</div>
														</div>
													}

													{isEmbebed === 1 &&
														<div className="col-12">
															<div className="mb-3">
																<label className="lbl-frnt-side">Social Embeded</label>
																<textarea className="form-control frnt-input-style h-auto" rows="5" name="embededLink" onChange={(e) => setembededvalue(e)} placeholder="Add Social Embeded link here..." data-lt-tmp-id="lt-887429" spellCheck="false" data-gramm="false" ></textarea>
																<span id="embededlink" className="red-txt" style={{ display: 'none', color: 'red' }}>
																	embededlink is required.
																</span>
															</div>
														</div>
													}

													<div className="col-12">
														<div className="mb-3">
															<label className="lbl-frnt-side">
																{/* URL Link <span>(optional)</span> */}
																URL Link
																<bdi>
																	{/* <OverlayTrigger placement="top" overlay={<Tooltip>Tooltip on</Tooltip>}>
																		<span className="ps-3">
																			<svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
																				<path d="M8.16602 4.83317H9.83268V6.49984H8.16602V4.83317ZM8.16602 8.1665H9.83268V13.1665H8.16602V8.1665ZM8.99935 0.666504C4.39935 0.666504 0.666016 4.39984 0.666016 8.99984C0.666016 13.5998 4.39935 17.3332 8.99935 17.3332C13.5993 17.3332 17.3327 13.5998 17.3327 8.99984C17.3327 4.39984 13.5993 0.666504 8.99935 0.666504ZM8.99935 15.6665C5.32435 15.6665 2.33268 12.6748 2.33268 8.99984C2.33268 5.32484 5.32435 2.33317 8.99935 2.33317C12.6743 2.33317 15.666 5.32484 15.666 8.99984C15.666 12.6748 12.6743 15.6665 8.99935 15.6665Z" fill="#030303" />
																			</svg>
																		</span>
																	</OverlayTrigger> */}
																</bdi>
															</label>
															<input type="text" className="form-control frnt-input-style" name="link" placeholder="add URL link here..." onChange={(e) => setVluelink(e)} />
															{/* {errorContainer(runform, "link")} */}
														</div>
													</div>
													{userRole === 1 || userPermission?.allowToSendPushNotification === 1 ?
														<div className="col-12">
															<div className="mb-3">
																<label className="lbl-frnt-side">Send Push Notification? (No/Yes)</label>
																<div className="comn-radio-btn" onChange={(e) => setOpenFormmenu(e)} >
																	<div className="form-check">
																		<input className="form-check-input" type="radio" name="notification" value="0" id="push-no" defaultChecked />
																		<label className="form-check-label" htmlFor="push-no">
																			No
																		</label>
																	</div>
																	<div className="form-check">
																		<input className="form-check-input" type="radio" name="notification" value="1" id="push-yes" />
																		<label className="form-check-label" htmlFor="push-yes">
																			YES
																		</label>
																	</div>
																</div>
															</div>
														</div> : ""}
													<div className="col-12">
														{open ? (
															<div className="row">
																{/* <div className="col-12 mb-3">
																	<label className="lbl-frnt-side">Gender</label>
																	<div className="comn-radio-btn">
																		<div className="form-check">
																			<input className="form-check-input" type="radio" name="Gender" id="female" defaultChecked />
																			<label className="form-check-label" htmlFor="female">
																				Female
																			</label>
																		</div>
																		<div className="form-check">
																			<input className="form-check-input" type="radio" name="Gender" id="male" />
																			<label className="form-check-label" htmlFor="male">
																				Male
																			</label>
																		</div>
																	</div>
																</div> */}
																<div className="col-12 mb-3">
																	<label className="lbl-frnt-side">Age Range</label>
																	<div className="col-md-12 mb-3  cust-slider-range">
																		<Range
																			min={0}
																			max={100}
																			defaultValue={[13, 30]}
																			tipFormatter={value => ` ${value}`}
																			tipProps={{
																				placement: "bottom",
																				visible: true
																			}}
																			onChange={(e) => handlerangeChange(e)}
																		/>
																	</div>
																</div>
																<div className="col-12">
																	<label className="lbl-frnt-side">Interests</label>
																	<div className="gyb-tags-main-part btn-group" id="interest-list" onChange={(e) => interestpost(e)}>
																		{interestlist.length > 0 && interestlist.map((item, i) => {
																			return (
																				<>
																					<input type="checkbox" className="btn-check" id={item.interest} key={i} />
																					<label className="select-tag-class" htmlFor={item.interest}>
																						<bdi>{item.interest}</bdi>
																					</label>
																				</>
																			)
																		})
																		}
																	</div>
																</div>
															</div>
														) : (
															""
														)}
													</div>
													<div className="col-sm-6 mb-3">
														<button type="button" className="btn-comn-all-2 w-100" onClick={() => savadraft('0')}>
															<span className="position-relative">SAVE AS A DRAFT</span>
														</button>
													</div>
													<div className="col-sm-6 mb-3">
														<button type="button" className="btn-comn-all w-100" onClick={() => savePublish('2')}>
															<span className="position-relative">PUBLISH LATER</span>
														</button>
													</div>

													<div className="col-12 text-center">
														<button type="button" className="btn-comn-all w-100" onClick={() => savePublishNow('1')}>
															<span className="position-relative">PUBLISH NOW</span>
														</button>
														<button type="submit" className="d-none" id="submitBtn">Submit</button>
													</div>
												</form>
											)}
										</Formik>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6 mb-3">
							<div className="white-box-main h-100 p-0">
								<div className="white-bx-hdr p-3 mb-0">Preview</div>
								<div className="preview-content-part p-3">
									<div className="latest-news-header">
										<div className="d-flex align-items-center">
											{tag &&
												<span>{tag.charAt(0)}</span>
											}
											<bdi>{tag}</bdi>
										</div>
									</div>
									<div className="latest-news-small-header py-2">
										<h4>{commentary_title}</h4>
									</div>
									<div className="latest-newsdetail-content pb-2">
										<bdi>{commentary_caption}</bdi>
									</div>
									<div className="latest-news-small-header py-2">
										{/* <span>
											CatholicVote <span>● 10h</span>
										</span> */}
									</div>
								</div>
								{isEmbebed === 0 &&
									<div className="py-2 text-center">
										{
											imgprev?.includes("mp4") || imgprev?.includes("mp3") ?
												<video width="750" height="500" autoPlay  >
													<source src={imgprev} type="video/mp4" />
												</video> : <img src={imgprev} className="img-fluid w-100" alt="" />
										}
									</div>
								}
								{isEmbebed === 1 && embededlink !== "" &&
									<div className="embeded d-flex align-items-center justify-content-center" dangerouslySetInnerHTML={createMarkup()}></div>
								}

							</div>
						</div>
					</div>
					<Modal
						show={schedulemodalShow}
						onHide={() => setScheduleModalShow(false)}
						size="md"
						scrollable={true}
						contentClassName="deactive-alert-box likes-box"
						aria-labelledby="contained-modal-title-vcenter"
						backdrop="static"
						centered
					>
						<Modal.Header closeButton className="border-bottom">
							<Modal.Title>
								<h1>Schedule Post</h1>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Formik
								// innerRef={this.runforms}
								enableReinitialize
								initialValues={{
									date: date,
									time: time,

								}}
								validationSchema={Yup.object({
									date: Yup.string().required("Enter The Schedule Date..."),
									time: Yup.string().required("Enter The Schedule Time..."),
								})}
								onSubmit={(formData, { resetForm }) => {
									submitScheduleData(formData, resetForm);
								}}
							>
								{(runform) => (
									<form className="row mb-0" onSubmit={runform.handleSubmit}>
										<div className="col-12 mb-3">
											<label className="lbl-frnt-side">Select Date</label>
											<input type="date" className="form-control frnt-input-style" name="date" id="txtDate" {...formAttr(runform, "date")} />
											{errorContainer(runform, "date")}
										</div>
										<div className="col-12 mb-3">
											<label className="lbl-frnt-side">Select Time</label>
											<input type="time" className="form-control frnt-input-style" name="time" id="txtTime" {...formAttr(runform, "time")} />
											{errorContainer(runform, "time")}
										</div>
										<div className="col-12">
											<button className="btn-comn-all w-100" type="submit" >
												<span className="position-relative" >save</span>
											</button>
										</div>
									</form>
								)}
							</Formik>
						</Modal.Body>
					</Modal>
					<Modal show={expiermodalShow} onHide={() => setExpierModalShow(false)} size="md" scrollable={true} contentClassName="deactive-alert-box likes-box" aria-labelledby="contained-modal-title-vcenter" centered>
						<Modal.Header closeButton className="border-bottom">
							<Modal.Title>
								<h1>Expire</h1>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Formik
								// innerRef={this.runforms}
								enableReinitialize
								initialValues={{
									expier: expier
								}}
								validationSchema={Yup.object({})}
								onSubmit={(formData, { resetForm }) => {
									submitFormDataexpire(formData, resetForm);
								}}
							>
								{(runform) => (
									<form className="row mb-0" onSubmit={runform.handleSubmit}>
										<div className="col-12 mb-3">
											<label className="lbl-frnt-side">Select Number Of Day’s </label>
											<input type="number" className="form-control frnt-input-style" name="expier" {...formAttr(runform, "expier")} />
										</div>
										<div className="col-12">
											<button className="btn-comn-all w-100" type="submit" >
												<span className="position-relative">save</span>
											</button>
										</div>
									</form>
								)}
							</Formik>
						</Modal.Body>
					</Modal>
				</div>
			</div>
		</Layout>
	);
}

export default withRouter(AddPost);
