import { Scoreboard } from '@/components/scoreboard';
import { getMatches } from '@/lib/db';

export default async function Home() {
  const matches = await getMatches();
  // For now, display the first match on the homepage
  const matchData = matches[0];
  return <Scoreboard data={matchData} />;
}
