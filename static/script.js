let expression = "";

function addToExpression(value) {
    expression += value;
    document.getElementById('display').value = expression;
}

function clearDisplay() {
    expression = "";
    document.getElementById('display').value = "";
    d3.select("#tree").selectAll("*").remove(); // Limpia el área del árbol
}

function calculate() {
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression: expression })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
            document.getElementById('display').value = data.result;
        } else {
            document.getElementById('display').value = data.error;
        }
    });
}

function showTree() {
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression: expression })
    })
    .then(response => response.json())
    .then(data => {
        if (data.tree) {
            drawTree(data.tree); // Llama a la función para dibujar el árbol
        } else {
            document.getElementById('tree').innerHTML = data.error;
        }
    });
}

function drawTree(treeData) {
    const svg = d3.select("#tree");
    svg.selectAll("*").remove(); // Limpia el SVG antes de dibujar

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // Configuración del layout del árbol
    const treeLayout = d3.tree().size([width - 40, height - 100]); // Ajustar altura (-100 reduce el espacio total)

    // Convertir el árbol en formato D3
    const root = d3.hierarchy(convertTree(treeData));

    // Generar las posiciones de los nodos
    treeLayout(root);

    // Ajuste manual para la posición vertical (desplazamiento)
    const verticalOffset = 50; // Incrementa este valor para mover el nodo raíz más abajo

    // Dibujar las líneas entre nodos
    svg.selectAll("line")
        .data(root.links())
        .enter()
        .append("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y + verticalOffset)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y + verticalOffset)
        .attr("stroke", "white");

    // Dibujar los nodos
    svg.selectAll("circle")
        .data(root.descendants())
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y + verticalOffset)
        .attr("r", 20)
        .attr("fill", "#666");

    // Etiquetas para los nodos
    svg.selectAll("text")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y + verticalOffset)
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .attr("fill", "white");
}

function convertTree(tree) {
    if (typeof tree === "number" || typeof tree === "string") {
        return { name: tree };
    }

    const [operator, left, right] = tree;
    return {
        name: operator,
        children: [convertTree(left), convertTree(right)]
    };
}