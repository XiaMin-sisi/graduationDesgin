/*
使用promise封装mysql的查询
多次查询可以使用链式操作，解决深度异步嵌套问题
内置mysql连接操作，简化查询步骤。只需要传入sql即可。不需要手动连接、关闭数据库
*/
let {mysql,mysqlConf}= require('./connectMysql');
/*
sql: 需要执行的sql语句,必须要传
paramsArr: 如果你使用的是预处理的sql那么就需要把sql的参数数组传递
params: 需要传递的其他参数，没有这个需求可以忽略这个参数
*/
module.exports=({sql,paramsArr,params={}})=>{
    return new Promise((resolve, reject)=>{
        let connect=mysql.createConnection(mysqlConf);
        if(paramsArr&&paramsArr.length>0){
            connect.query(sql,paramsArr,(error,res)=>{
                connect.end();
                if(error)
                    reject(error)
                else
                    resolve({res,params})
            })
        }
        else{
            connect.query(sql,(error,res)=>{
                connect.end();
                if(error)
                    reject(error)
                else
                    resolve({res,params})
            })
        }
    })
}


