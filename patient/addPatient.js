
/*
添加住院记录
patient/addPatient


patientName
idCardNum
startTime2
hospitalNum

*/
let lodash = require('lodash')
let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    if(method==="get"){
        console.log(!getParams.patientName||!getParams.idCardNum||!getParams.startTime2||!getParams.hospitalNum);

        if((!getParams.patientName||!getParams.idCardNum||!getParams.startTime2||!getParams.hospitalNum)&&!getParams.id){
            callback(200,getResponse(1002,[],"必要参数缺失"));
        }
        else
        {
            let sql=`insert into patientTb (patientName,idCardNum,startTime,hospitalNum) values('${getParams.patientName}','${getParams.idCardNum}','${getParams.startTime2}','${getParams.hospitalNum}')`;
            if(getParams.endTime&&getParams.id)
                sql= `update patientTb set endTime=${getParams.endTime} where patientId=${getParams.id}`
            mysqlQuery({sql}).then((res)=>{
                if(getParams.endTime&&getParams.id)
                    callback(200,getResponse(0,[],"出院成功"))
                else
                    callback(200,getResponse(0,[],"添加成功"))
            }).catch((error)=>{
                console.log("patient/addPatient error \n");
                console.log(error);
                callback(200,getResponse(1003,[]));
            })
        }
    }

    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}