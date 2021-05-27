//getPatientList

/*
分页获取医院信息列表
patient/getPatientList

pageNum
pageSize
isJoin 查询条件--是否出院 0 在院 1 出院
id 身份证
*/
let lodash = require('lodash')
let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){
        let sql=`select * from hospitalMessTb where hospitalName like '%${getParams.name||"%"}%' and hospitalNum like '%${getParams.num||"%"}%'`;
        mysqlQuery({sql}).then((res)=>{
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