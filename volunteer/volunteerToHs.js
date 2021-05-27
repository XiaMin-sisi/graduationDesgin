
/*
获取志愿者列表
volunteer/volunteerToHs

userNum
ids

*/
let lodash = require('lodash')
let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){
        let sql=`update volunteersTb set volunteersTb.hospitalNum=${getParams.userNum} where volunteersTb.volunteerNum in (${getParams.ids}) and volunteersTb.isJoin=1 and volunteersTb.hospitalNum is null`
        console.log(sql);
        mysqlQuery({sql:sql}).then((res)=>{
        callback(200,getResponse(0,
                {data:lodash.chunk(res.res, getParams.pageSize)[getParams.pageNum - 1],totalCount:res.res.length}
            ))
        }).catch((error)=>{
            console.log("volunteer/volunteerToHs error \n");
            console.log(error);
            callback(200,getResponse(1003,[]));
        })
    }

    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}