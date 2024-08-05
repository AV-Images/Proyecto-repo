document.getElementById('userForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const res=await fetch('http://localhost:3500/register',{
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
})