import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { donateToAProject } from "@/services/projects";

interface FundCardProps {
  projectId: string;
}

const FundCard: React.FC<FundCardProps> = ({ projectId }) => {
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleFundCampaign = async () => {
    // Input Validation
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setFeedback("Please enter a valid donation amount.");
      return;
    }
    console.log(donationAmount)
    console.log(projectId)

    // Proceed with Donation
    const success = await donateToAProject(projectId, donationAmount);
    if (success) {
      setFeedback('Donation successful!');
    } else {
      setFeedback('Donation failed. Please try again.');
    }
  };

  return (
    <Card className="bg-gray-accent text-gray-300 border-0 w-[350px]">
      <CardHeader>
        <div className="flex flex-col items-center">
          <CardTitle className=" text-lg">Fund the Campaign</CardTitle>
          <Input
            className="w-full m-4 bg-transparent border-gray-300"
            placeholder="ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex flex-col">
            <div className="bg-black border border-black rounded-lg p-4">
              <div className="text-white mb-4">
                Back it because you believe in it.
              </div>
              <div className="text-sm text-gray-400">
                Support the project for no reward, just because it speaks to
                you.
              </div>
            </div>

            <button className="mt-4 p-2 font-bold bg-purple-600 rounded-lg"
              onClick={handleFundCampaign}>
              Fund Campaign
            </button>
            {feedback && <div className="text-red-500">{feedback}</div>}

          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default FundCard;
