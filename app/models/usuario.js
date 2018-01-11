/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsuarioSchema   = new Schema({
	usuario: String,
        contrasena: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema);