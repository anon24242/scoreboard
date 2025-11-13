'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { MatchData } from '@/lib/types';
import { updateMatchData } from './actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const numberSchema = z.preprocess(
  (val) => (val === '' ? undefined : parseFloat(String(val))),
  z
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Must be a positive number')
);

const formSchema = z.object({
  teamAName: z.string().min(2, 'Name must be at least 2 characters.'),
  teamAScore: numberSchema,
  teamAWickets: numberSchema.max(10),
  teamAOvers: numberSchema,
  teamBName: z.string().min(2, 'Name must be at least 2 characters.'),
  teamBScore: numberSchema,
  teamBWickets: numberSchema.max(10),
  teamBOvers: numberSchema,
  striker: z.string().min(2, 'Name must be at least 2 characters.'),
  nonStriker: z.string().min(2, 'Name must be at least 2 characters.'),
  bowler: z.string().min(2, 'Name must be at least 2 characters.'),
  status: z.string().min(10, 'Status must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function UpdateMatchForm({ initialData }: { initialData: MatchData }) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamAName: initialData.teamA.name,
      teamAScore: initialData.teamA.score,
      teamAWickets: initialData.teamA.wickets,
      teamAOvers: initialData.teamA.overs,
      teamBName: initialData.teamB.name,
      teamBScore: initialData.teamB.score,
      teamBWickets: initialData.teamB.wickets,
      teamBOvers: initialData.teamB.overs,
      striker: initialData.striker,
      nonStriker: initialData.nonStriker,
      bowler: initialData.bowler,
      status: initialData.status,
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await updateMatchData(values);
    if (result?.success) {
      toast({
        title: 'Success',
        description: 'Match data updated successfully.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update match data. Please check the form for errors.',
      });
    }
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>Update Match Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Team A</h3>
              <FormField
                control={form.control}
                name="teamAName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="teamAScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamAWickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wickets</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamAOvers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overs</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Team B</h3>
              <FormField
                control={form.control}
                name="teamBName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="teamBScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamBWickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wickets</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamBOvers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overs</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Current Players</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="striker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Striker</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nonStriker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Striker</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bowler"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bowler</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Match Status</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    A short summary of the current match situation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? 'Updating...'
                : 'Update Scoreboard'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
