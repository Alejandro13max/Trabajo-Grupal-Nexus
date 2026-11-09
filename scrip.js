$(document).ready(function() {

    /* ==========================
       1. MENÚ HAMBURGUESA (slideToggle)
    ========================== */
    $('#hamburger').on('click', function() {
        $('#menu').slideToggle(300);
        
        const icon = $(this).find('i');
        if ($('#menu').is(':visible')) {
            icon.removeClass('fa-bars').addClass('fa-xmark');
        } else {
            icon.removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    $('.menu a').on('click', function() {
        if ($(window).width() <= 1024) {
            $('#menu').slideUp(300);
            $('#hamburger i').removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    /* ==========================
       2. MODO OSCURO / CLARO
    ========================== */
    $('#modoBtn').on('click', function() {
        $('body').toggleClass('light-mode');
        const icon = $(this).find('i');
        
        if ($('body').hasClass('light-mode')) {
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    });

    /* ==========================
       3. FILTROS DE CATÁLOGO (fadeIn / hide)
    ========================== */
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        const filterValue = $(this).data('filter');

        $('.product-card').hide(); 
        
        if (filterValue === 'todos') {
            $('.product-card').fadeIn(400); 
        } else {
            $(`.product-card[data-category="${filterValue}"]`).fadeIn(400);
        }
    });

    $('.filter-link').on('click', function() {
        const filter = $(this).data('filter');
        $(`.filter-btn[data-filter="${filter}"]`).trigger('click');
    });

    /* ==========================
       4. MODAL DE REGISTRO
    ========================== */
    $('#abrirModal').on('click', function() {
        $('#modal').fadeIn(300).css('display', 'flex'); 
    });

    function cerrarModal() {
        $('#modal').fadeOut(300); 
    }

    $('.close-modal').on('click', cerrarModal);
    
    $(window).on('click', function(e) {
        if ($(e.target).is('#modal')) {
            cerrarModal();
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            cerrarModal();
        }
    });

    /* ==========================
       5. VALIDACIONES EN TIEMPO REAL (jQuery)
    ========================== */
    
    const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^[67][0-9]{7}$/; 
    const regexCI = /^[0-9]{5,10}$/;

    function validarCampo(inputId, condicion) {
        const $input = $('#' + inputId);
        const $group = $input.closest('.form-group');
        
        if (condicion) {
            $group.removeClass('error');
            $group.find('.error-msg').hide();
            return true;
        } else {
            $group.addClass('error');
            $group.find('.error-msg').show();
            return false;
        }
    }

    $('#nombre, #apellido').on('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]/g, "");
        validarCampo(this.id, regexLetras.test(this.value) && this.value.length >= 2);
    });

    $('#ci, #telefono').on('input', function() {
        this.value = this.value.replace(/\D/g, "");
        
        if (this.id === 'ci') {
            validarCampo('ci', regexCI.test(this.value));
        } else {
            validarCampo('telefono', regexTelefono.test(this.value));
        }
    });

    $('#ciudad').on('change', function() {
        validarCampo('ciudad', $(this).val() !== "");
    });

    $('#correo').on('input', function() {
        validarCampo('correo', regexCorreo.test($(this).val().trim()));
    });

    $('#password').on('input', function() {
        const val = $(this).val();
        const esValida = val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val);
        validarCampo('password', esValida);
        
        if ($('#confirmar').val() !== "") {
            $('#confirmar').trigger('input');
        }
    });

    $('#confirmar').on('input', function() {
        validarCampo('confirmar', $(this).val() === $('#password').val() && $(this).val() !== "");
    });

    $('#terminos').on('change', function() {
        if ($(this).is(':checked')) {
            $('#error-terminos').hide();
        } else {
            $('#error-terminos').show();
        }
    });

    /* ==========================
       6. ENVÍO DEL FORMULARIO
    ========================== */
    $('#registroForm').on('submit', function(e) {
        e.preventDefault();

        let nombreOk = validarCampo('nombre', regexLetras.test($('#nombre').val().trim()) && $('#nombre').val().length >= 2);
        let apellidoOk = validarCampo('apellido', regexLetras.test($('#apellido').val().trim()) && $('#apellido').val().length >= 2);
        let ciOk = validarCampo('ci', regexCI.test($('#ci').val().trim()));
        let ciudadOk = validarCampo('ciudad', $('#ciudad').val() !== "");
        let telefonoOk = validarCampo('telefono', regexTelefono.test($('#telefono').val().trim()));
        let correoOk = validarCampo('correo', regexCorreo.test($('#correo').val().trim()));
        
        let passVal = $('#password').val();
        let passwordOk = validarCampo('password', passVal.length >= 8 && /[A-Z]/.test(passVal) && /[0-9]/.test(passVal));
        let confirmarOk = validarCampo('confirmar', $('#confirmar').val() === passVal && $('#confirmar').val() !== "");

        let terminosOk = true;
        if (!$('#terminos').is(':checked')) {
            $('#error-terminos').show();
            terminosOk = false;
        } else {
            $('#error-terminos').hide();
        }

        if (nombreOk && apellidoOk && ciOk && ciudadOk && telefonoOk && correoOk && passwordOk && confirmarOk && terminosOk) {
            alert("✅ ¡Cuenta Creada! Bienvenido al gremio de NEXUS GAMING.");
            this.reset();
            $('.error-msg').hide();
            $('.form-group').removeClass('error');
            cerrarModal();
        }
    });

    /* ==========================
       7. CARRITO (Simulación)
    ========================== */
    let cartCount = 0;
    
    $('.add-cart-btn').on('click', function() {
        cartCount++;
        $('.cart-count').text(cartCount);
        
        const $cartIcon = $('.cart-btn');
        $cartIcon.css('transform', 'scale(1.2)');
        setTimeout(() => $cartIcon.css('transform', 'scale(1)'), 200);
        
        const $btn = $(this);
        $btn.css('background-color', '#00f0ff').css('color', '#000');
        setTimeout(() => {
            $btn.css('background-color', '').css('color', '');
        }, 500);
    });

});