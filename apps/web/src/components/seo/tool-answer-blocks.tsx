import { ToolDefinition } from '@nexabit/shared';
import { getToolSeoContent } from '@/lib/seo/tool-content';

export function ToolAnswerBlocks({
  tool,
  seo,
}: {
  tool: ToolDefinition;
  seo: ReturnType<typeof getToolSeoContent>;
}) {
  return (
    <section className="mb-8 grid gap-4 md:grid-cols-3" aria-label="Tool overview">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          What this tool does
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Best for</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{seo.bestFor}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          Common use cases
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {seo.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ToolHowToSteps({ steps, toolName }: { steps: string[]; toolName: string }) {
  if (!steps.length) return null;
  return (
    <section className="mb-8" aria-labelledby="how-to-use">
      <h2 id="how-to-use" className="mb-3 text-xl font-bold">
        How to use {toolName}
      </h2>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
