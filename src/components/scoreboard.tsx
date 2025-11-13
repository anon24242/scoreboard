import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { MatchData, TeamScore } from '@/lib/types';
import { Shield, Zap } from 'lucide-react';

const TeamScoreDisplay = ({ name, score, wickets, overs }: TeamScore) => (
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

export function Scoreboard({ data }: { data: MatchData }) {
  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <p>No match data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-4xl overflow-hidden shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-primary/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Zap className="h-6 w-6 text-accent" />
              Live Match
            </CardTitle>
            <CardDescription className="font-semibold text-accent">
              {data.status}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <TeamScoreDisplay {...data.teamA} />
            <TeamScoreDisplay {...data.teamB} />
          </div>
          <Separator />
        </CardContent>
      </Card>
    </div>
  );
}
