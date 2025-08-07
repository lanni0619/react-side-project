import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return {
                ...state,
                isLoading: true,
            };
        case "cities/loaded":
            return {
                ...state,
                isLoading: false,
                cities: action.payload,
            };
        case "city/loaded":
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload,
            };
        case "city/created":
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
            };
        case "city/deleted":
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter((city) => city.id !== action.payload),
                currentCity: {},
            };
        case "rejected":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                currentCity: {},
            };
        default:
            throw new Error("Unknown action type");
    }
}

function CitiesProvider({ children }) {
    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState);
    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        async function fetchCities() {
            dispatch({ type: "loading" });
            try {
                const response = await fetch(`${BASE_URL}/cities`);
                const data = await response.json();
                dispatch({ type: "cities/loaded", payload: data });
            } catch (error) {
                alert("There was an error loading data ...");
                const payload = "There was an error loading data ...";
                dispatch({ type: "rejected", payload });
            }
        }
        fetchCities();
    }, []);

    const getCity = useCallback(
        async function getCity(id) {
            try {
                if (Number(id) !== currentCity.id) return;
                dispatch({ type: "loading" });
                const response = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await response.json();
                dispatch({ type: "city/loaded", payload: data });
            } catch (error) {
                alert("There was an error loading data ...");
                const payload = "There was an error loading data ...";
                dispatch({ type: "rejected", payload });
            }
        },
        [currentCity.id]
    );

    async function createCity(newCity) {
        dispatch({ type: "loading" });
        try {
            const response = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            dispatch({ type: "city/created", payload: data });
        } catch (error) {
            alert("There was an error loading data ...");
            const payload = "There was an error loading data ...";
            dispatch({ type: "rejected", payload });
        }
    }

    async function deleteCity(id) {
        dispatch({ type: "loading" });
        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });
            dispatch({ type: "city/deleted", payload: id });
        } catch (error) {
            alert("There was an error loading data ...");
            const payload = "There was an error loading data ...";
            dispatch({ type: "rejected", payload });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                getCity,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error("CitiesContext was used outside of the CitiesProvider");
    return context;
}

export { CitiesProvider, useCities };
