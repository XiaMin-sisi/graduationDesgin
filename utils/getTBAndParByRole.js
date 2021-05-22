module.exports=(role)=>{
    let obj={
        tbName:"hospitalmesstb",
        userNum:"hospitalNum",
    }
    if(role==0)
    {
        obj={
            tbName:"adminTb",
            userNum:"adminNum",
        }
    }
    if(role==2)
    {
        obj={
            tbName:"volunteerstb",
            userNum:"volunteerNum",
        }
    }
    return obj
}