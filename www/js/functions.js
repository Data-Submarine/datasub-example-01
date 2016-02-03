//////////////////////////////////////////////////////////////////////
//////////////////  FUNCIONALIDAD DE LA APLICACIÓN  //////////////////
//////////////////////////////////////////////////////////////////////


//////////////////  EVENTOS LUEGO DE CARGADA LA PÁGINA HTML  //////////////////

$(document).ready(todoCargado);

function todoCargado() {

  //--- Controles de ventana ---//
  // Min
  $('#windowControlMinimize').click(winMinimize);
  // Close
  $('#windowControlClose').click(winClose);
  // Max
  $('#windowControlMaximize').click(winMaximize);

  //--- Eventos Globales ---//

  // Tooltip
  $('.tooltip-demo').tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
  });

  // Popover
  $("#listSpp").on('keyup', function(e) {
    if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 40) {
      $('#listSpp').popover('destroy');
    }
  });

  $("#listSpp").on('blur', function(e) {
    $('#listSpp').popover('destroy');
  });

  $("#listSpp").on('keyup', function(e) {

    var image = '<button name="fotoAlga" value="1" class="btn btn-default" type="button" data-toggle="modal" data-target="#modalFotoAlga"><img src=img/fotosSpp/alexandrium.jpeg></button>';
    if (event.keyCode == 39) {
      $("#listSpp").popover({
        trigger: 'manual',
        placement: 'right',
        //content: $e.attr("data-content"),
        content: image,
        html: true
      }).popover('show');
    }
    // Definir evento del botón
    $('button[name="fotoAlga"]').click(funFotoAlgaPopover);
  });

  /*
  $("#listSpp").on('mouseleave', function(e) {
    $('#listSpp').popover('destroy');
  });

  $("#listSpp").on('mouseover', function(e) {
    var $e = $(e.target);
    var image = '<img src=img/fotosSpp/noctiluca-popover.jpeg>';
    if ($e.is('option')) {
      //$('#listSpp').popover('destroy');
      $("#listSpp").popover({
        trigger: 'manual',
        placement: 'right',
        //content: $e.attr("data-content"),
        content: image,
        html: true
      }).popover('show');
    }
  });
  */

  // Alertas
  $("#alertaFechaCualiBtn").click(funOcultarAlertaFechaCuali);

  // Cargar sitios a listas de select desde BD
  funCargarSitiosSelectores();

  //--- Información general ---//

  // Evento para mostrar [color de espuma]
  $('#formPresenciaEspuma').on('change', funFormColorEspuma);

  // Evento para habilitar [concentración] y [procedencia] en Toxinas
  $('#checkToxinaVAM').on('change', funCheckIngresoToxinas);

  //--- Eventos Análisis Fitoplancton ---//

  // Cargar fechas e ID muestra
  $("#fechaMuestra").change(function(event) {

    var fechaMuestra = $("#fechaMuestra").val();

    $("input[name='fechaMuestra']").val(fechaMuestra);
  });

  $("#fechaMuestra").change(funCargarIdMuestra);
  $("#sitioMuestra").change(funCargarIdMuestra);

  // Cargar spp a listas desde BD
  funCargarSppSelSpp();
  $('#selectorGrupo button').click(funSelectGrupo);
  $('#selectorGrupo button').click(funCargarSppSelSpp);

  // Seleccionar especies de lista a tabla
  $("#listSpp").dblclick(function(event) {
    funListaSppAgregarTabla();
  });

  $("#listSpp").keyup(function(event) {
    if (event.keyCode == 13) {
      // Spp elegida por ID
      var selectedID = $("#listSpp option:selected").val();
      if ($("#listSpp option:selected").length > 0) {
        funListaSppAgregarTabla();
      }
    }
  });

  // Enfocar búsqueda apretando tecla "izquierda" caundo estamos en el select de especies
  $("#listSpp").keyup(function(event) {
    if (event.keyCode == 37) {
      $("#inputBuscarSpp").trigger("focus");
    }
  });

  // Enfocar tabla apretando tecla "derecha" caundo estamos en el select de especies
  $("#listSpp").keyup(function(event) {
    if (event.keyCode == 39) {
      $("#tablaSpp").trigger("hover");
    }
  });

  // Remover especies de tabla
  $(".listSppTabla").click(funListaSppRemoverTabla);

  // Buscador de spp.
  $("#inputBuscarSpp").on('input', funFiltrarSpp);
  $("#inputBuscarSpp").on('input', funCargarSppSelSpp);
  $("#inputBuscarSpp").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#listSpp").trigger("focus");
    }
  });

  // Evento modal foto alga
  $("i[name='fotoAlga']").click(funMostrarModalFotoAlga);
}

