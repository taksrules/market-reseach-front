import React, { useState, useEffect } from "react";
import axios from "axios";
import TopNav from "../Components/TopNav";
import { Link, useParams } from "react-router-dom";
import { Button, Card } from "flowbite-react";
function Projects() {
  interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    notes: string;
    researchFindings: string | null;
    tasks: string | null;
  }
  const [projects, setProjects] = useState<Project[]>([]);
  function convertDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>(
          "http://localhost:3000/projects",
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);
  return (
    <TopNav>
      <div className="text-xl font-bold flex justify-between w-full"><h5>Project</h5></div>
      <div className="t grid w-full grid-cols-4 gap-2 ">
        {projects
          .filter((project) => project.status === "started")
          .map((project) => (
           
              
              <Card className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {project.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {project.description}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                {convertDateFormat(project.dueDate)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {project.status}
                </span>
                <Button>
                  Delete
                  
                </Button>
              </Card>
           
          ))}
      </div>
    </TopNav>
  );
}

export default Projects;
