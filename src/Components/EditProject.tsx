"use client";
import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import { FaPenToSquare } from "react-icons/fa6";
;
interface Project {
    title: string;
    description: string;
    dueDate: string;
    notes: string;
    status: string;
  }
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    dueDate: Yup.date().required('Due date is required'),
    notes: Yup.string().optional(),
    status: Yup.string().oneOf(['started', 'completed', 'cancelled']).required('Status is required'),
  });
 
    
function EditProject(props:any) {
    const {project}= props
    const [openModal, setOpenModal] = useState(false);
    const [projects, setProjects]= useState<Project[]>()
    function convertDateFormat(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }
    const initialValues: Project = {
      title: project.title,
      description: project.description,
      dueDate: convertDateFormat(project?.dueDate),
      notes: project.notes,
      status: project.status,
    };
    
    
    const handleSubmit = async (values: Project) => {
        try {
          const response: AxiosResponse<Project> = await axios.patch(
            `http://localhost:3000/projects/${project.id}`,
            values
          );
          console.log('Project created:', response.data);
          setOpenModal(false);
    
        } catch (error) {
          console.error('Error creating project:', error);
        }
      };
  return (
    <>
      <Button onClick={() => setOpenModal(true)}><FaPenToSquare/></Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Edit Project</Modal.Header>
        <Modal.Body>
        <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <div>
      <Form className="min-w-[400px] w-full mx-auto  p-8 px-8 rounded-lg flex flex-col space-y-1 text-sm">
      <Field name="title" type="text" placeholder="Title" />
      <Field name="description" type="text" placeholder="Description" />
      <Field name="dueDate" type="date" />
      <Field name="notes" type="text" placeholder="Notes" />
      <Field name="status" as="select">
        <option value="started">Started</option>
        <option value="completed">Completed</option>
        <option value="inprogress">Inprogress</option>
      </Field>
      <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
        Edit Project
      </Button>
    </Form>
    </div>
    </Formik>
    

        </Modal.Body>
        <Modal.Footer>
          
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EditProject