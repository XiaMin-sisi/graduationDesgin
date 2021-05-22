
/*
resource/deleteResource
管理员删除
ids id数组
*/

let mysqlQuery=require('../utils/mysqlQyery');
let getResponse=require('../utils/getResponseObj');

module.exports=({getParams,postParams,method},callback)=>{
    if(method==="get"){
        if(!getParams.ids){
            callback(501,"必要参数缺失");
        }
        else{
            let sql=`delete from suppliesTb where suppliesId in (${getParams.ids})`;
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