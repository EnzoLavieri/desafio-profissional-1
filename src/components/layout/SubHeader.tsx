import { useLocation } from "react-router-dom";
import { routes } from "../../Routes";

export default function SubHeader() {
    const location = useLocation();

    const currentRoute = routes.find(
        (route) => route.path === location.pathname
    );

    return (
        <div className="subheader">
            <div>{currentRoute?.title || "Página"}</div>
        </div>
    );
}