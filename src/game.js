import { keyPress, key } from "./keyboard";
import Energia from "./Energia";
import Inimigo from "./Inimigo"; 
import Dragao from "./Dragao"; 
import hud from "./hud"; 
import { loadAudio, loadImage } from "./loaderAssets"; 

const FRAMES = 70; 
let energia, dragao, estrelaImg, estrela; 
const PONTOS_ESTRELA = 50; 
const PONTOS_ENERGIA = 10; 
let inimigos = Array.from({ length: 2 }); 
let ctx, canvas, gameover, bordas, score, anime; 
let limitePontuacaoProximoInimigo = 100;
let energiaSound, scoreSound, themeSound, gameoverSound, backgroundImg, startBackgroundImg; 

const init = async () => {
    score = 0;
    gameover = false;

    canvas = document.querySelector('canvas'); 
    ctx = canvas.getContext('2d');

    startBackgroundImg = await loadImage('img/logo.png')
    backgroundImg = await loadImage('img/background_game.png');
    estrelaImg = await loadImage('img/estrela.png');
    scoreSound = await loadAudio('sounds/estrela.mp3');
    scoreSound.volume = .5;
    energiaSound = await loadAudio('sounds/energia.mp3');
    energiaSound.volume = .5;
    gameoverSound = await loadAudio('sounds/gameover.mp3');
    gameoverSound.volume = .1;
    themeSound = await loadAudio('sounds/theme.mp3');
    themeSound.volume = .3;
    themeSound.loop = true;

    bordas = {
        width: canvas.width,
        height: canvas.height
    };

    energia = new Energia(300, 200, 20, 5);
    dragao = new Dragao(300, 200, 8, 82, 89, FRAMES);
    estrela = {
        x: 200,
        y: 200,
        width: 40, 
        height: 40, 
        draw: function(ctx) {
            ctx.drawImage(estrelaImg, this.x, this.y, this.width, this.height);
        },
        restart: function() {
            this.x = Math.random() * (bordas.width - this.width);
            this.y = Math.random() * (bordas.height - this.height);
        }
    };
    inimigos = inimigos.map(() => new Inimigo(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5));



    keyPress(window);
    
    start();
};

const start = () => {
    let startInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(startBackgroundImg, 0, 0, canvas.width, canvas.height);
        
        hud(ctx, `Pressione ENTER para começar`, "white", canvas.height / 2 + 210);

        if (key === 'Enter') {
            themeSound.play();
            clearInterval(startInterval);
            loop();
        }
    }, 1000);
};

const updateScoreTable = () => {
    document.getElementById('score').textContent = `Score: ${score}`;
};

const displayGameOver = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    ctx.fillStyle = 'white'; 
    ctx.font = 'bold 48px CustomFont'; 
    ctx.textAlign = 'center'; 
    ctx.textBaseline = 'middle'; 

    ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = '24px CustomFont'; 
    ctx.fillText(`Pressione F5 para reiniciar!`, canvas.width / 2, canvas.height / 2 + 0);
};



const colisaoEstrela = (dragao, estrela) => {
    const centroDragaoX = dragao.x + dragao.larguraDragao / 2;
    const centroDragaoY = dragao.y + dragao.alturaDragao / 2;
    const centroEstrelaX = estrela.x + estrela.width / 2;
    const centroEstrelaY = estrela.y + estrela.height / 2;

    const distanciaHorizontal = Math.abs(centroDragaoX - centroEstrelaX);
    const distanciaVertical = Math.abs(centroDragaoY - centroEstrelaY);

    const raioDragaoHorizontal = dragao.larguraDragao / 2;
    const raioDragaoVertical = dragao.alturaDragao / 2;
    const raioEstrelaHorizontal = estrela.width / 2;
    const raioEstrelaVertical = estrela.height / 2;

    if (distanciaHorizontal > (raioEstrelaHorizontal + raioDragaoHorizontal)) return false;
    if (distanciaVertical > (raioEstrelaVertical + raioDragaoVertical)) return false;

    if (distanciaHorizontal <= raioEstrelaHorizontal) return true;
    if (distanciaVertical <= raioEstrelaVertical) return true;

    const diferencaHorizontal = distanciaHorizontal - raioEstrelaHorizontal;
    const diferencaVertical = distanciaVertical - raioEstrelaVertical;

};


const adicionaInimigo = () => {
    const novoInimigo = new Inimigo(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5);
    inimigos.push(novoInimigo);
};

const playScoreSound = () => {
    scoreSound.currentTime = 0;
    scoreSound.play();
};

const playEnergiaSound = () => {
    energiaSound.currentTime = 0; 
    energiaSound.play();
};

const loop = () => {
    setTimeout(() => {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        estrela.draw(ctx);

        energia.paint(ctx);

        dragao.move(bordas, key);
        dragao.draw(ctx);

        inimigos.forEach(inimigo => {
            inimigo.move(bordas);
            inimigo.draw(ctx);
            if (dragao.colisao(inimigo)) {
                gameover = true;
            }
        });

        if (colisaoEstrela(dragao, estrela)) {
            estrela.restart();
            dragao.aumentarTamanho(10);
            playScoreSound(); 
            score += PONTOS_ESTRELA;
        }

        if (energia.colisao(dragao)) {
            dragao.diminuirTamanho(10);
            energia.moveRandomly(bordas);
            score += PONTOS_ENERGIA;
            playEnergiaSound(); 
        }

        if (score >= limitePontuacaoProximoInimigo) {
            adicionaInimigo(); 
            limitePontuacaoProximoInimigo += 100; 
        }

        if (gameover) {
            displayGameOver();
            gameoverSound.play();
            themeSound.pause();
            cancelAnimationFrame(anime); 
        } else {
            updateScoreTable(); 
            anime = requestAnimationFrame(loop);
        }

    }, 1000 / FRAMES); 
};

export { init }; 