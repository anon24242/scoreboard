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
import { saveMatchData } from '../../actions';
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
    .optional()
    .default(0)
);

const wicketsSchema = z.preprocess(
  (val) => (val === '' ? undefined : parseFloat(String(val))),
  z
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Must be a positive number')
    .max(10, 'Wickets cannot exceed 10')
    .optional()
    .default(0)
);

const formSchema = z.object({
  id: z.string().optional(),
  teamAName: z.string().min(2, 'Name must be at least 2 characters.'),
  teamAScore: numberSchema,
  teamAWickets: wicketsSchema,
  teamAOvers: numberSchema,
  teamBName: z.string().min(2, 'Name must be at least 2 characters.'),
  teamBScore: numberSchema,
  teamBWickets: wicketsSchema,
  teamBOvers: numberSchema,
  status: z.string().min(10, 'Status must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: matchId,
      teamAName: initialData.teamA.name,
      teamAScore: initialData.teamA.score,
      teamAWickets: initialData.teamA.wickets,
      teamAOvers: initialData.teamA.overs,
      teamBName: initialData.teamB.name,
      teamBScore: initialData.teamB.score,
      teamBWickets: initialData.teamB.wickets,
      teamBOvers: initialData.teamB.overs,
      status: initialData.status,
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveMatchData(values);
    if (result?.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          result.errors._form?.join(', ') ||
          'Failed to save match data. Please check the form for errors.',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Match data saved successfully.',
      });
    }
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>
          {matchId === 'new' ? 'Add New Match' : 'Edit Match'}
        </CardTitle>
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
                </I
                  </FormItem>
              )}
            />

            <div className="flex gap-4">
               <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Match'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin">Cancel</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
