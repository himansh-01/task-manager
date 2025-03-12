"use client"
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleLogout } from "./action";
import { redirect } from "next/navigation";

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const onLogoutClick = async () => {
      try {
        localStorage.clear()
        const result = await handleLogout();
        
        if (result.success) {
          alert('Logged out successfully!'); 
          redirect('/login');
        } else {
          toast('Logout failed!');
        }
      } catch (error) {
        console.error('Logout error:', error);
        toast('An error occurred during logout');
      }
    };
    return (
        <div className="h-screen">
          <Navbar text={<form onClick={onLogoutClick}><Button className="ml-4 bg-blue-600 text-white">Logout</Button></form>} />
          <div className="flex h-auto min-h-full bg-gray-100">
              <Sidebar />
              {children}
          </div>
        </div>
    );
  }