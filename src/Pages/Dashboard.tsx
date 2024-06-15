"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopNav from "../Components/TopNav";
import { Link, useParams } from "react-router-dom";

import { MdOutlineDeleteForever } from "react-icons/md";

import { Button, Card, Badge } from "flowbite-react";
import Modals from "../Components/Modals";
import { deleteProject } from "../api/api";

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
  function convertDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>(
          "http://localhost:3000/projects",
        );
        setProjects(response.data);
      } catch (error) {}
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: any) => {
    await deleteProject(id);
  };

  const handleDragStart = (id: number) => {
    setDraggedProjectId(id);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLLIElement>,
    targetProjectStatus: string,
  ) => {
    event.preventDefault();
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLLIElement>,
    targetProjectStatus: string,
  ) => {
    event.preventDefault();
    if (draggedProjectId === null) return;

    // Find the project that is being dragged
    const projectToUpdate = projects.find(
      (project) => project.id === draggedProjectId,
    );
    if (!projectToUpdate) return;

    // Store the old status for potential rollback
    const previousStatus = projectToUpdate.status;

    // Optimistic UI update: Update the local state immediately
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === draggedProjectId
          ? { ...project, status: targetProjectStatus }
          : project,
      ),
    );

    try {
      // Send the API request to update the status on the backend
      await axios.patch(`http://localhost:3000/projects/${draggedProjectId}`, {
        status: targetProjectStatus,
      });
      console.log(
        `Project ${draggedProjectId} updated to ${targetProjectStatus}`,
      );
    } catch (error) {
      console.error(`Error updating project ${draggedProjectId}:`, error);

      // If there's an error, revert the local state to the previous status
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === draggedProjectId
            ? { ...project, status: previousStatus }
            : project,
        ),
      );
    } finally {
      // Clear the dragged project ID after the drop operation
      setDraggedProjectId(null);
    }
  };

  return (
    <TopNav>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between p-3">
          <h5 className="text-2xl font-bold">Projects</h5>
          <Modals />
        </div>
        <div className="grid w-full grid-cols-3 gap-4 bg-white ">
          <div className="w-full text-center font-bold">Started</div>
          <div className="w-full text-center font-bold">In Progress</div>
          <div className="w-full text-center font-bold">Completed</div>

          <ul className="list-none rounded-lg shadow-md  items-center">
            {projects
              .filter((project) => project.status === "started")
              .map((project) => (
                <li
                  className="mb-2 w-full max-w-sm cursor-move rounded-lg border-teal-200 bg-teal-600 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                  draggable={true}
                  onDragStart={() => handleDragStart(project.id)}
                  onDragOver={(event) => handleDragOver(event, "started")}
                  onDrop={(event) => handleDrop(event, "started")}
                >
                  <Card className="max-w-sm">
                    <div className="flex flex-row justify-between">
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {project.title}
                      </h5>
                      <Link
                        to={`/Projects/${project.id}`}
                        key={project.id}
                        className="flex justify-center"
                      >
                        <Button color="light" size="xs">
                          View Tasks
                        </Button>
                      </Link>
                    </div>

                    <p className="gap-3 font-normal text-gray-700 dark:text-gray-400">
                      {project.description}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {convertDateFormat(project.dueDate)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <Badge color="info">{project.status}</Badge>
                      <div>
                        <Button
                          onClick={() => handleDelete(project.id)}
                          size="xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </span>
                  </Card>
                </li>
              ))}
          </ul>

          <ul className="list-none rounded-lg shadow-md items-center">
            {projects
              .filter((project) => project.status === "inprogress")
              .map((project) => (
                <li
                  className="mb-2 w-full max-w-sm cursor-move rounded-lg border-teal-200 bg-teal-600 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                  draggable={true}
                  onDragStart={() => handleDragStart(project.id)}
                  onDragOver={(event) => handleDragOver(event, "inprogress")}
                  onDrop={(event) => handleDrop(event, "inprogress")}
                >
                  <Card className="max-w-sm">
                    <div className="flex flex-row justify-between">
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {project.title}
                      </h5>
                      <Link
                        to={`/Projects/${project.id}`}
                        key={project.id}
                        className="flex justify-center"
                      >
                        <Button color="light" size="xs">
                          View Tasks
                        </Button>
                      </Link>
                    </div>

                    <p className="gap-3 font-normal text-gray-700 dark:text-gray-400">
                      {project.description}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {convertDateFormat(project.dueDate)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <Badge color="info">{project.status}</Badge>
                      <div>
                        <Button
                          onClick={() => handleDelete(project.id)}
                          size="xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </span>
                  </Card>
                </li>
              ))}
          </ul>

          <ul className="list-none rounded-lg shadow-md items-center">
            {projects
              .filter((project) => project.status === "completed")
              .map((project) => (
                <li
                  className="mb-2 w-full max-w-sm cursor-move rounded-lg border-teal-200 bg-teal-600 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
                  draggable={true}
                  onDragStart={() => handleDragStart(project.id)}
                  onDragOver={(event) => handleDragOver(event, "completed")}
                  onDrop={(event) => handleDrop(event, "completed")}
                >
                   <Card className="max-w-sm">
                    <div className="flex flex-row justify-between">
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {project.title}
                      </h5>
                      <Link
                        to={`/Projects/${project.id}`}
                        key={project.id}
                        className="flex justify-center"
                      >
                        <Button color="light" size="xs">
                          View Tasks
                        </Button>
                      </Link>
                    </div>

                    <p className="gap-3 font-normal text-gray-700 dark:text-gray-400">
                      {project.description}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {convertDateFormat(project.dueDate)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <Badge color="info">{project.status}</Badge>
                      <div>
                        <Button
                          onClick={() => handleDelete(project.id)}
                          size="xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </span>
                  </Card>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </TopNav>
  );
}

export default Dashboard;
