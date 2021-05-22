
/*
管理员添加物资
resource/addResource
name
num
*/

let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    if(method==="get"){
        if(!getParams.name){
            callback(501,"必要参数缺失");
        }
        else{
            let sql=`insert into suppliesTb (suppliesName,suppliesSum) values('${getParams.name}',${getParams.num||0})`;
            if(getParams.rowId)
                sql=`update suppliesTb set suppliesName='${getParams.name}',suppliesSum='${getParams.num}' where suppliesId=${getParams.rowId}`
            mysqlQuery({sql}).then((res)=>{
                callback(200,getResponse(0, res.res,"物资种类添加、修改成功！"));
            }).catch((error)=>{
                console.log("user/alterInfo error \n");
                console.log(error);
                callback(200,getResponse(1002,[]));
            })
        }
    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}