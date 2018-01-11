/* 
Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

class LocalStorage{
    contructor(){}
    
    guardarJuego(user,contrasena){
        let juegos = this.get('juegos');
        usuario.setUsuario(user.val());
        usuario.setContrasena(contrasena.val());
        juego.setUsuario(usuario);
        juego.setSudoku_Actual(board.toString()); 
        if(typeof(juegos)=="undefined" || juegos == null){
            juegos = new Array();
            juegos.push(juego);
            this.set('juegos',juegos);
        }
        else{
            console.log(juegos);
            juegos = juegos.filter(juego => juego.usuario.usuario != usuario.usuario || juego.usuario.contrasena != usuario.contrasena);
            juegos.push(juego);
            console.log(juegos);
            this.set('juegos',juegos);
        }
        user.val("");
        contrasena.val("");
    }
    
    cargarSudokus() {
        let sudokus = [
            {sudoku: ".7..9.8.46.8...95...5.....2..4......3..875.2..5..4.7..2897.43..5.7.......6..53..8", dificultad: "F", numero: 1},
            {sudoku: ".87..3...1.5......3..782.5..6....5177.8...4...5.3..986246..9.......7..4.8..42.3.9", dificultad: "F", numero: 2},
            {sudoku: "..658.7...8.4..53..521.....7...36.4....25...7...74.2..2486.....573.9.62..6...28..", dificultad: "F", numero: 3},
            {sudoku: "..8..5..45294836..3..6...8..42.....8.....8...8..5.6...98.37.245..725..3...3..4.7.", dificultad: "F", numero: 4},
            {sudoku: ".....57.8546..81...18.96.4.28...9..7.3.2..9...5.18...2...8.......2...85....5623.4", dificultad: "F", numero: 5},
            {sudoku: "..6..47..9.4...26..5.6.....82.1.3674.....69..4.7.....13..4.8..6.1..6..39..59.....", dificultad: "N", numero: 6},
            {sudoku: ".3..9...2...5.7..1..6.418..87.....15...3.....4.9.783.69.26...3..65.2.18..8.......", dificultad: "N", numero: 7},
            {sudoku: ".8521...76.47.3.......4.....62..5........476.74...29.85.....38..26.9..7....3..6.9", dificultad: "N", numero: 8},
            {sudoku: "...32...5.58..94.3...5.4.2...38.26..8..16....5.2..7.....628534.......76..2..9....", dificultad: "N", numero: 9},
            {sudoku: ".537..8..4.782.1....6.9...4.6...85...2.9.5.4......7..3..4...9.2.......5....459376", dificultad: "N", numero: 10},
            {sudoku: "4...3.......6..8..........1....5..9..8....6...7.2........1.27..5.3....4.9........", dificultad: "D", numero: 11},
            {sudoku: "7.8...3.....6.1...5.........4.....263...8.......1...9..9.2....4....7.5...........", dificultad: "D", numero: 12},
            {sudoku: "3.7.4...........918........4.....7.....16.......25..........38..9....5...2.6.....", dificultad: "D", numero: 13},
            {sudoku: "5..7..6....38...........2..62.4............917............35.8.4.....1......9....", dificultad: "D", numero: 14},
            {sudoku: "3.7..4.2....1..8..9............3..9..5.8......4.6...........5.12...7..........6..", dificultad: "D", numero: 15}
        ];
        this.set('sudokus', sudokus);
    }
    
    get(id){
        return JSON.parse(localStorage.getItem(id));
    }
    
    set(id,objeto){
        localStorage.removeItem(id);
        localStorage.setItem(id,JSON.stringify(objeto));
    }
    
    cargarJuego(user, contrasena) {
        let juegos = this.get('juegos');
        if (typeof (juegos) == "undefined" || juegos == null) {
            alert("No existen juegos cargados");
        } else {
            let juego = juegos.filter(juego => juego.usuario.usuario == user.val() && juego.usuario.contrasena == contrasena.val());
            if(juego.length>0){
                let aux = juego[0];
                board.setString2(aux.sudoku_original.sudoku, aux.sudoku_actual);
                $("#dificultad").val(aux.sudoku_original.dificultad);
                $("#numeroSudoku").empty(); //--> se borra a todos los hijos de numeroSudoku
                $("#numeroSudoku").append("Numero de Sudoku: " + aux.sudoku_original.numero);
                updateUI();
            }
            else
                alert("No existe el usuario");
        }
    }
    
    cargarPorDificultad(dificultad) {
        let random = Math.random();
        let data = this.get('sudokus').filter(sudoku => sudoku.dificultad == dificultad);
        
        let game = data[Math.floor(random * data.length)];
        $("#numeroSudoku").empty(); //--> se borra a todos los hijos de numeroSudoku
        $("#numeroSudoku").append("Numero de Sudoku: " + game.numero);
        board.setString(game.sudoku);
        sudoku.setDificultad(game.dificultad);
        sudoku.setNumero(game.numero);
        $("#dificultad").val(sudoku.dificultad);
        sudoku.setSudoku(board.toString());
        juego.setSudoku_Original(sudoku);
        juego.setNumero(data.length);
        updateUI();
    }
}