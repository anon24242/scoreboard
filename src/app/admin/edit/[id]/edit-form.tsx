'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { MatchData } from '@/lib/types';
import { saveMatchData, type State } from '../../actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Match'}
    </Button>
  );
};

const defaultInitialData = {
  teamA: { name: '', score: 0, wickets: 0, overs: 0 },
  teamB: { name: '', score: 0, wickets: 0, overs: 0 },
  status: '',
};

export function EditMatchForm({
  matchId,
  initialData = defaultInitialData,
}: {
  matchId: string;
  initialData?: Omit<MatchData, 'id'>;
}) {
  const { toast } = useToast();
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(saveMatchData, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      } else {
        toast({
          title: 'Success',
          description: 'Match data saved successfully.',
        });
      }
    }
  }, [state, toast]);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>
          {matchId === 'new' ? 'Add New Match' : 'Edit Match'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="id" value={matchId} />
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Team A</h3>
            <div>
              <Label htmlFor="teamAName">Team Name</Label>
              <Input
                id="teamAName"
                name="teamAName"
                defaultValue={initialData.teamA.name}
              />
               {state.errors?.teamAName && <p className="text-sm text-destructive">{state.errors.teamAName}</p>}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="teamAScore">Score</Label>
                <Input
                  id="teamAScore"
                  name="teamAScore"
                  type="number"
                  defaultValue={initialData.teamA.score}
                />
                 {state.errors?.teamAScore && <p className="text-sm text-destructive">{state.errors.teamAScore}</p>}
              </div>
              <div>
                <Label htmlFor="teamAWickets">Wickets</Label>
                <Input
                  id="teamAWickets"
                  name="teamAWickets"
                  type="number"
                  defaultValue={initialData.teamA.wickets}
                />
                {state.errors?.teamAWickets && <p className="text-sm text-destructive">{state.errors.teamAWickets}</p>}
              </div>
              <div>
                <Label htmlFor="teamAOvers">Overs</Label>
                <Input
                  id="teamAOvers"
                  name="teamAOvers"
                  type="number"
                  step="0.1"
                  defaultValue={initialData.teamA.overs}
                />
                 {state.errors?.teamAOvers && <p className="text-sm text-destructive">{state.errors.teamAOvers}</p>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Team B</h3>
             <div>
              <Label htmlFor="teamBName">Team Name</Label>
              <Input
                id="teamBName"
                name="teamBName"
                defaultValue={initialData.teamB.name}
              />
               {state.errors?.teamBName && <p className="text-sm text-destructive">{state.errors.teamBName}</p>}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="teamBScore">Score</Label>
                <Input
                  id="teamBScore"
                  name="teamBScore"
                  type="number"
                  defaultValue={initialData.teamB.score}
                />
                {state.errors?.teamBScore && <p className="text-sm text-destructive">{state.errors.teamBScore}</p>}
              </div>
              <div>
                <Label htmlFor="teamBWickets">Wickets</Label>
                <Input
                  id="teamBWickets"
                  name="teamBWickets"
                  type="number"
                  defaultValue={initialData.teamB.wickets}
                />
                 {state.errors?.teamBWickets && <p className="text-sm text-destructive">{state.errors.teamBWickets}</p>}
              </div>
              <div>
                <Label htmlFor="teamBOvers">Overs</Label>
                <Input
                  id="teamBOvers"
                  name="teamBOvers"
                  type="number"
                  step="0.1"
                  defaultValue={initialData.teamB.overs}
                />
                 {state.errors?.teamBOvers && <p className="text-sm text-destructive">{state.errors.teamBOvers}</p>}
              </div>
            </div>
          </div>

          <Separator />
          <div>
            <Label htmlFor="status">Match Status</Label>
            <Textarea
              id="status"
              name="status"
              defaultValue={initialData.status}
            />
            <p className="text-sm text-muted-foreground">
              A short summary of the current match situation.
            </p>
             {state.errors?.status && <p className="text-sm text-destructive">{state.errors.status}</p>}
          </div>
          
           {state.errors?._form && <p className="text-sm text-destructive">{state.errors._form}</p>}


          <div className="flex gap-4">
            <SubmitButton />
            <Button variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
