import { rm, stat, readdir } from 'node:fs/promises'
import { join, normalize } from 'node:path'
import type { CleanerEntry, CleanerResult } from '@/types/models'

const TEMP_DIRS = Array.from(
  new Set(
    [process.env.TEMP, process.env.TMP, process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Temp'), 'C:\\Windows\\Temp']
      .filter(Boolean)
      .map((entry) => normalize(entry as string))
  )
)

async function inspectDirectory(path: string, depth = 1): Promise<CleanerEntry> {
  let size = 0
  let files = 0

  async function walk(currentPath: string, currentDepth: number): Promise<void> {
    const items = await readdir(currentPath, { withFileTypes: true })
    for (const item of items) {
      const nextPath = join(currentPath, item.name)
      try {
        if (item.isDirectory() && currentDepth < depth) {
          await walk(nextPath, currentDepth + 1)
          continue
        }

        const meta = await stat(nextPath)
        if (meta.isFile()) {
          size += meta.size
          files += 1
        }
      } catch {
        continue
      }
    }
  }

  await walk(path, 0)

  return { path, size, files }
}

export class CleanerService {
  async scan(): Promise<CleanerEntry[]> {
    const results = await Promise.allSettled(TEMP_DIRS.map((path) => inspectDirectory(path)))
    return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
  }

  async clean(paths: string[]): Promise<CleanerResult> {
    const result: CleanerResult = {
      deleted: 0,
      freed: 0,
      errors: []
    }

    for (const requestedPath of paths) {
      const target = normalize(requestedPath)
      const allowed = TEMP_DIRS.some((root) => target.startsWith(root))
      if (!allowed) {
        result.errors.push(`Skip unsafe path: ${requestedPath}`)
        continue
      }

      try {
        const entry = await inspectDirectory(target, 6)
        const children = await readdir(target)
        await Promise.all(
          children.map((child) =>
            rm(join(target, child), {
              recursive: true,
              force: true,
              maxRetries: 2
            })
          )
        )
        result.deleted += entry.files
        result.freed += entry.size
      } catch (error) {
        result.errors.push(`${requestedPath}: ${String(error)}`)
      }
    }

    return result
  }
}

export const cleanerService = new CleanerService()
