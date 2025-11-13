import { getMatchById } from '@/lib/db';
import { EditMatchForm } from './edit-form';
import { notFound } from 'next/navigation';

export default async function EditMatchPage({
  params,
}: {
  params: { id: string };
}) {
  if (params.id === 'new') {
    return (
      <div className="container mx-auto py-8">
        <EditMatchForm matchId="new" />
      </div>
    );
  }

  const matchData = await getMatchById(params.id);

  if (!matchData) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <EditMatchForm matchId={matchData.id} initialData={matchData} />
    </div>
  );
}
