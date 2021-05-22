/*
user/getInfo
role--角色
userName -- 账号
*/
let mysqlQuery=require('../utils/mysqlQyery');
let obj=require('../utils/getTBAndParByRole');
let getResponse=require('../utils/getResponseObj');
module.exports=({getParams,postParams,method},callback)=>{
    if(method==="get"){
        if(!getParams.role||!getParams.userName)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let sql=`select * from ${obj(getParams.role).tbName} where ${obj(getParams.role).userNum} = ${getParams.userName}`;
        mysqlQuery({sql}).then((res)=>{
                callback(200,getResponse(0,res.res))
        }).catch((error)=>{
            console.log("user/getInfo error \n");
            console.log(error);
            callback(200,getResponse(1002,[]));
        })

    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}