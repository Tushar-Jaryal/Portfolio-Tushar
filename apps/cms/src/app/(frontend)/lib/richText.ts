type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

function extractText(node: LexicalNode): string {
  if (node.type === 'text') return node.text ?? ''
  return (node.children ?? []).map(extractText).join('')
}

/**
 * Flattens a lexical doc into one string per rendered block. The bio field's
 * editor also allows headings/blockquotes/lists (see fields/richText.ts), so
 * this walks every top-level block type rather than just 'paragraph' —
 * otherwise that content would silently disappear from the About section.
 */
export function richTextToParagraphs(doc: { root?: { children?: LexicalNode[] } } | null | undefined): string[] {
  if (!doc?.root?.children) return []
  const blocks: string[] = []
  for (const node of doc.root.children) {
    if (node.type === 'list') {
      for (const item of node.children ?? []) {
        const text = extractText(item)
        if (text) blocks.push(text)
      }
    } else {
      const text = extractText(node)
      if (text) blocks.push(text)
    }
  }
  return blocks
}
