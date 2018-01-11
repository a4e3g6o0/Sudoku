/*
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let morgan = require('morgan');
let favicon = require('express-favicon');
let mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8081;

mongoose.connect('mongodb://localhost/sudokus',{useMongoClient: true});

let Juego = require('./app/models/juego');
let Usuario = require('./app/models/usuario');
let Sudoku = require('./app/models/sudoku');

let router = express.Router();

router.use((req, res, next) => {
    //console.log('General middleware activated');
    next();
});

router.get('/', (req, res) => {
    res.json({message: '++ API TRABAJANDO ++'});
});

router.route('/juegos')
        .post((req, res) => {
            console.log('---------- /juegos post request ----------');
            let juego = new Juego();
            let usuario = new Usuario();
            let sudoku = new Sudoku();
            let id = "";
            sudoku.sudoku = req.body.sudoku_original.sudoku;
            sudoku.dificultad = req.body.sudoku_original.dificultad;
            sudoku.numero = req.body.sudoku_original.numero;
            
            Sudoku.find({numero: sudoku.numero}, (err, sudokus) => {
                id = sudokus[0]._id;
                sudoku._id = id;
                usuario.usuario = req.body.usuario.usuario;
                usuario.contrasena = req.body.usuario.contrasena;
                usuario._id = new mongoose.Types.ObjectId();
                juego.sudoku_original = sudoku;
                juego.sudoku_actual = req.body.sudoku_actual;
                juego.usuario = usuario;

                usuario.save(err => {
                    if (err)
                        res.send(err);
                });

                juego.save(err => {
                    if (err)
                        res.send(err);
                    res.json({message:"Juego Guardado Correctamente"});
                });
            });
        })

        .get((req, res) => {
            console.log('---------- /juegos get request ----------');
            Juego.find({}, (err, juegos) => {
                if (err)
                    res.send(err);
                Usuario.populate(juegos, {path: "usuario"}, (err, juegos) => {
                    Sudoku.populate(juegos, {path: "sudoku_original"}, (err, juegos) => {
                        res.status(200).send(juegos);
                    });
                });
            });
        })
        
        .put((req,res)=>{
            console.log('---------- /juegos put request ----------');
            Juego.findById(req.body.id,(err,juego)=>{
                if(err)
                    res.send(err);
                console.log("Juego original "+ juego);
                juego.sudoku_actual = req.body.sudoku_actual;
                Sudoku.find({numero:req.body.sudoku_original.numero}, (err,sudoku)=>{
                    console.log("nuevo id = "+sudoku[0]._id);
                    juego.sudoku_original = sudoku[0]._id;
                    juego.save(err=>{
                        if(err)
                            res.send(err);
                        console.log("Juego a guardar "+ juego);
                        res.send({mensaje:"Sudoku actualizado correctamente"});
                    });
                });
                
                
            });
        });

router.route('/juegos/:usuario/:contrasena')
        .get((req, res) => {
            console.log('---------- /juegos get request with usuario:'+req.params.usuario+' contrasena:'+req.params.contrasena+'----------');
            Usuario.find({usuario: req.params.usuario, contrasena: req.params.contrasena}, (err, usuario) => {
                if (err)
                    res.send(err);
                if (usuario != 0) {
                    Juego.find({usuario: usuario[0]._id},
                            (err, juego) => {
                        if (err)
                            res.send(err);
                        Usuario.populate(juego, {path: "usuario"}, (err, juegos) => {
                            Sudoku.populate(juegos, {path: "sudoku_original"}, (err, juegos) => {
                                res.status(200).send(juegos);
                            });
                        });
                    });
                } else {
                    res.send([]);
                }
            });
        });

router.route('/sudokus')
        .get((req, res) => {
            console.log('---------- /sudokus get request ----------');
            Sudoku.find({}, (err, juegos) => {
                if (err)
                    res.send(err);
                res.send(juegos);
            });
        });

router.route('/sudokus/:dificultad')
        .get((req, res) => {
            console.log('---------- /juegos get request with dificultad:'+req.params.dificultad+' ----------');
            let dificultad=req.params.dificultad;
            Sudoku.find({dificultad:dificultad}, (err, juegos) => {
                if (err)
                    res.send(err);
                res.send(juegos);
            });
        });
                
router.route('/usuarios')
        .post((req,res)=>{
            console.log('---------- /usuarios post request ----------');
            usuario = new Usuario();
            usuario.usuario = req.body.usuario;
            usuario.contrasena = req.body.contrasena;
            Usuario.find({usuario:req.body.usuario,contrasena:req.body.contrasena},(err,usuarios)=>{
                if(err)
                    res.send(err);
                if(usuarios.length>0)
                    Juego.find({usuario:usuarios[0]._id},(err,juegos)=>{
                        if(err)
                            res.send(err);
                        res.send({usuario_id:usuarios[0]._id, existe:true,juego_id:juegos[0]._id});
                    });
                else
                    res.send({existe:false});
            });
        });

app.use('/static', express.static((__dirname + '/public')));

app.use(favicon(__dirname + '/public/images/sudoku.png'));

app.use('/api', router);

app.listen(port);
console.log('*** Server is up and running on port ' + port + ' ***');