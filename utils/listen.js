//通过路径的判断请求不同的接口
let {splitUrl}=require('./util');
let fs = require("fs");
let Url= require("url");

module.exports=(request,response)=>{
    console.log(request.url);
    let url=`.${Url.parse(request.url.replace("/local",""),true).pathname}.js`;//请求路径
    let method=request.method.toLowerCase();//请求方式
    let getParams=Url.parse(request.url,true).query;//get 请求的参数
    let postParams="";//非 get 请求的参数
    //数组保存文件流
    let chunks=[];
    //获取长度
    let num=0;
    //获取非 get 请求的参数
    request.on("data",(data)=>{
        postParams+=data;
        chunks.push(data);
        num+=data.length;
    });
    //请求结束后进行数据响应
    request.on("end",()=>{
        let postData=postParams;
        //请求静态图片（不是下载图片），而是前端需要使用服务器中的图片，如：头像
        if(Url.parse(request.url).pathname=="/static"){
            console.log("static");
            fs.promises.readFile(getParams.url||"").then((data)=>{
                response.writeHead(200, {'Content-Type': 'image/png'});
                response.end(data);
                return false;
            }).catch((e)=>{console.log(e);return false;})
        }
        else {
            //将非 get 请求的参数转化成对象
            try {
                postParams = eval('(' + postParams + ')');
            } catch (e) {
                postParams = postData;
                console.log("----postParams to json error:" + "\n" + e + '\n' + '----error end!');
            }

            //判断请求路径是否存在
            fs.promises.access(`${url}`).then(
                ()=>{
                    //请求路径存在,获取对应接口的数据
                    require('.'+url)({getParams,postParams,method,chunks,num,response},(code,data)=>{
                        if(code==200){
                            //设置请求头
                            //response.setHeader("Access-Control-Allow-Origin","*");//设置允许跨域
                            response.writeHead(code, {'Content-Type': 'application/json'});//设置响应的数据类型
                            //发送响应信息
                            response.write(JSON.stringify(data));
                        }
                        if(code!=200){
                            //请求不正确，给出相应的提示
                            response.writeHead(code, {'Content-Type': 'text/plain'});
                            //发送响应
                            response.write(data);
                        }
                        //结束响应
                        response.end();
                    })
                },
                (e)=>{
                    //请求路径不存在，返回状态码 404
                    response.writeHead(404, {'Content-Type': 'text/plain'});
                    response.write("Not Found!");
                    console.log("----Not Found:"+"\n"+e+'\n'+'----error end!');
                    response.end();
                })

        }
    })


}