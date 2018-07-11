// 引入http 模块
let http = require('http');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let querystring = require('querystring')
// 拼接根目录的路径 __dirname 获取的是当前的js文件所在的文件夹,但是页面所有的东西都
// 放在www目录下,所以拼接目录时要加上www
let rootPath = path.join(__dirname,'www');
let server = http.createServer((request,response)=>{
    // 拼接绝对路径
    // D:\就业班\nodeJS\代码练习\06.Apache_last\www\%E5%B0%8F%E8%A7%86%E9%A2%91
    // 浏览器会对中文进行编码,我们需要进行解密后中文路径才能正常显示
    // D:\就业班\nodeJS\代码练习\06.Apache_last\www\小视频
    let filePath = path.join(rootPath,querystring.unescape(request.url));
    console.log(filePath);
    
    // 1.判断文件是否存在 fs.existsSync(路径) 返回true/false
   let exists = fs.existsSync(filePath);
   if(exists){
        //文件存在(files是一个字符串数组)
        fs.readdir(filePath,(err,files)=>{
            if(err){
                // 单个文件 直接读取
                fs.readFile(filePath,(err,data)=>{
                    response.writeHead(200,{
                        // 拼接上编码格式
                        'content-type':mime.getType(filePath)+ ';charset=utf-8'
                    })
                    response.end(data);
                });
            }else{
                // 文件夹
                // 是否有首页
                if(files.indexOf('index.html')!=-1){
                    // 有首页,就跳到首页
                    fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                        response.end(data);
                    })
                }else{
                    // 没有首页,展示文件列表(要遍历数组)
                    let backData = '';
                    for (let i = 0; i < files.length; i++) {
                        // 如果是根目录就不拼接,不是根目录就拼接上 上级目录
                        backData += `<h2><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h2>`;
                    }
                    response.writeHead(200,{
                        'content-type':'text/html;charset=utf-8'
                    });
                    response.end(backData);
                }
            }
        })
   }else{
        //文件不存在 404
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        });
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /index.hththt was not found on this server.</p>
        </body></html>`);
   }
   

});
server.listen(8888,'127.0.0.1',()=>{
    console.log("成功监听 127.0.0.1:8888");
    
})