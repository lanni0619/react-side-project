import { useQuiz } from "../contexts/QuizContext";

function FinishScreen() {
    const { points, totalScore, highscore, dispatch } = useQuiz();
    const percentage = (points / totalScore) * 100;
    let emoji;
    if (percentage === 100) emoji = "🥇";
    else if (percentage >= 80) emoji = "🥈";
    else if (percentage >= 60) emoji = "🥉";
    else emoji = "👎";
    return (
        <>
            <p className="result">
                <span>{emoji}</span>
                You scored <strong>{points}</strong> out of {totalScore} ({Math.ceil(percentage)}%)
            </p>
            <p className="highscore">(Highscore: {highscore} points)</p>
            <button className="btn btn-ui" onClick={() => dispatch({ type: "restart" })}>
                Restart
            </button>
        </>
    );
}

export default FinishScreen;
