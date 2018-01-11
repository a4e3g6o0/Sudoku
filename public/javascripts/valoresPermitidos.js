/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

class ValoresPermitidos{ 
    constructor(n){
        this.mascara = n;
    }
    
    getSolo(solo=0,contador=0,i=1){
        if(i>9)
            return contador == 1 ? solo : 0;
        else
            return (this.mascara & (1 << i)) != 0 ? this.getSolo(i,contador+1,i+1)
                : this.getSolo(solo,contador,i+1);
    }
    
    setSolo(n){
        this.mascara = 1 << n;
    }
        
    contador(contador = 0, i = 1){
        if(i>9)
            return contador;
        else
            return (this.mascara & (1 << i)) != 0 ? this.contador(contador+1,i+1)
                : this.contador(contador,i+1);
    }
     
    esPermitido(n){
        return n >= 1 && n <= 9 && ((this.mascara & (1 << n)) != 0);
    }
   
    removerValores(bm){
        this.mascara &= ~bm.mascara;
    }
    
    valoresPermitidosArray(){
        return new Array(9).fill(0).reduce((array,_,i) => (((1 << i+1) & this.mascara) != 0) ? 
                                                                                array.concat((i+1)):
                                                                                array,[]);
    }
     
    copiar(){
        return new ValoresPermitidos(this.mascara);
    }
}