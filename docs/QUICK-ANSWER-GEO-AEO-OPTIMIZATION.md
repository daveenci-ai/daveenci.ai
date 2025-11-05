# Quick Answer GEO/AEO Optimization

**Date Updated:** November 2, 2025  
**Status:** ✅ Implemented

## Overview

Updated AI article generation prompts to create Quick Answers optimized for **Generative Engine Optimization (GEO)** and **Answer Engine Optimization (AEO)** - ensuring featured snippet eligibility and better AI-generated answer quality.

---

## 🎯 Key Changes

### 1. **Updated Quick Answer Structure**

#### Before (Generic):
- 40-60 words
- Long paragraph format
- Included year references ("2025 and beyond")
- Focused on conclusion first

#### After (GEO/AEO Optimized):
- **35-55 words** (snippet-ready length)
- **Structure**: DEFINITION + WHY + HOW
- **Evergreen**: No year references or timestamps
- **Followed by 3-5 micro-action bullets** (10-15 words each)
- Action-oriented with strong verbs
- Key entities emphasized

---

## 📐 New Quick Answer Format

### Main Snippet (35-55 words)
```
[Topic] is [definition]. [Why it matters/value]. [How to approach it]—
[specific action verbs and key steps].
```

### Micro-Action Bullets (3-5 items, 10-15 words each)
- Action verb + specific step + measurable outcome
- Scannable and actionable
- Includes key terms/entities

### Example (Customer Discovery):

**Before:**
> "For startup growth in 2025, employ data-driven insights, implement AI-driven personalization, foster community connections, and focus on sustainable scaling. These strategies will enhance adaptability and resilience, providing a roadmap for scalable success in a competitive market."

**After:**
> "Customer discovery is how startups validate real customer problems and willingness to pay before scaling. Talk to target users, map jobs-to-be-done, and run small experiments to test value propositions—then iterate until evidence shows repeatable demand and product–market fit."
> 
> - Interview 5–10 target users per week; capture pains, triggers, alternatives.
> - Define ICP & hypotheses; prioritize problems by frequency × pain.
> - Test value props via landing pages/prototypes; measure sign-ups or intent to pay.
> - Loop: learn → test → decide; stop when signals are consistent.

---

## ✅ Why This Is Better

### For Search Engines:
1. **Featured Snippet Length**: 35-55 words is optimal for Google snippets
2. **Answer Intent Fast**: Definition → Why → How structure
3. **Action Verbs**: "Validate," "test," "measure," "iterate"
4. **Key Entities**: ICP, product-market fit, jobs-to-be-done

### For AI Answer Engines (ChatGPT, Perplexity, Bard):
1. **Scannable Format**: Bullets are easy for AI to parse
2. **Action-Oriented**: Clear steps AI can summarize
3. **Evergreen**: Won't become outdated quickly
4. **Entity-Rich**: Contains searchable concepts

### For Users:
1. **Immediate Value**: Get the answer in 2 seconds
2. **Actionable**: Know exactly what to do
3. **Scannable**: Bullets are easy to skim
4. **Timeless**: Won't feel dated

---

## 🔧 Implementation Details

### Files Modified:

#### 1. `/apps/api/src/prompts.js`

**Updated `getLengthGuidance()` function:**
```javascript
1. START with a "Quick Answer" section optimized for GEO/AEO (35-55 words):
   - Structure: DEFINITION + WHY + HOW (action-oriented)
   - Answer search intent fast: "what is X," "why it matters," "how to do it"
   - Use action verbs and key entities (e.g., "ICP," "product-market fit")
   - EVERGREEN: NO year references or time stamps (no "2025," "in the future," etc.)
   - Follow with 3-5 scannable micro-action bullets (10-15 words each)
   - Self-contained and snippet-ready
   - This is CRITICAL for Google Featured Snippets and AI Overviews
```

