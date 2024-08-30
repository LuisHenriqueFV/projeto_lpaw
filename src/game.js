import { keyPress, key } from "./keyboard"; // Importa funções para capturar teclas
import Energia from "./Energia"; // Importa a classe energia
import Enemy from "./Enemy"; // Importa a classe Enemy
import Dragao from "./Dragao"; // Importa a classe Dragao
import hud from "./hud"; // Importa a função hud para exibir mensagens na tela
import { loadAudio, loadImage } from "./loaderAssets"; // Importa funções para carregar áudio e imagens

const FRAMES = 70; // Taxa de quadros por segundo
let energiaImg, energia, dragao, tangerineImg, tangerine; // Variáveis para a energia, Herói e Tangerina
const POINTS_FOR_YELLOWBALL = 50; // Pontos por coletar a tangerina
const POINTS_FOR_ENERGIA = 10; // Pontos por acertar a energia
let enemies = Array.from({ length: 2 }); // Array para armazenar inimigos
let ctx, canvas, gameover, boundaries, score, anime; // Variáveis gerais para o jogo
let nextEnemyScoreThreshold = 100;
let energiaSound, scoreSound, themeSound, gameoverSound, backgroundImg; // Sons e imagem de fundo

// Função principal de inicialização
const init = async () => {
    score = 0;
    gameover = false;

    canvas = document.querySelector('canvas'); // Seleciona o elemento canvas
    ctx = canvas.getContext('2d'); // Obtém o contexto de renderização 2D

    // Carrega imagens e sons
    backgroundImg = await loadImage('img/background_game_dragon.png');
    energiaImg = await loadImage('img/fogo.png');
    tangerineImg = await loadImage('img/star.png');
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
    boundaries = {
        width: canvas.width,
        height: canvas.height
    };

    // Instancia os objetos do jogo
    energia = new Energia(300, 200, 20, 5, energiaImg);
    dragao = new Dragao(300, 200, 8, 82, 89, FRAMES);
    tangerine = {
        x: 200,
        y: 200,
        width: 40, // Largura da imagem da tangerina
        height: 40, // Altura da imagem da tangerina
        draw: function(ctx) {
            ctx.drawImage(tangerineImg, this.x, this.y, this.width, this.height);
        },
        restart: function() {
            // Garante que a tangerina fique dentro dos limites do canvas
            this.x = Math.random() * (boundaries.width - this.width);
            this.y = Math.random() * (boundaries.height - this.height);
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
        hud(ctx, `Pressione ENTER para começar!! `, "red", canvas.height / 2 - 50);
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
const displayGameOverMessage = () => {
    document.getElementById('game-over-message').textContent = `GAME OVER!! Você fez ${score} pontos`;
    document.getElementById('restart-message').textContent = `Pressione F5 para reiniciar!`;
};

const colideTangerine = (colisao, rect) => {
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
    // Reinicia a reprodução do som da energia
    energiaSound.currentTime = 0; // Volta ao início do áudio
    energiaSound.play();
};

// Loop principal do jogo
const loop = () => {
    setTimeout(() => {
        // Desenha o fundo
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        // Desenha a tangerina
        tangerine.draw(ctx);

        // Desenha e move a energia
        energia.paint(ctx);

        // Move e desenha o herói com base nas teclas pressionadas
        dragao.move(boundaries, key);
        dragao.draw(ctx);

        // Move e desenha os inimigos
        enemies.forEach(e => {
            e.move(boundaries);
            e.draw(ctx);
            if (dragao.colide(e)) {
                gameover = true;
            }
        });

        // Lógica para quando o herói ou o energia colidem com a tangerina
        if (colideTangerine(dragao, tangerine) || energia.colide(tangerine)) {
            tangerine.restart();
            dragao.grow(10);
            playScoreSound(); // Reproduz o som de pontuação
            score += POINTS_FOR_YELLOWBALL;
        }

        // Lógica para quando a energia colide com o herói
        if (energia.colide(dragao)) {
            dragao.shrink(10);
            energia.moveRandomly(boundaries);
            score += POINTS_FOR_ENERGIA;
            playEnergiaSound(); // Reproduz o som do energia
        }

        // Verifica se o jogador atingiu a pontuação para adicionar um novo inimigo
        if (score >= nextEnemyScoreThreshold) {
            addEnemy(); // Função para adicionar novo inimigo
            nextEnemyScoreThreshold += 100; // Próximo aumento será após mais 100 pontos
        }

        // Lógica para o fim de jogo
        if (gameover) {
            displayGameOverMessage();
            gameoverSound.play();
            themeSound.pause();
            cancelAnimationFrame(anime); // Para a animação do jogo
        } else {
            updateScoreTable(); // Atualiza a pontuação na tela
            anime = requestAnimationFrame(loop); // Continua o loop do jogo
        }

    }, 1000 / FRAMES); // Controla a taxa de quadros
};

export { init }; // Exporta a função init para ser usada em outro lugar
