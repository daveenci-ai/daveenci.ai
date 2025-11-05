/**
 * AI Prompts Configuration
 * Contains all prompts used for article generation
 */

/**
 * Get the rich content sections configuration
 */
export function getRichContentSections() {
  return [
    {
      name: 'PROS_CONS',
      contentInstructions: `PROS & CONS TABLE:
   - Present as a clear comparison table
   - List 5-7 pros and 5-7 cons
   - Be balanced and honest
   - Include brief explanations for each point`,
      formatInstructions: `PROS & CONS (always as table):
   <div class="pros-cons-section">
     <h2>Pros & Cons</h2>
     <table class="pros-cons-table">
       <thead>
         <tr>
           <th class="pros-header">✅ Pros</th>
           <th class="cons-header">❌ Cons</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td class="pros-cell">
             <strong>Pro Title</strong>
             <span class="text-slate-600">Explanation...</span>
           </td>
           <td class="cons-cell">
             <strong>Con Title</strong>
             <span class="text-slate-600">Explanation...</span>
           </td>
         </tr>
       </tbody>
     </table>
   </div>`
    },
    {
      name: 'ALTERNATIVES',
      contentInstructions: `ALTERNATIVES SECTION:
   - List 3-5 alternative solutions/approaches
   - Brief description of each (2-3 sentences)
   - When to use each alternative`,
      formatInstructions: `ALTERNATIVES:
   <div class="alternatives-section">
     <h2>Alternatives to Consider</h2>
     <div class="alternative-card">
       <h3>🔄 Alternative Name</h3>
       <p class="text-slate-700">Description...</p>
       <p class="text-slate-600 text-sm"><strong>Best for:</strong> When to use this...</p>
     </div>
   </div>`
    },
    {
      name: 'COMMON_MISTAKES',
      contentInstructions: `COMMON MISTAKES SECTION:
   - List 3-5 critical mistakes to avoid (vary the number - don't always use 5)
   - Use warning/alert formatting
   - Explain why each is a mistake
   - Provide the correct approach
   - Keep it concise and focused on the most impactful mistakes`,
      formatInstructions: `COMMON MISTAKES (clean cards with inline icons):
   <div class="mistakes-section">
     <h2>⚠️ Common Mistakes to Avoid</h2>
     <div class="mistake-card">
       <h3 class="mistake-title"><span class="mistake-icon">❌</span> Mistake Title</h3>
       <p class="mistake-description">Why this is wrong...</p>
       <div class="mistake-solution">
         <strong>✅ Instead:</strong> The correct approach...
       </div>
     </div>
   </div>`
    },
    {
      name: 'TROUBLESHOOTING',
      contentInstructions: `TROUBLESHOOTING SECTION:
   - Problem/solution format
   - 3-5 common issues (vary the number - don't always use 5)
   - Step-by-step solutions
   - Focus on the most frequent or impactful problems`,
      formatInstructions: `TROUBLESHOOTING:
   <div class="alternatives-section">
     <h2>🔧 Troubleshooting Guide</h2>
     <div class="alternative-card">
       <h3>🚨 Problem: [Issue Title]</h3>
       <p class="text-slate-700"><strong>Solution:</strong></p>
       <ol class="list-decimal list-inside space-y-2 text-slate-700">
         <li>Step 1...</li>
         <li>Step 2...</li>
       </ol>
     </div>
   </div>`
    },
    {
      name: 'EXAMPLES',
      contentInstructions: `EXAMPLES SECTION:
   - 2-3 detailed real-world examples
   - Walk through each example step-by-step
   - Include outcomes/results`,
      formatInstructions: `EXAMPLES:
   <div class="examples-section">
     <h2>💡 Real-World Examples</h2>
     <div class="example-card">
       <h3>Example 1: [Title]</h3>
       <p class="example-context"><strong>Context:</strong> ...</p>
       <p class="example-approach"><strong>Approach:</strong> ...</p>
       <p class="example-outcome"><strong>Outcome:</strong> ...</p>
     </div>
   </div>`
    },
    {
      name: 'CHECKLIST',
      contentInstructions: `CHECKLIST SECTION:
   - Actionable checklist format
   - 10-15 items to check/complete
   - Organized by phase or category
   - Keep items SHORT and ACTION-ORIENTED (6-10 words max)
   - Use strong action verbs (Create, Review, Set up, Test, etc.)`,
      formatInstructions: `CHECKLIST:
   <h2>✅ Action Checklist</h2>
   <div class="checklist-section">
     <div class="checklist-category">
       <h3>Phase 1: [Category]</h3>
       <ul class="checklist-items">
         <li class="checklist-item">
           <label>
             <input type="checkbox"> <span>Concise, actionable item</span>
           </label>
         </li>
       </ul>
     </div>
   </div>
   
   CHECKLIST REQUIREMENTS:
   - Keep items SHORT and ACTION-ORIENTED (6-10 words max)
   - Use strong action verbs (Create, Review, Set up, Test, etc.)
   - Make items specific and measurable
   - Organize by logical phases/categories (3-4 categories)
   - 10-15 total items across all categories
   - Each item should be independently completable`
    }
  ];
}

