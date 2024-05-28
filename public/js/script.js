document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const message = document.getElementById('message');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/SignIn', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(
                { 
                    email, 
                    password 
                })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                window.location.href = `/authenticated.html?email=${encodeURIComponent(data.email)}&token=${data.token}`;
            } else {
                message.innerText = 'Credenciales Inválidas';
            }
        })
        .catch(error => {
            message.innerText = 'Error al procesar la solicitud';
        });
    });

    function fetchRestrictedContent() {
        const token = sessionStorage.getItem('token');
        if (!token) {
            message.innerText = 'No hay token almacenado';
            return;
        }

        fetch('/restricted', {
            method: 'GET',
            headers: { 'Authorization': token }
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('No autorizado');
            }
        })
        .then(data => {
            message.innerText = data;
        })
        .catch(error => {
            message.innerText = 'Error: ' + error.message;
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const token = urlParams.get('token');

    if (token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', email);
        setTimeout(() => sessionStorage.removeItem('token'), 120000); 
    }

    document.getElementById('email').innerText = email;

    document.getElementById('restricted-link').addEventListener('click', function(event) {
        event.preventDefault();
        fetchRestrictedContent();
    });

    function fetchRestrictedContent() {
        const token = sessionStorage.getItem('token');
        if (!token) {
            alert('No hay token almacenado');
            return;
        }

        fetch('/restricted', {
            method: 'GET',
            headers: { 'Authorization': token }
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('No autorizado');
            }
        })
        .then(data => {
            document.body.innerHTML = data;
        })
        .catch(error => {
            document.body.innerHTML = 'Error: ' + error.message;
        });
    }
});
