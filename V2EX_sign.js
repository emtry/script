const axios = require('axios');

// 自定义
// Cookie
let Cookie = process.env.V2EX_COOKIE || "";

// User-Agent
let UserAgent = process.env.V2EX_UserAgent || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15";

console.log("\nV2EX_sign\nVersion 1.0.0\n")

// 创建axios实例
const axios_V2EX = axios.create({
    baseURL: 'https://www.v2ex.com/',
    timeout: 0,
    headers: {
        "Cookie": Cookie,
        "User-Agent": UserAgent
    },
    withCredentials: true
});

// 判断是否登录 
axios_V2EX.get('/', {})
    .then(function (response) {
        if (response.status == 200) {
            let regex = />登录</;
            let m = regex.exec(response.data);
            if (m) {
                console.log('未登录');
            } else {
                // 判断是否已签到
                axios_V2EX.get('/mission/daily', {})
                    .then(function (response) {
                        if (response.status == 200) {
                            let regex = /每日登录奖励已领取/;
                            let m = regex.exec(response.data);
                            if (m) {
                                console.log('今日已签到');
                                if (response.status == 200) {
                                    let regex = /已连续登录 [1-9]* 天/;
                                    let m = regex.exec(response.data);
                                    if (m) {
                                        console.log(m[0]);
                                    }
                                } else {
                                    console.log('未知错误');
                                    console.log(response.data);
                                }
                            } else {
                                regex = /value="领取 X 铜币" onclick="location\.href = '(.*?)'/gm;
                                m = regex.exec(response.data);
                                // 签到
                                axios_V2EX.get(m[1], {})
                                    .then(function (response) {
                                        if (response.status == 200) {
                                            let regex = /已连续登录 [1-9]* 天/;
                                            let m = regex.exec(response.data);
                                            if (m) {
                                                console.log('签到成功\n' + m[0]);
                                            }
                                        } else {
                                            console.log('未知错误');
                                            console.log(response.data);
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }
                        } else {
                            console.log('未知错误');
                            console.log(response.data);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            console.log('未知错误');
            console.log(response.data);
        }
    })
    .catch(function (error) {
        console.log(error);
    });