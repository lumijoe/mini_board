// app.js
// list3-20(p161)1215
// 再確認

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
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('no page...');
            break;
    }
}

// loginのアクセス処理
function response_login(request, response) {
    var content = ejs.render(login_page, {});
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
}

// indexのアクセス処理
function response_index(request, response) {
    // POSTアクセス時の処理
    if (request.method == 'POST') {
        var body = '';
    
        // データ受信のイベント処理
        request.on('data', function (data) {
            body += data;
        });

        // データ受信終了のイベント処理
        request.on('end', function () {
            data = qs.parse(body);
            addToData(data.id, data.msg, filename, request);
            write_index(request, response);
        });
    } else {
        write_index(request, response);
    }
}

// indexのページ作成
function write_index(request, response) {
    var msg = "※何かメッセージを書いてください。";
    var content = ejs.render(index_page, {
        title: 'Index',
        content: msg,
        data:message_data,
        filename: 'data_item',
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
}

// テキストファイルをロード
/* function readFromFile(fname) {
    fs.readFile(fname, 'utf8', (err, data) => {
         message_data = data.split('\n');
    })
}*/
function readFromFile(fname, callback) {
    fs.readFile(fname, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        message_data = data.split('\n');
        callback(); // コールバックの実行
    });
}



// データを更新
function addToData(id, msg, fname, request) {
    var obj = { 'id':id, 'msg':msg };
    var obj_str = JSON.stringify(obj);
    console.log('add data: ' + obj_str);
    message_data.unshift(obj_str);
    if (message_data.length > max_num) {
        message_data.pop();
    }
    saveToFile(fname);
}

// データを保存
function saveToFile(fname) {
    var data_str = message_data.join('\n');
    fs.writeFile( fname, data_str, (err) => {
        if (err) { throw err; }
    });
}


// デバッグ確認
/*
val: ## (p158)1213
/Users/lumi/Desktop/mini_board/node_modules/ejs/lib/ejs.js:361
  throw err;
  ^

SyntaxError: data_item:46
    44|         <table class="table">
    45|             <% for(var i in data) { %>
 >> 46|             <%- include('data_item', {val:data[i]}) %>
    47|             <% } %>
    48|             </table>
    49|     </div>    

/Users/lumi/Desktop/mini_board/data_item.ejs:6
    4| <% if(val != ''){ %>
    5|     <% console.log('val:', val); %>
 >> 6|     <% var obj = JSON.parse(val); %>
    7|     <tr>
    8|         <th><%= obj.id %></th>
    9|         <td><%= obj.msg %></td>

Unexpected token # in JSON at position 0
    at JSON.parse (<anonymous>)
    at eval ("/Users/lumi/Desktop/mini_board/data_item.ejs":18:23)
    at data_item (/Users/lumi/Desktop/mini_board/node_modules/ejs/lib/ejs.js:703:17)
    at include (/Users/lumi/Desktop/mini_board/node_modules/ejs/lib/ejs.js:701:39)
    at eval ("data_item":15:17)
    at data_item (/Users/lumi/Desktop/mini_board/node_modules/ejs/lib/ejs.js:703:17)
    at exports.render (/Users/lumi/Desktop/mini_board/node_modules/ejs/lib/ejs.js:425:37)
    at write_index (/Users/lumi/Desktop/mini_board/app.js:77:23)
    at response_index (/Users/lumi/Desktop/mini_board/app.js:70:9)
    at Server.getFromClient (/Users/lumi/Desktop/mini_board/app.js:30:13) {
  path: 'data_item'
}
*/