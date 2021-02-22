//通过路径的判断请求不同的接口
let {splitUrl}=require('./util');
let fs = require("fs");
let Url= require("url");

module.exports=(request,response)=>{

    let url=`.${Url.parse(request.url,true).pathname}.js`;//请求路径
    let method=request.method.toLowerCase();//请求方式
    let getParams=Url.parse(request.url,true).query;//get 请求的参数
    let postParams="";//非 get 请求的参数

    //获取非 get 请求的参数
    request.on("data",(data)=>{
        postParams+=data
    });

    //请求结束后进行数据响应
    request.on("end",()=>{
        //将非 get 请求的参数转化成对象
        postParams=eval('('+postParams+')');

        //判断请求路径是否存在
        fs.promises.access(`${url}`).then(
            ()=>{
                //请求路径存在,获取对应接口的数据
                require('.'+url)({getParams,postParams,method},(code,data)=>{
                    if(code==200){
                        //设置请求头
                        response.writeHead(code, {'Content-Type': 'application/json'});
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
            ()=>{
                //请求路径不存在，返回状态码 404
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.write("Not Found!");
                console.log("请求不存在");
                response.end();
            })
    })


}