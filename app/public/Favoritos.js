document.addEventListener('DOMContentLoaded',async ()=>{
    const cookieJWT= document.cookie.split("; ").find(cookie=>cookie.startsWith("jwt=")).slice(4);
    const best=await fetch('https://proyecto-repo.onrender.com/getFavorites',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            cookie: cookieJWT
        })
    })
    const fav=await best.json();
    console.log(fav);
    const Cont_Img=document.getElementById('favorites-gallery');
    if(fav.length===0){
        Cont_Img.innerHTML = '<p>No tienes imágenes favoritas.</p>';
    }else{
        let i=0;
        do {
            const div_img=document.createElement('div');
            div_img.className='gallery-item';

            const img=document.createElement('img')
            img.src=fav[i].fk_imagen;

            const boton=document.createElement('button');
            boton.className='favorite-button';
            boton.innerHTML='Eliminar de favoritos'
            boton.onclick=()=>removeFavorites(img.src)

            const ruta=img.src;
            const a=document.createElement('a');
            a.href='/downloadCarros?name='+ruta.slice(21);
            a.className='download-button';
            a.innerHTML='Descargar'

            div_img.appendChild(img);
            div_img.appendChild(boton);
            div_img.appendChild(a);
            Cont_Img.appendChild(div_img);
            i++
        } while (i<fav.length);
    }
})

// Función para eliminar una imagen de los favoritos
async function removeFavorites(imageSrc){
    const cookieJWT= document.cookie.split("; ").find(cookie=>cookie.startsWith("jwt=")).slice(4);
    const res=await fetch('/getUser',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            cookie: cookieJWT
        })
    })
    const resJson=await res.json();
    console.log(resJson);
    const ans=await fetch('delFav',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            id: resJson.id_usuario,
            img: imageSrc.slice(21)
        })
    })
    const answer= await ans.json();
    if(answer.redirect){
        window.location.href=answer.redirect;
    }
}