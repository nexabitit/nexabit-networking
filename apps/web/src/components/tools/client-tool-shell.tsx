'use client';

import { ToolWorkspace } from './tool-workspace';

/** Client-side tools with live-updating results */
export function ClientToolShell({
  title,
  description,
  children,
  result,
  resultFilename,
  showResults = true,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  result: unknown;
  resultFilename?: string;
  /** Set false when result should only appear after an action */
  showResults?: boolean;
}) {
  const hasResult = result !== null && result !== undefined;

  return (
    <ToolWorkspace
      title={title}
      description={description}
      result={hasResult ? result : showResults ? result : undefined}
      resultFilename={resultFilename}
      liveResult={showResults}
    >
      {children}
    </ToolWorkspace>
  );
}
