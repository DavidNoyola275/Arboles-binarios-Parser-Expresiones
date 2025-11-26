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

            if (/[0-9]/.test(caracter)) { // Si es número
                salida.push(caracter);

            } else if ("+-*/".includes(caracter)) { // Si es operador
 
                while (pila.length && precedencia[pila[pila.length - 1]] >= precedencia[caracter]) { //Mientras haya operadores en la pila con mayor o igual precedencia
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

    construirArbol(postfijo) { //Constuir el arbol a partir de la expresion en postfijo
        const pila = [];

        for (let simbolo of postfijo) { //Recorre cada simbolo en la expresión

            if (/[0-9]/.test(simbolo)) { //Si es un número
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

    preorden(nodo = this.raiz, resultado = []) { //Recorrido en preorden RID
        if (nodo) { //Si el nodo no es nulo
            resultado.push(nodo.valor); //Raíz
            this.preorden(nodo.izquierda, resultado); //Izquierda
            this.preorden(nodo.derecha, resultado); //Derecha
        }
        return resultado; //Devuelve el resultado
    }

    postorden(nodo = this.raiz, resultado = []) { //Recorrido en postorden IDR
        if (nodo) { //Si el nodo no es nulo
            this.postorden(nodo.izquierda, resultado); //Izquierda
            this.postorden(nodo.derecha, resultado); //Derecha
            resultado.push(nodo.valor); //Raíz
        }
        return resultado; //Devuelve el resultado
    }

    procesarExpresionInfija(expresion) { //Procesa la expresión infija y devuelve los recorridos en preorden y postorden
        const postfijo = this.convertirInfijoAPostfijo(expresion); //Convierte la expresión infija a postfija
        this.construirArbol(postfijo); //Construye el árbol a partir de la expresión en postfijo

        return {
            preorden: this.preorden().join(" "), //Devuelve los recorridos en preorden
            postorden: this.postorden().join(" ") //Devuelve los recorridos en postorden
        };
    }

    resolverPreorden(expresion) { //Resuelve la expresión en preorden
        const tokens = expresion.split(" ").reverse(); //Divide la expresión en tokens y los invierte

        const evaluar = () => {
          const token = tokens.pop();

            if (!isNaN(token)) return Number(token); //Si es un número, lo convierte a número y lo devuelve

            const izquierdo = evaluar(); //Si no es un número, evalua el izquierdo
            const derecho = evaluar(); //Evalua el derecho

            switch (token) { //Realiza la operación correspondiente
                case "+": return izquierdo + derecho; //Suma
                case "-": return izquierdo - derecho; //Resta
                case "*": return izquierdo * derecho; //Multiplicación
                case "/": return izquierdo / derecho; //División
            }
        };

        return evaluar();
    }

    resolverPostorden(expresion) { //Resuelve la expresión en postorden
        const pila = [];
        const tokens = expresion.split(" "); //Divide la expresión en tokens
        for (let token of tokens) { //Recorre cada token
            if (!isNaN(token)) { //Si es un número
                pila.push(Number(token)); //Añade el número a la pila

            } else { //Si es un operador
                const b = pila.pop(); //Saca el último número de la pila
                const a = pila.pop(); //Saca el penúltimo número de la pila
                switch (token) {
                    case "+": pila.push(a + b); break; //Suma
                    case "-": pila.push(a - b); break; //Resta
                    case "*": pila.push(a * b); break; //Multiplicación
                    case "/": pila.push(a / b); break; //División
                }
            }
        }
        return pila.pop(); //Devuelve el resultado final
    }
}

const arbol = new ExpresionArbol();
const postfijo = arbol.convertirInfijoAPostfijo("3+4*2/7-1");
arbol.construirArbol(postfijo);
console.log(arbol.preorden().join(" "));
console.log(arbol.postorden().join(" "));
console.log(arbol.resolverPreorden("- + 3 / * 4 3 7 2").toFixed(2));
console.log(arbol.resolverPostorden("3 4 3 * 7 / + 2 -").toFixed(2));