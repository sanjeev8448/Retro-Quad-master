import { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { DataContext } from "./DataContext";

const Pacman = ({ isActive, isMobile }) => {
    const { updateGame } = useContext(DataContext);

    const pacMan = useRef({
        x: 500,
        y: 0,
        direction: 'right',
        speed: 3,
        score: 0,
        lives: 3,
    })

    useEffect(() => {

        if (isActive && !isMobile) {
            const pacContainer = document.getElementById("pacman-game");
            const startBtn = pacContainer.querySelector('.start-btn');
            const pacGame = pacContainer.querySelector(".game");
            const pacScore = pacContainer.querySelector("#pacman-score");
            const pacLives = pacContainer.querySelector("#pacman-lives span");
            const pacMapElement = pacContainer.querySelector(".pac-map");
            const extraData = pacContainer.querySelector("#extra-data");
            const playAgainBtn = pacContainer.querySelector("#play-again-pac");
            const pac = pacContainer.querySelector(".pac");
            let firstGame = true;
            let pacStarted = false;
            let siren = document.getElementById("siren");


            const dotsArray = [];
            const wallsArray = [{
                r1: 3, r2: 11, c1: 3, c2: 3
            }, {
                r1: 3, r2: 3, c1: 3, c2: 9
            }, {
                r1: 3, r2: 7, c1: 9, c2: 9
            }, {
                r1: 7, r2: 7, c1: 3, c2: 9
            }, {
                r1: 3, r2: 11, c1: 13, c2: 13
            }, {
                r1: 3, r2: 3, c1: 13, c2: 19
            }, {
                r1: 3, r2: 11, c1: 19, c2: 19
            }, {
                r1: 7, r2: 7, c1: 13, c2: 19
            }, //create C
            {
                r1: 3, r2: 3, c1: 23, c2: 29
            }, {
                r1: 3, r2: 11, c1: 23, c2: 23
            }, {
                r1: 11, r2: 11, c1: 23, c2: 29
            }, //create A
            ]
            const monstersArray = [{
                x: 0,
                y: 0,
                direction: 'right',
                speed: 2,
                color: 'red'
            }, {
                x: window.innerWidth - 50,
                y: 0,
                direction: 'down',
                speed: 2,
                color: 'blue'
            }, {
                x: window.innerWidth - 50,
                y: pacGame.offsetHeight - 50,
                direction: 'left',
                speed: 2,
                color: 'green'
            }, {
                x: 0,
                y: pacGame.offsetHeight - 50,
                direction: 'up',
                speed: 2,
                color: 'yellow'
            }]
            let monsters = [];
            let request = 0;

            playAgainBtn.addEventListener('click', () => {
                firstGame = false;
                pacGame.style.display = 'none';
                startBtn.style.display = 'block';
                pacScore.innerHTML = 0;
                pacMan.current.score = 0;
                pacMan.current.lives = 3;
                pacMan.current.x = 500;
                pacMan.current.y = 0;
                pacMan.current.direction = 'right';
                pacMan.current.speed = 3;
                extraData.style.display = 'none';
                extraData.classList.remove('game-over');
                pacGame.style.width = '100%';
                pacGame.style.height = '90%';
                monsters = [];
                const heart = document.createElement('i');
                heart.classList.add('fas', 'fa-heart');
                pacLives.innerHTML = '';
                pacGame.style.pointerEvents = 'auto';

                for (let i = 0; i < 3; i++) {
                    pacLives.appendChild(heart.cloneNode(true));
                }

                while (pacMapElement.firstChild) {
                    pacMapElement.removeChild(pacMapElement.firstChild);
                }
                pacMapElement.appendChild(pac);

            })


            startBtn.addEventListener('click', () => {
                startBtn.style.display = 'none';
                pacGame.style.display = 'block';
                extraData.style.display = "flex";
                init();
                siren.play();
                siren.setAttribute('loop', 'true');
                pacStarted = true
                if (firstGame)
                    animatePac();
            })

            function init() {
                console.log(pacMapElement.offsetWidth, pacMapElement.offsetHeight)
                const rowsCount = Math.floor(pacMapElement.offsetHeight / 50);
                const colCount = Math.floor(pacMapElement.offsetWidth / 50);
                pacGame.style.width = colCount * 50 + 'px';
                pacGame.style.height = rowsCount * 50 + 'px';

                const pacMap = new Array(rowsCount).fill(0).map(() => new Array(colCount).fill(0))

                pacMap.forEach((row, rowIndex) => {
                    const rowElement = document.createElement('div');
                    rowElement.classList.add('pac-row');

                    row.forEach((col, colIndex) => {
                        const colElement = document.createElement('div');
                        colElement.classList.add('pac-col');
                        rowElement.appendChild(colElement);
                    })

                    pacMapElement.prepend(rowElement);
                })


                createWalls();
                createDots();
                createMonsters();

            }

            function animatePac() {
                request = requestAnimationFrame(animatePac);
                pac.style.left = pacMan.current.x + 'px';
                pac.style.top = pacMan.current.y + 'px';
                switch (pacMan.current.direction) {
                    case 'right':
                        if (pacMan.current.x + pac.offsetWidth < pacGame.offsetWidth && canMoveOrTurn('right'))
                            pacMan.current.x += pacMan.current.speed;
                        pac.style.transform = 'rotate(0deg)';
                        break;
                    case 'left':
                        if (pacMan.current.x > 0 && canMoveOrTurn('left'))
                            pacMan.current.x -= pacMan.current.speed;
                        pac.style.transform = 'rotate(180deg)';
                        break;
                    case 'up':
                        if (pacMan.current.y > 0 && canMoveOrTurn('up'))
                            pacMan.current.y -= pacMan.current.speed;
                        pac.style.transform = 'rotate(270deg)';
                        break;
                    case 'down':
                        if (pacMan.current.y + pac.offsetHeight < pacGame.offsetHeight && canMoveOrTurn('down'))
                            pacMan.current.y += pacMan.current.speed;
                        pac.style.transform = 'rotate(90deg)';
                        break;

                    default:
                        break;

                }

                for (let dot of dotsArray) {
                    const dotLeft = dot.offsetLeft + dot.offsetWidth / 2;
                    const dotTop = dot.offsetTop + dot.offsetHeight / 2;
                    if (pacMan.current.x <= dotLeft && pacMan.current.x + pac.offsetWidth >= dotLeft && pacMan.current.y <= dotTop && pacMan.current.y + pac.offsetHeight >= dotTop) {
                        dot.classList.remove('dot');
                        dotsArray.splice(dotsArray.indexOf(dot), 1);
                        pacMan.current.score += 10;
                        pacScore.innerText = `Score: ${pacMan.current.score}`;
                    }
                }

                monstersArray.forEach((monster, index) => {
                    switch (monster.direction) {
                        case 'right':
                            if (monster.x + 50 < pacGame.offsetWidth) {
                                monsters[index].querySelectorAll(".eye-ball").forEach(ball => {
                                    ball.style.left = '100%';
                                    ball.style.top = '50%';
                                    ball.style.transform = 'translate(-100%, -50%)';
                                })

                                monster.x += monster.speed;
                                monsterOnBorder(monster);
                            } else {
                                changeMonsterDirection(monster);
                            }

                            break;
                        case 'left':
                            if (monster.x > 0) {
                                monsters[index].querySelectorAll(".eye-ball").forEach(ball => {
                                    ball.style.left = '0%';
                                    ball.style.top = '50%';
                                    ball.style.transform = 'translate(0%, -50%)';
                                })
                                monster.x -= monster.speed;
                                monsterOnBorder(monster);
                            } else {
                                changeMonsterDirection(monster)
                            }

                            break;
                        case 'up':
                            if (monster.y > 0) {
                                monsters[index].querySelectorAll(".eye-ball").forEach(ball => {
                                    ball.style.left = '50%';
                                    ball.style.top = '0%';
                                    ball.style.transform = 'translate(-50%, 0%)';
                                })

                                monster.y -= monster.speed;
                                monsterOnBorder(monster);
                            } else {
                                changeMonsterDirection(monster)
                            }

                            break;
                        case 'down':
                            if (monster.y + 50 < pacGame.offsetHeight) {
                                monsters[index].querySelectorAll(".eye-ball").forEach(ball => {
                                    ball.style.left = '50%';
                                    ball.style.top = '100%';
                                    ball.style.transform = 'translate(-50%, -100%)';
                                })
                                monster.y += monster.speed;
                                monsterOnBorder(monster);
                            } else {
                                changeMonsterDirection(monster)
                            }

                            break;
                        default:
                            break;
                    }

                    checkMonsterEatPacman(monster);


                    monsters[index].style.left = monster.x + 'px';
                    monsters[index].style.top = monster.y + 'px';
                })


            }

            function checkMonsterEatPacman(monster) {
                if (monster.x <= pacMan.current.x + pac.offsetWidth && monster.x + monsters[0].offsetWidth >= pacMan.current.x && monster.y <= pacMan.current.y + pac.offsetHeight && monster.y + monsters[0].offsetHeight >= pacMan.current.y) {
                    pacMan.current.lives--;
                    console.log(pacMan.current.lives);
                    pacLives.querySelector("i").classList.add("break")
                    setTimeout(() => {
                        pacLives.querySelector("i")?.remove();
                        pacMan.current.x = 500;
                        pacMan.current.y = 0;
                        pacMan.current.direction = 'right';
                        pac.style.left = pacMan.current.x + 'px';
                        pac.style.top = pacMan.current.y + 'px';
                        pac.style.transform = 'rotate(0deg)';
                        checkGameOver();
                    }, 1000);
                    cancelAnimationFrame(request);



                    pacGame.addEventListener("click", () => {
                        requestAnimationFrame(animatePac);
                    }, { once: true })

                }
            }

            function checkGameOver() {
                if (pacMan.current.lives <= 0) {
                    extraData.classList.add("game-over");
                    pacGame.style.pointerEvents = "none";
                    updateGame("pacman", { score: pacMan.current.score })
                    cancelAnimationFrame(request);
                }
            }

            function monsterOnBorder(monster) {
                const xBorder = monster.x % 50 <= 0 || (monster.x + 0) % 50 <= 0;
                const yBorder = monster.y % 50 <= 0 || (monster.y + 0) % 50 <= 0;
                if (xBorder && yBorder) {
                    changeMonsterDirection(monster);
                }
            }

            function changeMonsterDirection(monster) {
                let leftBox = document.querySelector(`.pac-row:nth-child(${Math.floor(monster.y / 50 + 1)}) .pac-col:nth-child(${Math.floor(monster.x / 50)})`);
                let rightBox = document.querySelector(`.pac-row:nth-child(${Math.floor(monster.y / 50 + 1)}) .pac-col:nth-child(${Math.floor(monster.x / 50 + 2)})`);
                let upBox = document.querySelector(`.pac-row:nth-child(${Math.floor(monster.y / 50)}) .pac-col:nth-child(${Math.floor(monster.x / 50 + 1)})`);
                let downBox = document.querySelector(`.pac-row:nth-child(${Math.floor(monster.y / 50 + 2)}) .pac-col:nth-child(${Math.floor(monster.x / 50 + 1)})`);
                if (monster.direction == "left") {
                    leftBox = leftBox?.nextElementSibling;
                    rightBox = rightBox?.previousElementSibling;
                    upBox = upBox?.nextElementSibling;
                    downBox = downBox?.nextElementSibling;
                }

                const leftWall = leftBox?.classList.contains("wall");
                const rightWall = rightBox?.classList.contains("wall");
                const upWall = upBox?.classList.contains("wall");
                const downWall = downBox?.classList.contains("wall");
                const options = [];

                if (!leftWall) {
                    options.push('left');
                }
                if (!rightWall) {
                    options.push('right');
                }
                if (!upWall) {
                    options.push('up');
                }
                if (!downWall) {
                    options.push('down');
                }

                const options2 = Array.from(options);
                if (monster.x < pacMan.current.x) {
                    // remove left from options2
                    options2.splice(options2.indexOf('left'), 1);
                }
                if (monster.x > pacMan.current.x) {
                    // remove right from options2
                    options2.splice(options2.indexOf('right'), 1);
                }

                if (monster.y < pacMan.current.y) {
                    // remove up from options2
                    options2.splice(options2.indexOf('up'), 1);
                }

                if (monster.y > pacMan.current.y) {
                    // remove down from options2
                    options2.splice(options2.indexOf('down'), 1);
                }


                const randDir = Math.floor(Math.random() * options2.length);
                monster.direction = options2[randDir] || options[Math.floor(Math.random() * options.length)];

            }

            function createWalls() {
                wallsArray.forEach(wall => {
                    if (wall.r1 === wall.r2) {
                        for (let i = wall.c1; i <= wall.c2; i++) {
                            const box = document.querySelector(`.pac-row:nth-child(${wall.r1}) .pac-col:nth-child(${i})`);
                            box.classList.add('wall');
                        }
                    } else {
                        for (let i = wall.r1; i <= wall.r2; i++) {
                            const box = document.querySelector(`.pac-row:nth-child(${i}) .pac-col:nth-child(${wall.c1})`);
                            box.classList.add('wall');
                        }
                    }
                })

                const allWalls = document.querySelectorAll('.wall');

                allWalls.forEach(wall => {
                    const leftWall = wall.previousElementSibling?.classList.contains("wall");
                    const rightWall = wall.nextElementSibling?.classList.contains("wall");
                    const index = Array.from(wall.parentElement.children).indexOf(wall);
                    const upWall = wall.parentElement.previousElementSibling?.children[index]?.classList.contains("wall");
                    const downWall = wall.parentElement.nextElementSibling?.children[index]?.classList.contains("wall");

                    if (leftWall) {
                        wall.style.borderLeft = 'none';
                    }

                    if (rightWall) {
                        wall.style.borderRight = 'none';
                    }

                    if (upWall) {
                        wall.style.borderTop = 'none';
                    }

                    if (downWall) {
                        wall.style.borderBottom = 'none';
                    }

                    if (leftWall && !upWall) {
                        wall.style.borderTopLeftRadius = '50%';
                    }

                    if (!leftWall && downWall) {
                        wall.style.borderBottomLeftRadius = '50%';
                    }

                    if (!rightWall && upWall) {
                        wall.style.borderTopRightRadius = '50%';
                    }

                    if (rightWall && !downWall) {
                        wall.style.borderBottomRightRadius = '50%';
                    }




                })
            }

            function createDots() {
                const columns = document.querySelectorAll(".pac-col");
                columns.forEach((col, index) => {
                    if (Math.random() > 0.5 && !col.classList.contains("wall")) {
                        col.classList.add('dot');
                        dotsArray.push(col);
                    }
                })
            }

            function createMonsters() {
                monstersArray[2].y = pacGame.offsetHeight - 50;
                monstersArray[3].y = pacGame.offsetHeight - 50;
                monstersArray[1].x = pacGame.offsetWidth - 50;
                monstersArray[2].x = pacGame.offsetWidth - 50;

                for (const element of monstersArray) {
                    const monster = document.createElement('div');
                    monster.classList.add('monster');
                    monster.style.left = element.x + 'px';
                    monster.style.top = element.y + 'px';
                    monster.style.backgroundColor = element.color;
                    monster.style.transform = `rotate(${element.direction}deg)`;

                    //adding eyes, eyeball and mouth
                    const eye = document.createElement('div');
                    const eyeBall = document.createElement('div');
                    eyeBall.classList.add('eye-ball');
                    eye.appendChild(eyeBall);
                    eye.classList.add('eye');
                    const eye2 = eye.cloneNode(true);
                    const mouth = document.createElement('div');
                    monster.appendChild(eye);
                    monster.appendChild(eye2);
                    mouth.classList.add('monster-mouth');
                    monster.appendChild(mouth);
                    pacGame.children[0].appendChild(monster);
                    monsters.push(monster);
                }
            }

            window.addEventListener('keydown', (e) => {
                if (!pacContainer.querySelector(".game") || !pacStarted) return;
                console.log("pressed");
                switch (e.key) {
                    case 'ArrowRight':
                        if (canMoveOrTurn('right'))
                            pacMan.current.direction = 'right';
                        break;
                    case 'ArrowLeft':
                        if (canMoveOrTurn('left'))
                            pacMan.current.direction = 'left';
                        break;
                    case 'ArrowUp':
                        if (canMoveOrTurn('up'))
                            pacMan.current.direction = 'up';
                        break;
                    case 'ArrowDown':
                        if (canMoveOrTurn('down'))
                            pacMan.current.direction = 'down';
                        break;

                    default:
                        break;
                }
            }
            )

            document.querySelector("#pacman-game .fa-times").addEventListener('click', () => {
                cancelAnimationFrame(request);
            })

            function canMoveOrTurn(direction) {
                const pac = document.querySelector(".pac");
                const pacMap = document.querySelector(".pac-map");
                const pacLeft = pacMan.current.x + pacMap.offsetLeft;
                const pacTop = pacMan.current.y + pacMap.offsetTop;
                const pacRight = pacLeft + pac.offsetWidth;
                const pacBottom = pacTop + pac.offsetHeight;
                switch (direction) {
                    case 'right':
                        const rightBox = document.elementFromPoint(pacRight + pacMan.current.speed, pacTop + pac.offsetHeight);
                        const rightBox2 = document.elementFromPoint(pacRight + pacMan.current.speed, pacTop);
                        if (rightBox?.classList.contains("wall") || rightBox2?.classList.contains("wall")) {
                            return false;
                        }
                        break;
                    case 'left':
                        const leftBox = document.elementFromPoint(pacLeft - pacMan.current.speed, pacTop + pac.offsetHeight);
                        const leftBox2 = document.elementFromPoint(pacLeft - pacMan.current.speed, pacTop);

                        if (leftBox?.classList.contains("wall") || leftBox2?.classList.contains("wall")) {
                            return false;
                        }
                        break;
                    case 'up':
                        const upBox = document.elementFromPoint(pacLeft + pac.offsetWidth, pacTop - pacMan.current.speed);
                        const upBox2 = document.elementFromPoint(pacLeft, pacTop - pacMan.current.speed);


                        if (upBox?.classList.contains("wall") || upBox2?.classList.contains("wall")) {
                            return false;
                        }
                        break;
                    case 'down':
                        const downBox = document.elementFromPoint(pacLeft + pac.offsetWidth, pacBottom + pacMan.current.speed);
                        const downBox2 = document.elementFromPoint(pacLeft, pacBottom + pacMan.current.speed);
                        if (downBox?.classList.contains("wall") || downBox2?.classList.contains("wall")) {
                            return false;
                        }
                        break;

                    default:
                        break;
                }
                return true;
            }



        }

    }, [isActive])

    return (
        <div id="pacman-game" className={isMobile ? "not-compatible" : ""}>
            {isActive ? (
                !isMobile ? (
                    <>
                        <div className="game">
                            <div className="pac-map">
                                <div className="pac">
                                    <div className="pac-mouth">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="extra-data">
                            <div id="pacman-score">Score : 0</div>
                            <div id="pacman-lives">Lives: <span><i className='fas fa-heart'></i><i className='fas fa-heart'></i><i className='fas fa-heart'></i></span></div>
                            <div id="play-again-pac">Play Again</div>
                        </div>
                        <div className="start-btn">Start</div>
                        <audio id="siren" src="./siren.mp3"></audio>
                    </>
                ) : (
                    <>
                        <h1>Sorry, This Game is not compatible with mobile devices.</h1>
                        <h1>Go on a pc device to play this game.</h1>
                    </>
                )
            ) : (
                <video src="pacman.mp4" autoPlay loop muted></video>

            )}
        </div>
    )

}

export default Pacman;