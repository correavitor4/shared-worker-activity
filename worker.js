//Variáveis (optei por deixá-las acima para manter a organização do código)
let m1;
let m2;
let m3;
let linesToWork;

worker.onmessage = (data) => {
    //Recebe as variáveis 
    m1 = new Int32Array(data.data.matrizBuffer1);
    m2 = new Int32Array(data.data.matrizBuffer2);
    m3 = new Int32Array(data.data.matrizBuffer3);
    linesToWork = data.data.workerLines;

    startWorkerWork();
}

const startWorkerWork = () => {
    linesToWork.forEach((line) => {
        multiplyLinePerM2Column(line);
    });
}

const multiplyLinePerM2Column = (line) => {
    //Inqüestinável
    let lineToMultiply  = new Int32Array(m1.buffer, line*10000*4, 10000);
    let acumulator = 0;
    let columnIndex = 0;
    //Considerando que cada linha de m1 deve multiplicar todas as colunas de m2, então deverá haver iteração
    //para cada coluna de m2. Haverá acumulação a cada iteração, e esse valor será preenchido na linha da M3 correspondente à linha do m1, e à coluna do M2 em questão
    while(columnIndex < 10000){
        //limpa o acumulador a cada nova iteração
        acumulator = 0;
        for(let i=0;i<10000;i++){
            acumulator += m2[columnIndex + i*10000] * lineToMultiply[i];
        };
        //Preenche a linha da M3 correspondente à linha do m1, e à coluna do M2 em questão
        m3[line*10000 + columnIndex] = acumulator;
        columnIndex++;
    }
}