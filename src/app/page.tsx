import { Scoreboard } from '@/components/scoreboard';
import { getMatches } from '@/lib/db';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default async function Home() {
  const matches = await getMatches();

  if (!matches || matches.length === 0) {
    return (
       <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">No matches available right now.</p>
      </div>
    );
  }

  return (
     <div className="container mx-auto py-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="mx-auto w-full max-w-4xl"
        >
          <CarouselContent>
            {matches.map((match) => (
              <CarouselItem key={match.id}>
                <Scoreboard data={match} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
    </div>
  );
}
