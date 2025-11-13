import { getMatches } from '@/lib/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Radio } from 'lucide-react';
import { DataActions } from './data-actions';

export default async function AdminPage() {
  const matches = await getMatches();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Manage Matches</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <DataActions matches={matches} />
            <Button asChild>
              <Link href="/admin/edit/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Match
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teams</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    <div className="font-medium">
                      {match.teamA.name} vs {match.teamB.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.teamA.name}: {match.teamA.score}/{match.teamA.wickets} ({match.teamA.overs})
                      <br />
                      {match.teamB.name}: {match.teamB.score}/{match.teamB.wickets} ({match.teamB.overs})
                    </div>
                  </TableCell>
                  <TableCell>{match.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/live/${match.id}`}>
                        <Radio className="mr-2 h-4 w-4" /> Live Update
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/edit/${match.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
