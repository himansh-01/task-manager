"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import { MdDelete } from 'react-icons/md';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profilePhoto?: string;
  verified: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ROUTE}/user/get_all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
            signal: signal
          }
        );
        setUsers(response.data.result);
        console.log(response.data.result)
      } catch (error) {
        toast('Failed to load users. Please try again.');
        return error
      } finally {
        setLoading(false);
      }
    };
      fetchUsers();
  }, []);

  const handleDeleteTask = async (email: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_ROUTE}/user/delete/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      setUsers(response.data.result);
      toast('User deleted successfully.');
    } catch (error) {
      toast('Failed to delete user. Please try again.');
      return error
    }
  };

  return (
    <div className="container mx-auto p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.email}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <MdDelete onClick={() =>handleDeleteTask(user.email)} className="cursor-pointer"/>
                </div>
                <div className="mt-4">
                  <Link href={`/dashboard/users/${user.email}`}>
                    <Button size="sm" className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;