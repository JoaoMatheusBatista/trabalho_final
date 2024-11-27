const apiKey = 'dc7acddf2e091fcb4bc97d1f493d4e88';
const baseUrl = 'https://data.fixer.io/api/latest?access_key=' + apiKey;
const phpURL = './php/';
const deleteLogUrl = 'https://www.piway.com.br/unoesc/api/excluir/log';

async function getExchangeRates() {
    try {
        const response = await fetch(phpURL + "moedas_listar.php");
        if (!response.ok) {
            throw new Error('Erro ao buscar taxas de câmbio');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function logRequest(numeroregistros) {
    const logs = await fetch (`${phpURL}log_inserir.php?numeroregistros=${numeroregistros}`);
    await viewLogs();
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
    const rates = await getExchangeRates();
    console.log(rates[0])
    i = 0;
    while(i < rates.length){
        console.log(i);
        console.log(rates.length);
        if(rates[i].base == fromCurrency){
            for(j = 0; j < rates.length; j++){
                if(rates[j].base == toCurrency){
                    const amountInBaseCurrency = amount / rates[i].valor;
                    const convertedAmount = amountInBaseCurrency * rates[j].valor;
                    return convertedAmount;
                }
            }
        }
        i++;
    }
}


document.getElementById('convertBtn').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    const result = await convertCurrency(amount, fromCurrency, toCurrency);
    console.log(result);
    if (result !== undefined) {
        document.getElementById('result').innerText = `${amount} ${fromCurrency} é igual a ${result.toFixed(2)} ${toCurrency}`;
    } else {
        document.getElementById('result').innerText = 'Moeda Não Registrada';
    }
});

async function listAvailableCurrencies() {
    const rates = await getExchangeRates();
    const currencyListElement = document.getElementById('currencyList');
    currencyListElement.innerHTML = '';

    if (!rates) {
        currencyListElement.innerHTML = '<div class="alert alert-danger">Não foi possível obter as taxas de câmbio.</div>';
        return;
    }

    rates.forEach(currency => {
        const rateBlock = document.createElement('div');
        rateBlock.className = 'col-md-3 mb-3';
        rateBlock.innerHTML = `
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">${currency.base}</h5>
                    <p class="card-text">Valor: ${currency.valor}</p>
                    <p class="card-text">Data: ${currency.data}</p>
                    <p class="card-text">Id: ${currency.id_moedas}</p>
                    <button class="btn btn-danger mt-2" onclick="deleteMoeda(${currency.id_moedas})">Excluir</button>
                </div>
            </div>
        `;
        currencyListElement.appendChild(rateBlock);
    });
}

document.getElementById('listCurrenciesBtn').addEventListener('click', async () => {
    await listAvailableCurrencies();
});

async function viewLogs() {
    try {
        const response = await fetch(`${phpURL}/log_listar.php`);
        if (!response.ok) {
            throw new Error('Erro ao buscar logs');
        }
        const logs = await response.json();
        const logListElement = document.getElementById('logList');
        logListElement.innerHTML = ''; // Limpar conteúdo anterior
        if (logs.length === 0) {
            logListElement.innerHTML = '<div class="alert alert-info">Nenhum log encontrado.</div>';
            return;
        }

        logs.forEach(log => {
            const logItem = document.createElement('div');
            logItem.className = 'alert alert-secondary';
            logItem.innerHTML = `
                idLog: ${log.idlog} <br>Horário: ${log.datahora} <br>Número de registros: ${log.numeroregistros}<br>
                <button class="btn btn-danger mt-2" onclick="deleteLog(${log.idlog})">Excluir</button>
            `;
            logListElement.appendChild(logItem);
        });
    } catch (error) {
        document.getElementById('logList').innerHTML = '<div class="alert alert-danger">Erro ao buscar logs.</div>';
    }
}

async function deleteMoeda(id_moedas) {
    const del = await fetch (`${phpURL}/moedas_excluir.php?id_moedas=${id_moedas}`);
    await listAvailableCurrencies();
}

async function deleteLog(idlog) {
        const del = await fetch (`${phpURL}/log_excluir.php?idlog=${idlog}`);
        await viewLogs();
}

document.getElementById('viewLogsBtn').addEventListener('click', async () => {
    await viewLogs();
});

async function insertElement() {
    const base = document.getElementById('insertBase').value;
    const data = document.getElementById('insertData').value;
    const valor = document.getElementById('insertValor').value;
    moedas = await getExchangeRates();
    add = false;
    for (const moeda of moedas) {
        console.log("testando");
        if (base === moeda.base) {
            console.log("alterando");
            try {
                const response = await fetch(`${phpURL}moedas_alterar.php?id_moedas=${moeda.id_moedas}&base=${base}&valor=${valor}&data=${data}`);
                if (response.ok) {
                    alert('Moeda já existe | Alterada');
                    return true; // Use `return` para sair do loop e função se necessário
                } else {
                    insertResult.innerHTML = '<p>Moeda já existe | Falha na alteração</p>';
                }
            } catch (error) {
                console.error("Erro na requisição para alteração:", error);
            }
        }
    }
    if(add === false){
        console.log("adicionando");
        const response = await fetch (`${phpURL}moedas_inserir.php?base=${base}&valor=${valor}&data=${data}`);
        if(response.ok){
            alert('Inserido no banco');
            return;
        }else{
            alert('Erro ao inserir');
            return;
        }
    }
}

document.getElementById('insertBtn').addEventListener('click', async () => {
    const options = document.getElementById('insertOptions')
    options.innerHTML = `<div class="mb-3">
                            <label for="amount" class="form-label input-label">Base (BRL, EUR, USD..)</label>
                            <input id="insertBase" class="form-control" placeholder="Digite a base" required>
                        </div>
                        <div class="mb-3">
                            <label for="amount" class="form-label input-label">Data(dd/mm/aaaa)</label>'
                            <input type="date" id="insertData" class="form-control" placeholder="Digite a data" required>
                        </div>
                        <div class="mb-3">
                            <label for="amount" class="form-label input-label">Valor</label>
                            <input type="number" id="insertValor" class="form-control" placeholder="Digite a quantia" required>
                        </div>
                        <button id="insertConc" onclick="insert()" class="btn btn-secondary w-100">Concluir</button>
                        <h2 class="text-center mt-4"></h2>`
                        ;
});

async function insert () {
    await insertElement();
    await listAvailableCurrencies();
    await viewLogs();
}

document.getElementById('UpdateAPIBtn').addEventListener('click', async () => {
    try {
        const moedasAPI = await getAPI();
        const moedasBD = await getExchangeRates();

        const updates = [];
        const insertions = [];

        var qtdmoedas = 0;

        for (const [base, valor] of Object.entries(moedasAPI.rates) ) {
            qtdmoedas++;

            const moedaExistente = moedasBD.find(moeda => moeda.base === base);

            if (moedaExistente) {
                updates.push(fetch(`${phpURL}moedas_alterar.php?id_moedas=${moedaExistente.id_moedas}&base=${base}&valor=${valor}&data=${moedasAPI.date}`));
            } else {
                insertions.push(fetch(`${phpURL}moedas_inserir.php?base=${base}&valor=${valor}&data=${moedasAPI.date}`));
            }
        }

        await Promise.all([...updates, ...insertions]);

        alert('Moedas atualizadas com sucesso.');
        await logRequest(qtdmoedas);
        await listAvailableCurrencies();
        await viewLogs();
    } catch (error) {
        console.error("Erro ao atualizar moedas:", error);
    }
    
});


async function getAPI() {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar taxas de câmbio');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}


async function options() {
    try {
        const moedas = await getExchangeRates();

        const fromCurrencyElement = document.getElementById('fromCurrency');
        const toCurrencyElement = document.getElementById('toCurrency');

        fromCurrencyElement.innerHTML = '';
        toCurrencyElement.innerHTML = '';

        moedas.forEach(moeda => {
            const optionFrom = document.createElement('option');
            optionFrom.value = moeda.base;
            optionFrom.textContent = moeda.base;

            const optionTo = document.createElement('option');
            optionTo.value = moeda.base;
            optionTo.textContent = moeda.base;

            fromCurrencyElement.appendChild(optionFrom);
            toCurrencyElement.appendChild(optionTo);
        });
    } catch (error) {
        console.error("Erro ao carregar opções de moedas:", error);
    }
}

document.getElementById('clearDB').addEventListener('click', async () => {
    const response = await fetch(`${phpURL}moedas_limpar.php`);
    if(!response.ok){
        console.log("erro");
    }
    await listAvailableCurrencies();
});
