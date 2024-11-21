import re

import re

def analyze_chain(cadena):
    patron = r"(\d+\.\d+|\d+|[\+\-\*/])"
    tokens = re.findall(patron, cadena)

    tabla_tokens = []
    resumen = {"Operadores": 0, "Enteros": 0, "Decimales": 0}

    for token in tokens:
        if re.fullmatch(r"\d+\.\d+", token):
            tipo = "Número decimal"
            resumen["Decimales"] += 1
        elif re.fullmatch(r"\d+", token):
            tipo = "Número entero"
            resumen["Enteros"] += 1
        elif token in "+-*/":
            if token == "+":
                tipo = "Operador (Suma)"
            elif token == "-":
                tipo = "Operador (Resta)"
            elif token == "*":
                tipo = "Operador (Multiplicación)"
            elif token == "/":
                tipo = "Operador (División)"
            resumen["Operadores"] += 1
        else:
            tipo = "Desconocido"

        tabla_tokens.append({"Token": token, "Tipo": tipo})

    return tabla_tokens, resumen