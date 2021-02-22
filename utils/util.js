module.exports={
    splitUrl:(url)=>{
        let arr=url.split("/");
        arr.shift();
        let str="";
        arr.forEach((val,index)=>{
            console.log(index)
            if(index==0){
                str=str+val;
            }
            else {
                str=str+val.replace(val[0],val[0].toUpperCase());
            }
        })
        return str;
    }
}