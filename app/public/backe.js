document.getElementById('imgForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(e);
})

document.getElementById('images').addEventListener('change', function(event) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = ''; // Limpiar las vistas previas anteriores
    const files = event.target.files;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});