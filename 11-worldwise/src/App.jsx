import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Product from "./pages/Product";
import Homepage from "./pages/Homepage";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

const BASE_URL = "http://localhost:8000/cities";

function App() {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="product" element={<Product />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="login" element={<Login />} />
                    <Route path="app" element={<AppLayout />}>
                        <Route index element={<Navigate replace to="cities" />} />
                        <Route path="cities" element={<CityList cities={cities} isLoading={isLoading} />} />
                        <Route path="cities/:id" element={<City />} />
                        <Route path="countries" element={<CountryList cities={cities} isLoading={isLoading} />} />
                        <Route path="form" element={<Form />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
