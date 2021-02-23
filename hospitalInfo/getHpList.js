/*
* 获取所有医院的信息
*/
let {mysql,mysqlConf}= require('../utils/connectMysql');

module.exports=(obj,callback)=>{
    if(obj.method==="get"){
        if(false)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let connect=mysql.createConnection(mysqlConf);
        let sql=`select * from hospitalMessTb`;
        connect.query(sql,(error,res)=>{
            if(error)
            {
                callback(200,{success:false,message:"未知错误",code:1003,data:error})
            }
            else {
                callback(200,{success:true,message:"查询成功",code:0,data:res});
            }
        });
        connect.end();
    }
    else {
        callback(501,"请求方式不正确，请使用Get请求！");
    }

}