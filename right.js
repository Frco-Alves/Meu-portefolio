
let horas = document.getElementById('horas');
let minutos = document.getElementById('minutos');
let segundos = document.getElementById('segundos');
let ampm = document.getElementById('ampm');

setInterval(() =>{
    let h = new Date().getHours();
let m = new Date().getMinutes();
let s = new Date().getSeconds();
let andDmd = h >= 12 ? 'PM' : 'AM'


//converter 12 horas para 24 horas

if(h > 12) {
  h = h - 12;
}

//adicionar zero antes de um numero

h = (h < 10) ? '0' + h : h;
m = (m < 10) ? '0' + m : m;
s = (s < 10) ? '0' + s: s;






horas.innerHTML = h;
minutos.innerHTML = m;
segundos.innerHTML = s;
ampm.innerHTML = andDmd;
})
























const input = document.getElementById('input-busca');
const apiKey = '9820327acb7cfc275652b4f6019c1440'
const clienteID = '40081a6734a24293848021f1af8a1486'
const clienteSecret = 'ce609b38b5ab4d14a1387ac0e61068e0'
const ulElement = document.querySelector('.playlist-caixa');
const liElement = ulElement.querySelectorAll('li');

const videoURLs = [
    './video/video1.mp4',
    './video/video2.mp4',
    './video/video3.mp4',
    './video/video4.mp4',
    './video/video5.mp4',
    './video/video6.mp4',
    './video/video7.mp4',
    './video/video8.mp4',
    './video/video9.mp4',
    './video/video10.mp4',
    './video/video11.mp4',
    './video/video12.mp4',
];

function obterVideosAleatorios(array){
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function recarregarVideosNaTela(){
    const videoElement = document.querySelector('.video');
    const videoSource = document.getElementById('video-souce');
    const randomVideoURL = obterVideosAleatorios(videoURLs);

    if(videoElement && videoSource) {
       videoSource.src = randomVideoURL;

       videoElement.load();
    }
}

function movimentoInput(inputValue) {
    const visibility = input.style.visibility;

    inputValue && procurarCidade(inputValue);



    visibility === 'hidden' ? abrirInput() : fecharInput()
}

function botaoDeBusca() {
    const inputValue = input.value;



    movimentoInput(inputValue)
}


function fecharInput() {
    input.style.visibility = 'hidden';
    input.style.width = '40px';
    input.style.padding = '0.3rem 0.3rem 0.3rem 2.6rem;';
    input.style.transition = 'all 0.5s ease-in-out 0s';
    input.value = "";
}


function abrirInput() {
    input.style.visibility = 'visible';
    input.style.width = '220px';
    input.style.padding = '0.3rem 0.3rem 0.3rem 3.1rem;';
    input.style.transition = 'all 0.5s ease-in-out 0s';

}

function mostrarEnvelope(){
    document.querySelector('.envelope').style.visibility = 'visible';
    document.querySelector('.caixa').style.alignItems = 'end';
    document.querySelector('.procura').style.position = 'initial';

    

}



input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        const valorInput = input.value;
        movimentoInput(valorInput)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    fecharInput();
    recarregarVideosNaTela();
})

async function procurarCidade(city) {
    try {
        const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`)

        if (dados.status === 200) {
            const resultado = await dados.json()

            
            obterTopAlbunsPorPais(resultado.sys.country)
            mostrarClimaNaTela(resultado)
            mostrarEnvelope();
            recarregarVideosNaTela();
        } else {
            throw new Error
        }
    } catch {
        alert('A pesquisa por cidade falhou!');

    }

}

function mostrarClimaNaTela(resultado) {
    document.querySelector('.icone-tempo').src = `./img/${resultado.weather[0].icon}.png`
    document.querySelector('.nome-cidade').innerHTML = `${resultado.name}`;
    document.querySelector('.temperatura').innerHTML = `${resultado.main.temp.toFixed(0)}°C`;
    document.querySelector('.maxTemperatura').innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}°C`;
    document.querySelector('.minTemperatura').innerHTML = `mín: ${resultado.main.temp_min.toFixed(0)}°C`;
}

async function obterAcessoToken() {
    const credentials = `${clienteID}:${clienteSecret}`
    const encodedCredentials = btoa(credentials);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
    });

    
    const data = await response.json()
    return data.access_token;
}

function obterDataAtual(){
    const currentDate = new Date();
    const ano = currentDate.getFullYear();
    const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dia = currentDate.getDate().toString().padStart(2, '0');

    return `${ano}-${mes}-${dia}`
}

async function obterTopAlbunsPorPais(country) {
    try{
        const accessToken = await obterAcessoToken();
        const dataAtual = obterDataAtual();
        const url = `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${dataAtual}T09%3A00%3A00&limit=3`
     
        const resultado = await fetch(`${url}`, {
         headers: {  
             'Authorization': `Bearer ${accessToken}`
         },
        });

        if(resultado.status === 200) {
            const data = await resultado.json()
            const result = data.playlists.items.map(item => ({
             name: item.name,
             image: item.images[0].url
            }))
         
            mostrarMusicaNaTela(result);
        }else{
            throw new Error 
        }
    }catch{
        alert('A pesquisa por musica falhou!')
    }
  
}




function mostrarMusicaNaTela(dados) {
    liElement.forEach((liElement, index) => {
        const imgElement = liElement.querySelector('img');
        const pElement = liElement.querySelector('p');

        imgElement.src = dados[index].image;
        pElement.textContent = dados[index].name
    });

    document.querySelector('.playlist-caixa').style.visibility = 'visible'
}


