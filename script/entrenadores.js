  

        let dbEntrenadores = JSON.parse(localStorage.getItem('apex_entrenadores')) || [];
//  Identifica al administrador conectado 
const usuarioActivo = localStorage.getItem('apex_admin') || "Invitado";

        async function guardarEntrenador() {
            const editId = document.getElementById('entrenador-id').value;
            const nombre = document.getElementById('entrenador-nombre').value.trim();
            const apellido = document.getElementById('entrenador-apellido').value.trim();
            const telefono = document.getElementById('entrenador-telefono').value.trim();
            const descripcion = document.getElementById('entrenador-descripcion').value.trim();

            if(!nombre || !apellido || !telefono || !descripcion) return alert("Complete todos los campos del entrenador.");

           // IDENTIFICADOR 
            const record = { id: editId ? parseInt(editId) : Math.floor(1000 + Math.random() * 9000), nombre, apellido, telefono, descripcion, usuarioOwner: usuarioActivo };

            if(editId) {
                dbEntrenadores = dbEntrenadores.map(i => i.id === record.id ? record : i);
                document.getElementById('entrenador-id').value = "";
                document.getElementById('btn-save-entrenador').textContent = "Guardar Entrenador";
            } else {
                dbEntrenadores.push(record);
            }
            localStorage.setItem('apex_entrenadores', JSON.stringify(dbEntrenadores));

            try {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, "entrenadores"),
                    record
                );
                console.log("✅ Entrenador guardado en Firebase");
            } catch (error) {
                console.error("❌ Error al guardar entrenador en Firebase:", error);
                alert("El entrenador se guardó en la página, pero NO en Firebase.");
            }

             limpiarformularioEntrenador();
            mostrarEntrenadores();
        }

        function  limpiarformularioEntrenador() {
            document.getElementById('entrenador-id').value = "";
            document.getElementById('entrenador-nombre').value = "";
            document.getElementById('entrenador-apellido').value = "";
            document.getElementById('entrenador-telefono').value = "";
            document.getElementById('entrenador-descripcion').value = "";
        }

        function mostrarEntrenadores() {
            const tbody = document.getElementById('table-entrenadores-body');
            tbody.innerHTML = dbEntrenadores.length === 0 ? `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Sin registros.</td></tr>` : '';
            dbEntrenadores.forEach(item => {
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${item.nombre} ${item.apellido}</strong></td>
                        <td>${item.telefono}</td>
                        <td>${item.descripcion}</td>
                        <td>
                            <button class="btn-edit" onclick="editarEntrenador(${item.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" onclick="eliminarEntrenador(${item.id})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        function editarEntrenador(id) {
            const item = dbEntrenadores.find(i => i.id === id);
            if(!item) return;
            document.getElementById('entrenador-id').value = item.id;
            document.getElementById('entrenador-nombre').value = item.nombre;
            document.getElementById('entrenador-apellido').value = item.apellido;
            document.getElementById('entrenador-telefono').value = item.telefono;
            document.getElementById('entrenador-descripcion').value = item.descripcion;
            document.getElementById('btn-save-entrenador').textContent = "Actualizar Entrenador";
            window.scrollTo(0, 0);
        }

        function eliminarEntrenador(id) {
            if(confirm("¿Eliminar entrenador?")) {
                dbEntrenadores = dbEntrenadores.filter(i => i.id !== id);
                localStorage.setItem('apex_entrenadores', JSON.stringify(dbEntrenadores));
                mostrarEntrenadores();
            }
        }

        mostrarEntrenadores();
  

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


// Retardo de 1.5 segundos para garantizar la inicialización global de Firebase
setTimeout(() => {
    cargarEntrenadoresDesdeFirebase();
}, 1500);
// ====== CÓDIGO AUMENTADO: Forzar la limpieza de datos basura locales si la nube está vacía ======
setTimeout(async () => {
    if (!window.firebaseQuery || usuarioActivo === "Invitado") return;
    try {
        const q = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDB, "entrenadores"),
            window.firebaseWhere("usuarioOwner", "==", usuarioActivo)
        );
        const querySnapshot = await window.firebaseGetDocs(q);
        
        // Si el usuario está conectado en el dispositivo nuevo pero no tiene nada en la nube,
        // vaciamos el localStorage local para borrar los datos basura o viejos de otros usuarios
        if (querySnapshot.empty) {
            dbEntrenadores = [];
            localStorage.setItem('apex_entrenadores', JSON.stringify(dbEntrenadores));
            mostrarEntrenadores();
            console.log("▲ Código Aumentado: Se limpió la tabla local porque este usuario no tiene registros en la nube.");
        }
    } catch (e) {
        console.error("Error en código aumentado:", e);
    }
}, 2500); 
// ====== CÓDIGO AUMENTADO: Forzar el envío y lectura correcta de usuarioOwner ======
async function purificarYSubirAFirebase(registroEntrenador) {
    if (!window.firebaseAddDoc || !window.firebaseCollection || !window.firebaseDB) {
        console.error("▲ Error: Las funciones globales de Firebase no están listas todavía.");
        return;
    }
    
    try {
        // Creamos una estructura limpia y plana idéntica a la que le gusta a Firebase
        const documentoLimpio = {
            id: Number(registroEntrenador.id),
            nombre: String(registroEntrenador.nombre || "").trim(),
            apellido: String(registroEntrenador.apellido || "").trim(),
            telefono: String(registroEntrenador.telefono || "").trim(),
            descripcion: String(registroEntrenador.descripcion || "").trim(),
            usuarioOwner: String(usuarioActivo || "sq sqqs").trim() // Forzamos el texto plano
        };

        // Subida directa a la colección correspondiente en la nube
        await window.firebaseAddDoc(
            window.firebaseCollection(window.firebaseDB, "entrenadores"),
            documentoLimpio
        );
        console.log("▲ Código Aumentado: Entrenador sincronizado en la nube con usuarioOwner:", documentoLimpio.usuarioOwner);
    } catch (error) {
        console.error("▲ Error crítico en la subida aumentada a Firebase:", error);
    }
}

// Interceptamos dinámicamente el clic del botón de guardar para asegurar la persistencia
document.addEventListener("DOMContentLoaded", () => {
    const btnGuardar = document.getElementById('btn-save-entrenador');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', () => {
            // Esperamos un segundo a que tu función original registre los datos locales
            setTimeout(() => {
                let listadoActual = JSON.parse(localStorage.getItem('apex_entrenadores')) || [];
                if (listadoActual.length > 0) {
                    // Tomamos el último entrenador agregado localmente y lo mandamos purificado
                    const ultimoRegistro = listadoActual[listadoActual.length - 1];
                    purificarYSubirAFirebase(ultimoRegistro);
                }
            }, 1200);
        });
    }
});
