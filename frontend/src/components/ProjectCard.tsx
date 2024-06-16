import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import greenEarthImage from "@/assets/green-earth.png";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import project4 from "@/assets/project4.jpg";
import { ProjectDetails } from "@/types/ProjectTypes";

export type ProjectCardProps = {
  details: ProjectDetails;
};

const ProjectCard = ({ details }: ProjectCardProps) => {
  const images = [greenEarthImage, project2, project3, project4];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // Convert timestamp to a readable date
  const formattedProjectStarter = `${details.address.substring(
    0,
    6
  )}...${details.address.substring(details.address.length - 4)}`;

  return (
    <Card className="bg-gray-accent text-white border-gray-accent shadow-sm hover:bg-light-gray-accent hover:border-light-gray-accent">
      <CardHeader>
        <img src={randomImage} alt="Project Banner" />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-base">{details.title}</CardTitle>
        <CardDescription className="mt-2">
          {details.description}
        </CardDescription>
        <div className="flex mt-2">
          <div className="w-1/2">
            <p>Goal: {details.goalAmount} ETH</p>
            <p className="text-gray-500">
              Current: {details.currentAmount} ETH
            </p>
          </div>
          <div className="w-1/2 flex items-end justify-end">
            <p>Deadline: {details.deadline.toLocaleDateString()}</p>
          </div>
        </div>
        <p className="mt-2">Min. Contribution: {details.minContribution} ETH</p>
      </CardContent>
      <CardFooter>
        <img
          className="w-8 h-8"
          src="src/assets/eth-logo.svg"
          alt="Eth Token"
        />
        <span className="ml-4">{formattedProjectStarter}</span>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
