// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";

import Button from "./Button";
import Backbutton from "./Backbutton";
import Message from "./Message";
import Spinner from "./Spinner";

import flagEmojiToPng from "../utils/flagEmojiToPng";
import useUrlPosition from "../hooks/useUrlPosition";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client?`;

function Form() {
    const navigate = useNavigate();
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [lat, lng] = useUrlPosition();
    const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
    const [emoji, setEmoji] = useState("");
    const [geoCodingError, setGeoCodingError] = useState(null);
    const { createCity, isLoading } = useCities();

    useEffect(
        function () {
            if (!lat || !lng) return;
            async function fetchCityData() {
                try {
                    setIsLoadingGeoCoding(true);
                    setGeoCodingError(null);
                    setDate(new Date());
                    const res = await fetch(BASE_URL + `latitude=${lat}&longitude=${lng}`);
                    const data = await res.json();
                    if (!data.countryCode) throw new Error("That doesn't seem to be a city");
                    setCityName(data.city || data.locality || "");
                    setCountry(data.countryName);
                    setEmoji(convertToEmoji(data.countryCode));
                } catch (error) {
                    setGeoCodingError(error.message);
                } finally {
                    setIsLoadingGeoCoding(false);
                }
            }
            fetchCityData();
        },
        [lat, lng]
    );

    async function handleSubmit(e) {
        e.preventDefault();
        if (!cityName || !date) return;

        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: { lat, lng },
        };

        await createCity(newCity);
        navigate("/app/cities");
    }

    if (isLoadingGeoCoding) return <Spinner />;
    if (!lat || !lng) return <Message message={"Start by clicking somewhere on the map"} />;
    if (geoCodingError) return <Message message={geoCodingError} />;

    return (
        <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input id="cityName" onChange={(e) => setCityName(e.target.value)} value={cityName} />
                <span className={styles.flag}>{flagEmojiToPng(emoji)}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker id="date" selected={date} onChange={(date) => setDate(date)} dateFormat="yyyy/MM/dd" />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">add</Button>
                <Backbutton />
            </div>
        </form>
    );
}

export default Form;
