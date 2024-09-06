import { keyPress, key } from "./keyboard"; // Importa funções para capturar teclas
import Energia from "./Energia"; // Importa a classe energia
import Enemy from "./Enemy"; // Importa a classe Enemy
import Dragao from "./Dragao"; // Importa a classe Dragao
import hud from "./hud"; // Importa a função hud para exibir mensagens na tela
import { loadAudio, loadImage } from "./loaderAssets"; // Importa funções para carregar áudio e imagens

const FRAMES = 70; // Taxa de quadros por segundo
let energiaImg, energia, dragao, starImg, star; // Variáveis para a energia, Herói e Tangerina
const PONTOS_ESTRELA = 50; // Pontos por coletar a tangerina
const PONTOS_ENERGIA = 10; // Pontos por acertar a energia
let enemies = Array.from({ length: 2 }); // Array para armazenar inimigos
let ctx, canvas, gameover, bordas, score, anime; // Variáveis gerais para o jogo
let nextEnemyScoreThreshold = 100;
let energiaSound, scoreSound, themeSound, gameoverSound, backgroundImg, startBackgroundImg; // Sons e imagem de fundo

// Função principal de inicialização
const init = async () => {
    score = 0;
    gameover = false;

    canvas = document.querySelector('canvas'); // Seleciona o elemento canvas
    ctx = canvas.getContext('2d'); // Obtém o contexto de renderização 2D

    // Carrega imagens e sons
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

    // Define os limites do jogo
    bordas = {
        width: canvas.width,
        height: canvas.height
    };

    // Instancia os objetos do jogo
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
            // Garante que a estrela fique dentro dos limites do canvas
            this.x = Math.random() * (bordas.width - this.width);
            this.y = Math.random() * (bordas.height - this.height);
        }
    };
    enemies = enemies.map(() => new Enemy(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5, energiaImg));

    // Captura eventos de teclado
    keyPress(window);
    
    // Inicia o jogo
    start();
};

// Função para iniciar o jogo após pressionar ENTER
const start = () => {
    let startInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenha a imagem de fundo
        ctx.drawImage(startBackgroundImg, 0, 0, canvas.width, canvas.height);
        
        // Desenha o HUD
        hud(ctx, `Pressione ENTER para começar`, "white", canvas.height / 2 + 210);

        // Verifica a tecla pressionada
        if (key === 'Enter') {
            themeSound.play();
            clearInterval(startInterval);
            loop();
        }
    }, 1000);
};

// Atualiza a tabela de pontuação
const updateScoreTable = () => {
    document.getElementById('score').textContent = `Score: ${score}`;
};

// Exibe mensagem de fim de jogo
const displayGameOver = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Fundo semi-transparente para destacar a mensagem
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Desenha o fundo da mensagem ocupando toda a tela

    ctx.fillStyle = 'white'; // Cor do texto
    ctx.font = 'bold 48px CustomFont'; // Define a fonte e o tamanho
    ctx.textAlign = 'center'; // Centraliza o texto horizontalmente
    ctx.textBaseline = 'middle'; // Centraliza o texto verticalmente

    // Desenha o texto principal
    ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2 - 50);

    // Fonte e tamanho para a mensagem de reinício
    ctx.font = '24px CustomFont'; 
    ctx.fillText(`Pressione F5 para reiniciar!`, canvas.width / 2, canvas.height / 2 + 0);
};



const colideStar = (colisao, rect) => {
    const distX = Math.abs(colisao.x + colisao.width / 2 - rect.x - rect.width / 2);
    const distY = Math.abs(colisao.y + colisao.height / 2 - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + colisao.width / 2)) return false;
    if (distY > (rect.height / 2 + colisao.height / 2)) return false;

    if (distX <= (rect.width / 2)) return true;
    if (distY <= (rect.height / 2)) return true;

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;

    return (dx * dx + dy * dy <= (colisao.size * colisao.size));
};

const addEnemy = () => {
    const newEnemy = new Enemy(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5);
    enemies.push(newEnemy);
};

const playScoreSound = () => {
    // Reinicia a reprodução do som de pontuação
    scoreSound.currentTime = 0; // Volta ao início do áudio
    scoreSound.play();
};

const playEnergiaSound = () => {
    energiaSound.currentTime = 0; // Volta ao início do áudio
    energiaSound.play();
};

const loop = () => {
    setTimeout(() => {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        star.draw(ctx);

        energia.paint(ctx);

        dragao.move(bordas, key);
        dragao.draw(ctx);

        // Move e desenha os inimigos
        enemies.forEach(e => {
            e.move(bordas);
            e.draw(ctx);
            if (dragao.colide(e)) {
                gameover = true;
            }
        });

        // Lógica para quando o herói ou o energia colidem com a estrela
        if (colideStar(dragao, star) || energia.colide(star)) {
            star.restart();
            dragao.aumentarTamanho(10);
            playScoreSound(); 
            score += PONTOS_ESTRELA;
        }

        // Lógica para quando a energia colide com o herói
        if (energia.colide(dragao)) {
            dragao.diminuirTamanho(10);
            energia.moveRandomly(bordas);
            score += PONTOS_ENERGIA;
            playEnergiaSound(); // Reproduz o som do energia
        }

        if (score >= nextEnemyScoreThreshold) {
            addEnemy(); // Função para adicionar novo inimigo
            nextEnemyScoreThreshold += 100; // Próximo aumento será após mais 100 pontos
        }

        if (gameover) {
            displayGameOver();
            gameoverSound.play();
            themeSound.pause();
            cancelAnimationFrame(anime); 
        } else {
            updateScoreTable(); // Atualiza a pontuação na tela
            anime = requestAnimationFrame(loop); // Continua o loop do jogo
        }

    }, 1000 / FRAMES); // Controla a taxa de quadros
};

export { init }; // Exporta a função init para ser usada em outro lugar
