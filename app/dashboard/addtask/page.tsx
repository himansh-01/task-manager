"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"; 
import { useRouter } from "next/navigation";

const AddTask = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
    assignedBy: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const email = localStorage.getItem('email') as string | null
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      assignedTo: email || "",
      assignedBy: email || ""
    });
    console.log(formData)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_ROUTE}/task/add`, 
        formData,
        {headers: 
          {
          Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      toast("Your task has been created successfully.",);
      
      router.push('/dashboard/');
    } catch (error) {
      toast("Failed to create task. Please try again.");
      return error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create your Task</h2>
            <Link href="/dashboard/tasks">
              <Button variant="outline">Go to tasks</Button>
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                rows={4} 
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                type="date" 
                id="dueDate" 
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Add task'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTask;