/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */


class Juego{
    constructor(numero,usuario,sudoku_original,sudoku_actual){
        this.numero = numero;
        this.usuario = usuario;
        this.sudoku_original = sudoku_original;
        this.sudoku_actual = sudoku_actual;
    }
    
    setNumero(numero){
        this.numero = numero;
    }
    
    setUsuario(usuario){
        this.usuario = usuario;
    }
    
    setSudoku_Original(sudoku){
        this.sudoku_original = sudoku;
    }
    
    setSudoku_Actual(sudoku){
        this.sudoku_actual = sudoku;
    }
}