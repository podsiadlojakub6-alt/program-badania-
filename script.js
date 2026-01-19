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
    const alpha=+alpha.value;
    let out="";

    const wald=data.map(r=>Math.min(...r));
    out+="WALD:\n"+wald.map((v,i)=>`S${i+1}: ${v}`).join("\n")+"\n\n";

    const hur=data.map(r=>alpha*Math.min(...r)+(1-alpha)*Math.max(...r));
    out+="HURWICZ:\n"+hur.map((v,i)=>`S${i+1}: ${v.toFixed(2)}`).join("\n");

    result.innerText=out;
}
render();

/* ===== TEORIA GIER ===== */
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
    out+=`Maximin: ${maximin}\nMinimax: ${minimax}\n\n`;

    // punkt siodłowy
    if(maximin===minimax){
        const ai=rowMin.indexOf(maximin);
        const bj=colMax.indexOf(minimax);
        out+="PUNKT SIODŁOWY\n";
        out+=`VA = VB = ${maximin}\n\n`;
        out+="Gracz A:\n";
        data.forEach((_,i)=>out+=`A${i+1}: ${i===ai?"100%":"0%"}\n`);
        out+="\nGracz B:\n";
        data[0].forEach((_,j)=>out+=`B${j+1}: ${j===bj?"100%":"0%"}\n`);
        gameResult.innerText=out;
        return;
    }

    // strategie mieszane – tylko 2×2
    if(gRows!==2 || gCols!==2){
        out+="Brak punktu siodłowego.\n";
        out+="Strategie mieszane tylko dla 2×2.\n";
        gameResult.innerText=out;
        return;
    }

    const a=data[0][0], b=data[0][1];
    const c=data[1][0], d=data[1][1];
    const denom=a-b-c+d;

    const V=(a*d-b*c)/denom;
    const pA1=(d-c)/denom;
    const pB1=(d-b)/denom;

    out+="STRATEGIE MIESZANE (2×2)\n\n";
    out+="Gracz A:\n";
    out+=`A1: ${(pA1*100).toFixed(2)}%\nA2: ${(100-pA1*100).toFixed(2)}%\n\n`;
    out+="Gracz B:\n";
    out+=`B1: ${(pB1*100).toFixed(2)}%\nB2: ${(100-pB1*100).toFixed(2)}%\n\n`;
    out+=`VA = VB = ${V.toFixed(2)}\n`;

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
