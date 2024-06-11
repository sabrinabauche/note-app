/* Declaración de variables */
const addBox = document.querySelector(".add-box"), /* Selecciona el primer elemento en el documento con la clase add-box y lo guarda con la variable addBox  */
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"), /* El elemento p es descendiente del elemento header dentro de la clase popup-box  */
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

/* Declaración de arreglo de variables meses */
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
          
/* Esta linea permite que se guarden las variables notes dentro de la página web*/
/* localStorage.getItem("notes") permite que se recopilen las notas del almacenaje local, regresando el valor como string*/
/* JSON.parse( se utiliza para convertir el dato a un objeto en Javascript*/
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;
/* Crea una variable que me permite determinar si la acción deseada es actualizar la nota*/

/* addBox representa el botón inicial que permite crear una nueva nota */
/* Un event listener representa una función que depende de una acción previa para ejecutarse */
/* Los argumentos dentro del Event listener nos permiten establecer la acción previa, en este caso el click en el ícono*/
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Crea una nueva nota";
    /* Añade texto dentro del pop-up, en la variable popupTitle que simboliza el elemento p dentro del header*/
    addBtn.innerText = "Crear";
    /* Permite añadir texto dentro del botón addBtn, el cual se encuentra dentro de popupBox*/
    popupBox.classList.add("show");
    /* Después de darle click en el botón crear, le añade el atributo show a estos pop-ups, los cuales tienen un estilo diferente en css. permitiendo que sean visibles*/
    if(window.innerWidth > 660) titleTag.focus();
    /* Si el tamaño de la pantalla es mayor a 60 pixeles, se enfoca en el input. Es decir que el cursor se pondrá automaticamente en este espacio.*/
});

/* closeIcon representa el ícono x dentro del formulario que nos permite cerrarlo */
/* Al darle click, se ejecutan todas las acciones */
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    /* Es falso porque la acción deseada no es actualizar la nota */
    titleTag.value = descTag.value = "";
    /* Limpia el valor del título y descripción antes de cerrar el formulario */
    popupBox.classList.remove("show");
    /* Elimina la clase show para hacer el pop-up invisible de nuevo */
    document.querySelector("body").style.overflow = "auto";
    /* Restaura el movimiento e interacción normales con la página web*/
});


/* Es la función responsable de mostrar las notas en la página web*/
function showNotes() {
    if(!notes) return;
    /* Revisa si la variable notas esta vacía, y si lo está deja de ejecutar la acción.*/
    document.querySelectorAll(".note").forEach(li => li.remove());
    /*Primero, selecciona todos los elementos con la clase note y los elimina, para después mostrar una lista actualizada */
    notes.forEach((note, id) => {
    /*Para cada nota en el array 'notas' se ejecutarán las siguientes acciones*/
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        /* Declara una variable para la descripción nueva, después de ciertos cambios*/
        /*La función permite que se remplacen los enters del usuario por la etiqueta br en html*/
        
        /*Crea una variable tipo lista que va a contener el input del usuario en la nota*/
        let liTag = `<li class="note"> 
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil settingsIcon">
                                </i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')">Editar</li>
                                    <li onclick="deleteNote(${id})">Eliminar</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    /*Inserta código html inmediatamente después del elemento addBox .add-box, como su descendiente*/
    /*Permite almacenar las notas como listas, inmediatamente después del contenedor inicial de crear nota*/
    /*Esto también permite que las notas más actuales estén en la parte superior*/
    });
}
showNotes();


/*Permite mostrar el mensaje de confirmación antes de eliminar la nota*/
function deleteNote(noteId) {
    /*Crea una variable para el mensaje de confirmación*/
    let confirmDel = confirm("¿Estás seguro de eliminar la nota?");
    /*Si se regresa con un valor vacío, se cancela*/
    if(!confirmDel) return;
    /*Elimina la nota del arreglo notas, especificado por su id, el 1 indica que solo se debe eliminar un elemento.*/
    notes.splice(noteId, 1);
    /*Actualiza el almacenamiento local. Se utiliza JSON.stringify para convertir el arreglo notes a una cadena JSON antes de almacenarlo en el localStorage. */
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}


/*La función desplega el menú de opciones*/
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    /*Agrega show al elemento padre del elemento, el cual es el ícono */
    // Agrega un event listener al documento para detectar clics en cualquier parte de la página
    document.addEventListener("click", e => {
         // Paso 3: Verifica si el elemento clicado no es una etiqueta 'I' o no es igual al elemento 'elem'
        if(e.target.tagName != "I" || e.target != elem) {
        // Si esto es verdadero. se elimina la clase show, haciéndolo invisible de nuevo
            elem.parentElement.classList.remove("show");
        }
    });
}

function updateNote(noteId, title, filterDesc) {
     //Convierte las etiquetas '<br/>' de 'filterDesc' a saltos de línea '\r\n'
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    //Convierte el note id por update id y cambia el estado de la variable isUpdate a verdadero
    updateId = noteId;
    isUpdate = true;
    //Simula la acción de añadir una nueva nota, un click en el botón addBox
    addBox.click();
    //Asigna valores a titleTag y descTag para almacenar la nueva información
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Edita la nota";
    addBtn.innerText = "Actualizar";
}

//Controla el flujo al darle click al botón +
addBtn.addEventListener("click", e => {
    e.preventDefault();
    //Evita que puedas volver a darle click al botón + después de abrir el formulario. 
    let title = titleTag.value.trim(),
    description = descTag.value.trim();
    // Obtiene y limpia los valores del título y la descripción del formulario (elimina espacios en blanco al inicio y final)
    if(title || description) {
    // Si hay título o descripción, sigue con la acción

    // Crea un nuevo objeto de fecha, con la fecha y hora actual.
        let currentDate = new Date(),
    // Extrae el mes, día y año de la fecha actual.
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();
    // Crea una variable que va a almacenar la fecha actual en la parte inferior de la nota. 
        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}

    // Si no es una actualización, agrega la nota tal como está
        if(!isUpdate) {
            notes.push(noteInfo);
    // Si es una actualización, vuelve a restablecer la variable a falso para futuros cambios
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        //actualiza la nota en la posición updateId del arreglo notes con la nueva información representada por noteInfo.

        //Almacena el arreglo 'notes' en el localStorage como una cadena JSON
        localStorage.setItem("notes", JSON.stringify(notes));
        //Muestra las notas actualizadas en la interfaz
        showNotes();
        //Simula un click en el botón de cerrar
        closeIcon.click();
    }
});