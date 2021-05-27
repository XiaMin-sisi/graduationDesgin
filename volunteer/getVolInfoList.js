
/*
获取志愿者列表
volunteer/getvolInfoList

pageNum
pageSize
isJoin
*/
let lodash = require('lodash')
let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){

        let sql=`select volunteersTb.*,hospitalMesstb.hospitalName from volunteersTb join hospitalMesstb on hospitalMesstb.hospitalNum=volunteersTb.hospitalNum where volunteersTb.isJoin in (${getParams.isJoin||'0,1'}) and volunteersTb.hospitalNum is not null`;
        let sql2=`select volunteersTb.*,null as hospitalName from volunteersTb  where volunteersTb.isJoin in (${getParams.isJoin||'0,1'}) and volunteersTb.hospitalNum is  null`;
        mysqlQuery({sql:sql+" union "+sql2}).then((res)=>{
                callback(200,getResponse(0,
                    {data:lodash.chunk(res.res, getParams.pageSize)[getParams.pageNum - 1],totalCount:res.res.length}
                ))
            }).catch((error)=>{
                console.log("volunteer/getvolInfoList error \n");
                console.log(error);
                callback(200,getResponse(1003,[]));
            })
        }

    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}