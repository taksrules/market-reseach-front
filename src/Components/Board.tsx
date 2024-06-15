"use client";
import * as React from "react";
import Modals from "./Modals";
import axios, { AxiosResponse } from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Table } from "flowbite-react";


import { Link, useParams } from "react-router-dom";

import AddTask from "./addTask";
import EditTask from "./editTask";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  notes: string;
  project: number;
}

function Board(props: any) {
  const { projectId } = useParams<{ projectId: string }>();
  const [Tasks, setTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    
    const getTasks = async (
      projectId: number,
    ): Promise<AxiosResponse<Task[]>> => {
      try {
        const response: AxiosResponse<Task[]> = await axios.get(
          `http://localhost:3000/task/project/${projectId}`,
        );
        setTasks(response.data);
        
        return response;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
    };
    

    getTasks(parseInt(projectId || ""));
  }, [projectId]);
  console.log(Tasks);

  const [openModal, setOpenModal] = React.useState(true);
  const notify = (data: any) => {
    toast(`${data}`);
  };
  function convertDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const mappedData = React.useMemo(() => {
    return Tasks.map((task) => ({
      Id: task.id,
      Status: task.status,
      Summary: task.title,
      Type: "Story",
      Priority: "Low",
      Tags: "Analyze,Customer",
      Estimate: 3.5,
      Assignee: "Nancy Davloio",
      RankId: 1,
    }));
  }, [Tasks]);

  return (
    <div className="flex flex-col">
      <div className="p-2">
        <ToastContainer />
        <AddTask projectId={projectId}/>
      </div>
      <div className="overflow-x-auto">
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>dueDate</Table.HeadCell>
          <Table.HeadCell>notes</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit </span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
        {Tasks.map((task) => (
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {`${task.title}`}
          </Table.Cell>
          <Table.Cell>{task.description}</Table.Cell>
          <Table.Cell>{task.status}</Table.Cell>
          <Table.Cell>{convertDateFormat(task.dueDate)}</Table.Cell>
          <Table.Cell>{task.notes}</Table.Cell>
          <Table.Cell>
            <span  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
              <EditTask task={task}/>
            </span>
          </Table.Cell>
        </Table.Row>
        ))}
          
        </Table.Body>
      </Table>
    </div>

    </div>
  );
}

export default Board;
