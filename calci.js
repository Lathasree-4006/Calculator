const display = document.getElementById("display");

function toDisplay(input){
        display.value += input;
}

function clearDisplay(){
   display.value="";
}

function calculate(){
    display.value=eval(display.value);
}

function toSquare(){
    display.value = display.value * display.value;
}

function toCube(){
    display.value = display.value * display.value * display.value;
}

function toSqrt(){
    display.value = Math.sqrt(display.value);
}
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function fact() {
    let value = Number(display.value);
    if (value <= 0 || isNaN(value)) {
        alert("Natural log is defined only for positive numbers");
        return;
    }
    display.value = factorial(value);
}

function log10(){
    let value = Number(display.value);
    if (value <= 0 || isNaN(value)) {
        alert("Natural log is defined only for positive numbers");
        return;
    }
    display.value = Math.log10(value);
}

function ln(){
    let value = Number(display.value);
    if (value <= 0 || isNaN(value)) {
        alert("Natural log is defined only for positive numbers");
        return;
    }
    display.value = Math.log(value);
}

function log2(){
    let value = Number(display.value);
    if (value <= 0 || isNaN(value)) {
        alert("Natural log is defined only for positive numbers");
        return;
    }
    display.value = Math.log2(value);
}

function sin(){
    let m = Number(display.value);
    let n = m * (Math.PI/180);
    display.value = Math.sin(n);
}

function cos(){
    let m = Number(display.value);
    let n = m * (Math.PI/180);
    display.value = Math.cos(n);
}

function tan(){
    let m = Number(display.value);
    let n = m * (Math.PI/180);
    display.value = Math.tan(n);
}

function reciprocal(n){
    return 1/n;
}

function recipro(){
    let n = Number(display.value);
    if (n === 0) {
        alert("Division by zero not allowed");
        return;
    }
    display.value = reciprocal(n);
}