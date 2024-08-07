document.addEventListener('DOMContentLoaded',async ()=>{
    const imagenes=await fetch('http://localhost:3501/getImgCarros',{
        method:"POST"
    })
    console.log('pum')
    console.log(imagenes)
    const divImg=document.getElementById('imagenes')
    //console.log(imagenes[0]);
    const img=document.createElement('img')
    //img.src=imagenes[0].datos;
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