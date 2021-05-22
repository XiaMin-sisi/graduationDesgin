/*
* 密码修改
* 参数：
* userName *
* oldPwd *
* newPwd *
*/
let {mysql,mysqlConf}= require('../utils/connectMysql');

module.exports=(obj,callback)=>{
    if(obj.method==="put"){
        if(!obj.postParams.userName||!obj.postParams.newPwd||!obj.postParams.oldPwd)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let connect=mysql.createConnection(mysqlConf);
        let sql=`update accountTb set accountPwd = '${obj.postParams.newPwd}' where accountNum = ${obj.postParams.userName} and accountPwd ='${obj.postParams.oldPwd}'`;
        connect.query(sql,(error,res)=>{
            if(error)
            {
                console.log(error);
                callback(200,{success:false,message:"修改失败",code:1003,data:error})
            }
            else {
                if(res.affectedRows==0){
                    callback(200,{success:true,message:"旧密码不正确，请检查账号和密码",code:0,data:{}});
                }
                else {
                    callback(200,{success:true,message:"修改成功",code:0,data:{}});
                }
            }
        });
        connect.end();
    }
    else {
        callback(501,"请求方式不正确，请使用Put请求！");
    }

}