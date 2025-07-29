import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000/cities";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const response = await fetch(BASE_URL);
                const data = await response.json();
                setCities(data);
            } catch (error) {
                alert("There was an error loading data ...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, []);

    async function getCity(id) {
        try {
            setIsLoading(true);
            const response = await fetch(`${BASE_URL}/${id}`);
            const data = await response.json();
            setCurrentCity(data);
        } catch (error) {
            alert("There was an error loading data ...");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                getCity,
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
