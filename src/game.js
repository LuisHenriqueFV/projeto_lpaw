import { keyPress, key } from "./keyboard";
import Energia from "./Energia";
import Inimigo from "./Inimigo"; 
import Dragao from "./Dragao"; 
import hud from "./hud"; 
import { loadAudio, loadImage } from "./loaderAssets"; 

const FRAMES = 70; 
let energiaImg, energia, dragao, starImg, star; 
const PONTOS_ESTRELA = 50; 
const PONTOS_ENERGIA = 10; 
let enemies = Array.from({ length: 2 }); 
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
    energiaImg = await loadImage('img/fogo.png');
    starImg = await loadImage('img/star.png');
    scoreSound = await loadAudio('sounds/star.mp3');
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

    energia = new Energia(300, 200, 20, 5, energiaImg);
    dragao = new Dragao(300, 200, 8, 82, 89, FRAMES);
    star = {
        x: 200,
        y: 200,
        width: 40, 
        height: 40, 
        draw: function(ctx) {
            ctx.drawImage(starImg, this.x, this.y, this.width, this.height);
        },
        restart: function() {
            this.x = Math.random() * (bordas.width - this.width);
            this.y = Math.random() * (bordas.height - this.height);
        }
    };
    enemies = enemies.map(() => new Inimigo(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5, energiaImg));

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



const colisaoEstrela = (colisao, rect) => {
    const distX = Math.abs(colisao.x + colisao.larguraDragao / 2 - rect.x - rect.width / 2);
    const distY = Math.abs(colisao.y + colisao.alturaDragao / 2 - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + colisao.larguraDragao / 2)) return false;
    if (distY > (rect.height / 2 + colisao.alturaDragao / 2)) return false;

    if (distX <= (rect.width / 2)) return true;
    if (distY <= (rect.height / 2)) return true;

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;

    return (dx * dx + dy * dy <= (colisao.raioColisao * colisao.raioColisao));
};

const adicionaInimigo = () => {
    const novoInimigo = new Inimigo(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5);
    enemies.push(novoInimigo);
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

        star.draw(ctx);

        energia.paint(ctx);

        dragao.move(bordas, key);
        dragao.draw(ctx);

        enemies.forEach(e => {
            e.move(bordas);
            e.draw(ctx);
            if (dragao.colisao(e)) {
                gameover = true;
            }
        });

        if (colisaoEstrela(dragao, star)) {
            star.restart();
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