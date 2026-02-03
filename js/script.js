$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Evita que la página se recargue

        //obtener valores...
        const email = $("#email").val();
        const password = $("#password").val();

        // Datos de prueba
        const correoCorrecto = "correo@gmail.com";
        const claveCorrecta = "123";

        if (email === correoCorrecto && password === claveCorrecta) {
            $("#mensaje").html(`
            <div class="alert alert-success">
              <strong>¡Éxito!</strong> Credenciales correctas. Redirigiendo...
            </div>
          `);

            // Redirección 
            setTimeout(function () {
                window.location.href = "menu.html";
            }, 1500);
        } else {
            // Alerta de error de Bootstrap
            $("#mensaje").html(`
            <div class="alert alert-danger">
              <strong>Error:</strong> Correo o contraseña incorrectos.
            </div>
          `);

            // Opcional: Limpiar el campo de password con jQuery
            $("#password").val("");
        }
    });
});


$(document).ready(function () {
    // Mostrar el saldo desde LocalStorage al iniciar
    const saldoActual = localStorage.getItem("saldo") || 60000;
    $('#saldoDisplay').text('$' + saldoActual);

    //Función para mostrar mensaje y redirigir
    function manejarRedireccion(nombrePantalla, destinoUrl) {
        $('#mensaje').hide().html(`
            <div class="alert alert-info">
                Redirigiendo a <strong>${nombrePantalla}</strong>...
            </div>
        `).fadeIn(500);

        // Esperar 1.5 segundos antes de cambiar de página
        setTimeout(function () {
            window.location.href = destinoUrl;
        }, 1500);
    }

    //Eventos de clic
    $('#btnDeposito').click(function () {
        manejarRedireccion("Depositar", "deposit.html");
    });

    $('#btnEnviar').click(function () {
        manejarRedireccion("Enviar Dinero", "sendmoney.html");
    });

    $('#btnMovimientos').click(function () {
        manejarRedireccion("Últimos Movimientos", "transactions.html");
    });

});






$(document).ready(function () {

    //Saldo mostrar
    let saldoActual = parseFloat(localStorage.getItem("saldo")) || 60000;
    $('#displaySaldoActual').text('$' + saldoActual);

    // Formuialrio
    $('#formDeposito').submit(function (event) {
        event.preventDefault();

        // Obtener inputs
        const montoADepositar = parseFloat($('#depositAmount').val());

        if (montoADepositar > 0) {

            const nuevoSaldo = saldoActual + montoADepositar;


            localStorage.setItem("saldo", nuevoSaldo);
            const historial = JSON.parse(localStorage.getItem("historial")) || [];
            const nuevoMovimiento = {
                tipo: "Depósito",
                detalle: "Depósito realizado",
                monto: montoADepositar,
                fecha: new Date().toLocaleString() // Guarda fecha y hora actual
            };
            historial.push(nuevoMovimiento);
            localStorage.setItem("historial", JSON.stringify(historial));

            //Mostrar monto 
            $('#mensaje-monto')
                .text('Has depositado: $' + montoADepositar)
                .fadeIn();

            //mostrar alerta 
            $('#alert-container').html(`
                <div class="alert alert-success alert-dismissible fade show">
                    <strong>¡Depósito realizado!</strong> Tu nuevo saldo es $${nuevoSaldo}.
                </div>
            `);

            // Deshabilitar el botón para evitar múltiples clics
            $('button[type="submit"]').attr('disabled', true);

            // Redirigir 
            setTimeout(function () {
                window.location.href = "menu.html";
            }, 2000);

        } else {
            // Alerta en caso de monto inválido
            $('#alert-container').html(`
                <div class="alert alert-danger">
                    Por favor, ingresa un monto mayor a 0.
                </div>
            `);
        }
    });
});





