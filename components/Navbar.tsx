import React from 'react'
import { Button } from './ui/button'

const Navbar = (props:any) => {
  return (
      <header className="w-full py-6 bg-white shadow-md flex justify-between px-10 items-center text-center">
        <h1 className="text-3xl font-bold text-blue-600">Clone-do</h1>
           <div>
             {props.text}
           </div>
      </header>
  )
}

export default Navbar