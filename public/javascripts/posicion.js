/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

class Posicion {
    constructor(fila, col) {
        this.fila = fila;
        this.col = col;
    }
    
    esVacio(){
        return this.fila < 0;
    }

    modulo(n) {
        return n < 0 ? n + 9 : n % 9;
    }

    izquierda() {
        return new Posicion(this.fila, this.modulo(this.col - 1));
    }

    derecha() {
        return new Posicion(this.fila, this.modulo(this.col + 1));
    }

    arriba() {
        return new Posicion(this.modulo(this.fila - 1), this.col);
    }

    abajo() {
        return new Posicion(this.modulo(this.fila + 1), this.col);
    }

    toString() {
        return "Row=" + String(this.fila) + "Col=" + String(this.col);
    }

    getCuadro(){
        return 3 * Math.floor(this.fila / 3) + Math.floor(this.col / 3);
    }

    equals(a) {
        return a.fila == this.fila && a.col == this.col;
    }

    notEquals(a) {
        return a.fila != this.fila || a.col != this.col;
    }

    filaHermanos() {
        return new Array(9).reduce((array,_,i)=>array.concat(new Posicion(this.fila, i)),[]);
    }

    colHermanos() {
        return new Array(9).reduce((array,_,i)=>array.concat(new Posicion(i,this.col)),[]);
    }

    
    cuadroHermanos() {
        let locs = [];
        let baseFila = 3 * Math.floor(this.fila / 3);
        let baseCol = 3 * Math.floor(this.col / 3);
        for (var i = 0; i < SquareSize; i++) {
            var r = baseFila + i;
            for (var j = 0; j < SquareSize; j++) {
                let c = baseCol + j;
                if (r != this.fila || c != this.col)
                    locs.push(new Posicion(r, c));
            }
        }
        return locs;
    }

    getHermanos(type) {
        switch (type) {
            case SibType.Row:
                return this.filaHermanos();
            case SibType.Col:
                return this.colHermanos();
            case SibType.Square:
                return this.cuadroHermanos();
        }
    }
}

Posicion.vacio = new Posicion(-1, -1);

Posicion.grid = () => {
    let locs = new Array();
    row(locs);
    return locs;
}

let col = (locs,i, j=0)=>{
    if(j < 9){
        locs.push(new Posicion(i, j));
        col(locs,i,j+1);
    }
}

let row = (locs,i=0) =>{
    if(i < 9){
        col(locs,i);
        row(locs,i+1);
    }
}