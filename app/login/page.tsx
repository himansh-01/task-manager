"use client"; 

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import axios from "axios";
import { loginInfoSchema } from "@/utils/formValidation";
import { ZodError } from "zod";


export default function Login() {
  type Role = "admin" | "user";
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selected, setSelected] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user" as Role
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };
  
  const handleRoleChange = (role: Role) => {
    setSelected(role);
    setFormData({
      ...formData,
      role
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const validatedData = loginInfoSchema.parse(formData)
     
      const response = await axios.post(`${process.env.NEXT_PUBLIC_ROUTE}/auth/login`, validatedData,{
        withCredentials:true
      })
      
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.user.email)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('name', data.user.name)
      toast.success('Login successful!');
      
      router.push('/dashboard');
      
    } catch (error:any) {
      if (error instanceof ZodError) {
        return error?.issues?.map((err:any) => toast(err.message))
      }
      else if(axios.isAxiosError(error)){
        toast(error.message || "Something went wrong")
      }
      else{
        toast("unexpected error occured")
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col gap-12 bg-[#f3f2f2] min-h-screen">
      <Navbar text={
        <div className="flex">
          <Button 
          className="ml-4 bg-blue-600 text-white"
          onClick={() => redirect('/signup')}
        >Signup</Button>
        <Button 
          className="ml-4 bg-blue-600 text-white"
          onClick={() => router.back()}
        >Go back</Button>
        </div>
      }/>
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto my-auto">
        <div className="w-full min-w-sm max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="relative font-bold text-3xl text-center mb-4">Login</div>
          <form className="space-y-4 flex flex-col items-center" onSubmit={handleSubmit}>  
            <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-12 w-[9rem] self-center">
              {(["admin", "user"] as Role[]).map((role) => (
                <label
                  key={role}
                  className={`px-4 py-2 cursor-pointer ${
                    selected === role ? "bg-blue-600 text-white" : "bg-white text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selected === role}
                    onChange={() => handleRoleChange(role)}
                    className="hidden"
                  />
                  {role}
                </label>
              ))}
            </div>
            <div className="w-[98%]">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="Example@gmail.com" 
                name="email" 
                value={formData.email}
                onChange={handleChange} 
              />
            </div>
            <div className="w-[98%]">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password here"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            <Button 
              className="w-full bg-blue-500" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
          <p className="text-center text-sm mt-4">
            <Link href="/forgot-password" className="text-blue-600">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
