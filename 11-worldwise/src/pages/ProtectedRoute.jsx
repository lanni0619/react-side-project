import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(
        function () {
            if (!isAuthenticated) navigate("/");
        },
        [navigate, isAuthenticated]
    );
    
    /* 
        回傳要先判斷條件的原因
        1. 在useEffect設計驗證功能，如果失敗執行重新導向
        2. 但是React會先執行渲染元件，後執行useEffect
        3. 如果渲染元件時出現錯誤，就無法執行useEffect
    */
    return isAuthenticated ? children : null;
}

export default ProtectedRoute;
