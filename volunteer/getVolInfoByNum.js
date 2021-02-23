let {mysql,mysqlConf}= require('../utils/connectMysql');

module.exports=(obj,callback)=>{
    if(obj.method==="get"){
        if(!obj.getParams.userNum)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let connect=mysql.createConnection(mysqlConf);
        let sql=`select * from volunteersTb where volunteerNum = ${obj.getParams.userNum}`;
        connect.query(sql,(error,res)=>{
            if(error)
            {
                callback(200,{success:false,message:"",code:1003,data:error})
            }
            else {
                if(res.length===0){
                    callback(200,{success:true,message:"未找到该信息，请确认账号正确性！",code:1002,data:res[0]});
                    return ;
                }
                callback(200,{success:true,message:"ok",code:0,data:res[0]});
            }
        });
        connect.end();
    }
    else {
        callback(501,"请求方式不正确，请使用Get请求！");
    }

}