//////////////////////////////////////////////////////////////////////////////
//////////////////  VALIDACIONES DE LAS ENTRADAS DE DATOS   //////////////////
//////////////////////////////////////////////////////////////////////////////



//////////////////  INFORMACIÓN GENERAL  //////////////////



//////////////////  ANÁLISIS DE FITOPLANCTON  //////////////////


// CUALITATIVO

// Especie
function funValidarEspecieCuali(pSelectedID) {

  var especieEncontrada = false;
  var j = 0;

  while (j < especiesTabla.length && !especieEncontrada) {

    if (especiesTabla.length !== 0 && pSelectedID === parseInt(especiesTabla[j].id)) {

      especieEncontrada = true;

      // Alerta
      alert("Atención: la especie ya fue elegida");
    }
    j++;
  }
  return especieEncontrada;
}

// Fecha
function funValidarFechaCuali(pFecha) {

  var fechaValida = false;
  var fechaCuali = pFecha;

  if (fechaCuali.length === 0) {

    // Alerta
    //alert("Atención: ingresar fecha");
    $("#alertaFechaCualiDiv").show();

  } else {
    fechaValida = true;
  }
  return fechaValida;
}

// ID
function funValidarIdCuali(pId) {

  var idValida = false;
  var idCuali = pId;

  if (idCuali.length === 0) {
    // Aviso
    alert("Atención: ingresar ID");
  } else {
    idValida = true;
  }
  return idValida;
}
