document.addEventListener('DOMContentLoaded',async (req,res)=>{
    const cookieJWT= document.cookie.split("; ").find(cookie=>cookie.startsWith("jwt=")).slice(4);
    const us=await fetch('http://localhost:3500/getUser',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            cookie: cookieJWT
        })
    })
    const user=await us.json();
    const id=user.id_usuario;
    
})