$(document).ready(function () {
    let contactoSeleccionado = null;

    // 1. Mostrar/Ocultar formulario
    $('#btnMostrarForm').click(function () {
        $('#nuevoContactoForm').slideDown();
        $(this).hide();
    });

    $('#btnCancelar').click(function () {
        $('#nuevoContactoForm').slideUp();
        $('#btnMostrarForm').show();
    });

    // Validar y Guardar nuevo contacto
    $('#btnGuardar').click(function () {
        const nombre = $('#nombre').val().trim();
        const cbu = $('#cbu').val().trim();
        const alias = $('#alias').val().trim();

        // Validación básica
        if (nombre === "" || cbu.length < 8 || alias === "") {
            alert("Completa todos los campos. CBU debe tener al menos 8 números.");
            return;
        }

        // Agregar a la lista...
        const nuevoLi = `
            <li class="list-group-item contacto-item" data-nombre="${nombre}" data-alias="${alias}">
                <strong>${nombre}</strong> (${alias}) <br> <small>CBU: ${cbu}</small>
            </li>`;

        $('#listaContactos').append(nuevoLi);
        $('#nuevoContactoForm').slideUp();
        $('#btnMostrarForm').show();

        // Limpiar campos
        $('#nombre, #cbu, #alias').val("");
    });

    // Búsqueda en la agenda (Filtro en tiempo real)
    $('#inputBusqueda').on('keyup', function () {
        const valor = $(this).val().toLowerCase();

        $('#listaContactos li').filter(function () {
            // Mostramos u ocultamos según coincida el nombre o alias
            $(this).toggle($(this).text().toLowerCase().indexOf(valor) > -1);
        });
    });

    // Seleccionar contacto y mostrar botón 
    $('#listaContactos').on('click', '.contacto-item', function () {
        $('.contacto-item').removeClass('selected');
        $(this).addClass('selected');

        contactoSeleccionado = $(this).data('nombre');
        $('#seccionEnvio').fadeIn(); // Mostrar sección de envío
    });

    // Enviar dinero con mensaje de confirmación
    $('#btnEnviarDinero').click(function () {
        const monto = parseFloat($('#montoEnvio').val());
        const saldoActual = parseFloat(localStorage.getItem("saldo")) || 60000;

        if (monto > 0 && monto <= saldoActual) {
            const nuevoSaldo = saldoActual - monto;
            localStorage.setItem("saldo", nuevoSaldo);
            const historial = JSON.parse(localStorage.getItem("historial")) || [];
            const nuevoMovimiento = {
                tipo: "Envío",
                detalle: `Envío a ${contactoSeleccionado}`,
                monto: monto,
                fecha: new Date().toLocaleString()
            };
            historial.push(nuevoMovimiento);
            localStorage.setItem("historial", JSON.stringify(historial));

            // Mensaje de confirmación 
            $('#alert-container').html(`
                <div class="alert alert-success">
                    ¡Éxito! Enviaste $${monto} a ${contactoSeleccionado}.
                </div>
            `);

            // Ocultar controles y redirigir
            $('#seccionEnvio').hide();
            setTimeout(() => { window.location.href = "menu.html"; }, 2500);
        } else {
            alert("Monto inválido o saldo insuficiente.");
        }
    });
});



// 1. Sincronizamos el ID con el HTML (listaTransacciones)
const listaUI = document.getElementById("listaTransacciones");
const filtroTipo = document.getElementById("filtroTipo");

// Función principal para renderizar los movimientos
function renderizarMovimientos(filtro = "todos") {
    // Limpiar la lista antes de dibujar
    listaUI.innerHTML = "";

    // Obtener datos de localStorage
    const movimientos = JSON.parse(localStorage.getItem("historial")) || [];

    // Filtrar según la selección del usuario
    const movimientosFiltrados = movimientos.filter(mov => {
        if (filtro === "todos") return true;
        if (filtro === "deposito") return mov.tipo === "Depósito";
        if (filtro === "envio") return mov.tipo === "Envío" || mov.tipo === "Transferencia";
        return true;
    });

    if (movimientosFiltrados.length === 0) {
        listaUI.innerHTML = "<li class='list-group-item text-muted'>No hay movimientos que coincidan.</li>";
        return;
    }

    // Usamos una copia para no alterar el array original con reverse()
    [...movimientosFiltrados].reverse().forEach(mov => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        // Lógica de colores (asegúrate de tener estas clases en tu CSS)
        const claseMonto = mov.tipo === "Depósito" ? "text-success" : "text-danger";
        const signo = mov.tipo === "Depósito" ? "+" : "-";

        li.innerHTML = `
            <span>
                <strong>${mov.detalle}</strong> <br> 
                <small class="text-secondary">${mov.fecha}</small>
            </span>
            <span class="${claseMonto} font-weight-bold">${signo} $${mov.monto}</span>
        `;
        listaUI.appendChild(li);
    });
}

// 2. Escuchar cambios en el filtro
filtroTipo.addEventListener("change", (e) => {
    renderizarMovimientos(e.target.value);
});

// 3. Ejecutar al cargar la página
renderizarMovimientos();

// Función para borrar (puedes llamarla desde un botón si lo deseas)
function borrarHistorial() {
    if (confirm("¿Seguro quieres borrar todo el historial?")) {
        localStorage.removeItem("historial");
        renderizarMovimientos();
    }
}