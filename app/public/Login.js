document.getElementById('loginForm').addEventListener('submit',async (e)=>{
    e.preventDefault();
    const email=e.target.email.value;
    const password=e.target.pass.value;
    const res=await fetch("https://proyecto-repo.onrender.com/login",{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email,password
        })
    });
    if(!res.ok) return;
    const resJson= await res.json();
    if(resJson.redirect){
        window.location.href=resJson.redirect;
    }
})