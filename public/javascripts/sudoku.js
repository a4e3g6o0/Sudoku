/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

class Sudoku{
    constructor(sudoku,dificultad,numero){
        this.sudoku = sudoku;
        this.dificultad = dificultad;
        this.numero = numero;
    }
    
    setSudoku(sudoku){
        this.sudoku = sudoku;
    }
    
    setDificultad(dificultad){
        this.dificultad = dificultad;
    }
    
    setNumero(numero){
        this.numero = numero;
    }
}