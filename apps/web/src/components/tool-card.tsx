import Link from 'next/link';
import type { ToolDefinition } from '@nexabit/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="h-full transition-colors hover:border-primary/50 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{tool.name}</CardTitle>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
          <Badge variant="secondary" className="w-fit capitalize">
            {tool.category}
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
