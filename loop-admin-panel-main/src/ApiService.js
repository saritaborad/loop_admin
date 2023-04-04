const axios = require("axios");

export function GetApi(path) {
    let tokenData;
    if (localStorage.getItem("loop_token")) {
        tokenData = "Bearer " + localStorage.getItem("loop_token");
    } else {
        tokenData = "";
    }
    const GetApiData = axios
        .get(path, {
            headers: {
                "access-control-allow-origin": "*",
                "device-type": 0,
                "Content-type": "application/json; charset=UTF-8",
                Authorization: tokenData,
            },
        })
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
    return GetApiData;
}
export function PostApi(path, data, token) {
    let tokenData;
    if (localStorage.getItem("loop_token")) {
        tokenData = "Bearer " + localStorage.getItem("loop_token");
    } else {
        tokenData = "";
    }
    let config = {
        headers: { "Content-Type": "application/json", "device-type": 0, Authorization: tokenData },
    };
    const PostApiData = axios
        .post(path, data, config)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            // console.log(err, "service");
            return err.response;
        });
    return PostApiData;
}
