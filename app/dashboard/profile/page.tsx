"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';


const Profile = () => {
  const [username, setUsername] = useState<string>("")
  const [useremail, setUseremail] = useState()
  const [formData, setFormData] = useState({
    name: username,
    email:useremail,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal

   const fetchUser = async() => {
     try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email')
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_ROUTE}/user/one/${email}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          signal: signal
        }
      );
      setUsername(response.data.result.user)
      setUseremail(response.data.result.email)
    } catch (error) {
      toast("Please try again.");
      return error
      
    } finally {
      setIsLoading(false);
    }
  }
  let isMounted = true;
  if (isMounted) {
    fetchUser();
  }

  return () => {
    isMounted = false;
  };
  },[formData])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if(formData.name ==="" && formData.email === ""){
      e.preventDefault()
      toast("no input provided")
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_ROUTE}/user/update/`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
      setUseremail(response.data.result.email)
      setUsername(response.data.result.name)
      toast("Your profile has been updated successfully.");
    } catch (error) {
      toast("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center mb-8 gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
          {username.substring(0, 2).toUpperCase()}
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">{username}</h2>
          <p className="text-gray-600">{useremail}</p>
        </div>

        <div className="ml-auto">
          <Link href="/dashboard/">
            <Button className="bg-blue-600 text-white">Go to home</Button>
          </Link>
        </div>
      </div>
    
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name?? ""} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email?? ""} 
              onChange={handleChange} 
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Edit'}
            </Button>
            <Link href="/dashboard">
              <Button type="button" variant="outline">Go back</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;