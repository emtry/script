const axios = require('axios');
const notify = require('./sendNotify');

// 自定义
// User-Agent
let sid = process.env.XBOXjulebu_sid || "";

let UserAgent = process.env.XBOXjulebu_UserAgent || "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac";

console.log("\nXBOXjulebu_daily\nVersion 1.0.0\n")

// 创建axios实例
const axios_XBOXjulebu = axios.create({
    baseURL: 'https://h5.youzan.com/',
    timeout: 0,
    headers: {
        "user-agent": UserAgent
    }
});


axios_XBOXjulebu.get('/wscump/checkin/checkinV2.json', {
    params: {
        "checkinId" : '1597464',
        "kdt_id" : '100464643',
        "access_token" : '8e2fd3b85697dda73d54d7d684584f'
    },
    headers: {
        "extra-data" : '{"is_weapp":1,"sid":"' + sid + '","version":"2.101.7.101","client":"weapp","bizEnv":"wsc"}'
    },
}).then(function(response) {
    if (response.status == 200) {
        if (response.data.code == 0) {
            console.log(response.data.desc + response.data.data.list.infos.title);
            notify.sendNotify('XBOXjulebu_daily', 'XBOX小程序每日签到完成\n' + response.data.desc + response.data.data.list.infos.title);
        } else {
            console.log(response.data);
        }
    }
}).
catch(function(error) {
    console.log(error);
});
