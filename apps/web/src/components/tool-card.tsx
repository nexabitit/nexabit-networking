import Link from 'next/link';
import type { ToolDefinition } from '@nexabit/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden card-hover">
        <div className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-gradient-to-r from-primary to-cyan-500 transition-transform duration-300 group-hover:scale-x-100" />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold transition-colors group-hover:text-primary">
              {tool.name}
            </CardTitle>
            <ArrowRight className="h-4 w-4 shrink-0 translate-x-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary" />
          </div>
          <Badge variant="secondary" className="w-fit capitalize">
            {tool.category}
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 text-sm leading-relaxed">
            {tool.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
