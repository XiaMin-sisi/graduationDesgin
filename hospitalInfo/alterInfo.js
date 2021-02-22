/*
* 修改单个医院信息,通过医院账号
* 参数：
+ 医院账号 -- userNum *
+ 医院名称 -- name *
+ 医院描述 -- describe *
+ 医院地址 -- address  *
+ 医院电话 -- tel *
*/
let {mysql,mysqlConf}= require('../utils/connectMysql');

module.exports=(obj,callback)=>{
    if(obj.method==="put"){
        if(!obj.getParams.userNum)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let connect=mysql.createConnection(mysqlConf);
        let sql=`update hospitalMessTb set hospitalName=(?),hospitalDescribe=(?),hospitalDress=(?),tel=(?) where hospitalNum = (?)`;
        connect.query(sql,[obj.postParams.name,obj.postParams.describe,obj.postParams.address,obj.postParams.tel,obj.postParams.userNum],(error,res)=>{
            if(error)
            {
                callback(200,{success:false,message:"",code:1003,data:error})
            }
            else {
                if(res.affectedRows==0){
                    callback(200,{success:true,message:"修改失败",code:1003,data:res});
                    return ;
                }
                callback(200,{success:true,message:"修改成功",code:0,data:{}});
            }
        });
        connect.end();
    }
    else {
        callback(501,"请求方式不正确，请使用Put请求！");
    }

}