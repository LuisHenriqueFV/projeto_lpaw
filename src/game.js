import { keyPress, key } from "./keyboard"; // Importa funções para capturar teclas
import Circle from "./geometries/Circle"; // Importa a classe Circle
import Corvo from "./Corvo"; // Importa a classe Corvo
import Enemy from "./Enemy"; // Importa a classe Enemy
import Hero from "./Hero"; // Importa a classe Hero
import hud from "./hud"; // Importa a função hud para exibir mensagens na tela
import { loadAudio, loadImage } from "./loaderAssets"; // Importa funções para carregar áudio e imagens

const FRAMES = 70; // Taxa de quadros por segundo
let corvoImg, corvo, hero, tangerine; // Variáveis para o Corvo, Herói e Tangerina
const POINTS_FOR_YELLOWBALL = 50; // Pontos por coletar a tangerina
const POINTS_FOR_CORVO = 10; // Pontos por acertar o corvo
let enemies = Array.from({ length: 3 }); // Array para armazenar inimigos
let ctx, canvas, gameover, boundaries, score, anime; // Variáveis gerais para o jogo
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
    scoreSound = await loadAudio('sounds/score.mp3');
    scoreSound.volume = .5;
    gameoverSound = await loadAudio('sounds/gameover.mp3');
    gameoverSound.volume = .1;
    themeSound = await loadAudio('sounds/theme.mp3');
    themeSound.volume = .3;
    themeSound.loop = true;
    corvoSound = await loadAudio('sounds/smile.mp3');
    corvoSound.volume = .5;

    // Define os limites do jogo
    boundaries = {
        width: canvas.width,
        height: canvas.height
    };

    // Instancia os objetos do jogo
    corvo = new Corvo(300, 200, 20, 5, corvoImg); // Instancia o Corvo com a animação
    hero = new Hero(300, 200, 8, 82, 89, FRAMES);
    tangerine = new Circle(200, 200, 10, 5, 'orange');
    enemies = enemies.map(() => new Enemy(Math.random() * canvas.width, Math.random() * canvas.height, 10, 5, 'blue'));

    // Define função para reiniciar a posição da tangerina
    tangerine.restart = () => {
        tangerine.x = tangerine.size + Math.random() * (boundaries.width - tangerine.size);
    };

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

// Loop principal do jogo
const loop = () => {
    setTimeout(() => {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height); // Desenha o fundo
        tangerine.draw(ctx); // Desenha a tangerina
        corvo.paint(ctx); // Desenha o corvo com animação
        hero.move(boundaries, key); // Move o herói com base nas teclas pressionadas
        hero.draw(ctx); // Desenha o herói

        // Move e desenha os inimigos
        enemies.forEach(e => {
            e.move(boundaries, 0);
            e.draw(ctx);
            if (hero.colide(e)) gameover = true;
        });

        // Lógica para quando o herói ou o corvo colidem com a tangerina
        if (corvo.colide(tangerine) || hero.colide(tangerine)) {
            tangerine.restart();
            hero.grow(10);
            scoreSound.play();
            score += POINTS_FOR_YELLOWBALL;
        }

        // Lógica para quando o corvo colide com o herói
        if (corvo.colide(hero)) {
            hero.shrink(10);
            corvo.moveRandomly(boundaries);
            score += POINTS_FOR_CORVO;
            corvoSound.play();
        }

        // Lógica para o fim de jogo
        if (gameover) {
            displayGameOverMessage();
            gameoverSound.play();
            themeSound.pause();
            cancelAnimationFrame(anime);
        } else {
            updateScoreTable();
            anime = requestAnimationFrame(loop); // Continua o loop do jogo
        }

    }, 1000 / FRAMES);
};

export { init }; // Exporta a função init para ser usada em outro lugar
