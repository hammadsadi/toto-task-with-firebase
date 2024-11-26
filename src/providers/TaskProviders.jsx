import { createContext } from "react";

export const TaskContext = createContext(null);


const TaskProviders = ({ children }) => {


  return (
    <TaskContext.Provider >{children}</TaskContext.Provider>
  );
};


export default TaskProviders;
