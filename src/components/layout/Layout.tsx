import Aside from "./Aside";
import Header from "./Header";
import SubHeader from "./SubHeader";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <Aside />
      <div className="main">
        <Header />
        <SubHeader />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}