   
document.addEventListener("DOMContentLoaded",()=> { 
   
    listTask = []

   // clase tarea / id / name / activo (realizada)
    class Tarea{
        static contador = 0
        constructor(name){
            this.id = Tarea.contador++;
            this.name = name;
            this.activo = false;  
        }
    }

//** agregar elementos como listas */
    const formAddItem = document.getElementById("formAddItem");
    const taskName = document.getElementById("taskName")
    const ul = document.getElementById("contenedor")
    const totalTask = document.getElementById("totalTask")

//** variables de localstorage  */ 
    const tareasGuardadas = JSON.parse(localStorage.getItem("listaTareas")) || []; 
    listTask = tareasGuardadas

    // Actualizamos el contador para evitar IDs duplicados
    if(listTask.length > 0) {
    const maxId = Math.max(...listTask.map(t => t.id));
    Tarea.contador = maxId + 1;
    } 
    tareasGuardadas.forEach(tarea => mostrarTarea(tarea))
    showTotalTask()
    



//mostrar tarea
    function mostrarTarea(tarea){
        const li = document.createElement("li")
        li.classList.add("itemTask")
        if(tarea.activo === true) {
            li.classList.add("activo")
        }
        li.innerHTML = `
        <span class="title-item">${tarea.name}</span>
        <button class="button" data-id-number="${tarea.id}">Listo!</button>
        `
        document.getElementById("contenedor").appendChild(li)
        showTotalTask()
        
    }// mostrar tarea


// crear nueva tarea
ul.addEventListener("click",(e)=>{
    if(e.target.matches("button[data-id-number]")){
        const id = Number(e.target.dataset.idNumber);
        const li = e.target.closest("li")
        if(li){
            li.classList.toggle("activo");
            console.log("ID:",id)
            const tarea = listTask.find(t => t.id ===id)
            if(tarea){
                tarea.activo = !tarea.activo
                localStorage.setItem("listaTareas",JSON.stringify(listTask))
            }
        }
        showTotalTask()

    }
})



formAddItem.addEventListener("submit",(e) => {
    e.preventDefault()// evito enviar dos veces
    // tengo que ver cual de los botenes del form fue enviado con e.submitter
    const botonPresionado = e.submitter;
    if(botonPresionado.value === "Agregar" ){
        let valorInput = document.getElementById("taskName").value
        if(valorInput.trim() !== ""){
            const newTask = new Tarea(valorInput)
            listTask.push(newTask)
             localStorage.setItem("listaTareas",JSON.stringify(listTask))
            console.log("el array es",listTask)
            mostrarTarea(newTask)
            showTotalTask()
           
        } else {
            console.log("El input esta vacio")
        }
        valorInput = document.getElementById("taskName").value = ""
    } /*else if(botonPresionado.value ==="Guardar"){
        localStorage.setItem("listaTareas",JSON.stringify(listTask))
        showTotalTask()
        saveCurrentDate()
        console.log("fue presionado Guardar ")*/
    else if(botonPresionado.value === "Borrar"){
        console.log("Fue presionado Borrar")
        localStorage.removeItem("listaTareas")
        location.reload()
        ul.textContent = ""
        totalTask.textContent = ""
        
        }
    })
// lista.

}) // cierra DOMcontentLoader 



function showTotalTask(){
        const tareasRealizadas = listTask.filter(t => t.activo === true).length
        const tareasSinRealizar = listTask.filter(t => t.activo === false).length
        const totalTareas = tareasRealizadas + tareasSinRealizar
        console.log("Tareas realizadas: " + tareasRealizadas + " / " + totalTareas)
        totalTask.textContent = "";
        const div = document.createElement("div")
        if(listTask.length > 0){
        div.innerHTML = `<div class="title_total"><h3>Tareas realizadas: ${tareasRealizadas} / ${totalTareas} ${saveCurrentDate()} </h3></div>`
        totalTask.appendChild(div)
        if(tareasRealizadas > 2 && tareasRealizadas < 10){
            div.innerHTML += `<h3 class="title_total">Hoy si estas inspirado!</h3>`
        }
    }   else if(listTask.length === 0){
        div.innerHTML = `<div class="title_total"> <h3>No hay tareas en tu lista de tareas </h3></div>`
        totalTask.appendChild(div)
        
    }
}

function saveCurrentDate(){
        const fecha = new Date();
        return (fecha.toLocaleDateString('es-AR',{
         weekday:'long',
         year:'2-digit',
         month:'2-digit',
         day:'2-digit'
        }))
}