import Sudoku from './Sudoku';
import Snake from './Snake';
import Pacman from './Pacman';
import Pong from './Pong';
import { useContext } from 'react';
import { DataContext } from './DataContext';
import { useEffect, useState } from 'react';


const Games = () => {

    const { currGame, changeGame } = useContext(DataContext);
    const [isMobile, setIsMobile] = useState(false);

    function checkMobile() {
        console.log(navigator.userAgent);
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }

    useEffect(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
    }, [isMobile]);

    useEffect(() => {
        const allGames = document.querySelectorAll('#games > div');
        const gamesParent = document.querySelector('#games');
        allGames.forEach(game => {
            const crossBtn = document.createElement("i");
            crossBtn.classList.add("fas", "fa-times");
            crossBtn.addEventListener('click', () => {
                changeGame(-1);
                game.classList.remove('active');
                game.style.width = "100%";
                game.style.height = "100%";
                gamesParent.nextElementSibling.classList.add("active");
                gamesParent.classList.remove("active");
                setTimeout(() => {
                    game.style.zIndex = 1;
                }, 500);
            })
            game.appendChild(crossBtn);
        })

        allGames.forEach((game, index) => {
            game.addEventListener('click', (e) => {
                if (e.target === game.querySelector("i")) return;
                allGames.forEach(game => {
                    game.classList.remove("active")
                    game.style.zIndex = 1;
                })
                game.style.zIndex = 10;
                document.querySelector("#user-credentials").classList.remove("active");
                gamesParent.classList.add("active");
                game.style.width = "100vw";
                game.style.height = "100vh";
                console.log(game.classList);
                game.classList.add('active');
                console.log(game.classList);
                changeGame(index);

            })
        })

    }, [])

    return (
        <div id="games">
            <Sudoku isActive={currGame == "sudoku"} isMobile={isMobile} />
            <Snake isActive={currGame == "snake"} isMobile={isMobile} />
            <Pacman isActive={currGame == "pacman"} isMobile={isMobile} />
            <Pong isActive={currGame == "pong"} isMobile={isMobile} />
        </div>
    )
}


export default Games;