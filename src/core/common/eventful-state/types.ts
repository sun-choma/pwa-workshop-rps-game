export type State<Config> = {
  [Key in keyof Config as Key extends string | symbol | number
    ? Key
    : string]: Config[Key] extends {
    type: unknown;
  }
    ? Config[Key]["type"]
    : never;
};

export type EventMap<Config> =
  Config extends Record<
    keyof Config,
    {
      triggers: string;
      type: unknown;
    }
  >
    ? {
        [Key in keyof Config as Config[Key]["triggers"]]: [Config[Key]["type"]];
      }
    : never;
