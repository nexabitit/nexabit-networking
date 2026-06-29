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
  ArrowRight,
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
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <Card className="h-full card-hover">
        <CardHeader>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-cyan-500/10 text-primary transition-all duration-300 group-hover:from-primary group-hover:to-blue-600 group-hover:text-primary-foreground">
              <Icon className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {category.name}
          </p>
          <CardTitle className="text-lg leading-snug">{category.useCaseLabel}</CardTitle>
          <CardDescription className="line-clamp-2">{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {toolCount} tools
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
