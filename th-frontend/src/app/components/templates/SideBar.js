import {
    LayoutDashboard,
    ListChecks,
    Boxes,
    Tag,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SideBar(){ 
    const router = useRouter();
    

    return (

        <div className="bg-base-100 text-base-content w-64 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <div className="py-4 px-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <LayoutDashboard className="w-6 h-6 text-gray-900 dark:text-white" />
                        <h1 className="text-xl font-semibold">DIY Project Manager</h1>
                    </div>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <ul className="space-y-2 flex-1">
                    <li>
                        <button className="btn btn-ghost w-full justify-start gap-2"  onClick={() => router.push('/projects')}>
                            <Boxes className="w-4 h-4" />
                            Projects
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-ghost w-full justify-start gap-2"  onClick={() => setIsMobileMenuOpen(false)}>
                            <ListChecks className="w-4 h-4" />
                            Tasks
                        </button>
                    </li>
                    <li>
                         <button className="btn btn-ghost w-full justify-start gap-2"  onClick={() => setIsMobileMenuOpen(false)}>
                            <Tag className="w-4 h-4" />
                            Resources
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-ghost w-full justify-start gap-2"  onClick={() => setIsMobileMenuOpen(false)}>
                            <User className="w-4 h-4" />
                            Profile
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-ghost w-full justify-start gap-2"  onClick={() => setIsMobileMenuOpen(false)}>
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
    }
