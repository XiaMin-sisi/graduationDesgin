/*
* 用户注册
* 参数：
* userName *
* passWord 默认为 123456
* userRole *
*/

let {mysql,mysqlConf}= require('../utils/connectMysql');

module.exports=(obj,callback)=>{
    if(obj.method==="get"){
        if(!obj.getParams.userName||!obj.getParams.userRole)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let connect=mysql.createConnection(mysqlConf);
        let sql=`insert into accountTb(accountNum,accountPwd,accountRole) values(?,?,?)`;
        connect.query(sql,[obj.getParams.userName,obj.getParams.passWord?obj.getParams.passWord:'123456',obj.getParams.userRole],(error,res)=>{
            if(error)
            {
                if(error.errno==1062)
                {
                    callback(200,{success:false,message:"账号已被注册！",code:1002,data: {}})
                    return  ;
                }
                callback(200,{success:false,message:"注册失败,未知错误",code:1003,data:error})
            }
            else {
                callback(200,{success:true,message:"注册成功",code:0,data:res[0]});
            }
        });
        connect.end();
    }
    else {
        callback(501,"请求方式不正确，请使用Get请求！");
    }

}