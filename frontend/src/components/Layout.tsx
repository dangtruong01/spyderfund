import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="max-w-screen min-h-screen flex flex-col bg-background overflow-x-hidden">
      <div className="flex flex-row">
        <Navbar />
        <main className="ml-32 grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
