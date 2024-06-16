
import React from "react";
import { Link } from "react-router-dom";
import LoginButton from "./blockchain/LoginButton";
import LogoutButton from "./blockchain/LogoutButton";
import { metamaskAccountAtom } from "@/states/atoms";
import { useRecoilState } from "recoil";
import logo from '../assets/logo.svg'
import dashboard from '../assets/dashboard.svg'
import profile from "../assets/profile.svg"

const Navbar: React.FC = () => {
  const [metamaskAccount, setMetamaskAccount] = useRecoilState(metamaskAccountAtom);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}`;
  };

  const handleLoggedOut = () => {
    setMetamaskAccount(null);
  };

  return (
    <nav
      className="fixed bg-gray-accent p-8 m-8 flex flex-col items-center justify-between rounded-xl z-index-20"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="text-transparent">
        <Link to="/">
          <img src={logo} />
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <Link to="/projects">
          <img src={dashboard} />
        </Link>
        <div>
          {metamaskAccount ? (
            <div>
              <Link to="/profile">
                <img src={profile} />
              </Link>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>

      {metamaskAccount ? <LogoutButton onLoggedOut={handleLoggedOut} /> : <></>}
    </nav>
  );
};

export default Navbar;
