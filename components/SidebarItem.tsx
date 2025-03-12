import { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode; // JSX icons
  label: string; // Must be a string!
  active?: boolean; // Optional prop, default false
  onClick: (label: string) => void; // Receives the string label
}

export const SidebarItem = ({ icon, label, active = false, onClick }: SidebarItemProps) => (
  <div 
    onClick={() => onClick(label)}
    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${
      active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);
