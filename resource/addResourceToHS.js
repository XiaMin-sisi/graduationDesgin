
/*
医院添加物资种类 / 取用物资
resource/addResourceToHS
suppliesId
userNum
num
subNum --取用物资时的参数
*/

let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    let totalCount=0;
    if(method==="get"){
        if(!getParams.suppliesId||!getParams.userNum||(!getParams.num&&!getParams.subNum)){
            callback(501,"必要参数缺失");
        }
        else {
            let sql = `insert into hospitalSuppliesTb (hospitalNum,suppliesId,hospitalsuppliesNum) values(${getParams.userNum},${getParams.suppliesId},${getParams.num})`;
            if(getParams.subNum)
                sql=`update hospitalSuppliesTb set hospitalsuppliesNum=hospitalsuppliesNum - ${getParams.subNum} where hospitalNum=${getParams.userNum} and suppliesId=${getParams.suppliesId}`
            mysqlQuery({sql: sql}).then((res) => {
                callback(200,getResponse(0, res.res,"医院物资种类添加、修改成功！"));
            }).catch((err) => {
                console.log('resource/getResourceList error \n');
                console.log(err)
            })
        }
    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}