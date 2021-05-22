/*
* type:
* avatar=>上传头像
* role:用户角色 adminTb volunteerstb hospitalmesstb
* userNum:用户账号
* */
let mysqlQuery=require('../utils/mysqlQyery');
let fs=require('fs');
let uuid=require('node-uuid')
module.exports=({getParams,postParams,chunks,num},callback)=>{
    if(getParams.type=="avatar"){
        if(!getParams.role||!getParams.userNum)
        {
            callback(502,"必要参数缺失或不正确");
            return ;
        }
    }
    //最终流的内容本体
    let buffer=Buffer.concat(chunks,num);
    //新建数组接收出去\r\n的数据下标
    let rems=[];
    //根据\r\n分离数据和报头
    for (let i = 0; i < buffer.length; i++) {
        let v=buffer[i];
        let v2=buffer[i+1];
        // 10代表\n 13代表\r
        if (v==13&&v2==10) {
            rems.push(i)
        }
    }
    //获取上传文件信息
    let picmsg_1 = buffer.slice(rems[0]+2,rems[1]).toString();

    let filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];

    //文件数据
    let nbuf = buffer.slice(rems[3]+2,rems[rems.length-2]);
    let address;
    if(getParams.type=="avatar")
        address="./public/avatar/"+uuid.v1()+filename;
    else
        address="./public/file/"+filename;
    //创建空文件并写入内容
    fs.writeFile(address,nbuf,function(err){
        if (err) {
            callback(200,{success:false,message:"未知错误",code:1003,data:"error"})
        }else{
            if(getParams.type=="avatar"){
              mysqlQuery({sql:`update ${getParams.role} set imgUrl = 'http://localhost:3000/static?url=${address}'`}).then((res)=>{
                  callback(200,{success:true,message:"上传成功",code:0,data:`http://localhost:3000/static?url=${address}`})
              }).catch((error)=>{
                  console.log("uploadFile error \n");
                  console.log(error)
              })
            }
            else
            callback(200,{success:true,message:"上传成功",code:0,data:"success"})
        }
    })

}