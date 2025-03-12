"use client" 
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { toast } from "sonner";
import { signupInfoSchema } from "@/utils/formValidation";

export default function Signup() {
  type Role = "admin" | "user";
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selected, setSelected] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as Role
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
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
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      
      if (profilePhoto) {
        formDataToSend.append("photo", profilePhoto);
      }
      const validatedData = signupInfoSchema.parse(formDataToSend)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ROUTE}/auth/signup`,
        validatedData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Signup successful. Please check your email for verification.");
        router.push('/login');
      } else {
        toast(response.data.message || "Something went wrong");
      }
    } catch (error:any) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data?.message || "Error during signup");
      }
      if (error.name === "ZodError") {
        const pull = error.issues.map((err: any) => err.message)
        toast(pull) 
      }
      else {
        toast("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 bg-[#f3f2f2] min-h-screen">
      <Navbar text={
        <div className="flex">
        <Button 
          className="ml-4 bg-blue-600 text-white"
          onClick={() => redirect('/login')}
        >Login</Button>
        <Button 
          className="ml-4 bg-blue-600 text-white"
          onClick={() => router.back()}
        >
          Go back
        </Button>
        </div>
      }/>
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto my-auto">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="relative font-bold text-3xl text-center mb-4">Signup</div>
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
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                placeholder="Your name here" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-[98%]">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="Example@gmail.com" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                required
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
                  onChange={handleInputChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            <div className="w-[98%]">
              <Label htmlFor="photo">Profile</Label>
              <Input 
                id="photo"
                accept="image/*" 
                type="file" 
                name="photo" 
                onChange={handleFileChange} 
              />
            </div>
            <Button 
              className="w-full bg-blue-500" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
          </div>
          <p className="text-center text-sm mt-4">
            Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}