import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
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
interface Column {
  id: string;
  name: string;
}
const TaskManagementApp: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns] = useState<Column[]>([
    { id: "todo", name: "To Do" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
  ]);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response: AxiosResponse<Project[]> = await axios.get<Project[]>(
          "http://localhost:3000/projects"
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const renderProjects = () => {
    return columns.map((column) => (
      <div
        key={column.id}
        className="w-full sm:w-1/3 bg-white rounded-lg p-4 shadow-md m-2"
        id={column.id}
        onDrop={(event) => handleDrop(event, column.id)}
        onDragOver={(event) => handleDragOver(event)}
      >
        <h2 className="text-lg font-semibold mb-2">{column.name}</h2>
        <hr className="mb-2" />
        {projects
          .filter((project) => project.status === column.id)
          .map((project) => (
            <div
              key={project.id}
              className="p-2 bg-gray-200 rounded-md mb-2 flex justify-between items-center"
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
            >
              <span>{project.title}</span>
              <button
                onClick={() => deleteProject(project.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    ));
  };

  const addProject = async () => {
    const projectTitleInput = document.getElementById(
      "projectTitleInput"
    ) as HTMLInputElement;
    const projectTitle = projectTitleInput.value.trim();
    if (projectTitle !== "") {
      const newProject: Project = {
        id: projects.length + 1,
        title: projectTitle,
        description: "",
        status: "todo",
        dueDate: "",
        notes: "",
        researchFindings: null,
        tasks: null,
      };

      try {
        const response: AxiosResponse<Project> = await axios.post(
          "http://localhost:3000/projects",
          newProject
        );
        setProjects([...projects, response.data]);
        projectTitleInput.value = "";
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    project: Project
  ) => {
    e.dataTransfer.setData("text/plain", project.id.toString());
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    e.preventDefault();
    const projectId = parseInt(e.dataTransfer.getData("text/plain"));
    const updatedProject: Project = {
      ...draggedProject!,
      status: columnId,
    };

    try {
      await axios.patch(
        `http://localhost:3000/projects/${projectId}`,
        updatedProject
      );
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? updatedProject : project
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Management</h1>
      <div className="flex flex-wrap justify-around">{renderProjects()}</div>
      <input
        type="text"
        id="projectTitleInput"
        placeholder="Add a new project"
        className="p-2 border border-gray-300 rounded mr-2"
      />
      <button
        onClick={addProject}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Project
      </button>
    </div>
  );
};

export default TaskManagementApp;
