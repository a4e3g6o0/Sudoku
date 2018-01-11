/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

class Tablero {
    constructor(){
        this._digitos = this.matriz(9, 9);
        this._esSolucion = false;
        this._esValido = false;
    }
    
    matriz(rows, cols){
        return new Array(rows).fill(0).reduce(aux=> 
            aux.concat([new Array(cols).fill(0).reduce(array=>
                array.concat(new Celda()),[])]),[]);
    }

    copiar() {
        let copiar = new Tablero();
        copiar.__esSolucion = this.__esSolucion;
        copiar._esValido = this._esValido;
        copiar._digitos = this.matriz(9,9);
        copiar._digitos.forEach((e,i)=>{
            e.forEach((_,j)=>{
                copiar._digitos[i][j] = this._digitos[i][j].copiar();
            });
        });
        return copiar;
    }
    
    copiarA(target) {
        target.__esSolucion = this.__esSolucion;
        target._esValido = this._esValido;
        this._digitos.forEach((fila,i)=>{
            fila.forEach((e,j)=>{
                target._digitos[i][j] = e.copiar();
            });
        });
    }
    

    getCelda(loc) {
        return this._digitos[loc.fila][loc.col];
    }

    setCelda(loc, value) {
        this._digitos[loc.fila][loc.col] = value;
    }

    limpiar() {
        this._digitos.forEach(e=>{
            e.forEach(e=>{
                e.limpiar();
            });
        });
        this.actualizaPermitidos();
    }

    resetear() {
        this._digitos.forEach(fila=>{
            fila.forEach(celda=>{
                if(!celda.esDado())
                    celda.limpiar();
            });
        });
        this.actualizaPermitidos();
    }
    
    checkearHermanosValidos(loc, digit, locs) {
        return locs.every(f=>this._digitos[f.fila][f.col].getRespuesta() != digit);
    } 

    checkarValidez(loc, digit) {
        return !this.checkearHermanosValidos(loc, digit, loc.colHermanos())? false : 
                !this.checkearHermanosValidos(loc, digit, loc.filaHermanos())? false :
                 !this.checkearHermanosValidos(loc, digit, loc.cuadroHermanos())? false : true;
     }

    acceptarPosibles(){
        let mas = false;
        let locs = Posicion.grid();
        locs.forEach(e=>{
            let cell = this._digitos[e.fila][e.col];
            if(!cell.esAsignado() && cell.tieneRespuesta() && this.checkarValidez(e, cell.getRespuesta())){
                cell.setValor(cell.getRespuesta());
                mas = true;
            }
        });
        return mas;
    }

    checkarOcultosSolitarios(loc, st) {
        let celda = this.getCelda(loc);
        if(!celda.esAsignado() && !celda.tieneRespuesta()) {
            let allowed = celda.getPermitidoCopia();
            let locs = loc.getHermanos(st);
            locs.forEach(e=>{
                let sibCell = this.getCelda(e);
                if(!sibCell.esAsignado()){
                    allowed.removerValores(sibCell.getPermitidoCopia());
                }
            });
            let respuesta = allowed.getSolo();
            if(respuesta != 0) {
                celda.setRespuesta(respuesta);
                return true;
            }
        }
        return false;
    }

    encuentraCeldaConPeorOportunidad() {
        let minPosicion = Posicion.empty;
        let minCount = 9;
        let locs = Posicion.grid();
        locs.forEach(e=>{
            let cell = this.getCelda(e);
            if(!cell.esAsignado()){
                let count = cell.getPermitidoCopia().contador();
                if(count < minCount){
                    minPosicion = e;
                    minCount = count;
                }
            }
        });
        return minPosicion;
    }

    actualizaPermitidos() {
        let cols = new Array(9);
        let rows = new Array(9);
        let squares = new Array(9);
        let locs = Posicion.grid();
        locs.forEach(e=>{
            let contains = this.getCelda(e).valorMascara();
            rows[e.fila] |= contains;
            cols[e.col] |= contains;
            squares[e.getCuadro()] |= contains;
            let contains2 = rows[e.fila] | cols[e.col] | squares[e.getCuadro()];
            let celda = this.getCelda(e);
            celda.setPermitido(~contains2); 
            celda.setRespuesta(0);
            if (!celda.esAsignado()) {
                this.__esSolucion = false;
                let mask = new ValoresPermitidos(~contains2);
                let count = mask.contador();
                if (count == 0)
                    this._esValido = false;
                else if (count == 1)
                    celda.setRespuesta(mask.getSolo());
            }
        });

        this._esValido = true;
        this.__esSolucion = true;
        locs.forEach(e=>{
            let contains2 = rows[e.fila] | cols[e.col] | squares[e.getCuadro()];
            let celda = this.getCelda(e);
            celda.setPermitido(~contains2); 
            celda.setRespuesta(0);
            if (!celda.esAsignado()) {
                this.__esSolucion = false;
                let mask = new ValoresPermitidos(~contains2);
                let count = mask.contador();
                if (count == 0)
                    this._esValido = false;
                else if (count == 1)
                    celda.setRespuesta(mask.getSolo());
            }
        });
        
        locs.forEach(e=>{
            if (!this.checkarOcultosSolitarios(e, SibType.Row))
                if (!this.checkarOcultosSolitarios(e, SibType.Col))
                    this.checkarOcultosSolitarios(e, SibType.Square);
        });
    }

    intentaResolver(loc, value) {
        if (!loc.esVacio()){
            let cell = this.getCelda(loc);
            if (!cell.esPermitido(value))
                throw "Internal error.";
            cell.setValor(value);
        }
        do {
            this.actualizaPermitidos();
            if (!this._esValido)
                return false;
        } while (this.acceptarPosibles());
        if (this.__esSolucion)
            return true;
        if (!this._esValido)
            return false;
        let locChoice = this.encuentraCeldaConPeorOportunidad();
        if (locChoice.esVacio())
            return false;
        let cell = this.getCelda(locChoice);
        let allowedValues = cell.permitido.valoresPermitidosArray();
        for (let i = 0; i < allowedValues.length;i++){
            let val = allowedValues[i];
            let board = this.copiar();
            if (board.intentaResolver(locChoice, val)){
                board.copiarA(this);
                return true;
            }
        }
        return false;
    }

    toString() {
        return this._digitos.reduce((text,array)=>{
            array.forEach(e=>{
                text += e.getValor() == 0 ? "." : String(e.getValor());
            });
            return text;
        },"");
    }

    setString(value) {
        if (value.length != (81))
            return false;
        let n = 0;
        this._digitos.forEach(e=>{
            e.forEach(e=>{
                let ch = parseInt(value.charAt(n++));
                e.setDado(!isNaN(ch) ? ch : 0);
            });
        });
        this.actualizaPermitidos();
        return true;
    }
    
    setString2(original,actual) {
        if (original.length != 81)
            return false;
        this.setString(original);
        let n = 0, n1 = 0;
        this._digitos.forEach(e=>{
            e.forEach(e=>{
                let ch = original.charAt(n++);
                let ch1 = actual.charAt(n1++);
                if(ch != ch1){
                    e.setValor(parseInt(ch1));
                    this.actualizaPermitidos();
                }
            });
        });
        return true;
    }
}