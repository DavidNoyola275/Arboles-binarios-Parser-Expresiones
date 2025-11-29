class Nodo {
  constructor(valor) {
    this.valor = valor
    this.izquierda = null // Hijo izquierdo
    this.derecha = null // Hijo derecho
  }
}

class ExpresionArbol {
  constructor() {
    this.raiz = null // Raíz del árbol
  }

  //-------------------------------------------------------
  //Funciones auxiliares para evitar uso de librerías que ya hagan la magia

  contarCaracteres(cadena) { //Contar cuentos caracteres tiene una cadena
    let contador = 0
    while (cadena[contador] !== undefined) {
      contador = contador + 1
    }
    return contador
  }

  esNumero(caracter) { //Solo verfica si un carácter es un numero del 0 al 9
    return caracter >= '0' && caracter <= '9'
  }

  esOperador(caracter) { // Verifica si un carácter es un operador
    return caracter === '+' || caracter === '-' || caracter === '*' || caracter === '/'
  }

  obtenerPrecedencia(op) { //Asigna la jerarquia de los operadores
    if (op === '+' || op === '-') return 1
    if (op === '*' || op === '/') return 2
    return 0
  }

  pilaVacia(pila) { // Verificar si la pila esta vacía 
    return pila[0] === undefined
  }

  toArray(str) {   // Convierte una cadena a un arreglo carácter por carácter
    let array = []
    let i = 0
    while (str[i] !== undefined) {
      array.push(str[i])
      i = i + 1
    }
    return array
  }

  splitEspacios(cadena) { // Divide una cadena en tokens separados por espacios
    let tokens = []
    let actual = ""
    let i = 0

    while (cadena[i] !== undefined) {
      if (cadena[i] === " ") { // Si se encuentra un espacio, se guarda el token actual
        if (actual !== "") {
          tokens.push(actual)
          actual = ""
        }
      } else { //Continuamos construyendo el token
        actual = actual + cadena[i]
      }
      i = i + 1
    }

    if (actual !== "") {
      tokens.push(actual)
    }

    return tokens
  }
 //-------------------------------------------------------
  convertirInfijoAPostfijo(expresion) { //Conversion de expresion infija a postfija
    const salida = [] //Arreglo para guardar la expresión postfija
    const pila = [] //Arreglo para guardar los operadores temporalmente
    const caracteres = this.toArray(expresion) //convertimos la cadena a un arreglo con nuestra función auxiliar

    let i = 0
    while (caracteres[i] !== undefined) {
      const caracter = caracteres[i]

      if (this.esNumero(caracter)) { //Si es un numero, va directo a salida
        salida.push(caracter)
      } else if (this.esOperador(caracter)) { //Si es un operador, se revisa la jerarquía

        while (!this.pilaVacia(pila)) {
          let ultimo = pila[pila.length - 1]

          if (this.obtenerPrecedencia(ultimo) >= this.obtenerPrecedencia(caracter)) {
            salida.push(pila.pop()) //Sale a salida
          } else {
            break //Ya podemos meter el operador actual
          }
        }

        pila.push(caracter) //Metemos el operador actual
      }
      i = i + 1
    }

    while (!this.pilaVacia(pila)) { //Vaciamos la pila al final
      salida.push(pila.pop())
    }

    return salida
  }

  construirArbol(postfijo) { //Contruimos el arbol a partir de la expresión en postfijo
    const pila = [] //Usamos una pila temporal
    let i = 0

    while (postfijo[i] !== undefined) {
      let simbolo = postfijo[i]

      if (this.esNumero(simbolo)) { //Si es numero, creamos nodo 
        pila.push(new Nodo(simbolo))
      } else { //Si es operador, sacamos dos nodos y los asignamos como hijos
        let operador = new Nodo(simbolo)

        operador.derecha = pila.pop() //Primer nodo es hijo derecho
        operador.izquierda = pila.pop() //Segundo nodo es hijo izquierdo

        pila.push(operador) //Nuevo subarbol
      }
      i = i + 1
    }

    this.raiz = pila.pop() //ultima posicion raíz del arbol
  }

  preorden(nodo = this.raiz, resultado = []) { //Recorrido preorden RID
    if (nodo !== null) {
      resultado.push(nodo.valor) //Raíz
      this.preorden(nodo.izquierda, resultado) //Izquierda
      this.preorden(nodo.derecha, resultado) //Derecha
    }
    return resultado
  }

  postorden(nodo = this.raiz, resultado = []) { //Recorrido postorden IDR
    if (nodo !== null) {
      this.postorden(nodo.izquierda, resultado) //Izquierda
      this.postorden(nodo.derecha, resultado) //Derecha
      resultado.push(nodo.valor) //Raíz
    }
    return resultado
  }

  procesarExpresionInfija(expresion) { //Procesa todo y devuelve preorden y postorden
    const postfijo = this.convertirInfijoAPostfijo(expresion)
    this.construirArbol(postfijo)

    return {
      preorden: this.preorden().join(" "),
      postorden: this.postorden().join(" "),
    }
  }

  resolverPreorden(expresion) {  //Resuelve expresión en Preorden
    const tokens = this.splitEspacios(expresion)
    const pila = []

    // invertir tokens manualmente
    let invertidos = []
    let i = 0
    while (tokens[i] !== undefined) { 
      i++ 
    }
    i = i - 1
    while (i >= 0) {
      invertidos.push(tokens[i])
      i--
    }
    // Tomamos cada token ya invertido
    let j = 0
    while (invertidos[j] !== undefined) {
      let token = invertidos[j]

      if (this.esNumero(token)) {
        pila.push(Number(token)) //Si es numero, va a la pila
      } else { //Si es operador, sacamos dos numeros y aplicamos la operacion
        let a = pila.pop()
        let b = pila.pop()
        pila.push(this._operacionPreOrder(token, a, b)) //Operación
      }

      j = j + 1
    }
    return pila.pop() //Retornamos resultado final
  }

  _operacionPreOrder(operador, a, b) { //Funcion interna
    if (operador === "+") return a + b
    if (operador === "-") return a - b
    if (operador === "*") return a * b
    if (operador === "/") return a / b
  }

  resolverPostorden(expresion) {  //Resuelve expresión en Postorden
    const tokens = this.splitEspacios(expresion)
    const pila = []

    let i = 0
    while (tokens[i] !== undefined) {
      let token = tokens[i]

      if (this.esNumero(token)) {
        pila.push(Number(token)) //Si es numero, va a la pila
      } else {
        let b = pila.pop() //Primer numero
        let a = pila.pop() //Segundo numero
        pila.push(this._operacionPostOrden(token, a, b)) //Aplicar operación
      }
      i = i + 1
    }
    return pila.pop() //Resultado final
  }

  _operacionPostOrden(operador, a, b) { //Funcion interna
    if (operador === "+") return a + b
    if (operador === "-") return a - b
    if (operador === "*") return a * b
    if (operador === "/") return a / b
  }
}

const arbol = new ExpresionArbol()
const postfijo = arbol.convertirInfijoAPostfijo("3+4*2/7-1")
arbol.construirArbol(postfijo)

console.log(arbol.preorden().join(" "))
console.log(arbol.postorden().join(" "))

console.log("Resultado preorden: " + arbol.resolverPreorden("- + 3 / * 4 2 7 1").toFixed(6)) //Limitación decimales a 6
console.log("Resultado postorden: " + arbol.resolverPostorden("3 4 2 * 7 / + 1 -").toFixed(6)) //Limitación decimales a 6