import React from 'react'

interface NavbarProps {
  text: string | React.ReactNode;
}

const Navbar = ({text}:NavbarProps) => {
  return (
      <header className="w-full py-6 bg-white shadow-md flex justify-between px-10 items-center text-center">
        <h1 className="text-3xl font-bold text-blue-600">Clone-do</h1>
           <div>
             {text}
           </div>
      </header>
  )
}

export default Navbar