let rows = 3;
let cols = 3;

const table = document.getElementById("matrix");

function render() {
    table.innerHTML = "";

    // header
    const header = document.createElement("tr");
    header.innerHTML = "<th>Strategia</th>";
    for (let j = 0; j < cols; j++) {
        header.innerHTML += `<th>Stan ${j+1}</th>`;
    }
    table.appendChild(header);

    // rows
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>S${i+1}</td>`;
        for (let j = 0; j < cols; j++) {
            tr.innerHTML += `<td><input value="0"></td>`;
        }
        table.appendChild(tr);
    }
}

function addRow() {
    rows++;
    render();
}

function removeRow() {
    if (rows > 1) rows--;
    render();
}

function addColumn() {
    cols++;
    render();
}

function removeColumn() {
    if (cols > 1) cols--;
    render();
}

function getData() {
    return [...table.querySelectorAll("tr")]
        .slice(1)
        .map(row =>
            [...row.querySelectorAll("input")].map(i => Number(i.value))
        );
}

function calculate() {
    const data = getData();
    const alpha = Number(document.getElementById("alpha").value);
    const probs = document.getElementById("probabilities")
        .value.split(",")
        .map(Number);

    let out = "";

    // WALD
    const wald = data.map(r => Math.min(...r));
    out += "WALD:\n";
    wald.forEach((v,i)=> out += `S${i+1}: ${v}\n`);
    out += `=> Najlepsza: S${wald.indexOf(Math.max(...wald))+1}\n\n`;

    // HURWICZ
    const hurwicz = data.map(r =>
        alpha * Math.min(...r) + (1-alpha) * Math.max(...r)
    );
    out += "HURWICZ:\n";
    hurwicz.forEach((v,i)=> out += `S${i+1}: ${v.toFixed(2)}\n`);
    out += `=> Najlepsza: S${hurwicz.indexOf(Math.max(...hurwicz))+1}\n\n`;

    // BAYES
    const bayes = data.map(r =>
        r.reduce((s,v,i)=> s + v * (probs[i] || 0), 0)
    );
    out += "BAYES:\n";
    bayes.forEach((v,i)=> out += `S${i+1}: ${v.toFixed(2)}\n`);
    out += `=> Najlepsza: S${bayes.indexOf(Math.max(...bayes))+1}\n\n`;

    // SAVAGE
    const maxCols = data[0].map((_,c)=> Math.max(...data.map(r=>r[c])));
    const savage = data.map(r =>
        Math.max(...r.map((v,i)=> maxCols[i] - v))
    );
    out += "SAVAGE:\n";
    savage.forEach((v,i)=> out += `S${i+1}: ${v}\n`);
    out += `=> Najlepsza: S${savage.indexOf(Math.min(...savage))+1}`;

    document.getElementById("result").innerText = out;
}

render();
