const http=require('https');
const mysql= require('mysql');
const cheerio=require('cheerio');
module.exports=(()=>{
    const mysqlConf={
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'medicalresourceschedulingsystem'
    }

    const getArr=(Items)=>{
        return Items.map((val)=>{
            return [val.provinceShortName,val.currentConfirmedCount,val.confirmedCount,val.suspectedCount,val.deadCount,val.curedCount]
        })
    }
    const getArr2=(Items)=>{
        return Items.map((val)=>{
            return [val.continents,val.provinceName,val.currentConfirmedCount,val.confirmedCount,val.suspectedCount,val.curedCount]
        })
    }
    const mysqlPromise=(sql,data,callback=()=>{})=>{
        return new Promise((resolve,reject)=>{
            let connect=mysql.createConnection(mysqlConf);
            connect.connect();
            connect.query(sql,data,(error,res)=>{
                callback(error,res)
                if(error){
                    reject(error)
                }
                else {
                    resolve(res)
                }
                connect.end();
            })
        })
    }

    let req=http.request(`https://ncov.dxy.cn/ncovh5/view/pneumonia?from=timeline`,res => {

        let chunks = []

        res.on('data', (chunk) => chunks.push(chunk));

        res.on("end", () => {
            let $ = cheerio.load(Buffer.concat(chunks).toString('utf-8'));
            //国内疫情数据
            let obj=JSON.parse($('#getAreaStat').html().slice(27).slice(0,-11))
            //国外疫情数据
            let obj2=JSON.parse($('#getListByCountryTypeService2true').html().slice(48).slice(0,-11));
            let sql;

            mysqlPromise('delete from data',[],(error,res)=>{
                if(error)
                    console.log("清空数据库失败")
                else
                    console.log("清空数据库成功")
            }).then((res)=>{
                sql=`insert into data(province,currentCount,count,suspectedCount,dieCount,okCount) values ?`;
                return mysqlPromise(sql,[getArr(obj)],(error,res)=>{
                    if(error)
                        console.log("国内疫情数据导入失败")
                    else
                        console.log("国内疫情数据导入成功")
                })
            }).then((res)=>{
                return mysqlPromise('delete from outdata',[],(error,res)=>{
                    if(error)
                        console.log("清空数据库失败")
                    else
                        console.log("清空数据库成功")
                })
            }).then(()=>{
                sql=`insert into outdata(continents,provinceName,currentConfirmedCount,confirmedCount,suspectedCount,curedCount) values ?`;
                return mysqlPromise(sql,[getArr2(obj2)],(error,res)=>{
                    if(error)
                        console.log("国外疫情数据导入失败")
                    else
                        console.log("国外疫情数据导入成功")
                })
            }).catch((error)=>{
                console.log(error);
            })



        })
    })
    req.end();
})()


