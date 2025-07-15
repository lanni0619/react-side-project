import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import { useEffect, useReducer } from "react";

const jsonServer = "http://localhost:8000/questions";
const initialState = {
    questions: [],
    status: "loading", // error, ready, active, finished
};
function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return {
                ...state,
                questions: action.payload,
                status: "ready",
            };
        case "dataFailed":
            return {
                ...state,
                status: "error",
            };
        case "start":
            return {
                ...state,
                status: "active",
            };
        default:
            throw new Error("Action is unknown");
    }
}

export default function App() {
    const [{ questions, status }, dispatch] = useReducer(reducer, initialState);
    const numQuestions = questions.length;
    useEffect(function () {
        fetch(jsonServer)
            .then((res) => res.json())
            .then((data) => dispatch({ type: "dataReceived", payload: data }))
            .catch((error) => dispatch({ type: "dataFailed" }));
    }, []);

    return (
        <div className="app">
            <Header />
            <Main>
                {status === "loading" && <Loader />}
                {status === "error" && <Error />}
                {status === "ready" && (
                    <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                    />
                )}
                {status === "active" && <Question />}
            </Main>
        </div>
    );
}
