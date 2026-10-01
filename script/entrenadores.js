  

        let dbEntrenadores = JSON.parse(localStorage.getItem('apex_entrenadores')) || [];

        async function guardarEntrenador() {
            const editId = document.getElementById('entrenador-id').value;
            const nombre = document.getElementById('entrenador-nombre').value.trim();
            const apellido = document.getElementById('entrenador-apellido').value.trim();
            const telefono = document.getElementById('entrenador-telefono').value.trim();
            const descripcion = document.getElementById('entrenador-descripcion').value.trim();

            if(!nombre || !apellido || !telefono || !descripcion) return alert("Complete todos los campos del entrenador.");

            const record = { id: editId ? parseInt(editId) : Math.floor(1000 + Math.random() * 9000), nombre, apellido, telefono, descripcion };
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