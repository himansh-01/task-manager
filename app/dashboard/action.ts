"use server"
import axios from 'axios';
import { cookies } from 'next/headers';

export async function handleLogout() {
    const cookieStore = await cookies();
    cookieStore.delete('Authorization');

  try{
    await axios.post(`${process.env.NEXT_PUBLIC_ROUTE}/auth/logout`,{
        withCredentials: true
    });
    return {success: true}
  }
  catch(err:any){
    return {success: false}
  }

}