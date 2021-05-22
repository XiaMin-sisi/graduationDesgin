
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
        if(!getParams.suppliesId||!getParams.userNum||!getParams.num){
            callback(501,"必要参数缺失");
        }
        else {
            let sql = `insert into applyTb (hospitalNum,suppliesId,suppliesNum,operationRes) values(${getParams.userNum},${getParams.suppliesId},${getParams.num},0)`;
            if(getParams.applyId)
                sql=`update applyTb set operationRes=${getParams.operation} where applyId=${getParams.applyId}`
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