/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Usuario = require('./usuario');
var Sudoku = require('./sudoku');

var JuegoSchema = new Schema({
    usuario: {type: Schema.ObjectId, ref: 'Usuario'},
    sudoku_original: {type: Schema.ObjectId, ref: 'Sudoku'},
    sudoku_actual: {type: String, required: true}
});
module.exports = mongoose.model('Juego', JuegoSchema);