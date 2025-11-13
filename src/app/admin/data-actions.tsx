'use client';

import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { MatchData } from '@/lib/types';
import { importMatchesFromJson } from './actions';
import { Upload, Download } from 'lucide-react';

export function DataActions({ matches }: { matches: MatchData[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(matches, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'matches.json';
    link.click();
    toast({
      title: 'Success',
      description: 'Match data exported.',
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result;
      if (typeof content !== 'string') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to read file.',
        });
        return;
      }
      
      startTransition(async () => {
        const result = await importMatchesFromJson(content);
        if (result.success) {
          toast({
            title: 'Success',
            description: result.message,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: result.message,
          });
        }
      });
    };
    reader.readAsText(file);
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isPending ? 'Importing...' : 'Import'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  );
}
