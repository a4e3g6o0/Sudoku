/* 
 Autores: 
    Alejandro Calderon
    Linsey Garro
    Angel Gomez
 */

function relMouseCoords(event) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    } while (currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x: canvasX, y: canvasY}
}

HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

// Javascript doesn't have 'contains' so added here for later readability

Array.prototype.contains =(element)=>{
    return this.some(e=>e==element);
}
let SquareSize = 3;
let BoardSize = 9;
var SibType = {"Row": 1, "Col": 2, "Square": 3}

