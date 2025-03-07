  import type { University } from '@/types';

  import { UniversityClientComponent } from '@/components/Universitypage';

  interface UniversityPageProps {
    params: { id: string };
  }

  // Fetching university data in a Server Component
  async function getUniversity(id: string): Promise<University | null> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/universities/${id}`, {
        cache: 'no-store', // Ensures fresh data
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data || null;
    } catch {
      return null;
    }
  }

  export default async function UniversityPage({ params }: UniversityPageProps) {
    const {id} = await params;
    const university = await getUniversity(id);
    console.log( {university} );
    

    if (!university) return <div>University not found</div>;

    return <UniversityClientComponent university={university}  />;
  }