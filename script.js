function getData() {
    return [
        [a1.value, b1.value, c1.value].map(Number),
        [a2.value, b2.value, c2.value].map(Number),
        [a3.value, b3.value, c3.value].map(Number)
    ];
}

function calculate() {
    const data = getData();
    const alpha = Number(alphaInput = document.getElementById("alpha").value);

    const pA = Number(pAInput = document.getElementById("pA").value);
    const pB = Number(pBInput = document.getElementById("pB").value);
    const pC = Number(pCInput = document.getElementById("pC").value);

    let out = "";

    // WALD
    const wald = data.map(r => Math.min(...r));
    out += "Wald:\n";
    wald.forEach((v, i) => out += `Strategia ${i+1}: ${v}\n`);
    out += `=> Najlepsza: ${wald.indexOf(Math.max(...wald))+1}\n\n`;

    // HURWICZ
    const hurwicz = data.map(r => alpha * Math.min(...r) + (1-alpha) * Math.max(...r));
    out += "Hurwicz:\n";
    hurwicz.forEach((v, i) => out += `Strategia ${i+1}: ${v.toFixed(2)}\n`);
    out += `=> Najlepsza: ${hurwicz.indexOf(Math.max(...hurwicz))+1}\n\n`;

    // BAYES (ważona)
    const bayes = data.map(r => r[0]*pA + r[1]*pB + r[2]*pC);
    out += "Bayes (ważona):\n";
    bayes.forEach((v, i) => out += `Strategia ${i+1}: ${v.toFixed(2)}\n`);
    out += `=> Najlepsza: ${bayes.indexOf(Math.max(...bayes))+1}\n\n`;

    // SAVAGE
    const maxCols = data[0].map((_, c) => Math.max(...data.map(r => r[c])));
    const regret = data.map(r => r.map((v, i) => maxCols[i] - v));
    const savage = regret.map(r => Math.max(...r));

    out += "Savage:\n";
    savage.forEach((v, i) => out += `Strategia ${i+1}: ${v}\n`);
    out += `=> Najlepsza: ${savage.indexOf(Math.min(...savage))+1}\n`;

    document.getElementById("result").innerText = out;
}
