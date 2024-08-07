document.addEventListener('DOMContentLoaded',async ()=>{
    const longitud=await fetch('http://localhost:3501/longCarr',{
        method:"POST"
    })
    const res=await longitud.json();
    console.log(res[0].largo);
    console.log('pum')
    console.log(imagenes)
    const divImg=document.getElementById('imagenes')
    //console.log(imagenes[0]);
    const img=document.createElement('img')
    img.src='/getImgCarros/id='+1;
    divImg.appendChild(img);
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