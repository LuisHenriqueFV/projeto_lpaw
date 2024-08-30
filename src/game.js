import { keyPress, key } from "./keyboard"; // Importa funções para capturar teclas
import Corvo from "./Corvo"; // Importa a classe Corvo
import Enemy from "./Enemy"; // Importa a classe Enemy
import Hero from "./Hero"; // Importa a classe Hero
import hud from "./hud"; // Importa a função hud para exibir mensagens na tela
import { loadAudio, loadImage } from "./loaderAssets"; // Importa funções para carregar áudio e imagens

const FRAMES = 70; // Taxa de quadros por segundo
let corvoImg, corvo, hero, tangerineImg, tangerine; // Variáveis para o Corvo, Herói e Tangerina
const POINTS_FOR_YELLOWBALL = 50; // Pontos por coletar a tangerina
const POINTS_FOR_CORVO = 10; // Pontos por acertar o corvo
let enemies = Array.from({ length: 2 }); // Array para armazenar inimigos
let ctx, canvas, gameover, boundaries, score, anime; // Variáveis gerais para o jogo
let nextEnemyScoreThreshold = 100;
let corvoSound, scoreSound, themeSound, gameoverSound, backgroundImg; // Sons e imagem de fundo

// Função principal de inicialização
const init = async () => {
    score = 0;
    gameover = false;

    canvas = document.querySelector('canvas'); // Seleciona o elemento canvas
    ctx = canvas.getContext('2d'); // Obtém o contexto de renderização 2D

    // Carrega imagens e sons
    backgroundImg = await loadImage('img/background_game_dragon.png');
    corvoImg = await loadImage('img/explode3.png');
    tangerineImg = await loadImage('img/star.png');
    scoreSound = await loadAudio('sounds/score.mp3');
    scoreSound.volume = .5;
    corvoSound = await loadAudio('sounds/smile.mp3');
    corvoSound.volume = .5;
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
    corvo = new Corvo(300, 200, 20, 5, corvoImg);
    hero = new Hero(300, 200, 8, 82, 89, FRAMES);
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
    enemies = enemies.map(() => new Enemy(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5, corvoImg));

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

const colideTangerine = (circle, rect) => {
    const distX = Math.abs(circle.x + circle.width / 2 - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y + circle.height / 2 - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.width / 2)) return false;
    if (distY > (rect.height / 2 + circle.height / 2)) return false;

    if (distX <= (rect.width / 2)) return true;
    if (distY <= (rect.height / 2)) return true;

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;

    return (dx * dx + dy * dy <= (circle.size * circle.size));
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

const playCorvoSound = () => {
    // Reinicia a reprodução do som do corvo
    corvoSound.currentTime = 0; // Volta ao início do áudio
    corvoSound.play();
};

// Loop principal do jogo
const loop = () => {
    setTimeout(() => {
        // Desenha o fundo
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        // Desenha a tangerina
        tangerine.draw(ctx);

        // Desenha e move o corvo
        corvo.paint(ctx);

        // Move e desenha o herói com base nas teclas pressionadas
        hero.move(boundaries, key);
        hero.draw(ctx);

        // Move e desenha os inimigos
        enemies.forEach(e => {
            e.move(boundaries);
            e.draw(ctx);
            if (hero.colide(e)) {
                gameover = true;
            }
        });

        // Lógica para quando o herói ou o corvo colidem com a tangerina
        if (colideTangerine(hero, tangerine) || corvo.colide(tangerine)) {
            tangerine.restart();
            hero.grow(10);
            playScoreSound(); // Reproduz o som de pontuação
            score += POINTS_FOR_YELLOWBALL;
        }

        // Lógica para quando o corvo colide com o herói
        if (corvo.colide(hero)) {
            hero.shrink(10);
            corvo.moveRandomly(boundaries);
            score += POINTS_FOR_CORVO;
            playCorvoSound(); // Reproduz o som do corvo
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
