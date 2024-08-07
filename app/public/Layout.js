document.addEventListener('DOMContentLoaded',async ()=>{
    const longitud=await fetch('http://localhost:3501/longCarr',{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body:JSON.stringify({
            tabla:1
        })

    })
    const res=await longitud.json();
    const le=res[0].largo

    //Meter las imagenes
    const Cont_Img=document.getElementById('gallery')

    for(let i=0;i<le;i++){

        const div_img=document.createElement('div');
        div_img.className='gallery-item';

        const img=document.createElement('img')
        img.src='/getImgCarros?id='+1;
        divImg.appendChild(img);

        const boton=document.createElement('button');
        
    }
})

function addToFavorites(imageSrc) {
    console.log(imageSrc);
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    if (!favorites.includes(imageSrc)) {
        favorites.push(imageSrc);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Imagen agregada a favoritos');
    } else {
        alert('Esta imagen ya está en tus favoritos');
    }
}