
/*
获取所有的物资名称和id
*/
let lodash = require('lodash')
let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){
        if(!getParams.userNum){
            callback(501,"必要参数缺失");
        }
        else{
            let sql=`select applyTb.*,suppliesTb.suppliesName,adminTb.adminName from applyTb,suppliesTb,adminTb where suppliesTb.suppliesId=applyTb.suppliesId and applyTb.operationAccount=adminTb.adminNum and applyTb.hospitalNum=${getParams.userNum} and applyTb.operationRes like '${getParams.res||"%"}' and suppliesTb.suppliesName like '${getParams.name||'%'}' and applyTb.operationAccount is not null`
            let sql2=`select applyTb.*,suppliesTb.suppliesName,null as adminName from applyTb,suppliesTb where suppliesTb.suppliesId=applyTb.suppliesId  and applyTb.hospitalNum=${getParams.userNum} and applyTb.operationRes like '%${getParams.res||"%"}%' and suppliesTb.suppliesName like '%${getParams.name||'%'}%' and applyTb.operationAccount is null`
            mysqlQuery({sql:sql+" union "+sql2}).then((res)=>{
                console.log(sql+" union "+sql2);
                callback(200,getResponse(0,
                    {data:lodash.chunk(res.res, getParams.pageSize)[getParams.pageNum - 1],totalCount:res.res.length}
                ))
            }).catch((error)=>{
                console.log("resource/getApplyList error \n");
                console.log(error);
                callback(200,getResponse(1002,[]));
            })
        }
    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}