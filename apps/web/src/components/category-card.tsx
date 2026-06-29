import Link from 'next/link';
import type { CategoryDefinition } from '@nexabit/shared';
import { getToolsByCategory } from '@nexabit/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Network,
  Globe,
  ShieldCheck,
  Lock,
  Code,
  Terminal,
} from 'lucide-react';

const iconMap = {
  Network,
  Globe,
  ShieldCheck,
  Lock,
  Code,
  Terminal,
};

export function CategoryCard({ category }: { category: CategoryDefinition }) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] || Network;
  const toolCount = getToolsByCategory(category.slug).length;

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="h-full transition-colors hover:border-primary/50 hover:shadow-md">
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-muted-foreground">{toolCount} tools</span>
        </CardContent>
      </Card>
    </Link>
  );
}
