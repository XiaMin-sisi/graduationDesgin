
/*
resource/getResourceIdList
获取物资id列表
userNum
*/

let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    if(method==="get"){

            let sql=`select * from suppliesTb where suppliesId not in (select suppliesId from hospitalSuppliesTb where hospitalNum=${getParams.userNum})`;
            mysqlQuery({sql}).then((res)=>{
                callback(200,getResponse(0, res.res,"物资种类添加、修改成功！"));
            }).catch((error)=>{
                console.log("resource/getResourceIdList error \n");
                console.log(error);
                callback(200,getResponse(1002,[]));
            })
    }
    else {
        callback(501,"请求方式不正确，请使用get请求！");
    }

}