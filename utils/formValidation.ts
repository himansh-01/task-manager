import {z} from "zod"

const signupInfoSchema=z.object({
    name:z.string().nonempty({message:'name is required'}).regex(/^[A-Za-z ]+$/,{message:"Full name can contain only uppercase,lowercase characters and spaces"}),
    email:z.string().nonempty({message:"email is required!"}).email({message:"Invalid email!"}),
    password:z.string().nonempty({message:'password is required'}).min(6,{message:"password must be atleast 6 characters long"}),
    role:z.enum(['admin','user'],{message:'select valid option'})
})

const loginInfoSchema=z.object({
    email:z.string().nonempty({message:"email is required!"}).email({message:"Invalid email!"}),
    password:z.string().nonempty({message:'password is required'}).min(6,{message:"password must be atleast 6 characters long"}),
    role:z.enum(['admin','user'],{message:'select valid option'})
})

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  dueDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return parsedDate > new Date();
  }, { message: "Due date must be a future date" }),
});

 const editInfoSchema=z.object({
  name:z.string().nonempty({message:'name is required'}).regex(/^[A-Za-z ]+$/,{message:"Full name can contain only uppercase,lowercase characters and spaces"}),
  email:z.string().nonempty({message:"email is required!"}).email({message:"Invalid email!"}),
  password:z.string().nonempty({message:'password is required'}).min(6,{message:"password must be atleast 6 characters long"})
 })

export {signupInfoSchema, loginInfoSchema, taskSchema, editInfoSchema}