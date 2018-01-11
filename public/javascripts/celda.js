/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

class Celda{
    constructor(valor) {
        this.valor = valor; // 0 means unassigned
        this.permitido = new ValoresPermitidos(0x3e); // all possible
        this.respuesta = 0; // no answer
        this.dado = false;
    }

    copiar() {
        let clone = new Celda();
        clone.valor = this.valor;
        clone.permitido = this.permitido.copiar();
        clone.respuesta = this.respuesta;
        clone.dado = this.dado;
        return clone;
    }

    solo(valor) {
        this.valor = valor; // valor user (or auto solve functions) has assigned as a possible answer
        this.permitido = new ValoresPermitidos(0x3e); // the allowed valors as a bit mask
        this.respuesta = 0; // calculated as the only possible correct valor
    }

    valorMascara() {
        return this.valor == 0 ? 0 : 1 << this.valor;
    }

    tieneRespuesta() {
        return this.respuesta != 0;
    }

    getRespuesta() {
        return this.respuesta;
    }

    setRespuesta(n) {
        if (n < 0 || n > 9)
            throw "Illegal valor not in the range 1..9.";
        this.respuesta = n;
    }

    getValor() {
        return this.valor;
    }

    setValor(n) {
        if (n < 0 || n > 9)
            throw "Illegal valor not in the range 1..9.";
        if (n != 0 && !this.permitido.esPermitido(n))
            throw "Not allowed.";
        this.valor = n;
        this.dado = false;
    }

    setDado(n){
        if (n < 0 || n > 9)
            throw "Illegal valor not in the range 1..9.";
        this.valor = n;
        this.dado = n != 0;
        this.respuesta = 0;
    }

    esDado() {
        return this.dado;
    }

    esAsignado() {
        return this.valor != 0;
    }

    limpiar() {
        this.valor = 0; // means unassigned
        this.permitido = new ValoresPermitidos(0x3E); // all possible
        this.respuesta = 0;
        this.dado = 0;
    }
    
    esPermitido(valor) {
        return this.permitido.esPermitido(valor);
    }

    setPermitido(valor) {
        this.permitido = new ValoresPermitidos(valor);
    }

    getPermitidoCopia(valor) {
        return this.permitido.copiar();
    }
}