import { useEffect } from "react";

function Timer({ secondsRemaining, dispatch }) {
    const mins = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    useEffect(
        function () {
            const intervalId = setInterval(() => {
                dispatch({ type: "tick" });
            }, 1000);
            return () => clearInterval(intervalId);
        },
        [dispatch]
    );
    return (
        <div className="timer">
            {mins < 10 && "0"}
            {mins}:{seconds < 10 && "0"}
            {seconds}
        </div>
    );
}

export default Timer