/**
 * Build the brand context for content generation
 */
export function buildBrandContext(brandEssence, currentDate) {
  let brandContext = 'You are an expert content writer for Crowley Capital, creating high-quality, informative content for startup founders.';
  
  if (brandEssence.positioning) {
    brandContext += `\n\nBRAND POSITIONING:\n${brandEssence.positioning}`;
  }
  
  if (brandEssence.tone) {
    brandContext += `\n\nTONE & STYLE:\n${brandEssence.tone}`;
  }
  
  if (brandEssence.brand_pillars) {
    brandContext += `\n\nBRAND PILLARS:\n${brandEssence.brand_pillars}`;
  }
  
  brandContext += `\n\nIMPORTANT CONTENT GUIDANCE:
- EVERGREEN LANGUAGE: Avoid specific years, dates, or "as of" statements (no "2025," "currently," "today"). Use relative terms like "recent," "modern," "contemporary," "latest."
- TIMELESS PRINCIPLES: Focus on fundamental concepts and strategies that remain relevant over time.
- EXAMPLES: When citing trends or data, use phrases like "recent studies show..." rather than "2025 studies show..."
- BODY CONTENT: Can reference modern trends and contemporary examples, but frame them as ongoing patterns rather than time-bound events.
- Quick Answer MUST be completely evergreen and timestamp-free.
Keep content fresh, actionable, and relevant to the startup ecosystem without dating the material.`;
  
  return brandContext;
}

/**
 * Get the length guidance for content generation
 */
export function getLengthGuidance(targetWordCount, targetReadTime, selectedContentInstructions) {
  return `\n\nIMPORTANT: This should be a COMPREHENSIVE, IN-DEPTH article of approximately ${targetWordCount} words (${targetReadTime}-minute read). 

ARTICLE STRUCTURE REQUIREMENTS:
1. START with a "Quick Answer" section optimized for GEO/AEO (35-55 words):
   - Structure: DEFINITION + WHY + HOW (action-oriented)
   - Answer search intent fast: "what is X," "why it matters," "how to do it"
   - Use action verbs and key entities (e.g., "ICP," "product-market fit")
   - EVERGREEN: NO year references or time stamps (no "2025," "in the future," etc.)
   - Follow with 3-5 scannable micro-action bullets (10-15 words each)
   - Self-contained and snippet-ready
   - This is CRITICAL for Google Featured Snippets and AI Overviews

2. IMMEDIATELY after Quick Answer, include an "Introduction" section:
   - Title this section exactly as "Introduction"
   - 2-3 paragraphs introducing the topic
   - Explain why it matters and what the reader will learn
   - Set the context for the rest of the article

3. Then include comprehensive content with:
   - Detailed explanations with multiple examples
   - Multiple subsections for each main point
   - Practical, actionable advice
   - Real-world case studies or scenarios
   - Step-by-step processes where applicable
   - Expert tips and best practices
   - IMPORTANT: Do NOT number section headings (e.g., use "Data-Driven Insights" not "1. Data-Driven Insights")

4. Include these 2 RICH CONTENT SECTIONS (include BOTH of these and ONLY these):
   
   ${selectedContentInstructions}
   
   IMPORTANT: Include BOTH sections above. Do NOT add any other rich content sections.

5. MANDATORY: Include a "Further Reading & Resources" section at the VERY END (after FAQ):
   - Provide 5-7 highly relevant, authoritative external links
   - Each link should have a descriptive title and brief explanation (1-2 sentences)
   - Include a mix of: official documentation, industry research, expert articles, tools/platforms
   - Links must be real, high-quality sources (no fictional URLs)
   - Prioritize recent resources (last 2-3 years)
   - DO NOT organize into categories - present as a flat list
   - This section must be the LAST section of the article
   - This helps readers explore the topic more deeply

6. The body content MUST elaborate consistently on the Quick Answer:
   - Expand on the same claims (no contradictions)
   - Provide deeper context and evidence
   - Maintain consistent messaging throughout

Make this thorough and valuable - don't rush through topics.`;
}

/**
 * Get the formatting prompt
 */
