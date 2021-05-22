//下载服务器中的文件
let fs=require('fs')
module.exports=({getParams,postParams,chunks,num,response},callback)=>{
    fs.promises.readFile("./public/avatar/git.md").then((data)=>{
        response.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + "git.md", //文件名根据前端的数据进行设置，我这里写死为了演示
        });
        response.end(data);
        return false;
    }).catch((e)=>{console.log(e);return false;})

}