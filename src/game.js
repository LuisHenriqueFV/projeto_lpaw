import { keyPress, key } from "./keyboard";
import Circle from "./geometries/Circle";
import Smile from "./Smile";
import Enemy from "./Enemy";
import Hero from "./Hero";
import hud from "./hud";
import { loadAudio, loadImage } from "./loaderAssets";

const FRAMES = 60;
const groundY = 370; // Define a linha do chão
const smile = new Smile(300, groundY, 20, 5, 'yellow');
const hero = new Hero(300, groundY, 4, 82, 89, FRAMES);
const tangerine = new Circle(200, groundY, 10, 5, 'orange');
let enemies = Array.from({ length: 3 });
let ctx;
let canvas;
let gameover;
let boundaries;
let score;
let anime;

let scoreSound;
let themeSound;
let gameoverSound;
let backgroundImg; // Nova variável para a imagem de fundo

const init = async () => {
    score = 0;
    gameover = false;

    console.log("Initialize Canvas");
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    // Carregar a imagem de fundo
    backgroundImg = await loadImage('img/background_game.png');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hud(ctx, `Carregando... `, "#f00", canvas.height / 2 - 50);

    scoreSound = await loadAudio('sounds/score.ogg');
    scoreSound.volume = .5;
    gameoverSound = await loadAudio('sounds/gameover.wav');
    gameoverSound.volume = .5;
    themeSound = await loadAudio('sounds/theme.mp3');
    themeSound.volume = .3;
    themeSound.loop = true;

    boundaries = {
        width: canvas.width,
        height: canvas.height
    };

    enemies = enemies.map(() => new Enemy(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        10,
        5,
        'red'
    ));

    tangerine.restart = () => {
        tangerine.x = tangerine.size + Math.random() * (boundaries.width - tangerine.size);
        tangerine.y = groundY; // Posicionar no chão
    };

    keyPress(window);
    start();
};

const start = () => {
    let startInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hud(ctx, `Pressione ENTER para começar!! `, "#0f0", canvas.height / 2 - 50);
        console.log(key);
        if (key == 'Enter') {
            themeSound.play();
            clearInterval(startInterval);
            loop();
        }
    }, 1000);
};

const loop = () => {
    setTimeout(() => {
        // Desenhar o fundo
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        // Desenhar o resto dos elementos
        tangerine.draw(ctx);
        smile.paint(ctx); // Atualizar a chamada para o método paint

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
            hero.grow(10); // Aumenta o tamanho do herói em 10 unidades
            console.clear();
            scoreSound.play();
            console.count("PONTOS", ++score);
        }

        if (smile.colide(hero)) {
            hero.shrink(10); // Reduz o tamanho do herói em 10 unidades
            smile.moveRandomly(boundaries); // Move o Smile para uma nova posição aleatória
            console.clear();
            console.count("PONTOS", ++score);
        }

        if (gameover) {
            console.error('DEAD!!!');
            hud(ctx, `Pontos: ${score}. GAME OVER !! `, "#f00");
            hud(ctx, `Pressione F5 para reiniciar!`, "#f00", canvas.height / 2 - 50);
            gameoverSound.play();
            themeSound.pause();
            cancelAnimationFrame(anime);
        } else {
            hud(ctx, `Pontos: ${score}`);
            anime = requestAnimationFrame(loop);
        }

    }, 1000 / FRAMES);
};
export { init };
