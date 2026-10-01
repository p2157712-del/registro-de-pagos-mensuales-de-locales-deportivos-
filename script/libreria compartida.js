const user = localStorage.getItem('apex_admin');
        if (!user) { window.location.href = "../index.html"; } 
        else {
            document.getElementById('admin-name').textContent = user;
            document.getElementById('admin-initials').textContent = user.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }

        function logout() {
            localStorage.removeItem('apex_admin');
            window.location.href = "../index.html";
        }

       // let dbEntrenadores = JSON.parse(localStorage.getItem('apex_entrenadores')) || [];
       // let dbAsignaciones = JSON.parse(localStorage.getItem('apex_asignaciones')) || [];
        