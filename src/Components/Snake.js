import { useEffect } from "react";
import { useContext } from "react";
import { DataContext } from "./DataContext";

const Snake = ({ isActive, isMobile }) => {
    const { updateGame } = useContext(DataContext);
    useEffect(() => {
        if (isActive && !isMobile) {
            const container = document.querySelector("#snake-game");
            const startBtnSnake = document.querySelector("#start-btn-snake");
            const sound = document.querySelector("#eat");
            const playAgainBtn = document.querySelector("#snake-game-over button");
            const snakeModal = document.querySelector(".snake-modal");
            let speed = 3;
            let score = 0;
            const boxes = [];
            const snake = [];
            let interval = 0;
            let dir = "right";
            const dirVal = { right: 0, down: 90, left: 180, up: 270 };
            let totalRows = 0;
            let totalCols = 0;
            let difficultyChosen = null;
            const height = window.innerHeight;
            const width = window.innerWidth;
            const size = Math.min(height, width) * 0.9 / 15;
            container.style.setProperty("--size", size + "px");
            console.log(size);

            playAgainBtn.addEventListener("click", () => {
                startBtnSnake.parentElement.parentElement.classList.add('active');
                startBtnSnake.parentElement.parentElement.classList.remove('game-over');
                container.innerHTML = "";
                boxes.length = 0;
                snake.length = 0;
                score = 0;
                dir = "right";
                document.querySelector("#score").textContent = score;
            });

            function createGame() {
                totalRows = Math.floor(container.clientHeight / size);
                totalCols = Math.floor(container.clientWidth / size);
                console.log(totalRows, totalCols);
                container.style.height = `${totalRows * size}px`;
                container.style.width = `${totalCols * size}px`;
                for (let i = 0; i < totalRows; i++) {
                    const row = [];
                    for (let j = 0; j < totalCols; j++) {
                        const box = document.createElement("div");
                        if (i == 6 && j < 10 && j > 6) {
                            box.classList.add("snake");
                            snake.unshift(box);
                        }

                        if (i == 6 && j == 10) {
                            box.classList.add("head-right", "snake");
                            snake.unshift(box);
                        }
                        const apple = document.createElement("i");
                        apple.classList.add("fas", "fa-apple-whole");
                        box.appendChild(apple);
                        box.classList.add("box");
                        container.appendChild(box);
                        row.push(box);
                    }
                    boxes.push(row);
                }


            }

            function moveSnake() {
                const head = snake[0];
                const row = Math.floor(Array.from(head.parentNode.children).indexOf(head) / totalCols);
                const col = boxes[row].indexOf(head);
                let next = 0;

                switch (dir) {
                    case "right":
                        next = boxes[row] ? boxes[row][col + 1] : null;
                        break;
                    case "left":
                        next = boxes[row] ? boxes[row][col - 1] : null;
                        break;
                    case "up":
                        next = boxes[row - 1] ? boxes[row - 1][col] : null;
                        break;
                    case "down":
                        next = boxes[row + 1] ? boxes[row + 1][col] : null;
                        break;
                    default:
                        break;

                }

                if (!next || next.classList.contains("snake")) {
                    gameOver();
                    return;
                }


                head.classList.remove(`head-${dir}`);
                next.classList.add(`head-${dir}`, "snake")
                snake.unshift(next);
                if (next.classList.contains("apple")) {
                    next.classList.remove("apple");
                    score += 1;
                    sound.volume = 1;
                    sound.play();
                    document.querySelector("#score").textContent = score;
                    createApple();
                    return;
                }
                const last = snake.pop();
                last.classList.remove("snake");
            }

            function startGame() {
                moveSnake();
                interval = setInterval(moveSnake, 100 * (4 - speed));
            }

            function gameOver() {
                clearInterval(interval);
                document.querySelector('#snake-game-over h4 span').textContent = score;
                startBtnSnake.parentElement.parentElement.classList.add("game-over", "active");
                window.removeEventListener("keydown", enterDirection);
                updateGame("snake", { score: score, difficulty: difficultyChosen });
            }

            function createApple() {
                const row = Math.floor(Math.random() * totalRows);
                const col = Math.floor(Math.random() * totalCols);
                const apple = boxes[row][col];
                if (apple.classList.contains("snake")) {
                    createApple();
                    return;
                }

                apple.classList.add("apple");

            }

            function enterDirection(e) {
                if (!document.querySelector("#snake-game")) return;
                if (!e.key.includes("Arrow")) return;
                if (e.key.split("Arrow")[1].toLowerCase() == dir) return;
                const value = e.key.split("Arrow")[1].toLowerCase();
                if ((dirVal[value] - dirVal[dir]) % 180 != 0) {
                    changeDirection(value);
                }
            }

            function changeDirection(value) {
                dir = value;
                const head = snake[0];
                head.classList.forEach((c) => {
                    if (c.includes("head")) {
                        head.classList.remove(c);
                    }
                })
                head.classList.add(`head-${value}`);
                clearInterval(interval);
                startGame();
            }

            const buttonsDifficulty = document.querySelectorAll(".choose-difficulty button");

            buttonsDifficulty.forEach((btn) => {
                btn.addEventListener("click", () => {
                    buttonsDifficulty.forEach((btn) => {
                        btn.classList.remove("selected");
                    })
                    btn.classList.add("selected");
                    difficultyChosen = btn.textContent;
                    speed = difficultyChosen == "Easy" ? 1 : difficultyChosen == "Medium" ? 2 : 3;
                })
            })

            startBtnSnake.addEventListener("click", () => {
                startBtnSnake.parentElement.parentElement.classList.remove('active');
                sound.volume = 0;
                sound.play();
                createGame();
                createApple();
                buttonsDifficulty.forEach((btn) => {
                    btn.classList.remove("selected");
                })
                setTimeout(() => {
                    window.addEventListener("keydown", enterDirection)
                    startGame();
                }, 200);
            })

            window.addEventListener("keydown", (e) => {
                if (!snakeModal.classList.contains("active")) return;
                if (e.key == "Enter" || e.key == " ") {
                    startBtnSnake.click();
                }
            })


        }
    }, [isActive])

    return (
        <div id="snake-container" className={isMobile ? "not-compatible" : ""}>
            {isActive ? (
                !isMobile ? (
                    <>
                        <div className="score">
                            <h2>Score</h2>
                            <p id="score">0</p>
                        </div>
                        <div id="snake-game"></div>
                        <div className="snake-modal active">
                            <div className="start-game">
                                <h1>Welcome to Snake</h1>
                                <div className="choose-difficulty">
                                    <button>Easy</button>
                                    <button>Medium</button>
                                    <button>Hard</button>
                                </div>
                                <p>
                                    Use the
                                    <img src="arrow-keys-2.png" alt="arrow-keys" /> keys to move the snake
                                </p>
                                <button id="start-btn-snake">Start Game</button>
                            </div>
                            <div id="snake-game-over">
                                <h2>Game Over</h2>
                                <h4>Your Score was <span></span></h4>
                                <button >Play Again</button>
                            </div>
                        </div>
                        <audio id="eat" src="eat.mp3"></audio>
                    </>
                ) : (
                    <>
                        <h1>Sorry, This Game is not compatible with mobile devices.</h1>
                        <h1>Go on a pc device to play this game.</h1>
                    </>
                )
            ) : (
                <video src="snake.mp4" autoPlay loop muted ></video>

            )}
        </div>
    )

}


export default Snake;