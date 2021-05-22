
/*
医院查看医院物资库存
resource/getHospitalResource
userNum
pageNum
pageSize
id
name
*/

let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){
        let  sql=`select count(*) as sum from hospitalSuppliesTb join suppliesTb  on suppliesTb.suppliesId=hospitalSuppliesTb.suppliesId where hospitalSuppliesTb.hospitalNum=${getParams.userNum} and hospitalSuppliesTb.suppliesId like "${getParams.id||'%'}" and suppliesName like '${getParams.name||"%"}'`;
        mysqlQuery({sql:sql}).then((res)=>{
            console.log(res.res[0].sum);
            totalCount=res.res[0].sum;
            let min=(getParams.pageNum-1)*getParams.pageSize||0;
            let max=getParams.pageSize*getParams.pageNum||0;
            sql=`select hospitalSuppliesTb.suppliesId,hospitalsuppliesNum,suppliesName,suppliesSum from hospitalSuppliesTb join suppliesTb  on suppliesTb.suppliesId=hospitalSuppliesTb.suppliesId where hospitalSuppliesTb.hospitalNum=${getParams.userNum} and hospitalSuppliesTb.suppliesId like "${getParams.id||'%'}" and suppliesName like '${getParams.name||"%"}' limit ${min},${max}`;
            console.log(sql);
            return mysqlQuery({sql})
        }).then((res)=>{
            console.log(res.res)
            callback(200,getResponse(0, {data:res.res,totalCount:totalCount},""))
        }).catch((err)=>{
            console.log('resource/getResourceList error \n');
            console.log(err)
            callback(200,getResponse(1003,[]))
        })
    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}