

        let dbDeportes = JSON.parse(localStorage.getItem('apex_deportes')) || [];

        function selectPresetSport(nombre, desc) {
            document.getElementById('nombre-deporte').value = nombre;
            document.getElementById('descripcion-deporte').value = desc;
            document.querySelectorAll('.sport-card').forEach(c => c.classList.remove('selected'));
            const map = { 'Fútbol': 'futbol', 'Básquet': 'basket', 'Natación': 'natacion', 'Gimnasio': 'gym' };
            if(map[nombre]) document.getElementById(`card-${map[nombre]}`).classList.add('selected');
        }

        function handleManualSportInput() {
            document.querySelectorAll('.sport-card').forEach(c => c.classList.remove('selected'));
        }

        async function guardardeporte() {
            const editId = document.getElementById('deporte-id').value;
            const deporte = document.getElementById('nombre-deporte').value.trim();
            const monto = parseFloat(document.getElementById('monto-deporte').value);
            const descripcion = document.getElementById('descripcion-deporte').value.trim();

            if(!deporte || isNaN(monto) || !descripcion) return alert("Complete todos los campos del deporte.");

            const record = { id: editId ? parseInt(editId) : Date.now(), deporte, monto, descripcion };
            if(editId) {
                dbDeportes = dbDeportes.map(i => i.id === record.id ? record : i);
                document.getElementById('deporte-id').value = "";
                document.getElementById('btn-save-deporte').textContent = "Guardar Deporte";
            } else {
                dbDeportes.push(record);
            }

            localStorage.setItem('apex_deportes', JSON.stringify(dbDeportes));

            try {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, "deportes"),
                    record
                );
                console.log("✅ Deporte guardado en Firebase");
            } catch (error) {
                console.error("❌ Error al guardar deporte en Firebase:", error);
                alert("El deporte se guardó en la página, pero NO en Firebase.");
            }

             limpiarformularioDeporte();
            mostrarDeportes();
        }

        function limpiarformularioDeporte() {
            document.getElementById('deporte-id').value = "";
            document.getElementById('nombre-deporte').value = "";
            document.getElementById('monto-deporte').value = "";
            document.getElementById('descripcion-deporte').value = "";
            document.querySelectorAll('.sport-card').forEach(c => c.classList.remove('selected'));
        }

        function mostrarDeportes() {
            const tbody = document.getElementById('table-deportes-body');
            tbody.innerHTML = dbDeportes.length === 0 ? `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Sin registros.</td></tr>` : '';
            dbDeportes.forEach(item => {
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${item.deporte}</strong></td>
                        <td style="color: var(--success); font-weight:700;">$${item.monto.toFixed(2)}</td>
                        <td>${item.descripcion}</td>
                        <td>
                            <button class="btn-edit" onclick="editarDeporte(${item.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" onclick="eliminarDeporte(${item.id})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        function editarDeporte(id) {
            const item = dbDeportes.find(i => i.id === id);
            if(!item) return;
            document.getElementById('deporte-id').value = item.id;
            document.getElementById('nombre-deporte').value = item.deporte;
            document.getElementById('monto-deporte').value = item.monto;
            document.getElementById('descripcion-deporte').value = item.descripcion;
            document.getElementById('btn-save-deporte').textContent = "Actualizar Deporte";
            window.scrollTo(0, 0);
        }

        function eliminarDeporte(id) {
            if(confirm("¿Eliminar deporte?")) {
                dbDeportes = dbDeportes.filter(i => i.id !== id);
                localStorage.setItem('apex_deportes', JSON.stringify(dbDeportes));
                mostrarDeportes();
            }
        }

        mostrarDeportes();

        
