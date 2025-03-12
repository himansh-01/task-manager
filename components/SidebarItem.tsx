export const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <div 
    onClick={() => onClick(label)}
    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}>
    {icon}
    <span>{label}</span>
  </div>
);