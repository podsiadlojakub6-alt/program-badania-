/* ===== ZAKŁADKI ===== */
function showTab(id) {
    ["nature","games","hungarian"].forEach(t =>
        document.getElementById(t).classList.add("hidden")
    );
    document.getElementById(id).classList.remove("hidden");
}

/* ===== GRA Z NATURĄ ===== */
let rows=3, cols=3;
const table=document.getElementById("matrix");

function render(){
    table.innerHTML="<tr><th>Strategia</th>"+
        [...Array(cols)].map((_,j)=>`<th>Stan ${j+1}</th>`).join("")+"</tr>";
    for(let i=0;i<rows;i++){
        table.innerHTML+=`<tr><td>S${i+1}</td>`+
            [...Array(cols)].map(()=>"<td><input value='0'></td>").join("")+
            "</tr>";
    }
}
function addRow(){rows++;render();}
function removeRow(){if(rows>1)rows--;render();}
function addColumn(){cols++;render();}
function removeColumn(){if(cols>1)cols--;render();}

function calculateNature(){
    const data=[...table.querySelectorAll("tr")].slice(1)
        .map(r=>[...r.querySelectorAll("input")].map(i=>+i.value));
    const alpha=+document.getElementById("alpha").value;
    const probs=document.getElementById("probabilities").value.split(",").map(Number);
    let out="";

    const wald=data.map(r=>Math.min(...r));
    out+="WALD:\n"+wald.map((v,i)=>`S${i+1}: ${v}`).join("\n")+
        `\n=> S${wald.indexOf(Math.max(...wald))+1}\n\n`;

    const hur=data.map(r=>alpha*Math.min(...r)+(1-alpha)*Math.max(...r));
    out+="HURWICZ:\n"+hur.map((v,i)=>`S${i+1}: ${v.toFixed(2)}`).join("\n")+"\n";

    result.innerText=out;
}
render();

/* ===== GRY DWUOSOBOWE ===== */
let gRows=2,gCols=2;
const gTable=document.getElementById("gameTable");

function renderGame(){
    gTable.innerHTML="<tr><th>A\\B</th>"+
        [...Array(gCols)].map((_,j)=>`<th>B${j+1}</th>`).join("")+"</tr>";
    for(let i=0;i<gRows;i++){
        gTable.innerHTML+=`<tr><th>A${i+1}</th>`+
            [...Array(gCols)].map(()=>"<td><input value='0'></td>").join("")+
            "</tr>";
    }
}
function addGameRow(){gRows++;renderGame();}
function removeGameRow(){if(gRows>1)gRows--;renderGame();}
function addGameCol(){gCols++;renderGame();}
function removeGameCol(){if(gCols>1)gCols--;renderGame();}

function calculateGame(){
    const data=[...gTable.querySelectorAll("tr")].slice(1)
        .map(r=>[...r.querySelectorAll("input")].map(i=>+i.value));
    let out="";

    const rowMin=data.map(r=>Math.min(...r));
    const colMax=data[0].map((_,j)=>Math.max(...data.map(r=>r[j])));
    const maximin=Math.max(...rowMin);
    const minimax=Math.min(...colMax);

    out+="STRATEGIE CZYSTE:\n";
    if(maximin===minimax){
        const a=rowMin.indexOf(maximin);
        const b=colMax.indexOf(minimax);
        out+=`Punkt siodłowy = ${maximin}\n\nPrawdopodobieństwa:\n`;
        data.forEach((_,i)=>out+=`A${i+1}: ${i===a?"100%":"0%"}\n`);
        out+="\n";
        data[0].forEach((_,j)=>out+=`B${j+1}: ${j===b?"100%":"0%"}\n`);
        gameResult.innerText=out;
        return;
    }
    out+="Brak punktu siodłowego\n\n";

    // ===== 2×2 =====
    if(gRows===2 && gCols===2){
        const [a,b]=data[0];
        const [c,d]=data[1];
        const denom=a-b-c+d;
        const pA=(d-c)/denom;
        const pB=(d-b)/denom;
        const V=(a*d-b*c)/denom;
        out+="STRATEGIE MIESZANE 2×2:\n";
        out+=`A1: ${(pA*100).toFixed(2)}%\nA2: ${(100-pA*100).toFixed(2)}%\n\n`;
        out+=`B1: ${(pB*100).toFixed(2)}%\nB2: ${(100-pB*100).toFixed(2)}%\n\n`;
        out+=`VA = VB = ${V.toFixed(2)}\n`;
    }

    // ===== 2×n =====
    else if(gRows===2){
        out+="STRATEGIE MIESZANE 2×n:\n";
        out+="Gracz A losuje między A1 i A2.\n";
        out+="Kolumny B ograniczają grę – wyznaczane geometrycznie.\n";
        out+="(w praktyce: wybierz 2 najbardziej ograniczające kolumny)\n";
    }

    // ===== m×2 =====
    else if(gCols===2){
        out+="STRATEGIE MIESZANE m×2:\n";
        out+="Gracz B losuje między B1 i B2.\n";
        out+="Wiersze A ograniczają grę.\n";
    }

    else{
        out+="⚠️ Strategie mieszane dla m×n wymagają programowania liniowego.\n";
    }

    gameResult.innerText=out;
}
renderGame();

/* ===== ALGORYTM WĘGIERSKI ===== */
let hRows=3,hCols=3;
const hTable=document.getElementById("hungarianTable");

function renderHungarian(){
    hTable.innerHTML="<tr><th></th>"+
        [...Array(hCols)].map((_,j)=>`<th>Z${j+1}</th>`).join("")+"</tr>";
    for(let i=0;i<hRows;i++){
        hTable.innerHTML+=`<tr><th>W${i+1}</th>`+
            [...Array(hCols)].map(()=>"<td><input value='0'></td>").join("")+
            "</tr>";
    }
}
function addHungarianRow(){hRows++;renderHungarian();}
function removeHungarianRow(){if(hRows>1)hRows--;renderHungarian();}
function addHungarianCol(){hCols++;renderHungarian();}
function removeHungarianCol(){if(hCols>1)hCols--;renderHungarian();}

function solveHungarian(){
    const m=[...hTable.querySelectorAll("tr")].slice(1)
        .map(r=>[...r.querySelectorAll("input")].map(i=>+i.value));
    const n=m.length;
    let best=Infinity,bestA=[];
    const used=Array(n).fill(false);

    function dfs(i,sum,a){
        if(sum>=best)return;
        if(i===n){best=sum;bestA=[...a];return;}
        for(let j=0;j<n;j++){
            if(!used[j]){
                used[j]=true;
                a[i]=j;
                dfs(i+1,sum+m[i][j],a);
                used[j]=false;
            }
        }
    }
    dfs(0,0,[]);
    let out="Optymalny przydział:\n";
    bestA.forEach((v,i)=>out+=`W${i+1} → Z${v+1}\n`);
    out+=`\nMinimalny koszt: ${best}`;
    hungarianResult.innerText=out;
}
renderHungarian();