////////////////// FIN EVENTOS LUEGO DE CARGADA LA PÁGINA HTML  //////////////////

// Función para tiempo de registro
function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (month.toString().length == 1) {
    month = '0' + month;
  }
  if (day.toString().length == 1) {
    day = '0' + day;
  }
  if (hour.toString().length == 1) {
    hour = '0' + hour;
  }
  if (minute.toString().length == 1) {
    minute = '0' + minute;
  }
  if (second.toString().length == 1) {
    second = '0' + second;
  }
  var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  return dateTime;
}

//////////////////  INFORMACIÓN GENERAL  //////////////////

// Función para mostrar [color de espuma] si hay [espuma]
function funFormColorEspuma() {
  var espuma = $('input[name="presenciaEspuma"]:checked', '#formPresenciaEspuma').val();
  if (espuma === "si") {
    $('#formColorEspuma').show();
  }
  if (espuma === "no") {
    $('#formColorEspuma').hide();
  }
}

// Función para habilitar/deshabilitar ingreso toxinas
function funCheckIngresoToxinas() {

  var toxina = $('input[id="checkToxinaVAM"]:checked').val();
  if (toxina === "si") {
    $("#fieldToxinaVAM").attr("disabled", false);
  } else {
    $("#fieldToxinaVAM").attr("disabled", true);
  }
}

// Función para cargar sitios en selectores
function funCargarSitiosSelectores() {

  //Vacío listas spp
  $("#sitioMuestra").html("");

  var listaSitios = "";

  for (var i = 0; i < baseDatosSitios.length; i++) {
    idSitio = baseDatosSitios[i].idSitio;
    departamento = baseDatosSitios[i].departamento;
    ciudad = baseDatosSitios[i].ciudad;
    codigo = baseDatosSitios[i].codCiudad;
    sitio = baseDatosSitios[i].sitio;

    listaSitios = "<option value='" + idSitio + "'>" + departamento + " - " + ciudad + " (" + codigo + ", " + sitio + ")" + "</option>";
    $("#sitioMuestra").append(listaSitios);
  }
}


// Generar y Cargar ID muestra a secciones
function funCargarIdMuestra() {

  var idSitio = parseInt($("#sitioMuestra option:selected").val());
  var fechaMuestra = $("#fechaMuestra").val();
  var codCiudad = baseDatosSitios[idSitio - 1].codCiudad;
  var nroMuestra = parseInt($("#numeroMuestra").val());
  var integrada = 1;

  var idMuestra = "";
  idMuestra += "S" + codCiudad;
  idMuestra += idSitio;
  idMuestra += "F" + fechaMuestra;
  idMuestra += "M" + nroMuestra;
  idMuestra += "I" + integrada;

  $("input[name='IDMuestra']").val(idMuestra);

}


//////////////////  ANÁLISIS DE FITOPLANCTON  //////////////////

// Valores de botones de grupos
function funValorBotonGrupo() {
  var valorBoton = $(this).prop("value");
  return valorBoton;
}

// Filtrado base datos por búsqueda
function funFiltrarSpp() {

  //Limpio array con especies
  especieFiltrado = [];

  var busqueda = $("#inputBuscarSpp").val();

  for (var i = 0; i < baseDatosSpp.length; i++) {

    especieTemporal = baseDatosSpp[i].spp.toLowerCase();

    if (especieTemporal.indexOf(busqueda) !== -1) {

      var arraySppPos = {
        Especie: baseDatosSpp[i].spp,
        Pos: i
      };
      especieFiltrado.push(arraySppPos);
    }
  }

  if (especieFiltrado.length === 0) {

    //especieFiltrado = especie;

    var arraySppPos2 = {
      Especie: "No encontrada",
      Pos: 0
    };
    especieFiltrado.push(arraySppPos2);
  }
  return especieFiltrado;
}

// Función para eventos de selección de grupo
function funSelectGrupo() {
  $('#selectorGrupo button').addClass('active').not(this).removeClass('active');
  grupoFiltrado = $('#selectorGrupo').find('button.active').val();
  return grupoFiltrado;
}

