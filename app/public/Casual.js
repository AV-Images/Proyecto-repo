document.addEventListener('DOMContentLoaded',async ()=>{
    const longitud=await fetch('http://localhost:3500/longCarr',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            tabla:2
        })

    })
    const res=await longitud.json();
    const le=res[0].largo
    console.log(le)

    //Meter las imagenes
    const Cont_Img=document.getElementById('gallery')

    let i=1;
    do{
       
        console.log('Morenos')
        const div_img=document.createElement('div');
        div_img.className='gallery-item';

        const img=document.createElement('img')
        img.src='/getImgCasual?id='+i;

        const boton=document.createElement('button');
        boton.className='favorite-button';
        boton.innerHTML='Añadir a favoritos'
        const ruta=img.src;
        console.log(ruta.slice(21));
        boton.onclick=()=>addToFavorites(ruta.slice(21))

        const a=document.createElement('a');
        a.href='/downloadCasual?name='+ruta.slice(21);
        a.className='download-button';
        a.innerHTML='Descargar'

        div_img.appendChild(img);
        div_img.appendChild(boton);
        div_img.appendChild(a)
        Cont_Img.appendChild(div_img);
        i++
    }while(i<le)
    console.log('blanco')
})

async function addToFavorites(imageSrc) {
    const cookieJWT= document.cookie.split("; ").find(cookie=>cookie.startsWith("jwt=")).slice(4);
    console.log(cookieJWT);
    const res= await fetch('/addFav',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            src: imageSrc,
            cookie: cookieJWT
        })
    })
}