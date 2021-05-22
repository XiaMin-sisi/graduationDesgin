/*
*获取国外疫情数据
*method:get
*
* */
let mysqlQuery=require('../utils/mysqlQyery');

module.exports=({getParams,postParams,method,chunks,num,response},callback)=>{
    if(method!="get")
    {
        callback(501,"请求参数不正确")
    }
    else{
        mysqlQuery({sql:'select * from outdata'}).then((res)=>{
            callback(200,{success:true,message:"获取成功",code:0,data:res.res})
        }).catch((error)=>{
            callback(200,{success:false,message:"未知错误",data:{},code:1002})
            console.log("error:data/data")
            console.log(error)
        })
    }
}