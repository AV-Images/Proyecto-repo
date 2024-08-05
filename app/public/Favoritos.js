        // Cargar las imágenes favoritas desde el almacenamiento local
        window.onload = function() {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            let gallery = document.getElementById('favorites-gallery');

            if (favorites.length === 0) {
                gallery.innerHTML = '<p>No tienes imágenes favoritas.</p>';
            } else {
                favorites.forEach(src => {
                    let div = document.createElement('div');
                    div.className = 'gallery-item';
                    let img = document.createElement('img');
                    img.src = src;
                    let button = document.createElement('button');
                    button.className = 'remove-button';
                    button.innerText = 'Quitar de Favoritos';
                    button.onclick = function() { removeFromFavorites(src); };
                    div.appendChild(img);
                    div.appendChild(button);
                    gallery.appendChild(div);
                });

                // Iniciar Masonry después de cargar las imágenes
                //var msnry = new Masonry(gallery, {
                //    itemSelector: '.gallery-item',
                //    columnWidth: '.gallery-item',
                //    percentPosition: true
                //});
            }
        };

        // Función para eliminar una imagen de los favoritos
        function removeFromFavorites(imageSrc) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(src => src !== imageSrc);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Imagen eliminada de favoritos');
            location.reload(); // Recargar la página para actualizar la lista de favoritos
        }