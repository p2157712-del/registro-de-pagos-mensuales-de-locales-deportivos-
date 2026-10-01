

        let dbAtletas = JSON.parse(localStorage.getItem('apex_atletas')) || [];
       
        
       
       
       

         function mostrarListadeDeportes() {             
            const box = document.getElementById('contenedor-deportes');
            box.style.display = 'block' ;           
           
            const variosDeportesFijos = [];

            const dbDeportes = JSON.parse(localStorage.getItem('apex_deportes')) || [];
            for(let i = 0; i < dbDeportes.length ; i++){ 
               variosDeportesFijos.push(dbDeportes[i].deporte)
            }

            const cont = document.getElementById('atleta-deportes-checkbox-container');
            cont.innerHTML = "";
            variosDeportesFijos.forEach((dep, idx) => {
                cont.innerHTML += `
                    <label class="checkbox-item">
                        <input type="checkbox" name="atleta-deporte-check" value="${dep}" data-deporte-id="${900+idx}">
                        <span>${dep}</span>
                    </label>
                `;
            });
        }

        async function guardarAtleta() {
            const editId = document.getElementById('atleta-id-hidden').value;
            const cedula = parseInt(document.getElementById('atleta-cedula').value);
            const nombre = document.getElementById('atleta-nombre').value.trim();
            const apellido = document.getElementById('atleta-apellido').value.trim();
            const telefono = parseInt(document.getElementById('atleta-telefono').value);
            const checks = document.querySelectorAll('input[name="atleta-deporte-check"]:checked');

            let deportes = [];
            checks.forEach(c => deportes.push(c.value));

            if(isNaN(cedula) || !nombre || !apellido || isNaN(telefono) || deportes.length === 0) {
                alert("Complete todos los campos de atleta y seleccione al menos un deporte.");
                return;
            }

            const record = { id: editId ? parseInt(editId) : Date.now(), cedula, nombre, apellido, telefono, deportes };
            if(editId) {
                dbAtletas = dbAtletas.map(i => i.id === record.id ? record : i);
                document.getElementById('atleta-id-hidden').value = "";
                document.getElementById('btn-save-atleta').textContent = "Guardar Atleta";
            } else {
                dbAtletas.push(record);
            }

           localStorage.setItem('apex_atletas', JSON.stringify(dbAtletas));

            try {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, "atletas"),
                    record
                );
                console.log("✅ Atleta guardado en Firebase");
            } catch (error) {
                console.error("❌ Error al guardar en Firebase:", error);
                alert("El atleta se guardó en la página, pero NO en Firebase. Revisa la consola.");
            }

             limpiarformularioAtleta();
            mostrarAtletas();
            mostrarListadeDeportes();
        }

        function  limpiarformularioAtleta() {
            document.getElementById('atleta-id-hidden').value = "";
            document.getElementById('atleta-cedula').value = "";
            document.getElementById('atleta-nombre').value = "";
            document.getElementById('atleta-apellido').value = "";
            document.getElementById('atleta-telefono').value = "";
        
            document.getElementById('contenedor-deportes').style.display = 'none';
            document.querySelectorAll('input[name="atleta-deporte-check"]').forEach(c => c.checked = false);
        }

        function mostrarAtletas() {
            const tbody = document.getElementById('table-atletas-body');
            tbody.innerHTML = dbAtletas.length === 0 ? `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Sin registros.</td></tr>` : '';
            dbAtletas.forEach(item => {
                tbody.innerHTML += `
                    <tr>
                        <td><code>${item.cedula}</code></td>
                        <td><strong>${item.nombre} ${item.apellido}</strong></td>
                        <td>${item.telefono}</td>
                        <td>${item.deportes.join(', ')}</td>
                        <td>
                            <button class="btn-edit" onclick="editarAtleta(${item.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" onclick="eliminarAtleta(${item.id})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        function editarAtleta(la) {
            const item = dbAtletas.find(i => i.id === la);
            if(!item) return;
            document.getElementById('atleta-id-hidden').value = item.id;
            document.getElementById('atleta-cedula').value = item.cedula;
            document.getElementById('atleta-nombre').value = item.nombre;
            document.getElementById('atleta-apellido').value = item.apellido;
            document.getElementById('atleta-telefono').value = item.telefono;
            
            document.getElementById('contenedor-deportes').style.display = 'block';

            document.querySelectorAll('input[name="atleta-deporte-check"]').forEach(c => c.checked = item.deportes.includes(c.value));
            document.getElementById('btn-save-atleta').textContent = "Actualizar Atleta";
            window.scrollTo(0, 0);
        }

        function eliminarAtleta(id) {
            if(confirm("¿Eliminar atleta?")) {
                dbAtletas = dbAtletas.filter(i => i.id !== id);
                localStorage.setItem('apex_atletas', JSON.stringify(dbAtletas));
                mostrarAtletas();
            }
        }

        mostrarListadeDeportes();
        mostrarAtletas();