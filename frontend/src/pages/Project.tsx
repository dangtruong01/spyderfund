import { Progress } from "../components/ui/progress";
import StatsCard from "../components/StatsCard";
import ProfileAvatar from "../components/ProfileAvatar";
import FundCard from "../components/FundCard";
import { TransactionTable } from "@/components/TransactionTable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProjectDetails, ProjectDonation } from "@/types/ProjectTypes";
import {
  getAProjectDetail,
  getDonationTransactions,
  getNoOfContributors,
} from "@/services/projects";
import greenEarthImage from "@/assets/green-earth.png";

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );
  const [daysUntilDeadline, setDaysUntilDeadline] = useState<number | null>(
    null
  );
  const [donations, setDonations] = useState<ProjectDonation[]>([]);
  const [noOfContributors, setNoOfContributors] = useState<string>("");

  useEffect(() => {
    if (projectId) {
      const fetchProjectDetails = async () => {
        try {
          const details = await getAProjectDetail(projectId);
          setProjectDetails(details);

          if (details?.deadline) {
            const currentDate = new Date(); // Current date and time
            const timeDiff =
              details?.deadline.getTime() - currentDate.getTime(); // Difference in milliseconds

            // Calculate the difference in days
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
            setDaysUntilDeadline(daysDiff);
          }
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      };

      fetchProjectDetails();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchDonations = async () => {
      const donations = await getDonationTransactions(projectId!);
      setDonations(donations);
    };

    fetchDonations();
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      const contributors = await getNoOfContributors(projectId!);
      setNoOfContributors(contributors);
    };

    fetchContributors();
  });

  return (
    <div className="h-screen p-8 text-white">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:2/3">
          <img
            src={greenEarthImage}
            alt="project"
            className="w-full object-fill"
          />
          <div className="my-4">
            <Progress value={33} />
          </div>
        </div>
        <div className="flex flex-col my-auto lg:mx-auto lg:w-1/2 lg:px-28 w-full gap-y-10">
          <StatsCard
            value={daysUntilDeadline?.toString()!}
            description="Days Left"
          />
          <StatsCard
            value={projectDetails?.currentAmount!}
            description="Raised"
          />
          <StatsCard value={noOfContributors} description="Total Backers" />
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col w-2/3">
          <div className="">
            <div className="text-xl">{projectDetails?.title}</div>
            <div className="flex flex-row items-center my-2">
              <ProfileAvatar />
              <div className="flex flex-col mx-2">
                <div className="">name</div>
                <div className="text-xs text-gray-400">num campaigns</div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <div className="text-l">STORY</div>
            <div className="text-gray-400 my-2">
              {projectDetails?.description}
            </div>
          </div>
        </div>
        <div className="w-1/3 flex justify-center">
          <FundCard projectId={projectDetails?.address!} />
        </div>
      </div>
      <div className="w-full">
        <div className="text-xl my-4">DONATIONS</div>
        <TransactionTable projectId={projectDetails?.address!} />
      </div>
    </div>
  );
};
export default Project;
