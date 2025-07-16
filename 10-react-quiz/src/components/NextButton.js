function NextButton({ dispatch, answer, index, numQuestions }) {
    if (answer === null) return;
    const isFinal = index === numQuestions - 1;
    return (
        <button
            className="btn btn-ui"
            onClick={() => {
                if(isFinal) {
                    return dispatch({ type: "finish" });
                }
                return dispatch({ type: "nextQuestion" })
            }}
        >
            {isFinal ? "Finish" : "Next"}
        </button>
    );
}

export default NextButton;
