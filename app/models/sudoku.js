/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SudokuSchema   = new Schema({
        sudoku: String,
        dificultad: String,
        numero: Number
});

module.exports = mongoose.model('Sudoku', SudokuSchema);