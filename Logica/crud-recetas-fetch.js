const BASEURL = 'http://127.0.0.1:5000';
/**
* Función para realizar una petición fetch con JSON.
* @param {string} url - La URL a la que se realizará la petición.
* @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
* @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
* @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
*/
async function fetchData(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null, // Si hay datos, los convierte a JSON y los incluye en el cuerpo
        };
    try {
        const response = await fetch(url, options); // Realiza la petición fetch
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json(); // Devuelve la respuesta en formato JSON
        } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while fetching data. Please try again.');
        }
    }

    async function showRecetas(){
        let recetas = await fetchData(BASEURL+'/api/recetas/', 'GET');
        const tableMovies = document.querySelector('#list-table-recetas tbody');
        tableMovies.innerHTML='';
        recetas.forEach((receta, index) => {
        let tr = `<tr>
        
                <td>${movie.title}</td>
                <td>${movie.director}</td>
                <td>${movie.release_date}</td>
                <td>
                <img src="${movie.banner}" width="30%">
                </td>
                <td>
                <button class="btn-cac" onclick='updateMovie(${movie.id_movie})'><img src="../Imagenes/lapiz.png"></button></img>
                <button class="btn-cac" onclick='deleteMovie(${movie.id_movie})'><img src="../Imagenes/basura.png ></button></img>
                </td>
                </tr>`;
        
        tableMovies.insertAdjacentHTML("beforeend",tr);
        });
        }
/**
* Función para comunicarse con el servidor para poder Crear o Actualizar
* un registro de pelicula
* @returns
*/
async function saveReceta(){
    const id_Receta = document.querySelector('#id_receta').value;
    const name = document.querySelector('#name').value;
    const ingredientes = document.querySelector('#ingredientes').value;
    const releaseDate = document.querySelector('#descripcion').value;
    const cheff = document.querySelector('#cheff').value;
    const precio = document.querySelector('#precio').value;
    //VALIDACION DE FORMULARIO
    if (!name || !ingredientes || !releaseDate || !cheff|| !precio) {
    Swal.fire({
    name: 'Error!',
    text: 'Por favor completa todos los campos.',
    icon: 'error',
    confirmButtonText: 'Cerrar'
    });
    return;
    }
    // Crea un objeto con los datos de la película
    const recetaData = {
    name: name,
    ingredientes: ingredientes,
    descripcion: releaseDate,
    cheff: cheff,
    precio: precio,
    };
    let result = null;
// Si hay un idReceta, realiza una petición PUT para actualizar la película existente
if(id_Receta!==""){
result = await fetchData(`${BASEURL}/api/recetas/${id_Receta}`, 'PUT', recetaData);
}else{
// Si no hay idReceta, realiza una petición POST para crear una nueva película
result = await fetchData(`${BASEURL}/api/recetas/`, 'POST', recetaData);
}
const formMovie = document.querySelector('#form-receta');
formMovie.reset();
Swal.fire({
name: 'Exito!',
text: result.message,
icon: 'success',
confirmButtonText: 'Cerrar'
})
showRecetas();
}


/**
 * Function que permite eliminar una pelicula del array del localstorage
 * de acuedo al indice del mismo
 * @param {number} id posición del array que se va a eliminar
 */
function deleteReceta(id){
    Swal.fire({
        title: "Esta seguro de eliminar la receta?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then(async (result) => {
        if (result.isConfirmed) {
          let response = await fetchData(`${BASEURL}/api/recetas/${id}`, 'DELETE');
          showRecetas();
          Swal.fire(response.message, "", "success");
        }
    });
    
}

/**
 * Function que permite cargar el formulario con los datos de la pelicula 
 * para su edición
 * @param {number} id Id de la pelicula que se quiere editar
 */
async function updateReceta(id){
    //Buscamos en el servidor la pelicula de acuerdo al id
    let response = await fetchData(`${BASEURL}/api/recetas/${id}`, 'GET');
    const id_receta = document.querySelector('#id_receta');
    const name = document.querySelector('#name');
    const ingredientes = document.querySelector('#ingredientes');
    const descripcion = document.querySelector('#descripcion');
    const cheff = document.querySelector('#cheff');
    const precio = document.querySelector('#precio');
    
    id_receta.value = response.id_receta;
    name.value = response.name;
    ingredientes.value = response.ingredientes;
    descripcion.value = response.descripcion;
    cheff.value = response.cheff;
    precio.value = response.precio;

}

document.addEventListener('DOMContentLoaded',function(){
    const btnSaveMovie = document.querySelector('#btn-save-receta');
    //ASOCIAR UNA FUNCION AL EVENTO CLICK DEL BOTON
    btnSaveMovie.addEventListener('click',saveReceta);
    showRecetas();
    });