// Función para cargar especies en listas de spp.
function funCargarSppSelSpp() {

  //Vacío listas spp
  $("#optgroupDino").html("");
  $("#optgroupDiato").html("");
  $("#optgroupSilico").html("");
  $("#optgroupCiano").html("");
  $("#optgroupCilia").html("");

  var listaSpp = "";
  var spp = "";
  var grupos = "";
  var ids = "";
  var i = 0;

  // Datos especies filtradas
  var especiesLista = funFiltrarSpp();

  // Selector de grupo
  //$('#selectorGrupo button').addClass('active').not(this).removeClass('active');

  var grupoRadio = grupoFiltrado;

  if (grupoRadio === "grupoTodos") {
    for (i; i < especiesLista.length; i++) {
      spp = especiesLista[i].Especie;
      grupos = baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo.toLowerCase();
      ids = baseDatosSpp[parseInt(especiesLista[i].Pos)].id;
      listaSpp = "<option data-placement='' data-content='1' data-toggle='tooltip' data-original-title='" + spp + "' class='" + grupos + "' value='" + ids + "'><i>" + spp + "</i></option>";

      if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Dinoflagelados") {
        $("#optgroupDino").append(listaSpp);
      } else if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Diatomeas") {
        $("#optgroupDiato").append(listaSpp);
      } else if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Silicoflagelados") {
        $("#optgroupSilico").append(listaSpp);
      } else if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Cianobacterias") {
        $("#optgroupCiano").append(listaSpp);
      } else if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Ciliados") {
        $("#optgroupCilia").append(listaSpp);
      }
    }

  } else if (grupoRadio === "grupoDino") {
    for (i; i < especiesLista.length; i++) {
      if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Dinoflagelados") {
        spp = especiesLista[i].Especie;
        grupos = baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo.toLowerCase();
        ids = baseDatosSpp[parseInt(especiesLista[i].Pos)].id;
        listaSpp = "<option data-placement='bottom' data-toggle='tooltip' data-original-title='" + spp + "'class='" + grupos + "' value='" + ids + "'><i>" + spp + "</i></option>";
        $("#optgroupDino").append(listaSpp);
      }
    }

  } else if (grupoRadio === "grupoDiato") {
    for (i; i < especiesLista.length; i++) {
      if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Diatomeas") {
        spp = especiesLista[i].Especie;
        grupos = baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo.toLowerCase();
        ids = baseDatosSpp[parseInt(especiesLista[i].Pos)].id;
        listaSpp = "<option data-placement='bottom' data-toggle='tooltip' data-original-title='" + spp + "'class='" + grupos + "' value='" + ids + "'><i>" + spp + "</i></option>";
        $("#optgroupDiato").append(listaSpp);
      }
    }
  } else if (grupoRadio === "grupoSilico") {
    for (i; i < especiesLista.length; i++) {
      if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Silicoflagelados") {
        spp = especiesLista[i].Especie;
        grupos = baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo.toLowerCase();
        ids = baseDatosSpp[parseInt(especiesLista[i].Pos)].id;
        listaSpp = "<option data-placement='bottom' data-toggle='tooltip' data-original-title='" + spp + "'class='" + grupos + "' value='" + ids + "'><i>" + spp + "</i></option>";
        $("#optgroupSilico").append(listaSpp);
      }
    }
  } else if (grupoRadio === "grupoCiano") {
    for (i; i < especiesLista.length; i++) {
      if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Cianobacterias") {
        spp = especiesLista[i].Especie;
        grupos = baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo.toLowerCase();
        ids = baseDatosSpp[parseInt(especiesLista[i].Pos)].id;
        listaSpp = "<option data-placement='bottom' data-toggle='tooltip' data-original-title='" + spp + "'class='" + grupos + "' value='" + ids + "'><i>" + spp + "</i></option>";
        $("#optgroupCiano").append(listaSpp);
      }
    }
  } else if (grupoRadio === "grupoCilia") {
    for (i; i < especiesLista.length; i++) {
      if (baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo === "Ciliados") {
        spp = especiesLista[i].Especie;
        grupos = baseDatosSpp[parseInt(especiesLista[i].Pos)].grupo.toLowerCase();
        ids = baseDatosSpp[parseInt(especiesLista[i].Pos)].id;
        listaSpp = "<option data-placement='bottom' data-toggle='tooltip' data-original-title='" + spp + "'class='" + grupos + "' value='" + ids + "'><i>" + spp + "</i></option>";
        $("#optgroupCilia").append(listaSpp);
      }
    }
  }
}

