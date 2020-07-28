const express = require('express');
const request = require('request');
const fs = require('fs');

//利用插件形式使require读取txt 返回字符串形式
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf-8');
}
let proxies = require('./proxies/proxies.txt');

let app = express();

app.listen('3022', () => {
    console.log('Start Testing');
})

let arrProxies = proxies.split('\r\n');

function reqProxy(proxy){
    // http://user:pass@ip:port
    let testProxy = [];
    for(let i = 0;i<proxy.length;i++){
        let _proxy = proxy[i].split(':');
        let ip = _proxy[0];
        let port = _proxy[1];
        let user = _proxy[2];
        let pwd = _proxy[3];
        testProxy.push(`http://${user}:${pwd}@${ip}:${port}`);
    }
    return testProxy;
}

function check(proxy) {
    let headers = {
        useragent:'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
    };
    for (let i = 0; i < proxy.length; i++) {
        request({
            url: 'https://www.kith.com',
            headers,
            proxy: proxy[i],
            time: true,
            timeout: 1500
        }, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                console.log(`${proxy[i]} result : ${response.responseStartTime - response.timingStart} ms`);
            }else{
                console.log('Test Fail')
            }
        })
    }
}
check(reqProxy(arrProxies));
