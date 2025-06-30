import ProjectEditPage from '../../../components/projects/ProjectEditPage';
import SideBar from '../../../components/templates/SideBar';

export default async function EditProjectPage({ params }) {
  const { id } = await params;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-8">
          <ProjectEditPage projectId={id} isNew={false} />
        </div>
      </main>
    </div>
  );
} 