// Función para armar Tabla de especies seleccionadas
function funArmarTabla() {

  if (especiesTabla.length > 0) {

    $("#tableBodyListSpp").html("");

    if (especiesTabla.length === 0) {
      return NULL;
    } else {
      var tabla = "";
      var fila = "";

      // Variables de Tabla
      var id = -1;
      var spp = "";
      var grupos = "";
      var grupoNombre = "";
      var nocivo = "";
      var foto = "<img class='img-thumbnail img-responsive' name='fotoAlga' data-toggle='modal' data-target='#modalFotoAlga' src='../img/fotosSpp/noctiluca.jpeg' alt='' width='40px' />";
      var contar = "";
      var medir = "";

      // Armar tabla
      for (var i = 0; i < especiesTabla.length; i++) {

        id = especiesTabla[i].id;
        spp = especiesTabla[i].spp;
        grupos = especiesTabla[i].grupo.toLowerCase();
        grupoNombre = especiesTabla[i].grupo;

        if (parseInt(especiesTabla[i].nocivo) === 1) {
          nocivo = "Si";
        } else {
          nocivo = "No";
        }

        if (parseInt(especiesTabla[i].contar) === 1) {
          contar = "checked";
        } else {
          contar = "";
        }

        if (parseInt(especiesTabla[i].medir) === 1) {
          medir = "checked";
        } else {
          medir = "";
        }

        fila = "";
        fila = "<tr id='" + id + "'>";
        fila += "<td title='Remover de tabla'><p><i class='fa fa-chevron-left listSppTabla' value='" + id + "'></i></p></td>";
        fila += "<td class='text-center'><p>" + (i + 1) + "</p></td>";
        fila += "<td><p>" + spp + "</p></td>";
        fila += "<td><p>" + grupoNombre + "</p></td>";
        fila += "<td class='text-center'><p>" + nocivo + "</p></td>";
        fila += "<td title='Ver foto' class='text-center'>" + "<i id='" + id + "' class='glyphicon glyphicon-picture' name='fotoAlga' data-toggle='modal' data-target='#modalFotoAlga'></i>" + "</td>";
        fila += "<td class='text-center'>" + "<input type='checkbox' name='contar' value='" + id + "' " + contar + " >" + "</td>";
        fila += "<td class='text-center'>" + "<input type='checkbox' name='medir' value='" + id + "' " + medir + " >" + "</td>";
        fila += "<td class='" + "color-grupo td-" + grupos + "' </td>";
        fila += "</tr>";
        tabla += fila;
      }

      $("#tableBodyListSpp").html(tabla);

      // Eventos sobre Tabla

      // Foto modal
      $("i[name='fotoAlga']").click(funMostrarModalFotoAlga);

      // Remover especies de tabla
      $(".listSppTabla").click(funListaSppRemoverTabla);

      // Checkboxes
      $("input[name='contar']").click(funCualiCheckContar);
      $("input[name='medir']").click(funCualiCheckMedir);
    }
  } else {
    $("#tableBodyListSpp").html("");
  }

}

// Función para seleccionar especies de lista a tabla
function funListaSppAgregarTabla() {

  // Datos especies filtradas
  var especiesLista = funFiltrarSpp();

  // Spp elegida por ID
  var selectedID = parseInt($("#listSpp option:selected").val());

  // Especie
  var especieEncontrada = funValidarEspecieCuali(selectedID);

  // Fecha
  var fechaCuali = $('#fechaMuestra').val();
  var fechaCualiValida = funValidarFechaCuali(fechaCuali);

  // ID
  var idCuali = $('input[name="IDMuestra"]').val();
  var idCualiValida = funValidarIdCuali(idCuali);

  // Tiempo registro: %Y-%m-%d %H:%M:%S
  var dt = new Date();
  var dateTimeReg = getDateTime();

  if (!especieEncontrada && fechaCualiValida && idCualiValida) {

    // Agrego ID spp a Array de especies Tabla
    var especieTemporal = {
      id: baseDatosSpp[selectedID - 1].id,
      spp: baseDatosSpp[selectedID - 1].spp,
      grupo: baseDatosSpp[selectedID - 1].grupo,
      nocivo: baseDatosSpp[selectedID - 1].nocivo,
      contar: 2,
      medir: 2
    };

    especiesTabla.push(especieTemporal);

    var insertar = "";
    insertar += "INSERT INTO Cualitativo VALUES ";
    insertar += "(";
    insertar += "'" + idCuali.toUpperCase() + "'";
    insertar += ",";
    insertar += "'" + fechaCuali + "'";
    insertar += ",";
    insertar += especieTemporal.id;
    insertar += ",";
    insertar += 2;
    insertar += ",";
    insertar += 2;
    insertar += ",";
    insertar += "'" + dateTimeReg + "'";
    insertar += ");";

    // Ayuda
    //$("#observacionesCuali").val("");
    //$("#observacionesCuali").val(insertar);

    // Insertar en Base de Datos
    var insertarEnDB = db.exec(insertar);
    var data = db.export();
    var buffer = new Buffer(data);
    fs.writeFileSync('src/app/data/fitoDB.sqlite', buffer);

    // Mensaje en consola
    console.log("Dato insertado a Cualitativo: " + insertar);

    // Sumo al contador de spp
    if (contadorSpp < baseDatosSpp.length) {
      contadorSpp += 1;
    }

    // Llamo función para armar tabla
    funArmarTabla();
  }
}

