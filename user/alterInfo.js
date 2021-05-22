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
        let sql=`update ${obj(getParams.role).tbName} set email='${getParams.email}',adminName='${getParams.name}' where ${obj(getParams.role).userNum} = ${getParams.userName}`
        if(getParams.role==1)
            sql=`update ${obj(getParams.role).tbName} set email='${getParams.email}',hospitalName='${getParams.name}',hospitalDescribe='${getParams.hospitalDescribe}',hospitalDress='${getParams.hospitalDress}' where ${obj(getParams.role).userNum} = ${getParams.userName}`
        if(getParams.role==2)
            sql=`update ${obj(getParams.role).tbName} set email='${getParams.email}',volunteerName='${getParams.name}',volunteerId='${getParams.volunteerId}' where ${obj(getParams.role).userNum} = ${getParams.userName}`
        mysqlQuery({sql}).then((res)=>{
            callback(200,getResponse(0, [],"修改成功"));
        }).catch((error)=>{
            console.log("user/alterInfo error \n");
            console.log(error);
            callback(200,getResponse(1002,[]));
        })

    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}