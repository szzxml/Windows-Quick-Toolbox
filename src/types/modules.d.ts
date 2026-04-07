declare module 'sudo-prompt' {
  interface Options {
    name?: string
  }

  function exec(
    command: string,
    options: Options,
    callback: (error: Error | null, stdout?: string, stderr?: string) => void
  ): void

  const sudoPrompt: {
    exec: typeof exec
  }

  export default sudoPrompt
}
