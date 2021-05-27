
/*
申请物资（新增）  修改（审批）
resource/applyResource
suppliesId
userNum
num
operation --0未操作 1 同意 2 拒绝
applyId
*/

let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){
            let sql = `insert into applyTb (hospitalNum,suppliesId,suppliesNum,operationRes) values(${getParams.userNum},${getParams.suppliesId},${getParams.num},0)`;
            let result;
            if(getParams.applyId)
            {
                sql=`update applyTb set operationRes=${getParams.operation} where applyId=${getParams.applyId}`;
                mysqlQuery({sql}).then((res)=>{
                    if(getParams.operation=="2")
                        return Promise.reject("拒绝");
                    sql='select * from applyTb where applyId='+getParams.applyId;
                    return mysqlQuery({sql})
                }).then((res)=>{
                    result=res;
                    sql=`update suppliesTb set suppliesSum=suppliesSum-${res.res[0].suppliesNum} where suppliesId=${res.res[0].suppliesId} and suppliesSum >= ${res.res[0].suppliesNum}`
                    return mysqlQuery({sql})
                }).then((res)=>{
                    if(res.affectedRows==0)
                        return Promise.reject("库存不足");
                    sql=`update hospitalSuppliesTb set hospitalsuppliesNum=hospitalsuppliesNum+${result.res[0].suppliesNum} where suppliesId=${result.res[0].suppliesId} and hospitalNum=${result.res[0].hospitalNum}`
                    return mysqlQuery({sql})
                }).then(()=>{
                    callback(200,getResponse(0,[],"同意该申请成功"))
                }).catch((error)=>{
                    console.log(error)
                    if(error=="拒绝")
                        callback(200,getResponse(0,[],"拒绝该申请成功"))
                    else if(error=="库存不足")
                        callback(200,getResponse(1002,[],error))
                    else
                        callback(200,getResponse(1003))
                })
            }
            else{
                mysqlQuery({sql: sql}).then((res) => {
                    callback(200,getResponse(0, res.res,"物资申请提交、审批成功！"));
                }).catch((err) => {
                    console.log('resource/getResourceList error \n');
                    console.log(err)
                    callback(200,getResponse(1003,[]))
                })
            }

    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}