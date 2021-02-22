/*
* 账号登录
* 参数：
* userName *
* passWord *
*/
let {mysql,mysqlConf}= require('../utils/connectMysql');

module.exports=(obj,callback)=>{
    if(obj.method==="post"){
        if(!obj.postParams.userName||!obj.postParams.passWord)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let connect=mysql.createConnection(mysqlConf);
        let sql=`select * from accountTb where accountNum = ${obj.postParams.userName} and accountPwd = ${obj.postParams.passWord}`;
        connect.query(sql,(error,res)=>{
            if(error)
            {
                callback(200,{success:false,message:"deng",code:1003,data:error})
            }
            else {
                if(res.length===0){
                    callback(200,{success:true,message:"密码或账号错误！",code:1002,data:res[0]});
                    return ;
                }
                callback(200,{success:true,message:"登录成功",code:0,data:res[0]});
            }
        });
        connect.end();
    }
    else {
        callback(501,"请求方式不正确，请使用Post请求！");
    }

}