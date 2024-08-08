document.addEventListener('DOMContentLoaded',async ()=>{
    const cookieJWT= document.cookie.split("; ").find(cookie=>cookie.startsWith("jwt=")).slice(4);
    const best=await fetch('/getFavorites',{
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
    if(!fav || fav.length===0){
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
            //boton.onclick=()=>removeFavorites()

            div_img.appendChild(img);
            div_img.appendChild(boton);
            Cont_Img.appendChild(div_img);
            i++
        } while (i<fav.length);
    }
})

        // Función para eliminar una imagen de los favoritos
        function removeFromFavorites(imageSrc) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(src => src !== imageSrc);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Imagen eliminada de favoritos');
            location.reload(); // Recargar la página para actualizar la lista de favoritos
        }