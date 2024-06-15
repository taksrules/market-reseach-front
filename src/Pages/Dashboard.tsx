import React, { useState, useEffect } from "react";
import axios from "axios";
import TopNav from "../Components/TopNav";
import { Link, useParams } from "react-router-dom";

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

function Dashboard() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [draggedProjectId, setDraggedProjectId] = useState<number | null>(null);

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
  }, [projects]);

  const handleDragStart = (id: number) => {
    setDraggedProjectId(id);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>, targetProjectStatus: string) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLLIElement>, targetProjectStatus: string) => {
    event.preventDefault();
    if (draggedProjectId === null) return;

    // Find the project that is being dragged
    const projectToUpdate = projects.find((project) => project.id === draggedProjectId);
    if (!projectToUpdate) return;

    // Store the old status for potential rollback
    const previousStatus = projectToUpdate.status;

    // Optimistic UI update: Update the local state immediately
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === draggedProjectId ? { ...project, status: targetProjectStatus } : project
      )
    );

    try {
      // Send the API request to update the status on the backend
      await axios.patch(`http://localhost:3000/projects/${draggedProjectId}`, {
        status: targetProjectStatus,
      });
      console.log(`Project ${draggedProjectId} updated to ${targetProjectStatus}`);
    } catch (error) {
      console.error(`Error updating project ${draggedProjectId}:`, error);

      // If there's an error, revert the local state to the previous status
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === draggedProjectId ? { ...project, status: previousStatus } : project
        )
      );
    } finally {
      // Clear the dragged project ID after the drop operation
      setDraggedProjectId(null);
    }
  };

  return (
    <TopNav>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h5>Projects</h5>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="w-full text-center">Started</div>
          <div className="w-full text-center">In Progress</div>
          <div className="w-full text-center">Completed</div>

          <ul className="list-none">
            {projects
              .filter((project) => project.status === "started")
              .map((project) => (
                <Link to={`/Projects/${project.id}`} key={project.id}>
                  <li
                    className="mb-2 w-full max-w-sm cursor-move rounded-lg border-teal-200 bg-teal-600 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                    draggable={true}
                    onDragStart={() => handleDragStart(project.id)}
                    onDragOver={(event) => handleDragOver(event, "started")}
                    onDrop={(event) => handleDrop(event, "started")}
                  >
                    <div className="flex flex-col items-center pb-10">
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.status}
                      </span>
                    </div>
                    {project.title}
                  </li>
                </Link>
              ))}
          </ul>

          <ul className="list-none">
            {projects
              .filter((project) => project.status === "inprogress")
              .map((project) => (
                <Link to={`/Projects/${project.id}`} key={project.id}>
                  <li
                    className="mb-2 w-full max-w-sm cursor-move rounded-lg border-teal-200 bg-teal-600 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                    draggable={true}
                    onDragStart={() => handleDragStart(project.id)}
                    onDragOver={(event) => handleDragOver(event, "inprogress")}
                    onDrop={(event) => handleDrop(event, "inprogress")}
                  >
                    <div className="flex flex-col items-center pb-10">
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.status}
                      </span>
                    </div>
                    {project.title}
                  </li>
                </Link>
              ))}
          </ul>

          <ul className="list-none">
            {projects
              .filter((project) => project.status === "completed")
              .map((project) => (
                <Link to={`/Projects/${project.id}`} key={project.id}>
                  <li
                    className="mb-2 w-full max-w-sm cursor-move rounded-lg border-teal-200 bg-teal-600 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                    draggable={true}
                    onDragStart={() => handleDragStart(project.id)}
                    onDragOver={(event) => handleDragOver(event, "completed")}
                    onDrop={(event) => handleDrop(event, "completed")}
                  >
                    <div className="flex flex-col items-center pb-10">
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.status}
                      </span>
                    </div>
                    {project.title}
                  </li>
                </Link>
              ))}
          </ul>
        </div>
      </div>
    </TopNav>
  );
}

export default Dashboard;
