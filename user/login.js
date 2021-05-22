/*
* 账号登录
* 参数：
* userName *
* passWord *
*/
let mysqlQuery=require('../utils/mysqlQyery')
module.exports=(obj,callback)=>{
    if(obj.method==="post"){
        if(!obj.postParams.userName||!obj.postParams.passWord)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
        let sql=`select * from accountTb where accountNum = '${obj.postParams.userName}' and accountPwd = "${obj.postParams.passWord}"`;

        mysqlQuery({sql}).then(({res})=>{
            if(res.length===0){
                console.log(sql);
                callback(200,{success:true,message:"密码或账号错误！",code:1002,data:res[0]});
                return Promise.reject(0);
            }
            let tbName="adminTb";
            let numName="adminNum";
            let name="adminName";
            if(res[0].accountRole==1)
            {
                tbName="hospitalMessTb";
                numName="hospitalNum";
                name="hospitalName";
            }
            else if(res[0].accountRole==2)
            {
                tbName="volunteersTb";
                numName="volunteerNum";
                name="volunteerName";
            }
            sql=`select * from ${tbName} where ${numName} ='${res[0].accountNum}'`
            return mysqlQuery({sql,params:{res:res,name:name}});
        }).then(({res:data,params:{res,name}})=>{
            data[0].accountRole=res[0].accountRole;
            data[0].userName=data[0][name];
            console.log(data[0])
            callback(200,{success:true,message:"登录成功",code:0,data:data[0]});
        }).catch((error)=>{
            if(error===0){
                return ;
            }
            else
            callback(200,{success:false,message:"未知错误",code:1003,data:error});
        })
    }
    else {
        callback(501,"请求方式不正确，请使用Post请求！");
    }

}