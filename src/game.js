import { keyPress, key } from "./keyboard";
import Circle from "./geometries/Circle";
import Smile from "./Smile";
import Enemy from "./Enemy";
import Hero from "./Hero";
import hud from "./hud";
import { loadAudio, loadImage } from "./loaderAssets";

const FRAMES = 70;
const smile = new Smile(300, 200, 20, 5, 'yellow');
const hero = new Hero(300, 200, 8, 82, 89, FRAMES);
const tangerine = new Circle(200, 200, 10, 5, 'orange');
const POINTS_FOR_YELLOWBALL = 50;
const POINTS_FOR_SMILE = 10;
let enemies = Array.from({ length: 3 });
let ctx;
let canvas;
let gameover;
let boundaries;
let score;
let anime;
let smileSound;
let scoreSound;
let themeSound;
let gameoverSound;
let backgroundImg;

const init = async () => {
    score = 0;
    gameover = false;

    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    backgroundImg = await loadImage('img/background_game_dragon.png');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hud(ctx, `Carregando... `, "#f00", canvas.height / 2 - 50);


 
    scoreSound = await loadAudio('sounds/score.mp3');
    scoreSound.volume = .5;
    gameoverSound = await loadAudio('sounds/gameover.mp3');
    gameoverSound.volume = .2;
    themeSound = await loadAudio('sounds/theme.mp3');
    themeSound.volume = .3;
    themeSound.loop = true;
    smileSound = await loadAudio('sounds/smile.mp3'); 
    smileSound.volume = .5;

    boundaries = {
        width: canvas.width,
        height: canvas.height
    };

    enemies = enemies.map(() => new Enemy(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        10,
        5,
        'blue'
    ));

    tangerine.restart = () => {
        tangerine.x = tangerine.size + Math.random() * (boundaries.width - tangerine.size);
    };

    keyPress(window);
    start();
};

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

const updateScoreTable = () => {
    const scoreTable = document.getElementById('score');
    scoreTable.textContent = `Score: ${score}`;
};

const displayGameOverMessage = () => {
    const gameOverElement = document.getElementById('game-over-message');
    gameOverElement.textContent = `GAME OVER!! Você fez ${score} pontos`;

    const restartElement = document.getElementById('restart-message');
    restartElement.textContent = `Pressione F5 para reiniciar!`;
};

const loop = () => {
    setTimeout(() => {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        tangerine.draw(ctx);
        smile.paint(ctx);

        hero.move(boundaries, key);
        hero.draw(ctx);

        enemies.forEach(e => {
            e.move(boundaries, 0);
            e.draw(ctx);
            gameover = !gameover
                ? hero.colide(e)
                : true;
        });

        if (smile.colide(tangerine) || hero.colide(tangerine)) {
            tangerine.restart();
            hero.grow(10);
            console.clear();
            scoreSound.play();
            score += POINTS_FOR_YELLOWBALL;
            console.count("PONTOS", score);
        }

        if (smile.colide(hero)) {
            hero.shrink(10);
            smile.moveRandomly(boundaries);
            console.clear();
            score += POINTS_FOR_SMILE;
            smileSound.play(); // Toca o som ao coletar o Smile
            console.count("PONTOS", score);
        }

        if (gameover) {
            displayGameOverMessage();
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
