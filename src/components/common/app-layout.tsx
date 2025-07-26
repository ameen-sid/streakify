import React, { useState, ReactNode } from "react";
import { BrainCircuit, ListTodo, Settings, UserCircle, LogOut, Menu, X, Star, LayoutDashboard, BarChart3 } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  avatar: string;
}

const AppLayout = ({ children, avatar }: AppLayoutProps) => {
    
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="lg:pl-64 flex flex-col flex-1">
                <Header onMenuClick={() => setSidebarOpen(true)} avatar={avatar} />
                <main className="flex-1 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

interface HeaderProps {
  onMenuClick: () => void;
  avatar: string;
}

const Header = ({ onMenuClick, avatar }: HeaderProps) => {
   
    // const user = { avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Three' };
    const user = { avatar: avatar };
    // console.log(user);

    return (
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm lg:hidden">
            <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none lg:hidden" onClick={onMenuClick}>
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
                <div className="flex-1 flex">
                    <BrainCircuit className="h-8 w-8 text-black" />
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                    <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
                </div>
            </div>
        </div>
    );
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    
    const user = {
        fullName: 'Alex Doe',
        avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AD',
    };
    
    const navigation = [
        { name: "Today's Log", href: '/today', icon: ListTodo },
        { name: 'Disciplines', href: '/disciplines', icon: Settings },
        { name: 'Grid Dashboard', href: '/dashboard/grid', icon: LayoutDashboard },
        { name: 'Summary Dashboard', href: '/dashboard/summary', icon: BarChart3 },
        { name: 'Monthly Highlights', href: '/dashboard/highlights', icon: Star },
        { name: 'Profile', href: '/profile', icon: UserCircle },
    ];

    const SidebarContent = () => (
        <>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                    <BrainCircuit className="h-8 w-8 text-black" />
                    <span className="ml-3 text-xl font-bold">Discipline Planner</span>
                </div>
                <nav className="mt-8 px-2 space-y-1">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-gray-600 hover:bg-gray-100 hover:text-black group flex items-center px-2 py-2 text-base font-medium rounded-md">
                            <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                            {item.name}
                        </a>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <a href="#" className="w-full flex-shrink-0 group block">
                    <div className="flex items-center">
                        <div><LogOut className="inline-block h-9 w-9 text-gray-500"/></div>
                        <div className="ml-3"><p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Log Out</p></div>
                    </div>
                </a>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`} role="dialog" aria-modal="true">
                <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button type="button" className={`ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)}>
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <SidebarContent />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 bg-white">
                <SidebarContent />
            </div>
        </>
    );
};

export default AppLayout;