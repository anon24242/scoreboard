import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { MatchData, TeamScore } from '@/lib/types';
import { Shield, User, Zap } from 'lucide-react';
import { CricketBallIcon, CricketBatIcon } from './cricket-icons';

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
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg bg-background p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CricketBatIcon className="h-5 w-5" />
                <span>Striker</span>
              </div>
              <p className="text-lg font-bold">{data.striker}</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg bg-background p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-5 w-5" />
                <span>Non-Striker</span>
              </div>
              <p className="text-lg font-bold">{data.nonStriker}</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg bg-background p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CricketBallIcon className="h-5 w-5" />
                <span>Bowler</span>
              </div>
              <p className="text-lg font-bold">{data.bowler}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
