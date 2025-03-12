"use client";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import FilterTask from "./FilterTask";
import axios from "axios";
import { toast } from "sonner";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  createdAt: string;
}

export const Main = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);


  useEffect(() =>{ 

    const controller = new AbortController();
    const signal = controller.signal

    const fetchTasks= async() =>  {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email')
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ROUTE}/task/one/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
            signal: signal
          }
        )
        setTasks(response.data.result)
      }
        catch(err){
          toast("fetch failed")
          return err
        }
    }

    let isMounted = true;
    if (isMounted) {
      fetchTasks();
    }

    return () => {
      isMounted = false;
    };
  },[])
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = event.target.value; 
  
    const sortedTasks: Task[] = [...tasks]; 
  
    if (sort === "Due") {
      const sorted = sortedTasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setFilteredTasks(sorted);
    } else if (sort === "Created") {
      const sorted = sortedTasks.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setFilteredTasks(sorted);
    } else if (sort === "Completed") {
      const completedTasks = tasks.filter((task) => task.status === "completed");
      setFilteredTasks(completedTasks);
    } else if (sort === "Incomplete") {
      const incompleteTasks = tasks.filter((task) => task.status !== "completed");
      setFilteredTasks(incompleteTasks);
    } else {
      setFilteredTasks(tasks);
    }
  };
  

  const handleSearch = () => {
    console.log("line 1")
    if (!searchTerm) {
      console.log("line 2")
      setFilteredTasks(tasks);
      console.log(searchTerm)
      return;
    }
    else{
      console.log("line 3")
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
    console.log(filtered)
  }
  };

  

  return (
    <main className="flex-1 p-10 py-4 max-w-[77.5rem]">
      <h1 className="text-3xl font-semibold">My Day</h1>
      <p className="text-gray-500">{new Date().toLocaleDateString()}</p>

      <div className="bg-white p-6 mt-5 shadow-md rounded-lg text-center">
        <h2 className="text-lg font-semibold">Focus on your day</h2>
        <p className="text-gray-500">Get things done with Clone-do.</p>
      </div>

      <div className="mt-5 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search your task"
          className="flex-1 p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="p-3 h-11 w-11 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          <FaSearch  onClick={handleSearch}/>
        </button>

        <select
          name="sort"
          className="border rounded-md p-2 text-lg"
          onChange={handleSortChange}
        >
          <option value="Sort by" defaultValue="Sort by">
            Sort by
          </option>
          <option value="Due">Due date</option>
          <option value="Created">Created date</option>
          <option value="Completed">Completed</option>         
          <option value="Incomplete">Incompleted</option>         
        </select>
      </div>
        <FilterTask
          filteredTasks={filteredTasks}
        />
    </main>
  );
};

export default Main;

