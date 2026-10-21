
        let dbEntrenadores = JSON.parse(localStorage.getItem('apex_entrenadores')) || [];
        let dbAsignaciones = JSON.parse(localStorage.getItem('apex_asignaciones')) || [];
        //  Identificar al administrador conectado 
const usuarioActivo = localStorage.getItem('apex_admin') || "Invitado";

        const variosDeportesFijos = [ ];
        
        

        const dbDeportes = JSON.parse(localStorage.getItem('apex_deportes')) || [];
        for(let i = 0; i < dbDeportes.length ; i++){ 
           variosDeportesFijos.push(dbDeportes[i].deporte)

        }


        function toggleDeportesView(value) {
            const box = document.getElementById('sports-container-box');
            box.style.display = (value === 'mostrar') ? 'block' : 'none';
            if(value !== 'mostrar') document.querySelectorAll('input[name="deporte-check"]').forEach(cb => cb.checked = false);
        }

        function actualizarAsignacionSelectors() {
            const sel = document.getElementById('select-entrenador');
            sel.innerHTML = `<option value="">-- Seleccione Entrenador --</option>`;
            dbEntrenadores.forEach(e => sel.innerHTML += `<option value="${e.id}">${e.nombre} ${e.apellido}</option>`);

            const cont = document.getElementById('deportes-checkbox-container');
            cont.innerHTML = "";
            variosDeportesFijos.forEach((dep, idx) => {
                cont.innerHTML += `
                    <label class="checkbox-item">
                        <input type="checkbox" name="deporte-check" value="${dep}" data-deporte-id="${700+idx}">
                        <span>${dep}</span>
                    </label>
                `;
            });
        }

        async function guardarAsignacion() {
            const editId = document.getElementById('asignacion-id').value;
            const entrenadorId = document.getElementById('select-entrenador').value;
             
            const checks = document.querySelectorAll('input[name="deporte-check"]:checked');
           
            let deportes = [];
            checks.forEach(c => deportes.push({ nombre: c.value, deporteId: parseInt(c.getAttribute('data-deporte-id')) }));
            window.guardarAsignacion = guardarAsignacion
            if(!entrenadorId || deportes.length === 0) return alert("Seleccione entrenador y al menos un deporte.");

           // IDENTIFICADOR 
           const record = { id: editId ? parseInt(editId) : Date.now(), entrenadorId: parseInt(entrenadorId), deportes, usuarioOwner: usuarioActivo };

            if(editId) {
                dbAsignaciones = dbAsignaciones.map(i => i.id === record.id ? record : i);
                document.getElementById('asignacion-id').value = "";
             
                document.getElementById('btn-save-asignacion').textContent = "Guardar Asignación";
            } else {
                dbAsignaciones.push(record);
            }

            localStorage.setItem('apex_asignaciones', JSON.stringify(dbAsignaciones));

            try {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, "asignaciones"),
                    record
                );
                console.log("✅ Asignación guardada en Firebase");
            } catch (error) {
                console.error("❌ Error al guardar asignación en Firebase:", error);
                alert("La asignación se guardó en la página, pero NO en Firebase.");
            }

              limpiarformularioAsignacion();
            mostrarAsignaciones();
        }

        function  limpiarformularioAsignacion() {
            document.getElementById('asignacion-id').value = "";
            document.getElementById('select-entrenador').value = "";
   
            document.getElementById('sports-container-box').style.display = 'none';
            document.querySelectorAll('input[name="deporte-check"]').forEach(c => c.checked = false);
        }

        function mostrarAsignaciones() {
            const tbody = document.getElementById('table-asignaciones-body');
            tbody.innerHTML = dbAsignaciones.length === 0 ? `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">Sin registros.</td></tr>` : '';
            dbAsignaciones.forEach(item => {
                const ent = dbEntrenadores.find(e => e.id === item.entrenadorId);
                const nombreEnt = ent ? `${ent.nombre} ${ent.apellido}` : 'Desconocido';
                const depNames = item.deportes.map(d => d.nombre).join(', ');
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${nombreEnt}</strong></td>
                        <td>${depNames}</td>
                        <td>
                            <button class="btn-edit" onclick="editarAsignacion(${item.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" onclick="eliminarAsignacion(${item.id})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        function editarAsignacion(id) {
            const item = dbAsignaciones.find(i => i.id === id);
            if(!item) return;
            document.getElementById('asignacion-id').value = item.id;
            document.getElementById('select-entrenador').value = item.entrenadorId;
            document.getElementById('toggle-deportes-select').value = 'mostrar';
            document.getElementById('sports-container-box').style.display = 'block';

            const names = item.deportes.map(d => d.nombre);
            document.querySelectorAll('input[name="deporte-check"]').forEach(c => c.checked = names.includes(c.value));
            document.getElementById('btn-save-asignacion').textContent = "Actualizar Asignación";
            window.scrollTo(0, 0);
        }

        function eliminarAsignacion(id) {
            
            if(confirm("¿Eliminar asignación?")) {
                dbAsignaciones = dbAsignaciones.filter(i => i.id !== id);
                localStorage.setItem('apex_asignaciones', JSON.stringify(dbAsignaciones));
                mostrarAsignaciones();
            }
        }

        actualizarAsignacionSelectors();
mostrarAsignaciones();
window.eliminarAsignacion = eliminarAsignacion;
window.editarAsignacion = editarAsignacion;
// ====== CÓDIGO AUMENTADO: Recuperar asignaciones en un dispositivo nuevo ======
async function cargarAsignacionesDesdeFirebase() {
    if (!window.firebaseQuery || usuarioActivo === "Invitado") return;
    
    try {
        console.log("Buscando asignaciones en la nube para:", usuarioActivo);
        const q = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDB, "asignaciones"),
            window.firebaseWhere("usuarioOwner", "==", usuarioActivo)
        );
        
        const querySnapshot = await window.firebaseGetDocs(q);
        const asignacionesNube = [];
        
        querySnapshot.forEach((doc) => {
            asignacionesNube.push(doc.data());
        });

        if (asignacionesNube.length > 0) {
            dbAsignaciones = asignacionesNube;
            localStorage.setItem('apex_asignaciones', JSON.stringify(dbAsignaciones));
            mostrarAsignaciones();
            console.log("✅ Asignaciones del dispositivo anterior recuperadas con éxito.");
        }
    } catch (error) {
        console.error("❌ Error al descargar asignaciones desde Firebase:", error);
    }
}
// ====== CÓDIGO NUEVO: Mostrar el usuario conectado y sus iniciales ======
function actualizarInterfazUsuario() {
    const txtNombre = document.getElementById('admin-name');
    const txtIniciales = document.getElementById('admin-initials');

    // Cambia el texto "Administrador" por el valor de usuarioActivo
    if (txtNombre && usuarioActivo) {
        txtNombre.textContent = usuarioActivo;
    }

    // Calcula de forma dinámica las iniciales basándose en el nombre
    if (txtIniciales && usuarioActivo && usuarioActivo !== "Invitado") {
        const palabras = usuarioActivo.trim().split(/\s+/);
        let letras = "";
        
        if (palabras.length >= 2) {
            // Toma la primera letra de las dos primeras palabras (Ej: "sq sqqs" -> "SS")
            letras = palabras[0][0] + palabras[1][0];
        } else if (palabras.length === 1 && palabras[0].length > 0) {
            // Si solo es una palabra, toma sus primeras dos letras
            letras = palabras[0].substring(0, 2);
        }
        
        if (letras) {
            txtIniciales.textContent = letras.toUpperCase();
        }
    }
}

// Ejecuta la función al cargar el script
actualizarInterfazUsuario();

// Retardo de seguridad para dar tiempo a la inicialización global del SDK de Firebase
setTimeout(() => {
    cargarAsignacionesDesdeFirebase();
}, 1500);
