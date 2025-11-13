'use client';
import { Button } from '@/components/ui/button';
import { liveUpdate } from '../../actions';
import { useTransition } from 'react';

type LiveUpdateActionsProps = {
  matchId: string;
  team: 'teamA' | 'teamB';
};

export const LiveUpdateActions = ({ matchId, team }: LiveUpdateActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (field: 'score' | 'wickets' | 'overs', delta: number) => {
    startTransition(() => {
      liveUpdate(matchId, team, field, delta);
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Button
        onClick={() => handleUpdate('score', 1)}
        disabled={isPending}
        variant="outline"
      >
        +1 Run
      </Button>
      <Button
        onClick={() => handleUpdate('score', 4)}
        disabled={isPending}
        variant="outline"
      >
        +4 Runs
      </Button>
      <Button
        onClick={() => handleUpdate('score', 6)}
        disabled={isPending}
        variant="outline"
      >
        +6 Runs
      </Button>
      <Button
        onClick={() => handleUpdate('wickets', 1)}
        disabled={isPending}
        variant="destructive"
      >
        Wicket
      </Button>
      <Button
        onClick={() => handleUpdate('overs', 0.1)}
        disabled={isPending}
        variant="outline"
        className="col-span-2"
      >
        +0.1 Overs
      </Button>
       <Button
        onClick={() => handleUpdate('score', -1)}
        disabled={isPending}
        variant="secondary"
        size='sm'
      >
        -1 Run
      </Button>
       <Button
        onClick={() => handleUpdate('wickets', -1)}
        disabled={isPending}
        variant="secondary"
        size='sm'
      >
        -1 Wicket
      </Button>
    </div>
  );
};
