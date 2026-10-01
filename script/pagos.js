 let dbPagos = JSON.parse(localStorage.getItem('apex_pagos')) || [];
        let dbAtletas = JSON.parse(localStorage.getItem('apex_atletas')) || [];

        function actualizarPagoAtletasSelector() {
            const sel = document.getElementById('select-atleta-pago');
            sel.innerHTML = `<option value="">-- Seleccione un atleta --</option>`;
            dbAtletas.forEach(a => sel.innerHTML += `<option value="${a.id}">${a.nombre} ${a.apellido} (Cédula: ${a.cedula})</option>`);
        }

        function onAtletaPagoSelected(atletaId) {
            const cont = document.getElementById('pago-deportes-container');
            cont.innerHTML = "";
            if(!atletaId) {
                cont.style.display = 'none';
                cont.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">Seleccione un atleta primero...</span>`;
                return;
            }
            const atleta = dbAtletas.find(a => a.id == atletaId);
            if(!atleta || !atleta.deportes.length) {
                cont.style.display = 'block';
                cont.innerHTML = `<span style="color: var(--danger); font-size: 0.85rem;">Este atleta no tiene deportes asignados.</span>`;
                return;
            }
            cont.style.display = 'block';
            cont.innerHTML = `<label style="font-size: 0.8rem; margin-bottom: 6px;">Seleccione deporte(s) para este pago:</label>`;
            atleta.deportes.forEach(dep => {
                cont.innerHTML += `
                    <label class="checkbox-item">
                        <input type="checkbox" name="pago-deporte-check" value="${dep}" checked>
                        <span>${dep}</span>
                    </label>
                `;
            });
        }

        async function guardarPago() {
            const editId = document.getElementById('pago-id-hidden').value;
            const monto = parseFloat(document.getElementById('pago-monto').value);
            const metodo = document.getElementById('pago-metodo').value;
            const fecha = document.getElementById('pago-fecha').value;
            const atletaId = document.getElementById('select-atleta-pago').value;
            const checks = document.querySelectorAll('input[name="pago-deporte-check"]:checked');

            let deportes = [];
            checks.forEach(c => deportes.push(c.value));

            if(isNaN(monto) || !metodo || !fecha || !atletaId || deportes.length === 0) {
                alert("Complete todos los campos del pago y seleccione al menos un deporte.");
                return;
            }

            const record = { id: editId ? parseInt(editId) : Date.now(), monto, metodo, fecha, atletaId: parseInt(atletaId), deportes };
            if(editId) {
                dbPagos = dbPagos.map(i => i.id === record.id ? record : i);
                document.getElementById('pago-id-hidden').value = "";
                document.getElementById('btn-save-pago').textContent = "Guardar Pago";
            } else {
                dbPagos.push(record);
            }

           localStorage.setItem('apex_pagos', JSON.stringify(dbPagos));

            try {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, "pagos"),
                    record
                );
                console.log("✅ Pago guardado en Firebase");
            } catch (error) {
                console.error("❌ Error al guardar pago en Firebase:", error);
                alert("El pago se guardó en la página, pero NO en Firebase.");
            }

             limpiarformularioPago();
             mostrarPagos();
        }

        function  limpiarformularioPago() {
            document.getElementById('pago-id-hidden').value = "";
            document.getElementById('pago-monto').value = "";
            document.getElementById('pago-metodo').value = "";
            document.getElementById('pago-fecha').value = "";
            document.getElementById('select-atleta-pago').value = "";
            const cont = document.getElementById('pago-deportes-container');
            cont.style.display = 'none';
            cont.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">Seleccione un atleta primero...</span>`;
        }

        function toggleSubRow(atletaId) {
            const subRow = document.getElementById(`subrow-${atletaId}`);
            const icon = document.getElementById(`icon-${atletaId}`);
            if (subRow.style.display === 'table-row') {
                subRow.style.display = 'none';
                icon.className = 'fas fa-chevron-right';
            } else {
                subRow.style.display = 'table-row';
                icon.className = 'fas fa-chevron-down';
            }
        }

        function mostrarPagos() {
            const tbody = document.getElementById('table-pagos-body');
            tbody.innerHTML = dbPagos.length === 0 ? `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Sin registros.</td></tr>` : '';
            
            const atletasConPagos = [...new Set(dbPagos.map(p => p.atletaId))];

            atletasConPagos.forEach(atletaId => {
                const pagosDelAtleta = dbPagos.filter(p => p.atletaId === atletaId);
                const ultimoPago = pagosDelAtleta[pagosDelAtleta.length - 1];
                const atleta = dbAtletas.find(a => a.id === atletaId);
                const nombreAtleta = atleta ? `${atleta.nombre} ${atleta.apellido}` : 'Desconocido';

                tbody.innerHTML += `
                    <tr>
                        <td style="color: var(--success); font-weight:700;">$${ultimoPago.monto.toFixed(2)}</td>
                        <td>${ultimoPago.metodo}</td>
                        <td>${ultimoPago.fecha}</td>
                        <td><strong>${nombreAtleta}</strong></td>
                        <td>${ultimoPago.deportes.join(', ')}</td>
                        <td>
                            <button class="toggle-row-btn" onclick="toggleSubRow(${atletaId})">
                                <i id="icon-${atletaId}" class="fas fa-chevron-right"></i> Ver (${pagosDelAtleta.length}) pagos
                            </button>
                        </td>
                        <td>
                            <button class="btn-edit" onclick="editarPago(${ultimoPago.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" onclick="eliminarPago(${ultimoPago.id})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;

                let subHtml = `<tr id="subrow-${atletaId}" class="sub-row"><td colspan="7" style="padding: 15px;">`;
                subHtml += `<p style="margin-bottom: 8px; font-size: 0.85rem; font-weight: 700; color: var(--accent);">Historial completo de pagos de ${nombreAtleta}:</p>
                <table class="sub-table">
                    <thead>
                        <tr style="font-size: 0.75rem;">
                            <th>Monto</th>
                            <th>Método</th>
                            <th>Fecha</th>
                            <th>Deportes</th>
                        </tr>
                    </thead>
                    <tbody>`;
                pagosDelAtleta.forEach(p => {
                    subHtml += `<tr>
                        <td style="color: var(--success); font-weight:600;">$${p.monto.toFixed(2)}</td>
                        <td>${p.metodo}</td>
                        <td>${p.fecha}</td>
                        <td>${p.deportes.join(', ')}</td>
                    </tr>`;
                });
                subHtml += `</tbody></table></td></tr>`;
                tbody.innerHTML += subHtml;
            });
        }

        function editarPago(id) {
            const item = dbPagos.find(i => i.id === id);
            if(!item) return;
            document.getElementById('pago-id-hidden').value = item.id;
            document.getElementById('pago-monto').value = item.monto;
            document.getElementById('pago-metodo').value = item.metodo;
            document.getElementById('pago-fecha').value = item.fecha;
            document.getElementById('select-atleta-pago').value = item.atletaId;

            onAtletaPagoSelected(item.atletaId);
            setTimeout(() => {
                document.querySelectorAll('input[name="pago-deporte-check"]').forEach(c => {
                    c.checked = item.deportes.includes(c.value);
                });
            }, 50);

            document.getElementById('btn-save-pago').textContent = "Actualizar Pago";
            window.scrollTo(0, 0);
        }

        function eliminarPago(id) {
            if(confirm("¿Eliminar pago?")) {
                dbPagos = dbPagos.filter(i => i.id !== id);
                localStorage.setItem('apex_pagos', JSON.stringify(dbPagos));
                mostrarPagos();
            }
        }

        actualizarPagoAtletasSelector();
        mostrarPagos();
