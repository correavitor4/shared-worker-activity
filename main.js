if (!crossOriginIsolated) {
    throw new Error('Cannot use SharedArrayBuffer');
}
// Quantidade de workers que estão ocupados
let busyWorkers = workers.length;
//Array que salva os objetos do tipo Worker
let workers = [];
//Buffer from 10^4 * 10^4 cells
var matrizBuffer1 = new SharedArrayBuffer(400000000);
var matrizBuffer2 = new SharedArrayBuffer(400000000);
var matrizBuffer3 = new SharedArrayBuffer(400000000);
// const view = new Int32Array(buffer);
// const view2 = new Uint8Array(buffer2);

//Considerando que a matriz é quadrada, então a multiplicação é possível, o que elimina a necessidade de verificação da comparação entre o número de linha e colunas


const defineWorkers = () => {
    const nWorkers = document.getElementById('nWorkers').value;
    for (let i = 0; i < nWorkers; i++) {
        workers[i] = new Worker('worker.js');
    }
}

const startCalc = () =>{
    document.getElementById('startButton').disabled = true;

    //1. Create workers 
    defineWorkers();

    //2. Divide o trabalho entre os workers
    let alocatedWorkToEachWorker = alocateWorkToWorkers();

    //3. Define os "onMessage" dos workers
    defineWorkersOnMessage();

    //4. Executa o cálculo especificando a divisão de trabalho entre os workers
    execCalc(alocatedWorkToEachWorker);

    //5. Verifica se o resultado está correto
    if(checkIfIsCorrect()){
        console.log('Resultado correto!');
    }else{
        console.log('Resultado incorreto!');
    }
    
    document.getElementById('startButton').disabled = false;
}

const execCalc = (alocatedWorkToEachWorker) => {
    alocatedWorkToEachWorker.forEach((workerLines, index) => {
        //Send the lines to each worker
        workers[index].postMessage({matrizBuffer1,matrizBuffer2,matrizBuffer3,workerLines});
    });

    //Wait for all workers to finish
    while(busyWorkers>0){
        //Wait for the workers to finish
    }

    return;
}

//Vai definir quais linhas cada worker vai calcular, e retorna um vetor com essa informação
//Isso dividirá o trabalho entre eles
const alocateWorkToWorkers = () => {
    let lines = 0;
    //Cada worker do array de workers tem um elemento associado nesse array aqui
    //Esse elemento associdado é um vetor, que conterá as linhas nos quais cada worker deverá trabalhar
    let linesForEachWorkerThatWork = [];
    for(let i=0;i<workers.length;i++){
        linesForEachWorkerThatWork.push([]);
    }

    let index = 0;
    while(lines<10000){
        linesForEachWorkerThatWork[index].push(lines);
        index++;
        if(index == workers.length){
            index = 0;
        }
        lines++;
    }
    return linesForEachWorkerThatWork;
}

//Verifica se todos os resultados da matriz m3 estão preenchidos
const checkIfIsCorrect = () => {
    let m3View = new Int32Array(matrizBuffer3);
    m3View.forEach((element) => {
        if(!element){
            console.log('Erro no resultado: ' + element);
            return;
        }
    });

    return true;
}

const defineWorkersOnMessage = () => {
    workers.foreach((worker) => {
        worker.onmessage = (data) => {
            if(data.data != true){
                console.log('Erro na execução do processamento do worker');
                return;
            }
            busyWorkers--;      
        }
    });
}