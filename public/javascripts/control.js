/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

$(document).ready(() => {
    var ini = () => {
        if (modo == "0") {
            $.get('/api/sudokus', data => {
                let random = Math.random();
                let game = data[Math.floor(random * data.length)];
                $("#numeroSudoku").empty();
                $("#numeroSudoku").append("Numero de Sudoku: " + game.numero);
                board.setString(game.sudoku);
                sudoku.setDificultad(game.dificultad);
                sudoku.setNumero(game.numero);
                $("#dificultad").val(sudoku.dificultad);
                sudoku.setSudoku(board.toString());
                juego.setSudoku_Original(sudoku);
                juego.setNumero(data.length);
                updateUI();
            });
        } else {
            if (typeof (localStorage.sudokus) == "undefined") {
                storage.cargarSudokus();
            }
            let random = Math.random();
            let data = JSON.parse(localStorage.sudokus);
            let game = data[Math.floor(random * data.length)];
            $("#numeroSudoku").empty();
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
    };
    
    ini();
    
    $("#btnGuardar").click(() => {
        if (modo == "0") {
            let user = $("#campoUsuario");
            let contrasena = $("#campoContrasena");
            if (user.val().length > 0 && contrasena.val().length > 0) {
                usuario.setUsuario(user.val());
                usuario.setContrasena(contrasena.val());
                juego.setUsuario(usuario);
                juego.setSudoku_Actual(board.toString());
                $.ajax({
                    url: '/api/usuarios',
                    type: 'POST',
                    data: usuario,
                    dataType: 'json'
                }).done(data => {
                    console.log(data);
                    if (!data.existe) {
                        $.ajax({
                            url: '/api/juegos',
                            type: 'POST',
                            data: juego,
                            dataType: 'json'
                        }).done(() => {
                            alert("Juego guardado correctamente");
                        }).fail((e, msg, excpn) => {
                            alert('**** AJAX ERROR ' + msg + ' ****');
                        });
                    } else {
                        if(id.length == 0)
                            id=data.juego_id;
                        $.ajax({
                            url: '/api/juegos',
                            data: {id: id, sudoku_actual: board.toString(),sudoku_original:juego.sudoku_original},
                            type: 'PUT'
                        }).done(res => {
                            alert(res);
                        });
                    }
                });
            } else
                alert("DIGITE SUS DATOS POR FAVOR");
            user.val("");
            contrasena.val("");
        } else {
            let user = $("#campoUsuario");
            let contrasena = $("#campoContrasena");
            if (user.val().length > 0 && contrasena.val().length > 0) {
                storage.guardarJuego(user, contrasena);
            }
        }
    });

    
    $("#btnCargar").click(() => {
        if (modo == "0") {
            let user = $("#campoUsuario");
            let contrasena = $("#campoContrasena");
            let ruta = '/api/juegos/' + user.val() + "/" + contrasena.val();
            $.get(ruta, data => {
                console.log(data);
                id = data[0]._id;
                console.log(id);
                board.setString2(data[0].sudoku_original.sudoku, data[0].sudoku_actual);
                $("#dificultad").val(data[0].sudoku_original.dificultad);
                $("#numeroSudoku").empty(); //--> se borra a todos los hijos de numeroSudoku
                $("#numeroSudoku").append("Numero de Sudoku: " + data[0].sudoku_original.numero);
                updateUI();
            });
        }
        else {
            let user = $("#campoUsuario");
            let contrasena = $("#campoContrasena");
            if (user.val().length > 0 && contrasena.val().length > 0) {
                storage.cargarJuego(user, contrasena);
            }
        }
        reinicio();
    });
    
    $("#dificultad").change(() => {
        let dificultad = $("#dificultad").val();
        if (modo == "0") {
            let ruta = '/api/sudokus/' + dificultad;
            $.get(ruta, data => {
                let random = Math.random();
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
            });
        }
        else{
            storage.cargarPorDificultad(dificultad);
        }
        reinicio();
    });
    
    $("#modo").change(()=>{
        modo = $("#modo").val();
        ini();
        reinicio();
    });
});

let CellSize = 60;
let SubCellSize = 18;

let canvas1 = document.getElementById("canvas1");
let canvas2 = document.getElementById("canvas2");
let chbAllowed = document.getElementById("chbAllowed");
let chbShowSingles = document.getElementById("chbShowSingles");
let tbSerial = document.getElementById("tbSerial");
let extraInfo = document.getElementById("extraInfo");

let usuario = new Usuario();
let juego = new Juego();
let sudoku = new Sudoku();
let id = "";
let modo = "0";
let storage = new LocalStorage();

let board = new Tablero();
let selectRow = 0;
let selectCol = 0;
let showAllowed = false;
let showSingles = false;
let undoStack = Array();

let normalColor = "#aaaaaa";
let singleColor = "#ff143c";

function undo() {
    let tos = undoStack.pop();
    if (tos) {
        board = tos;
        updateUI();
    }
}

function clearUndo() {
    undoStack = Array();
}

function pushBoard() {
    undoStack.push(board.copiar());
}

function checkStatus() {
    extraInfo.innerHTML = "";
    board._esValido ? board.__esSolucion ? (message.innerHTML = "*Solved*",parar()) : message.innerHTML = "":
        message.innerHTML = "*Invalid*"
}

function drawGrid() {
    // Only ever called once!
    let context = canvas1.getContext('2d');
    context.strokeStyle = '#808080';   //------> Color de las lineas del sudoku
    conte1(context);
}
function conte1(context, i=0){
    if(i <=9){
        context.beginPath();
        let thick = i % 3 == 0;
        // Draw vertical lines
        context.lineWidth = thick ? 2 : 1;
        context.moveTo(i * CellSize + 0.5, 0.5);
        context.lineTo(i * CellSize + 0.5, 9 * CellSize + 0.5);

        // Draw horizontal lines
        context.moveTo(0.5, i * CellSize + 0.5);
        context.lineTo(9 * CellSize + 0.5, i * CellSize + 0.5);
        context.stroke();
        conte1(context, i + 1);
    }
}
function colrec(context, row, col = 0){
    if(col < 9){
        if (row == selectRow && col == selectCol) {
                let margin = 2;
                context.beginPath();
                context.rect(col * CellSize + margin + 0.5, row * CellSize + margin + 0.5, CellSize - 2 * margin, CellSize - 2 * margin);
                context.fillStyle = "#00CC66";
                context.fill();
            }
            colrec(context,row,col+1);
    }
}
function rowrec(context,row = 0){
    if(row < 9){
        colrec(context,row);
        rowrec(context,row+1);
    }
}

function cellcol(context, row, col = 0) {
    if (col < 9) {
        let cell = board.getCelda(new Posicion(row, col));
        if (!cell.esAsignado()) {
            let allowedValues = cell.permitido.valoresPermitidosArray();
            allowedValues.forEach(e => {
                let x = (col + 0.5) * CellSize; // center of cell for textAlign center, textBaseline middle
                let y = (row + 0.5) * CellSize;
                let subRow = Math.floor((e - 1) / 3) - 1;
                let subCol = Math.floor((e - 1) % 3) - 1;
                x += subCol * SubCellSize;
                y += subRow * SubCellSize;
                let hiddenSingle = allowedValues.length != 1 && e == cell.getRespuesta(); // naked single would have only one allowed value
                context.fillStyle = normalColor; // show hidden single in purple
                if (showSingles && e == cell.getRespuesta())
                    context.fillStyle = singleColor; // show hidden single in purple
                context.fillText(e, x, y);
            });
        }
        cellcol(context, row, col + 1);
    }
}
function cellrow(context,row = 0){
    if(row < 9){
        cellcol(context,row);
        cellrow(context,row+1);
    }
}
function alicol(context, sele, color, row, col = 0) {
    if (col < 9) {
        let cell = board.getCelda(new Posicion(row, col));
        let x = (col + 0.5) * CellSize; // center of cell for textAlign center, textBaseline middle
        let y = (row + 0.5) * CellSize;
        let sameDigit = cell.getValor() == sele && sele != 0;
        // Draw value
        let value = cell.getValor();
        if (value != 0) {
            context.fillStyle = cell.esDado() ? "#2200aa" : "#696969"; // show "givens" in a darker color
            if (sameDigit)// then override
                context.fillStyle = color; // text color - dark
            context.fillText(value, x, y);
        }
        alicol(context, sele, color, row, col + 1);
    }
}
function alirow(context,sele,color,row = 0){
    if(row < 9){
        alicol(context,sele,color, row);
        alirow(context,sele,color,row+1);
    }
}
function drawCells() {
    let context = canvas1.getContext('2d');

    context.font = "12pt Calibri"; // small text
    context.textAlign = "center";
    context.textBaseline = "middle";
    

    // Draw background for selected cell
    rowrec(context);
    context.fillStyle = "#999999"; // text color - light

    // Draw allowed values
    if (showAllowed)
        cellrow(context);
            

    // New if a digit is selected then make all cells with the same digit foreground red
    let selectCell = board.getCelda(new Posicion(selectRow, selectCol));
    let selectValue = selectCell.getValor();

    // Draw values last
    context.font = "32pt Calibri";
    context.textAlign = "center";
    context.textBaseline = "middle";
    let normalForeColor = "#191929";
    let sameDigitForeColor = "#F91919";
    context.fillStyle = normalForeColor; // text color - dark
    alirow(context,selectValue,sameDigitForeColor);
}

function drawCanvas() {
    canvas1.width = canvas1.width;
    drawGrid();
    drawCells();
}

function updateUI() {
    drawCanvas();
    checkStatus();
}

function readOptions() {
    showAllowed = chbAllowed.checked;
    showSingles = chbShowSingles.checked;
    drawCanvas();
}

chbAllowed.onclick = readOptions;
chbShowSingles.onclick = readOptions;

function selectCell(row, col) {
    selectRow = row;
    selectCol = col;
    drawCanvas();
}

function moveSelection(row, col) {
    selectRow += row;
    selectCol += col;
    selectRow < 0 ?
        selectRow = 8 :
        selectRow > 8 ?
            selectRow = 0 :
            selectCol < 0 ?
                selectCol = 8 :
                selectCol > 8 ?
                    selectCol = 0 : selectRow;
    drawCanvas();
}

function setDigitInCell(digit) {
    let cell = board.getCelda(new Posicion(selectRow, selectCol));
    message.innerHTML = "";
    return cell.esDado()? cell : (digit != 0 && !cell.esPermitido(digit))? message.innerHTML = "Digit not allowed" : (pushBoard(),cell.setValor(digit),board.actualizaPermitidos(),updateUI())
      
}

canvas1.onmousedown = function canvasMouseDown(ev) {
    let x = ev.pageX - this.offsetLeft;
    let y = ev.pageY - this.offsetTop;
    let coords = this.relMouseCoords(ev);
    selectCell(Math.floor(coords.y / CellSize), Math.floor(coords.x / CellSize));
}

document.onkeydown = function (ev) {
    switch (ev.keyCode) {
        case 37: // left arrow
            moveSelection(0, -1);
            break;
        case 38: // up arrow
            moveSelection(-1, 0);
            break;
        case 39: // right arrow
            moveSelection(0, 1);
            break;
        case 40: // down arrow
            moveSelection(1, 0);
            break;
        default:
            let key = Number(ev.keyCode);
            let digit = key >= 96 ? key - 96 : key - 48;// handle keypad digits as well
            digit >= 0 && digit <= 9 ?
                setDigitInCell(digit) : key;
            break;
    }
};

function clearGame() {
    clearUndo();
    board.limpiar();
    updateUI();
}

function acceptPossibles() {
    pushBoard();
    board.acceptarPosibles();
    board.actualizaPermitidos();
    updateUI();
}

function hint() {
    solution = board.copiar();
    if (solution.intentaResolver(Posicion.vacio, 0)) {
        let cell = solution.getCelda(new Posicion(selectRow, selectCol)); 
        cell.esDado()? cell : setDigitInCell(cell.getValor());
    } 
}

function reset() {
    clearUndo();
    board.resetear();
    updateUI();
}

function solve() {
    pushBoard();
    board.intentaResolver(Posicion.vacio, 0);
    if(!board.__esSolucion){
        board.setString(juego.sudoku_original.sudoku);
        board.intentaResolver(Posicion.vacio,0);
    }
    updateUI();
    try{
        parar();
    } catch(err){
        throw "No se inicio el cronometro";
    }
}

let digCellSize = 54;

function begin(context, i = 0){
    if(i <= 10){
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(i * digCellSize + 0.5, 0.5);
        context.lineTo(i * digCellSize + 0.5, digCellSize + 0.5);
        context.stroke();
        begin(context, i + 1);
    }
}

function mid(context, i = 0){
    if(i <=1){
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(0.5, i * digCellSize + 0.5);
        context.lineTo(10 * digCellSize + 0.5, i * digCellSize + 0.5);
        context.stroke();
        mid(context,i + 1);
    }
}
function cencol(context,color, col=0){
    if(col < 10){
        let x = (col + 0.5) * digCellSize; // center of cell for textAlign center, textBaseline middle
        let y = 0.5 * digCellSize;
        let value = col < 9 ? col + 1 : "Del";
        context.fillStyle = color; // show "givens" in a darker color
        context.fillText(value, x, y);
        cencol(context,color,col + 1);
    }
}
function initDigitSource() {
    // Only ever called once!
    let context = canvas2.getContext('2d');
    context.strokeStyle = '#808080';
    begin(context);
    mid(context);
    context.font = "24pt Calibri";
    context.textAlign = "center";
    context.textBaseline = "middle";
    let normalForeColor = "#708090";
    context.fillStyle = normalForeColor;
    cencol(context,normalForeColor);
}
initDigitSource();

canvas2.onmousedown = function canvasMouseDown(ev) {
    let x = ev.pageX - this.offsetLeft;
    let y = ev.pageY - this.offsetTop;
    let coords = this.relMouseCoords(ev);
    let dig = Math.floor(coords.x / digCellSize) + 1;
    dig === 10 ? dig = 0 : x; 
    setDigitInCell(dig);
}