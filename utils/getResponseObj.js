module.exports=(code,data=[],message="")=>{
    let obj={
        code:code,
        success:true,
        message:message||"请求成功",
        data:data
    }
    if(code==1002)
    {
        obj.success=false;
        obj.message=message;
    }
    else if(code==1003)
    {
        obj.success=false;
        obj.message="未知错误";
    }
    return obj;
}