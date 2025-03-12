"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiUser } from "react-icons/fi";
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'in-progress';
  createdAt: string;
  assignedTo: string;
  assignedBy: string
}

const Page = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true);
  const [popupTask, setPopupTask] = useState<Task | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

   // Modal input states
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
    const [taskDueDate, setTaskDueDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 3;
  
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSubmitTask = async (_id: string) => {
    const email = localStorage.getItem('email')
    if (!email) return;

    if (!taskTitle || !taskDescription || !taskDueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      dueDate: new Date(taskDueDate),
      assignedBy: email,
      assignedTo: email,
    };

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_ROUTE}/task/update/${_id}`, newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
      setTasks([...tasks, response.data]);
      toast("Task edited successfully");
      setShowModal(false);
      resetModalFields();
    } catch (error) {
      toast("Failed to edit task");
      return error
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setTasks(tasks);
      return;
    }

    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTasks(filtered);
  }

  const resetModalFields = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('pending');
    setTaskDueDate('');
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = event.target.value;
  
    const sortedTasks: Task[] = [...tasks]; 
  
    if (sort === "Due") {
      const sorted = sortedTasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setTasks(sorted);
    } else if (sort === "Created") {
      const sorted = sortedTasks.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setTasks(sorted);
    } else if (sort === "Completed") {
      const completedTasks = tasks.filter((task) => task.status === "completed");
      setTasks(completedTasks);
    } else if (sort === "Incomplete") {
      const incompleteTasks = tasks.filter((task) => task.status !== "completed");
      setTasks(incompleteTasks);
    } else {
      setTasks(tasks);
    }
  };

  const handleCompleteTask = async (_Id: string) => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email')
      await axios.put(
        `${process.env.NEXT_PUBLIC_ROUTE}/task/update/${_Id}`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      const updatedTasks = tasks.map((task) =>
        task._id === _Id ? { ...task, status: 'completed' } : task
      );

      setTasks(
        updatedTasks
          .filter((task) => task.assignedTo !== email)
          .map((task) => ({
            ...task,
            status: task.status as 'pending' | 'completed' | 'in-progress'
          }))
      );
      setTasks(
        updatedTasks
          .filter((task) => task.assignedTo !== email)
          .map((task) => ({
            ...task,
            status: task.status as 'pending' | 'completed' | 'in-progress'
          }))
      );
      toast('Task marked as completed successfully.');
    } catch (error) {
      toast('Failed to complete task. Please try again.');
      return error
    }
  };

  const handleDeleteTask = async (_Id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_ROUTE}/task/delete/${_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      const updatedTasks = tasks.filter((task) => task._id !== _Id);
      setTasks(updatedTasks);
      toast('Task deleted successfully.');
    } catch (error) {
      toast('Failed to delete task. Please try again.');
      return error
    }
  };

    const handleTaskClick = (task: Task) => {
       setPopupTask(task);
     };

  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal

    const fetchTasks = async () => {
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
        );
        const resp = response.data.result

        const userTasks = resp.filter((task: Task) => task?.assignedTo === email && task?.assignedBy === "admin");

        setTasks(userTasks);
      } catch (error) {
        toast('Failed to load tasks. Please try again.');
        return error
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setPopupTask(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <main className="flex-1 p-10 max-w-[77.5rem]">
      <h1 className="text-3xl font-semibold">
        <FiUser className='inline mr-2 relative top-[-0.3rem]' />
        Assigned to me
      </h1>

      <div className="mt-5 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search your task"
          className="flex-1 p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="p-3 h-11 w-11 bg-blue-500 text-white rounded-md hover:bg-blue-700" onClick={handleSearch}>
          <FaSearch />
        </button>

        <select
          name='sort'
          className='border rounded-md p-2 text-lg'
          onChange={handleSortChange}
        >
          <option value="">Sort by</option>
          <option value="Due">Due date</option>
          <option value="Created">Created date </option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) :
            tasks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">You don&apos;t have any tasks assigned by admin yet</p>
                </div>
              ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative mt-12">
              {currentTasks.map((task) => (
                <div key={task._id} className="relative">
                  <Card onClick={(e) => handleTaskClick(task)}>
                    <CardContent className="p-6">
                      <div className="mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                      <h3 className="font-medium text-lg mb-2">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                      <div className="text-xs text-gray-500">
                        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <p>Created: {formatDistanceToNow(new Date(task.createdAt))} ago</p>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-between">
                      {task.status !== 'completed' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteTask(task._id);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
  
                  {popupTask && popupTask._id === task._id && (
                    <div
                      ref={popupRef}
                      className="absolute bg-white border rounded shadow-md p-4 z-10"
                      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                      <Button
                        onClick={() => {
                          setShowModal(true)
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task._id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
  
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
  
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => paginate(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                >
                  {page}
                </Button>
              ))}
  
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </>
        )}
        {showModal && (
                <div className="fixed inset-0 bg-[#00000053] bg-opacity-30 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">Edit your Task</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-md"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Due Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-md"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value as Task["status"])}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
        
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => { setShowModal(false); resetModalFields(); }}>
                          Cancel
                        </Button>
                        <Button onClick={() =>handleSubmitTask(popupTask?._id?? "")} className="bg-blue-600 text-white">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
    </main>
  );
};

export default Page;
