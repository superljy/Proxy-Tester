const express = require('express');
const request = require('request');
const fs = require('fs');
const env = require('dotenv');

env.config();

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

function reqProxy(proxy) {
    // format: http://user:pass@ip:port
    let testProxy = [];
    for (let i = 0; i < proxy.length; i++) {
        let _proxy = proxy[i].split(':');
        if (_proxy.length <= 2) {
            testProxy.push(`http://${proxy[i]}`);
        } else {
            let ip = _proxy[0];
            let port = _proxy[1];
            let user = _proxy[2];
            let pwd = _proxy[3];
            testProxy.push(`http://${user}:${pwd}@${ip}:${port}`);
        }
    }
    return testProxy;
}

function check(proxy, site, callback) {
    let url = null;
    let headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br"
    };
    switch (site) {
        case 'kith':
            url = 'https://www.kith.com';
            headers = {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
            };
            break;
        case 'ys':
            url = 'https://www.yeezysupply.com';
            break;
        case 'supreme':
            url = 'https://www.supremenewyork.com';
            break;
        case 'footlocker':
            url = 'https://www.footlocker.com';
            break;
        case 'nike':
            url = 'https://www.nike.com';
            headers = {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
            };
            break;
        default:
            site = 'google';
            url = 'https://www.google.com';
            break;
    }
    for (let i = 0; i < proxy.length; i++) {
        request({
            url: url,
            headers,
            proxy: proxy[i],
            time: true,
            timeout: 1500
        }, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                console.log(`Testing site : ${site} ,${proxy[i]} result : ${response.responseStartTime - response.timingStart} ms`);
                let timing = response.responseStartTime - response.timingStart;
                if (timing > process.env.DELAY) {
                    proxy.splice(i, 1);
                }
            } else if (err && err.message.match(/403/)) {
                proxy.splice(i, 1);
                console.log('proxy banned');
            } else {
                proxy.splice(i, 1);
                console.log('proxy failed');
            }
            if (callback && typeof (callback) == 'function') {
                callback(proxy);
            }
        })
    }
}

check(reqProxy(arrProxies), process.env.TESTING_SITE, (proxy) => {
    let proxyResult = [];
    proxy.forEach((item) => {
        let index = item.lastIndexOf('\/');
        item = item.substring(index + 1).split('@').reverse().join(':');
        proxyResult.push(item);
    });
    fs.writeFileSync('./filted-proxies.txt', proxyResult.join('\n'), (err) => {
        if (err) throw err;
        console.log('done');
    })
});
