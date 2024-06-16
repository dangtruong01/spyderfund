import React, { useState } from "react";
import { connectWallet } from "@/services/projects";
import { metamaskAccountAtom } from "@/states/atoms";
import { useRecoilState } from "recoil";

declare global {
  interface Window {
    ethereum: any;
  }
}

const LoginButton: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [metamaskAccount, setMetamaskAccount] =
    useRecoilState(metamaskAccountAtom);

  const handleLogin = async () => {
    try {
      const account = await connectWallet();
      setMetamaskAccount(account);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
      const err = error as Error;
      setErrorMessage(err.message);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="no-underline flex h-full w-full items-center justify-end rounded py-2 pl-3 pr-4 text-gray-300 hover:text-pink-300 md:border-0 md:p-0 md:hover:bg-transparent"
    >
      {errorMessage || "Login"}
    </button>
  );
};

export default LoginButton;
