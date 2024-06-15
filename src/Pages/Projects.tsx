
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopNav from "../Components/TopNav";
import { Link, useParams } from "react-router-dom";
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
    useEffect(() => {

        const fetchProjects = async () => {
          try {
            const response = await axios.get<Project[]>(
              "http://localhost:3000/projects"
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
        <div className="text-xl font-bold">
            Project
        </div>
    <div className="grid grid-cols-4 gap-2 w-full t ">
         {projects
              .filter((project) => project.status === "started")
              .map((project) => (
         <div className="flex flex-col items-center pb-10 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.description}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.dueDate}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.status}
                      </span>
                    </div>
              ))
            }
    </div>
    </TopNav>
  )
}

export default Projects