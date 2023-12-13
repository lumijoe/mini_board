// app.js
// list3-20(p159)1213

const http = require('http');
const fs = require('fs') 
const ejs = require('ejs') 
const url = require('url') 
const qs = require('querystring') 

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const login_page = fs.readFileSync('./login.ejs', 'utf8');

const max_num = 10;            // 最大補完数
const filename = 'mydata.txt'; // データフィル名
var message_data;              // データ
readFromFile(filename);

var server = http.createServer(getFromClient);

server.listen(3004);
console.log('Server start!');
// ここまでメインプログラム==========

// createServerの処理
function getFromClient(request, response) {
    
    var url_parts = url.parse(request.url, true);
    switch (url_parts.pathname) {
        case '/': // トップメッセージ（メッセージボード）
            response_index(request,response);
            break;

        case '/login': // ログインページ
            response_login(request,response);
            break;

        default:
            // 1213ここまで（p160-45%）


    }
}

