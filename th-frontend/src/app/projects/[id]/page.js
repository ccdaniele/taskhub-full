import Project from "app/components/projects/Project";

async function getProject(id) {
    const res = await fetch(`http://localhost:3000/projects/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch project');
    }

    return res.json();
}

export default async function ProjectPage({ params }) {
    const { id } = await params; // Directly access params.id
    const project = await getProject(id); // Pass the id to your fetch function

    
    return <Project project={project} />;
}
