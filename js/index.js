const idregistro = document.getElementById("idRegistro");
const nombre = document.getElementById("nombre");
const idvotar = document.getElementById("idvotar");
const registrar = document.getElementById("btnRegistrar");
const votar = document.getElementById("votar");
const database = firebase.database();
const btnCandidato = document.getElementById("btncandidato");
const btnVotos = document.getElementById("btnvotaciones");


let validarCandidato = (i, n) => {

    if (i === "" || n === "") {

        alert("Complete los campos");
        return false;
    }
    let candidatoNuevo = true;
    database.ref('Candidatos').on('value', function (data) {

        data.forEach(

            function (C) {

                let valor = C.val();
                let id = valor.id;

                if (id === i) {

                    candidatoNuevo = false;

                }


            }

        )
    });

    return candidatoNuevo;

}

let Registrar = () => {

    let i = idregistro.value;
    let n = nombre.value;



    if (validarCandidato(i, n)) {
        let Candidato = {
            id: i,
            nombre: n
        }

        database.ref('Candidatos').push().set(Candidato)
        alert("candidato registrado");
        idregistro.value = "";
        nombre.value ="";
    }
    else {

        alert("Ya existe un candidato con este id")


    }

}

let Votar = () => {

    let idv = idvotar.value;

    let voto = {

        idVoto: Math.random(),
        id: idv

    }

    let key;
    let valido = false;
    database.ref('Candidatos').on('value', function (data) {

        data.forEach(

            function (C) {

                let valor = C.val();
                let id = valor.id;
                if (id === idv) {
                    valido = true;
                    key = C.key;
                }

            }

        )

    });
    if (valido) {

        database.ref('Candidatos').child(key).child('votos').push().set(voto);
        database.ref('Votos').push().set(voto);
        alert("voto registrado correctamente");
        idvotar.value=""

    }
    else {

        alert("no existe un candidato con este id");
    }
   

}

let VerCandidatos = () => {

    let arrayNombre = [];
    database.ref('Candidatos').on('value', function (data) {

        data.forEach(

            function (C) {

                let valor = C.val();
                arrayNombre.push(valor.nombre + "  " + valor.id + " ");
            
            }
        )

    })
    alert(arrayNombre);
}

let VerVotos = () => {

    let totalVotos;
    let porcentajeVotos = [];


    database.ref('Votos').on('value', function (data) {

        totalVotos = data.numChildren();
        
    });

    database.ref('Candidatos').on('value', function (data) {

        data.forEach(

            function (C) {

                let valor = C.val();
                let key = C.key;
                let name = valor.nombre;

                database.ref('Candidatos').child(key).child('votos').on('value', function (datavotos) {
                    porcentajeVotos.push(name + " " + datavotos.numChildren() / totalVotos * 100 + " % " );
                });
            }
        )

    })

    alert(porcentajeVotos)



}

votar.addEventListener('click', Votar);
registrar.addEventListener('click', Registrar);
btnCandidato.addEventListener('click', VerCandidatos);
btnVotos.addEventListener('click', VerVotos);


