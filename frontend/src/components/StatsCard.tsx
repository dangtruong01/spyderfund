import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface StatsCardProps {
  value: string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, description }) => {
  return (
    <Card className="bg-gray-accent text-gray-300 border-0">
      <CardHeader>
        <div className="flex justify-center">
          <CardTitle>{value}</CardTitle>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-center items-center bg-light-gray-accent text-gray-400 rounded-b-lg py-3">
        <p className="">{description}</p>
      </CardFooter>
    </Card>
  );
};

export default StatsCard;
