interface PromptOutcome {
  outcome: "accepted" | "dismissed";
  platform: string;
}

// beforeinstallprompt is considered non-standard, so we need to manually type it
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<PromptOutcome>;

  prompt(): Promise<PromptOutcome>;
}
