const axios = require('axios');
const iconv = require('iconv-lite');

// 自定义
// Cookie
let Cookie = process.env.Hao4K_COOKIE || "";

// User-Agent
let UserAgent = process.env.Hao4K_UserAgent || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15";

console.log("\nHao4K_sign\nVersion 1.0.0\n")

// 创建axios实例
const axios_Hao4K = axios.create({
    baseURL: 'https://www.hao4k.cn/',
    timeout: 0,
    headers: {
        "Cookie": Cookie,
        "User-Agent": UserAgent
    },
    withCredentials: true,
    responseType: "arraybuffer"
});

// 判断是否登录 
axios_Hao4K.get('/', {})
    .then(function (response) {
        if (response.status == 200) {
            let regex = />登录网站</;
            let m = regex.exec(iconv.decode(response.data, 'gbk'));
            if (m) {
                console.log('未登录');
            } else {
                // 判断是否已签到
                axios_Hao4K.get('/qiandao', {})
                    .then(function (response) {
                        if (response.status == 200) {
                            let regex = /您的签到排名/;
                            let m = regex.exec(iconv.decode(response.data, 'gbk'));
                            if (m) {
                                console.log('今日已签到');
                            } else {
                                regex = /id="JD_sign" href=\"(.*?)\" onclick=/gm;
                                m = regex.exec(iconv.decode(response.data, 'gbk'));
                                // 签到
                                axios_Hao4K.get(m[1], {})
                                    .then(function (response) {
                                        if (response.status == 200) {
                                            let regex = /您的签到排名/;
                                            let m = regex.exec(response.data);
                                            if (m) {
                                                console.log('签到成功');
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