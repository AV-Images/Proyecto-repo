document.getElementById('userForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const res=await fetch('https://proyecto-repo.onrender.com/register',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email: e.target.email.value,
            password: e.target.pass.value,
            phone: e.target.telefono.value,
            name: e.target.Nombre.value
        })
    })
    const resJson= await res.json();
    if(resJson.redirect){
        window.location.href=resJson.redirect;
    }
})