import { getMatchData } from '@/lib/db';
import { UpdateMatchForm } from './update-form';

export default async function AdminPage() {
  const matchData = await getMatchData();

  return (
    <div className="container mx-auto py-8">
      <UpdateMatchForm initialData={matchData} />
    </div>
  );
}
