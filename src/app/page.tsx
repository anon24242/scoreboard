import { Scoreboard } from '@/components/scoreboard';
import { getMatchData } from '@/lib/db';

export default async function Home() {
  const matchData = await getMatchData();
  return <Scoreboard data={matchData} />;
}
