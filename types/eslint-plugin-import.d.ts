declare module 'eslint-plugin-import' {
  import { ESLint } from 'eslint'

  interface ImportPlugin extends ESLint.Plugin {
    rules: Record<string, ESLint.Rule.RuleModule>
    configs: {
      recommended: ESLint.Config
      typescript: ESLint.Config
      errors: ESLint.Config
      warnings: ESLint.Config
      'stage-0': ESLint.Config
      electron: ESLint.Config
      react: ESLint.Config
      'react-native': ESLint.Config
    }
  }

  const plugin: ImportPlugin
  export = plugin
}
