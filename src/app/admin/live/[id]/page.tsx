import { getMatchById } from '@/lib/db';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import type { TeamScore } from '@/lib/types';
import { LiveUpdateActions } from './live-update-actions';

const TeamLiveScore = ({ name, score, wickets, overs }: TeamScore) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <Shield className="h-8 w-8 text-muted-foreground" />
      <span className="text-3xl font-bold">{name}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-bold tracking-tighter">
        {score}-{wickets}
      </span>
      <span className="text-xl text-muted-foreground">({overs})</span>
    </div>
  </div>
);

export default async function LiveUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const match = await getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Matches
          </Link>
        </Button>
      </div>

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">Live Score Update</CardTitle>
          <CardDescription>{match.status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg border bg-card-foreground/5 p-4">
            <TeamLiveScore {...match.teamA} />
            <LiveUpdateActions matchId={match.id} team="teamA" />
          </div>

          <Separator />

          <div className="space-y-4 rounded-lg border bg-card-foreground/5 p-4">
            <TeamLiveScore {...match.teamB} />
            <LiveUpdateActions matchId={match.id} team="teamB" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
