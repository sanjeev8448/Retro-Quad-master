import { useContext, useEffect } from "react";
import { DataContext } from "./DataContext";

const Sudoku = ({ isActive, isMobile }) => {
    const { updateGame } = useContext(DataContext);
    useEffect(() => {
        if (isActive && !isMobile) {
            const container = document.querySelector('#sudoku');
            const sudoku = [];
            const congratsSound = document.getElementById('congrats');
            let difficulty = null;

            function createGrid() {
                for (let i = 0; i < 9; i++) {
                    const row = document.createElement('div');
                    row.classList.add('row');
                    container.appendChild(row);
                    const rowVal = [];
                    for (let j = 0; j < 9; j++) {
                        const box = document.createElement('div');
                        box.classList.add('box');
                        row.appendChild(box);
                        rowVal.push('.');
                    }
                    sudoku.push(rowVal);
                }
            }

            function initializePuzzle() {
                createGrid();
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                for (let i = 0; i < 9; i++) {
                    const randNo = Math.floor(Math.random() * numbers.length);
                    sudoku[0][i] = numbers[randNo];
                    numbers.splice(randNo, 1);
                }

                sudokuSolver();
                const boxesAll = document.querySelectorAll('.box');

                boxesAll.forEach((box, index) => {
                    const i = Math.floor(index / 9);
                    const j = index % 9;
                    if (i > 8 || j > 8 || i < 0 || j < 0) return;
                    if (sudoku[i][j] !== '.') {
                        box.innerHTML = sudoku[i][j];
                    }
                })

            }

            function sudokuSolver() {
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (sudoku[i][j] == '.') {
                            for (let k = 1; k <= 9; k++) {
                                if (isValid(i, j, k)) {
                                    sudoku[i][j] = k;
                                    if (sudokuSolver()) {
                                        return true;
                                    } else {
                                        sudoku[i][j] = '.';
                                    }
                                }
                            }
                            return false;
                        }
                    }
                }
                return true;
            }

            function isValid(row, col, num, arrName = sudoku) {
                for (let i = 0; i < 9; i++) {
                    if (arrName[row][i] == num && i != col) {
                        return false;
                    }
                    if (arrName[i][col] == num && i != row) {
                        return false;
                    }
                }
                const rowStart = row - row % 3;
                const colStart = col - col % 3;

                for (let i = rowStart; i < rowStart + 3; i++) {
                    for (let j = colStart; j < colStart + 3; j++) {
                        if ((i != row || j != col) && sudoku[i][j] == num) {
                            return false;
                        }
                    }
                }

                return true;
            }

            initializePuzzle();

            const buttons = document.querySelectorAll('#sudoku-container .difficulty button');

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    button.parentNode.style.transform = `scale(0)`;
                    document.querySelector('#difficulty-chosen').innerHTML = button.innerHTML;
                    document.querySelector('#difficulty-chosen').classList.add(button.innerHTML);
                    setTimeout(() => {
                        button.parentNode.style.display = "none"
                        document.querySelector('.timer').style.display = "block"
                        stopWatch(0, 0, 0);
                        document.querySelector('#sudoku').classList.add('active');

                    }, 500)

                    changeDifficulty(button);
                })
            })

            function changeDifficulty(button) {
                difficulty = button.innerHTML;
                if (difficulty == "Easy") {
                    removeNumbers(40);
                } else if (difficulty == "Medium") {
                    removeNumbers(50);
                } else {
                    removeNumbers(60);
                }

                document.querySelectorAll('.box.new').forEach(box => {
                    const span = document.createElement('span');
                    box.appendChild(span);
                })

                const pencils = document.querySelectorAll('.box span');


                pencils.forEach(pencil => {
                    const icon = document.createElement("i");
                    icon.classList.add("fa-solid", "fa-pencil");
                    pencil.appendChild(icon);
                    pencil.addEventListener('click', () => {

                        pencil.parentNode.classList.toggle('pencil');
                        checkCompletion();
                        if (pencil.parentNode.textContent.length > 1) {
                            const parent = pencil.parentNode;
                            pencil.parentNode.textContent = pencil.parentNode.textContent[0];
                            parent.appendChild(pencil);
                        }
                    })
                })

                enterValue();


            }

            function removeNumbers(count) {
                const boxesAll = document.querySelectorAll('.box');
                for (let i = 0; i < 81; i++) {
                    if (boxesAll[i].innerText != "") {
                        const value = Math.random() > 0.5 ? 0 : 1;
                        if (value) {
                            boxesAll[i].innerText = "";
                            boxesAll[i].classList.add("new");
                            count--;
                        }
                        if (count == 0) {
                            break;
                        }
                    }

                }

                if (count > 0) {
                    removeNumbers(count);
                }



            }

            let boxesAll = document.querySelectorAll('.box');

            boxesAll.forEach(box => {
                box.addEventListener('click', () => {
                    if (box.innerHTML == "" || box.classList.contains("new")) {
                        boxesAll.forEach(box => {
                            box.classList.remove('selected');

                        })
                        box.classList.add('selected');
                    }
                }
                )
            })

            function enterValue() {
                window.addEventListener('keydown', (e) => {
                    if (!document.querySelector("#sudoku")) return;
                    const selected = document.querySelector('.selected');
                    const pencil = document.querySelector('.selected.pencil');
                    const span = selected?.lastElementChild;
                    // console.log(selected?.lastElementChild)
                    if (selected) {
                        if (!pencil) {
                            if (e.key >= 1 && e.key <= 9) {
                                selected.innerHTML = e.key;
                                selected.appendChild(span);
                                checkCompletion();

                            } else if (e.key == "Backspace") {
                                selected.innerHTML = "";
                                document.querySelector('#sudoku').classList.remove('error');
                                selected.appendChild(span);
                            }
                        } else {
                            if (e.key >= 1 && e.key <= 9) {
                                selected.innerHTML = selected.textContent.includes(e.key) ? selected.textContent.replace(e.key, "") : selected.textContent + e.key;
                                pencil.appendChild(span);
                                checkCompletion();

                            } else if (e.key == "Backspace") {
                                selected.innerHTML = "";
                                pencil.appendChild(span);
                            }
                        }
                    }


                })
            }

            function checkCompletion() {
                setTimeout(() => {
                    boxesAll = document.querySelectorAll('.box');
                    for (let i = 0; i < 81; i++) {
                        if (boxesAll[i].textContent == "" || boxesAll[i].classList.contains("pencil")) {
                            return;
                        }
                    }

                    const newArr = [];
                    boxesAll.forEach((box, index) => {
                        const row = Math.floor(index / 9);
                        const col = index % 9;
                        if (!newArr[row]) {
                            newArr[row] = [];
                        }
                        newArr[row][col] = box.textContent;
                    })

                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            if (!isValid(i, j, boxesAll[i * 9 + j].textContent, newArr)) {
                                document.querySelector('#sudoku').classList.add("error");
                                return;
                            }
                        }

                    }
                    showResult();
                }, 300);

            }

            function stopWatch(h, m, s) {
                if (s === 60) {
                    s = 0;
                    m += 1;
                }

                if (m == 60) {
                    m = 0;
                    h += 1;
                }
                h = h < 10 ? "0" + h : h;
                m = m < 10 ? "0" + m : m;
                s = s < 10 ? "0" + s : s;

                if (!document.querySelector("#time")) {
                    return;
                }
                document.querySelector('#time').innerHTML = h + ":" + m + ":" + s;
                setTimeout(() => {
                    stopWatch(Number(h), Number(m), Number(s) + 1);
                }, 1000)
            }

            function showResult() {
                const time = document.querySelector('.timer #time').innerHTML;
                const displayTime = document.querySelector('#time-taken');

                document.querySelector('.timer').style.display = "none";
                document.querySelector('#sudoku').classList.remove('active');
                document.querySelector('.result').classList.add('active');
                congratsSound.play();
                congratsSound.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);


                const timeSplit = time.split(":");
                displayTime.innerHTML = timeSplit[0] > 0 ? timeSplit[0] + " hours " : "" + timeSplit[1] > 0 ? timeSplit[1] + " minutes " : "" + timeSplit[2] + " seconds";

                const timeToHistory = timeSplit[0] > 0 ? timeSplit[0] + "hr " : "" + timeSplit[1] > 0 ? timeSplit[1] + "m " : "" + timeSplit[2] + "s";
                updateGame("sudoku", { score: timeToHistory, difficulty: difficulty })

            }

            document.querySelector("#sudoku-container").addEventListener("click", (e) => {
                console.log(e.target, e.target.parentNode);
                if (!e.target.classList.contains("new") && !e.target.parentNode?.classList.contains("new") && !e.target.classList.contains("fa-pencil")) {
                    document.querySelector(".selected")?.classList.remove("selected");
                }
            })

            window.addEventListener('resize', () => {
                changeBoxSize();
            });

            changeBoxSize();

            function changeBoxSize() {
                const height = window.innerHeight;
                const width = window.innerWidth;
                console.log(height, width);
                document.querySelectorAll(".box").forEach(box => {
                    box.style.setProperty("--size", Math.min(height, width) * 4 / 5 / 9 + "px");
                })
            }

        }
    }, [isActive])


    return (
        <div id="sudoku-container" className={isMobile ? "not-compatible" : ""}>
            {isActive ? (
                !isMobile ? (
                    <>
                        <div className="difficulty">
                            <h1>Choose Difficulty</h1>
                            <button className="easy">Easy</button><button className="medium">Medium</button
                            ><button className="hard">Hard</button>
                        </div>
                        <div id="sudoku">
                            <h1 id="difficulty-chosen">Hello</h1>
                        </div>
                        <div className="timer">
                            <h1><i className="far fa-clock"></i><span id="time">00:00</span></h1>
                        </div>
                        <div className="result">
                            <h1><span>🎉</span>Congratulations<span>🎉</span></h1>
                            <h2>You have completed the game in <span id="time-taken"></span></h2>
                        </div>
                        <audio id="congrats" src="./congrats.mp3"></audio>
                    </>
                ) : (
                    <>
                        <h1>Sorry, This Game is not compatible with mobile devices.</h1>
                        <h1>Go on a pc device to play this game.</h1>
                    </>
                )
            ) : (
                <img src="./sudoku2.gif" alt="sudoku gif"></img>

            )}
        </div>
    )

}

export default Sudoku;