**Updated `getFormattingPrompt()` function:**
```javascript
3. Include a "Quick Answer" box at the start (CRITICAL for GEO/AEO optimization):
   <div class="answer-box">
     <h2>Quick Answer</h2>
     <p>[Write a 35-55 word snippet following DEFINITION + WHY + HOW structure...]</p>
     <ul class="list-disc list-inside space-y-2 text-slate-700 mt-4">
       <li>[Micro-action 1: 10-15 words with action verb]</li>
       <li>[Micro-action 2: 10-15 words with action verb]</li>
       <li>[Micro-action 3: 10-15 words with action verb]</li>
       <li>[Micro-action 4: 10-15 words with action verb]</li>
     </ul>
   </div>
```

**Updated `buildBrandContext()` function:**
```javascript
IMPORTANT CONTENT GUIDANCE:
- EVERGREEN LANGUAGE: Avoid specific years, dates, or "as of" statements (no "2025," "currently," "today"). Use relative terms like "recent," "modern," "contemporary," "latest."
- TIMELESS PRINCIPLES: Focus on fundamental concepts and strategies that remain relevant over time.
- EXAMPLES: When citing trends or data, use phrases like "recent studies show..." rather than "2025 studies show..."
- BODY CONTENT: Can reference modern trends and contemporary examples, but frame them as ongoing patterns rather than time-bound events.
- Quick Answer MUST be completely evergreen and timestamp-free.
```

#### 2. `/apps/web/src/styles/article.css`

**Added bullet styling for Quick Answer:**
```css
.answer-box ul {
  margin-top: 1rem;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.answer-box li {
  color: rgb(51 65 85);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  padding-left: 0.25rem;
}

.answer-box li:last-child {
  margin-bottom: 0;
}
```

**Mobile responsive:**
```css
@media (max-width: 768px) {
  .answer-box li {
    @apply text-sm;
    margin-bottom: 0.375rem;
  }
}
```

---

## 📊 Content Guidelines

### ✅ DO:
- Use action verbs: validate, test, measure, iterate, define, capture, prioritize
- Include key entities: ICP, product-market fit, value proposition, jobs-to-be-done
- Write 35-55 words for main answer
- Add 3-5 bullet points with 10-15 words each
- Use relative time references: "recent," "modern," "contemporary"
- Structure as: Definition → Why → How

### ❌ DON'T:
- Reference specific years: "2025," "2024," "next year"
- Use timestamp language: "currently," "today," "as of now," "in the future"
- Write long paragraphs (over 55 words)
- Be generic or vague
- Omit action bullets
- Use dated examples: "in 2025, companies..."

---

## 🧪 Testing New Articles

When generating new articles, verify:

1. **Word Count**: Quick Answer paragraph is 35-55 words
2. **Structure**: Follows Definition → Why → How
3. **Evergreen**: No year/date references
4. **Bullets**: 3-5 actionable items present
5. **Action Verbs**: Strong, specific verbs used
6. **Entities**: Key concepts/terms included

---

## 🚀 Expected Impact

### SEO Benefits:
- ✅ Featured snippet eligibility increased
- ✅ Higher click-through rates (CTR)
- ✅ Better "People Also Ask" inclusion
- ✅ Improved voice search compatibility

### AI Answer Engine Benefits:
- ✅ Better citation in ChatGPT/Perplexity/Bard
- ✅ More likely to be used as primary source
- ✅ Clearer attribution in AI summaries

### User Experience:
- ✅ Faster time-to-answer
- ✅ More actionable content
- ✅ Better scannability
- ✅ Evergreen content that ages well

---

## 📚 References

- Google Featured Snippets Best Practices
- Generative Engine Optimization (GEO) Guidelines
- Answer Engine Optimization (AEO) Standards
- Perplexity AI Citation Guidelines

---

## Next Steps

1. **Generate new test article** with updated prompts
2. **Compare** old vs new Quick Answer format
3. **Monitor** featured snippet performance
4. **Track** AI citation rates
5. **Iterate** based on results

---

**Status:** All changes implemented and ready for testing.
**Backend Server:** Restart required to load new prompts.

