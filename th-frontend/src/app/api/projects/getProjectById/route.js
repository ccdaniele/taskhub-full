import { NextResponse } from 'next/server'


export async function GET (request){
    const id = await request.json
try {
    const response = await fetch(`http://localhost:3000/project/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })      
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Failed to delete" }, { status: response.status });
    }

    return NextResponse.json({ data }, { status: 200 });
    
} catch(error){
   
 return NextResponse.json({ error: "Server error" }, { status: 500 });
}
}
