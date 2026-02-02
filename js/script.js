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


$(document).ready(function() {
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
        setTimeout(function() {
            window.location.href = destinoUrl;
        }, 1500);
    }

    //Eventos de clic
    $('#btnDeposito').click(function() {
        manejarRedireccion("Depositar", "deposit.html");
    });

    $('#btnEnviar').click(function() {
        manejarRedireccion("Enviar Dinero", "sendmoney.html");
    });

    $('#btnMovimientos').click(function() {
        manejarRedireccion("Últimos Movimientos", "transactions.html");
    });

});



$(document).ready(function() {
    
    //Saldo mostrar
    let saldoActual = parseFloat(localStorage.getItem("saldo")) || 60000;
    $('#displaySaldoActual').text('$' + saldoActual);

    // Formuialrio
    $('#formDeposito').submit(function(event) {
        event.preventDefault(); 

        // Obtener inputs
        const montoADepositar = parseFloat($('#depositAmount').val());

        if (montoADepositar > 0) {
            
            const nuevoSaldo = saldoActual + montoADepositar;

          
            localStorage.setItem("saldo", nuevoSaldo);

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
            setTimeout(function() {
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



$(document).ready(function() {
    let contactoSeleccionado = null;

    // 1. Mostrar/Ocultar formulario
    $('#btnMostrarForm').click(function() {
        $('#nuevoContactoForm').slideDown();
        $(this).hide();
    });

    $('#btnCancelar').click(function() {
        $('#nuevoContactoForm').slideUp();
        $('#btnMostrarForm').show();
    });

    // Validar y Guardar nuevo contacto
    $('#btnGuardar').click(function() {
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
    $('#inputBusqueda').on('keyup', function() {
        const valor = $(this).val().toLowerCase();
        
        $('#listaContactos li').filter(function() {
            // Mostramos u ocultamos según coincida el nombre o alias
            $(this).toggle($(this).text().toLowerCase().indexOf(valor) > -1);
        });
    });

    // Seleccionar contacto y mostrar botón 
    $('#listaContactos').on('click', '.contacto-item', function() {
        $('.contacto-item').removeClass('selected');
        $(this).addClass('selected');
        
        contactoSeleccionado = $(this).data('nombre');
        $('#seccionEnvio').fadeIn(); // Mostrar sección de envío
    });

    // Enviar dinero con mensaje de confirmación
    $('#btnEnviarDinero').click(function() {
        const monto = parseFloat($('#montoEnvio').val());
        const saldoActual = parseFloat(localStorage.getItem("saldo")) || 60000;

        if (monto > 0 && monto <= saldoActual) {
            const nuevoSaldo = saldoActual - monto;
            localStorage.setItem("saldo", nuevoSaldo);

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



$(document).ready(function() {
    
    // Obtener los movimientos reales del LocalStorage
    // (Asegúrate de haber guardado datos con los nombres 'tipo', 'monto' y 'detalle')
    const movimientosReal = JSON.parse(localStorage.getItem("historial")) || [];

    // Función para obtener el formato 
    function getTipoTransaccion(tipo) {
        const tipos = {
            'deposito': '💰 Depósito',
            'envio': '💸 Transferencia Enviada'
        };
        return tipos[tipo.toLowerCase()] || tipo;
    }

    //Función principal para mostrar movimientos
    function mostrarUltimosMovimientos(filtro = "todos") {
        const $lista = $('#listaTransacciones');
        $lista.empty(); // Limpiar la lista antes de volver a llenar

        // Filtrar la lista real
        const movimientosFiltrados = movimientosReal.filter(mov => {
            if (filtro === "todos") return true;
            return mov.tipo.toLowerCase() === filtro;
        });

        if (movimientosFiltrados.length === 0) {
            $lista.append('<li class="list-group-item text-center text-muted">No hay movimientos para este tipo.</li>');
            return;
        }

        // Dibujar cada movimiento (del más nuevo al más viejo)
        movimientosFiltrados.reverse().forEach(mov => {
            const claseMonto = mov.tipo.toLowerCase() === 'deposito' ? 'monto-deposito' : 'monto-envio';
            const signo = mov.tipo.toLowerCase() === 'deposito' ? '+' : '-';
            
            const itemHtml = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${mov.detalle}</strong> <br>
                        <span class="badge badge-light badge-tipo">${getTipoTransaccion(mov.tipo)}</span>
                        <br><small class="text-muted">${mov.fecha || ''}</small>
                    </div>
                    <span class="${claseMonto}">${signo} $${mov.monto}</span>
                </li>
            `;
            
            // Usamos fadeIn para que aparezcan suavemente...
            $(itemHtml).hide().appendTo($lista).fadeIn(400);
        });
    }

    // Cambio en el select
    $('#filtroTipo').change(function() {
        const seleccion = $(this).val();
        mostrarUltimosMovimientos(seleccion);
    });

    //Carga inicial
    mostrarUltimosMovimientos();
});