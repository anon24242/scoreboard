import { Scoreboard } from '@/components/scoreboard';
import { getMatches } from '@/lib/db';

export default async function Home() {
  const matches = await getMatches();

  if (!matches || matches.length === 0) {
    return (
       <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">No matches available right now.</p>
      </div>
    );
  }

  return (
     <div className="container mx-auto py-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {matches.map((match) => (
            <Scoreboard key={match.id} data={match} />
          ))}
        </div>
    </div>
  );
}
