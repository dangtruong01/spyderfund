import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProjectCard from "@/components/ProjectCard";
import { connectWallet, getAllProjects } from "@/services/projects";
import { metamaskAccountAtom } from "@/states/atoms";
import { useRecoilState } from "recoil";
import { ProjectDetails } from "@/types/ProjectTypes";
import { Link } from "react-router-dom";

const ProjectsPage = () => {
  const [account, setAccount] = useRecoilState(metamaskAccountAtom); // Use the atom
  const [projects, setProjects] = useState<ProjectDetails[]>([]); // Use the ProjectDetails type for your projects array

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsData = await getAllProjects();
      setProjects(projectsData);

    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen p-8">

      <div className="flex justify-center">
        <SearchBar placeholder="Search for campaigns" onSearch={function (arg: string): void {
          throw new Error("Function not implemented.");
        }} />
      </div>

      <div className="my-8 grid place-items-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.isArray(projects) && projects.map((project, index) => (
          <Link key={project.address} to={`/projects/${project.address}`}>
            <ProjectCard key={index} details={project} />
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ProjectsPage;
