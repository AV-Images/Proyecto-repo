window.onload = function() {
    var elem = document.querySelector('.gallery');
    var msnry = new Masonry(elem, {
        // Opciones
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-item',
        percentPosition: true
    });
};

function addToFavorites(imageSrc) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(imageSrc)) {
        favorites.push(imageSrc);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Imagen agregada a favoritos');
    } else {
        alert('Esta imagen ya está en tus favoritos');
    }
}