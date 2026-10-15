/**
 * Codex "Contents" links (site audit, 15 Oct 2026). The sidebar used to slug each label ("Pattern 1: ToT" →
 * "#pattern-1:-tot"), which matched no section id on 6 of the 10 issues, so those links went nowhere. The labels are
 * written in section order, so each one now points at its section's real id: "Quick Answer" → the quick-answer box,
 * "FAQ" → the FAQ block, everything else → the next section in order.
 */
export interface TocSource {
  toc: string[];
  sections: { id: string }[];
}

export const tocEntries = ({ toc, sections }: TocSource): { label: string; id: string }[] => {
  let next = 0;
  return toc.map((label) => {
    if (/^faq$/i.test(label)) return { label, id: 'faq' };
    if (/^quick answer$/i.test(label)) return { label, id: 'quick-answer' };
    const section = sections[next++];
    return { label, id: section ? section.id : 'faq' };
  });
};
