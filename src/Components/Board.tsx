import { KanbanComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-kanban";
import * as React from 'react';
import Modals from "./Modals";
import axios, { AxiosResponse } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import TaskManagementApp from "./kanban";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    notes: string;
    project: number;
  }

function Board(props:any) {

    const { projectId } = useParams<{ projectId: string }>();
    const [Tasks,setTasks]= React.useState<Task[]>([])
    
   
      
      React.useEffect(() => {
        const getTasks = async (
            projectId: number,
          ): Promise<AxiosResponse<Task[]>> => {
            try {
              const response: AxiosResponse<Task[]> = await axios.get(
                `http://localhost:3000/task/project/${projectId}`,
              );
              setTasks( response.data)
              return response;
            } catch (error) {
              console.error("Error fetching tasks:", error);
              throw error;
            }
          };
    
          getTasks(parseInt(projectId || ''));
      }, [projectId]);
      console.log(Tasks)
      
    
    const [openModal, setOpenModal] = React.useState(true);
    const notify = (data:any) =>{ toast(`${data}`);}
    const mappedData = React.useMemo(() => {
        return Tasks.map(task => ({
            Id: task.id,
            Status: task.status,
            Summary: task.title,
            Type: 'Story',
            Priority: 'Low',
            Tags: 'Analyze,Customer',
            Estimate: 3.5,
            Assignee: 'Nancy Davloio',
            RankId: 1
        }));
    }, [Tasks]);

    const handleActionComplete = (args:any) => {
        if (args.requestType === 'cardChanged' && args.data) {
          const { Status } = args.data;
          console.log(`Status has changed - New Status: ${Status}`);
        }
        notify(args)
        console.log(args)
    }
    const [projects, setProjects] = useState<Task[]>([]);
   
    
    const [draggedProjectId, setDraggedProjectId] = useState(null);
  
    const handleDragStart = (id:any) => {
      setDraggedProjectId(id);
     
    };
    const handleDragOver = async (event:any,targetProjectStatus: string) => {
      event.preventDefault(); // Allow the drop
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
       const res= await axios.patch(`http://localhost:3000/projects/${draggedProjectId}`, {
          status: targetProjectStatus,
        });
        console.log(res)
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
  
    const handleDrop = async (event: React.DragEvent, targetProjectStatus: string) => {
      event.preventDefault();
      console.log("We are here",targetProjectStatus)
  
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
    const [draggedList, setDraggedList] = useState([]);
    

    return (
            <div className="flex flex-col">
                <div className="p-2">
                    <ToastContainer />
                    <Modals />
                </div>
                <div className="flex flex-row gap-4">
                <div className="flex flex-col">
        <div className="flex flex-col">
          <h5>Projects</h5>
          

        </div>
      <div className="w-full">
        <Board/>
      </div>
    </div>
                </div>
            </div>
          );
}

export default Board