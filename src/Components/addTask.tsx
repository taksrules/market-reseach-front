"use client";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosResponse } from 'axios';

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    notes: string;
    project: number;
  }
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
  notes: Yup.string().optional(),
  status: Yup.string().oneOf(['started', 'completed', 'cancelled']).required('Status is required'),
});
function AddTask(props:any) {
  const [openModal, setOpenModal] = useState(false);
  const initialValues: Task = {
    id: props.projectId,
    title: '',
    description: '',
    status: '',
    dueDate: '',
    notes: '',
    project: props?.projectId?props.projectId:0,
  };


  const handleSubmit = async (values: Task) => {
    
    try {
      const response: AxiosResponse<Task> = await axios.post(
        'http://localhost:3000/task',
        values
      );
      console.log('Project created:', response.data);
      

    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
  
  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Add Task</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add Project</Modal.Header>
        <Modal.Body>
        <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="min-w-[400px] w-full mx-auto  p-8 px-8 rounded-lg flex flex-col space-y-1 text-sm">
      <Field name="title" type="text" placeholder="Title" />
      <Field name="description" type="text" placeholder="Description" />
      <Field name="dueDate" type="date" />
      <Field name="notes" type="text" placeholder="Notes" />
      <Field name="status" as="select">
        <option value="started">Started</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </Field>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
        Create Project
      </button>
    </Form>
    </Formik>

        </Modal.Body>
        <Modal.Footer>
          
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTask

function resetForm() {
  throw new Error("Function not implemented.");
}