export function getFormattingPrompt(rawContent, selectedFormatInstructions) {
  return `Take this article content and format it into clean, semantic HTML that matches the Crowley Capital design system.

RAW CONTENT:
${rawContent}

FORMATTING REQUIREMENTS:
1. Use semantic HTML5 tags
2. Apply these exact CSS classes from our design system:
   - Headings: Use font-light, text-black, tracking-tight
   - H2: text-3xl mb-6 mt-12 pb-3 border-b border-slate-200
   - H3: text-2xl mb-4 mt-8 font-medium
   - Paragraphs: text-slate-700 leading-relaxed mb-6 text-lg font-light
   - Lists: Use proper ul/ol with list-disc or list-decimal, space-y-3
   - Links: text-black underline font-medium hover:text-slate-700
   - Strong: text-black font-medium
   - IMPORTANT: Remove any numbered prefixes from headings (e.g., "1. Title" → "Title", "2. Another Title" → "Another Title")

CRITICAL SPACING RULES:
- NEVER use <br> or <br/> tags for spacing between sections, cards, or structural elements
- ALL spacing between sections is handled by CSS (margin/padding classes)
- ONLY use <br> inside paragraphs if you need a line break within the same thought
- Do NOT add <br> after titles, before/after cards, between list items, or around any structural elements
- Let CSS handle all vertical spacing - trust the design system

3. Include a "Quick Answer" box at the start (CRITICAL for GEO/AEO optimization):
   <div class="answer-box">
     <h2>Quick Answer</h2>
     <p>[Write a 35-55 word snippet following DEFINITION + WHY + HOW structure. Use action verbs and key entities. Be evergreen—NO year references or time stamps. Answer likely queries directly: "what is X," "why it matters," "how to do it."]</p>
     <ul class="list-disc list-inside space-y-2 text-slate-700 mt-4">
       <li>[Micro-action 1: 10-15 words with action verb]</li>
       <li>[Micro-action 2: 10-15 words with action verb]</li>
       <li>[Micro-action 3: 10-15 words with action verb]</li>
       <li>[Micro-action 4: 10-15 words with action verb]</li>
     </ul>
   </div>
   
   QUICK ANSWER REQUIREMENTS (CRITICAL for Featured Snippets & AI Answers):
   - Exactly 35-55 words for the main snippet
   - Structure: DEFINITION → WHY it matters → HOW to do it
   - Action-oriented with strong verbs (validate, test, measure, iterate)
   - Include key entities/concepts (e.g., "product-market fit," "ICP," "value proposition")
   - EVERGREEN: Absolutely NO year references ("2025"), time stamps, or dated language
   - Follow with 3-5 scannable bullet points (micro-actions, 10-15 words each)
   - Answer search intent fast and directly
   - Body content must expand on this consistently

4. IMMEDIATELY after Quick Answer, include an "Introduction" section:
   <h2>Introduction</h2>
   <p>[2-3 paragraphs of introductory content]</p>

5. Include "Key Takeaways" section with bullet points:
   <h2>🎯 Key Takeaways</h2>
   <ul class="list-disc list-inside space-y-2 text-slate-700">
     <li>[Benefit-focused takeaway]</li>
     <li>[Benefit-focused takeaway]</li>
   </ul>

6. RICH CONTENT SECTION FORMATTING (format ONLY these sections if they appear in the content):

   ${selectedFormatInstructions}

7. For FAQ section, use accordion format with heading (5 to 7 questions):
   <h2>Frequently Asked Questions</h2>
   <div class="faq-accordion">
     <details class="faq-item">
       <summary class="faq-question">[Question]</summary>
       <div class="faq-answer">
         <p>[Answer]</p>
       </div>
     </details>
   </div>

8. MANDATORY: "Further Reading & Resources" section (MUST be included as the LAST section):
   <h2>📚 Further Reading & Resources</h2>
   <p class="text-slate-600 mb-6">Explore these curated resources to deepen your understanding:</p>
   
   <div class="space-y-4">
     <div>
       <a href="[URL]" target="_blank" rel="noopener noreferrer" class="text-black underline font-medium hover:text-slate-700">
         [Resource Title] ↗
       </a>
       <p class="text-slate-700 mt-1">[Brief 1-2 sentence description of what readers will find]</p>
     </div>
   </div>
   
   RESOURCES SECTION REQUIREMENTS:
   - Include 5-7 high-quality external resources
   - Use real, authoritative URLs (no fictional links)
   - DO NOT use category headings (no <h3> tags) - just a flat list of resources
   - Each resource needs: title (as link), URL, and brief description
   - Prioritize recent, authoritative sources
   - Include external link icon (↗) for visual clarity
   - This section is MANDATORY and must appear AFTER FAQ as the VERY LAST section

9. NO markdown code blocks (no \`\`\`html)
10. Return ONLY the HTML content, nothing else
11. Ensure proper spacing and readability

Format the content now:`;
}

