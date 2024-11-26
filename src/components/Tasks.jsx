import { useContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import toast from "react-hot-toast";
import {
  Avatar,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import {
  addDoc,
  collection,
  getFirestore,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../providers/AuthProvider";
import Loader from "./Loader";

const Tasks = () => {
    const { user, loading } = useContext(AuthContext);
  const db = getFirestore(app);
  const [dataLoader, setdataLoader] = useState(false)
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allTasks, setAllTasks] = useState([]); 
  const [open, setOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({})
  const taskPerPage = 4;
const profileImages =
  "https://i1.sndcdn.com/avatars-jRXwcAeJYYa5np7a-EGDQqA-t1080x1080.jpg";
  // handleSubmitTodo
  const handleSubmitTodo = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;

    // Add Task
    await addDoc(collection(db, "tasks"), {
      title,
      description,
    });
    e.target.reset();
  };

  // Real-Time Listener for All Tasks
  useEffect(() => {
   try {
    setdataLoader(true)
     const taskCollection = collection(db, "tasks");
     const q = query(taskCollection, orderBy("title"));

     const unsubscribe = onSnapshot(q, (snapshot) => {
       const taskData = snapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
       }));
       setAllTasks(taskData);

       // Update total pages based on all tasks
       setTotalPages(Math.ceil(taskData.length / taskPerPage));
     });

     return () => unsubscribe();
   } catch (error) {
    console.log(error)
    setdataLoader(false);
    
   }finally{
    setdataLoader(false);
   }
  }, []);

  // Update Tasks for Current Page
  const updateTasksForPage = (page) => {
    const startIdx = (page - 1) * taskPerPage;
    const endIdx = startIdx + taskPerPage;

    const paginatedTasks = allTasks.slice(startIdx, endIdx);
    setTasks(paginatedTasks);
  };


  // Delete Task
  const handleDeleteTask = async (id) =>{
    try {
      const findTask = doc(db, "tasks", id);
      await deleteDoc(findTask);
      toast.success("Task Deleted Successful");
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    updateTasksForPage(currentPage);
  }, [allTasks, currentPage]);

  // Change Page Handler
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle Update Task
  const handleUpdateTask = async (e) => {
    e.preventDefault()
    try {
      // Form Data
      const title = e.target.title.value;
      const description = e.target.description.value;
      // Make Object Data
      const taskUpdate = {title, description}
      const docFind = doc(db, "tasks", updatedData.id); 
      await updateDoc(docFind, taskUpdate); 
      toast.success('Task Updated Successfujl')
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

// Handle Modal
const handleOpen = (data) => {
  setOpen(!open);
  setUpdatedData(data)
};
if (loading || dataLoader) return <Loader/>
  return (
    <div className="">
      <div className="container p-2 mx-auto sm:p-4 flex justify-center items-center flex-col">
        <Avatar
          src={user?.photoURL ? user?.photoURL : profileImages}
          alt="avatar"
          withBorder={true}
          className="p-0.5"
        />
        <h2>{user?.email}</h2>
      </div>
      <div className="container p-2 mx-auto sm:p-4">
        <h2 className="mb-2 text-2xl font-semibold leading-tight text-gray-700 text-center">
          Add Task
        </h2>
        <form
          onSubmit={handleSubmitTodo}
          className="flex justify-center items-center gap-3 md:gap-2 flex-col md:flex-row"
        >
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-800">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="py-1 px-3 border focus:border-rose-600 rounded outline-none"
              placeholder="Enter Your Title"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-800">
              Description
            </label>
            <input
              type="text"
              name="description"
              className="py-1 px-3 border focus:border-rose-600 rounded outline-none"
              placeholder="Enter Your Description"
            />
          </div>
          <div className="flex flex-col">
            <button className="bg-light-green-900 text-white rounded py-2 px-4 md:mt-6">
              Submit Task
            </button>
          </div>
        </form>
      </div>

      <div className="container p-2 mx-auto sm:p-4 text-gray-100">
        <h2 className="mb-2 text-2xl font-semibold leading-tight text-gray-700 text-center">
          Task List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-700">
              <tr className="text-center">
                <th className="p-3">SL NO</th>
                <th className="p-3">Title</th>
                <th className="p-3">Desc</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks?.map((task, idx) => (
                <tr
                  className="border-b border-opacity-20 border-gray-700 bg-gray-900 text-center"
                  key={task.id}
                >
                  <td className="p-3">
                    {(currentPage - 1) * taskPerPage + idx + 1}
                  </td>
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">
                    <p className="text-gray-400">
                      {task.description?.slice(0, 50)}
                    </p>
                  </td>
                  <td className="p-3 flex gap-1 justify-center">
                    <button
                      className="bg-red-600 py-1 px-2 rounded cursor-pointer"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleOpen(task)}
                      className="bg-red-600 py-1 px-2 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((item, idx) => (
          <button
            className={`py-2 px-3 rounded ${
              currentPage === idx + 1
                ? "bg-green-900 text-white"
                : "bg-gray-400 text-black"
            }`}
            onClick={() => changePage(idx + 1)}
            key={idx}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Update Modal */}
      <div>
        <Dialog open={open} handler={handleOpen}>
          <DialogBody>
            <div className=" p-2 mx-auto sm:p-4">
              <h2 className="mb-4 text-2xl font-semibold leading-tight text-gray-700 text-center">
                Update Task
              </h2>
              <form
                onSubmit={handleUpdateTask}
                className="flex justify-center items-center gap-3 md:gap-2 flex-col md:flex-row"
              >
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-gray-800">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="py-1 px-3 border focus:border-rose-600 rounded outline-none"
                    defaultValue={updatedData.title}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="description" className="text-gray-800">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="py-1 px-3 border focus:border-rose-600 rounded outline-none"
                    defaultValue={updatedData.description}
                  />
                </div>
                <div className="flex flex-col">
                  <button className="bg-light-green-900 text-white rounded py-2 px-4 md:mt-6">
                    Update Now
                  </button>
                </div>
              </form>
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </div>
  );
};

export default Tasks;
