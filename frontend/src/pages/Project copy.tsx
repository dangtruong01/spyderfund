import { Progress } from "../components/ui/progress";
import StatsCard from "../components/StatsCard";
import ProfileAvatar from "../components/ProfileAvatar";
import FundCard from "../components/FundCard";
import { TransactionTable } from "@/components/TransactionTable";
import { useEffect, useState } from "react";
import type { Payment } from "@/components/TransactionTable";

type EtherscanTransaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
};

type EtherscanResponse = {
  status: string;
  message: string;
  result: EtherscanTransaction[];
};

const Project = () => {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [totalRaised, setTotalRaised] = useState<number>(0);
  const [uniqueBackers, setUniqueBackers] = useState<number>(0);

  return (
    <div className="h-screen p-8 text-white">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:2/3">
          <img
            src={"src/assets/green-earth.png"}
            alt="project"
            className="w-full object-fill"
          />
          <div className="my-4">
            <Progress value={33} />
          </div>
        </div>
        <div className="flex flex-col my-auto lg:mx-auto lg:w-1/2 lg:px-28 w-full gap-y-10">
          <StatsCard value={40} description="Days Left" />
          <StatsCard value={totalRaised} description="Raised" />
          <StatsCard value={uniqueBackers} description="Total Backers" />
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col w-2/3">
          <div className="">
            <div className="text-xl">CREATOR</div>
            <div className="flex flex-row items-center m-2">
              <ProfileAvatar />
              <div className="flex flex-col mx-2">
                <div className="">name</div>
                <div className="text-xs text-gray-400">num campaigns</div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <div className="text-xl">STORY</div>
            <div className="text-gray-400 m-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
        </div>
        <div className="w-1/3 flex justify-center">
          <FundCard />
        </div>
      </div>
      <div className="w-full">
        <div className="text-xl my-4">DONATIONS</div>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};
export default Project;
