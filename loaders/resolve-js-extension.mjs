import fs from 'node:fs/promises'

const knownExtensions = ['.js', '.mjs', '.cjs', '.json']

function hasExtension(specifier) {
  return knownExtensions.some((ext) => specifier.endsWith(ext))
}

async function exists(fileUrl) {
  try {
    await fs.access(fileUrl)
    return true
  } catch {
    return false
  }
}

export async function resolve(specifier, context, defaultResolve) {
  try {
    return await defaultResolve(specifier, context)
  } catch (error) {
    const baseUrl = context.parentURL || context.url
    if (!baseUrl || hasExtension(specifier)) {
      throw error
    }

    const resolved = new URL(specifier, baseUrl)
    const specWithExt = `${specifier}.js`
    const resolvedWithExt = new URL(specWithExt, baseUrl)
    if (await exists(resolvedWithExt)) {
      return defaultResolve(specWithExt, context)
    }
    throw error
  }
}

export function load(url, context, defaultLoad) {
  return defaultLoad(url, context)
}