// Función para remover especies de tabla
function funListaSppRemoverTabla() {

  var selectedID = parseInt($(this).attr("value"));
  var arrayEspeciesTabla = [];

  // Recorro el array de especies especiesTabla y saco la especie seleccionada
  for (var i = 0; i < especiesTabla.length; i++) {

    if (parseInt(especiesTabla[i].id) !== selectedID) {
      arrayEspeciesTabla.push(especiesTabla[i]);
    }
  }

  especiesTabla = arrayEspeciesTabla;

  var remover = db.exec("DELETE FROM `Cualitativo` WHERE `idSpp`='" + selectedID + "';");
  console.log("Removido de Cualitativo: idSpp = " + selectedID);

  var data = db.export();
  var buffer = new Buffer(data);
  fs.writeFileSync('src/app/data/fitoDB.sqlite', buffer);

  // Resto al contador de spp
  if (contadorSpp > 0) {
    contadorSpp -= 1;
  }

  // Llamo función para armar tabla
  funArmarTabla();
}

// Eventos checkboxes Cuali (contar y medir)
function funCualiCheckMedir() {

  var selectedID = parseInt($(this).attr("value"));
  var arrayEspeciesTabla = [];

  // Recorro el array de especies especiesTabla y modifico el atributo Medir para la especie seleccionada
  var i = 0;
  var encontrado = false;

  while (i < especiesTabla.length && !encontrado) {

    if (parseInt(especiesTabla[i].id) === selectedID) {

      encontrado = true;

      if (parseInt(especiesTabla[i].medir) === 1) {
        especiesTabla[i].medir = 2;

      } else if (parseInt(especiesTabla[i].medir) === 2) {
        especiesTabla[i].medir = 1;
      }
    }
    i++;
  }
}

function funCualiCheckContar() {

  var selectedID = parseInt($(this).attr("value"));
  var arrayEspeciesTabla = [];

  // Recorro el array de especies especiesTabla y modifico el atributo Contar para la especie seleccionada
  var i = 0;
  var encontrado = false;

  while (i < especiesTabla.length && !encontrado) {

    if (parseInt(especiesTabla[i].id) === selectedID) {

      encontrado = true;

      if (parseInt(especiesTabla[i].contar) === 1) {
        especiesTabla[i].contar = 2;

      } else if (parseInt(especiesTabla[i].contar) === 2) {
        especiesTabla[i].contar = 1;
      }
    }
    i++;
  }
}


// Modal foto alga
function funMostrarModalFotoAlga() {

  var contenido = "";
  var pos = -1;
  var especieFotoNombre = "Spp";
  var id = parseInt(this.id);

  for (var i = 0; i < baseDatosSpp.length; i++) {
    if (id === i) {
      pos = parseInt(baseDatosSpp[i].id);
      especieFotoNombre = baseDatosSpp[i - 1].spp;
    }
  }

  $("#modalNombreAlga").html("");
  $("#modalNombreAlga").html(especieFotoNombre);
}

// Evento sobre imagen popover de foto alga

function funFotoAlgaPopover() {

  var contenido = "";
  var pos = -1;
  var especieFotoNombre = "Spp";
  var id = parseInt(this.value);

  for (var i = 0; i < baseDatosSpp.length; i++) {
    if (id === i) {
      pos = parseInt(baseDatosSpp[i].id);
      especieFotoNombre = baseDatosSpp[i - 1].spp;
    }
  }

  $("#modalNombreAlga").html("");
  $("#modalNombreAlga").html(especieFotoNombre);
}


// Alertas

//Fecha Cuali
function funOcultarAlertaFechaCuali() {
  $("#alertaFechaCualiDiv").hide();
}



/*



*/

//FIN
