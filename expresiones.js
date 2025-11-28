class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.izquierda = null;
    this.derecha = null;
  }
}

class ExpresionArbol {
  constructor() {
    this.raiz = null;
  }

  convertirInfijoAPostfijo(expresion) {
    const precedencia = { "+": 1, "-": 1, "*": 2, "/": 2 }; //Definir jerarquia de operadores
    const salida = []; //Almacenar la expresion en postfijo
    const pila = []; //Almacenar operadores

    for (const caracter of expresion) {
      if (/[0-9]/.test(caracter)) {
        // Si es número
        salida.push(caracter);
      } else if ("+-*/".includes(caracter)) {
        // Si es operador

        while (
          pila.length &&
          precedencia[pila[pila.length - 1]] >= precedencia[caracter]
        ) {
          //Mientras haya operadores en la pila con mayor o igual precedencia
          salida.push(pila.pop()); //saca el operadores de la pila y lo añade a la salida
        }

        pila.push(caracter); //Añade el operador a la pila
      }
    }

    // Vaciar pila
    while (pila.length) {
      salida.push(pila.pop());
    }

    return salida;
  }

  construirArbol(postfijo) {
    //Constuir el arbol a partir de la expresion en postfijo
    const pila = [];

    for (let simbolo of postfijo) {
      //Recorre cada simbolo en la expresión

      if (/[0-9]/.test(simbolo)) {
        //Si es un número
        pila.push(new Nodo(simbolo));
      } else {
        const operador = new Nodo(simbolo); //Si es un operador

        operador.derecha = pila.pop(); //Añade el operador a la pila
        operador.izquierda = pila.pop(); //Añade el operador a la pila

        pila.push(operador);
      }
    }

    this.raiz = pila.pop(); //La raíz del árbol es el último elemento en la pila
  }

  preorden(nodo = this.raiz, resultado = []) {
    //Recorrido en preorden RID
    if (nodo) {
      //Si el nodo no es nulo
      resultado.push(nodo.valor); //Raíz
      this.preorden(nodo.izquierda, resultado); //Izquierda
      this.preorden(nodo.derecha, resultado); //Derecha
    }
    return resultado; //Devuelve el resultado
  }

  postorden(nodo = this.raiz, resultado = []) {
    //Recorrido en postorden IDR
    if (nodo) {
      //Si el nodo no es nulo
      this.postorden(nodo.izquierda, resultado); //Izquierda
      this.postorden(nodo.derecha, resultado); //Derecha
      resultado.push(nodo.valor); //Raíz
    }
    return resultado; //Devuelve el resultado
  }

  procesarExpresionInfija(expresion) {
    //Procesa la expresión infija y devuelve los recorridos en preorden y postorden
    const postfijo = this.convertirInfijoAPostfijo(expresion); //Convierte la expresión infija a postfija
    this.construirArbol(postfijo); //Construye el árbol a partir de la expresión en postfijo

    return {
      preorden: this.preorden().join(" "), //Devuelve los recorridos en preorden
      postorden: this.postorden().join(" "), //Devuelve los recorridos en postorden
    };
  }

  resolverPreorden(expresion) { // RID
    //Resuelve la expresión en preorden
    const tokens = expresion.split(" "); //Divide la expresión en tokens
    tokens.reverse(); //Invierte los tokens para poder recorrerlos fácilmente
    const pila = []; //Pila para almacenar valores

    for (let token of tokens) {
      //Recorre cada token de derecha a izquierda
      if (!isNaN(token)) {
        //Si es un número
        pila.push(Number(token)); //Lo agrega a la pila
      } else {
        //Si es un operador
        const a = pila.pop(); //Primer número
        const b = pila.pop(); //Segundo número
        const resultado = this._operacionPreOrder(token, a, b); //Realiza la operación
        pila.push(resultado); //Agrega el resultado a la pila
      }
    }
    return pila.pop(); //Devuelve el resultado final
  }

  //Realiza una operación individual para preorden
  _operacionPreOrder(operador, a, b) {
    switch (operador) {
      case "+": return a + b; //Suma
      case "-": return a - b; //Resta
      case "*": return a * b; //Multiplicación
      case "/": return a / b; //División
    }
  }

  resolverPostorden(expresion) { // IDR
    //Resuelve la expresión en postorden
    const tokens = expresion.split(" "); //Divide la expresión en tokens
    const pila = []; //Pila para almacenar valores

    for (let token of tokens) {
      //Recorre cada token de izquierda a derecha
      if (!isNaN(token)) {
        //Si es un número
        pila.push(Number(token)); //Lo agrega a la pila
      } else {
        //Si es un operador
        const b = pila.pop(); //Saca el último número de la pila
        const a = pila.pop(); //Saca el penúltimo número de la pila
        const resultado = this._operacionPostOrden(token, a, b); //Realiza la operación
        pila.push(resultado); //Agrega el resultado a la pila
      }
    }
    return pila.pop(); //Devuelve el resultado final
  }

  //Realiza una operación individual para postorden
  _operacionPostOrden(operador, a, b) {
    switch (operador) {
      case "+": return a + b; //Suma
      case "-": return a - b; //Resta
      case "*": return a * b; //Multiplicación
      case "/": return a / b; //División
    }
  }
}

const arbol = new ExpresionArbol();
const postfijo = arbol.convertirInfijoAPostfijo("3+4*2/7-1");
arbol.construirArbol(postfijo);

console.log(arbol.preorden().join(" "));
console.log(arbol.postorden().join(" "));

console.log("Resultado preorden: " + arbol.resolverPreorden("- + 3 / * 4 3 7 2").toFixed(2));
console.log("Resultado postorden: " + arbol.resolverPostorden("3 4 3 * 7 / + 2 -").toFixed(2));