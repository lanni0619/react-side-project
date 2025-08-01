import { Link, useNavigate } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));

const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
        .map((char) => String.fromCharCode(char - 127397).toLowerCase())
        .join("");
    return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />;
};

function CityItem({ city }) {
    const { cityName, emoji, date, id, position } = city;
    const { currentCity, deleteCity } = useCities();

    async function handleDeleteCity(e) {
        e.preventDefault();
        await deleteCity(id);
    }

    return (
        <li>
            <Link
                className={`${styles.cityItem} ${currentCity.id === id ? styles["cityItem--active"] : ""}`}
                to={`${id}?lat=${position.lat}&lng=${position.lng}`}
            >
                <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>({formatDate(date)})</time>
                <button className={styles.deleteBtn} onClick={handleDeleteCity}>
                    &times;
                </button>
            </Link>
        </li>
    );
}

export default CityItem;
