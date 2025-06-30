import ResourceEditPage from '../../../components/resources/ResourceEditPage';
import SideBar from '../../../components/templates/SideBar';

export default async function EditResourcePage({ params }) {
  const { id } = await params;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-8">
          <ResourceEditPage resourceId={id} isNew={false} />
        </div>
      </main>
    </div>
  );
} 
