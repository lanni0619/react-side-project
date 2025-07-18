import Sidebar from "../components/SideBar";
import Map from "../components/Map";
import styles from "./AppLayout.module.css";

function AppLayout() {
    return (
        <div className={styles.app}>
            <Sidebar />
            <Map />
            <p>App</p>
        </div>
    );
}

export default AppLayout;
