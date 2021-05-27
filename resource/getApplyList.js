
/*
医院查看自己的申请列表
中心查看所有的
resource/getApplyList
userNum
pageNum
pageSize
res
name
*/
let lodash = require('lodash')
let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){

            let sql=`select applyTb.*,suppliesTb.suppliesName,suppliesTb.suppliesSum,adminTb.adminName,hospitalMesstb.hospitalName from applyTb,suppliesTb,adminTb,hospitalMesstb where hospitalMesstb.hospitalNum=applyTb.hospitalNum and suppliesTb.suppliesId=applyTb.suppliesId and applyTb.operationAccount=adminTb.adminNum and applyTb.hospitalNum like '${getParams.userNum||"%"}' and applyTb.operationRes like '${getParams.res||"%"}' and suppliesTb.suppliesName like '${getParams.name||'%'}' and applyTb.operationAccount is not null`
            let sql2=`select applyTb.*,suppliesTb.suppliesName,suppliesTb.suppliesSum,null as adminName,hospitalMesstb.hospitalName from applyTb,suppliesTb,hospitalMesstb where hospitalMesstb.hospitalNum=applyTb.hospitalNum and suppliesTb.suppliesId=applyTb.suppliesId  and applyTb.hospitalNum like '${getParams.userNum||'%'}' and applyTb.operationRes like '%${getParams.res||"%"}%' and suppliesTb.suppliesName like '%${getParams.name||'%'}%' and applyTb.operationAccount is null`
            mysqlQuery({sql:sql+" union "+sql2}).then((res)=>{
                callback(200,getResponse(0,
                    {data:lodash.chunk(res.res, getParams.pageSize)[getParams.pageNum - 1],totalCount:res.res.length}
                        ))
            }).catch((error)=>{
                console.log("resource/getApplyList error \n");
                console.log(error);
                callback(200,getResponse(1002,[]));
            })
        }

    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}