import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, VitruvianBackground, Button } from './Shared';
import type { Page } from './types';
import { Clock, Tag, ChevronRight, Check, X, AlertTriangle, Lightbulb, BookOpen, Layers } from 'lucide-react';
import AgenticWorkflowImage from '../images/001 - What is an Agentic Workflow.jpg';
import SyntheticDataImage from '../images/002 - Synthetic Data Pipelines.jpg';
import ZeroTouchCRMImage from '../images/003 - Zero-Touch CRM.jpg';
import RagVsContextImage from '../images/004 - RAG vs. Long Context.jpg';
import LocalLLMImage from '../images/005 - Local LLM Stack 2025.jpg';
import PromptPatternsImage from '../images/006 - Prompt Engineering Patterns.jpg';
import ComplianceImage from '../images/007 - AI Legal Compliance.jpg';
import SaaSPricingImage from '../images/008 - The Death of SaaS Pricing.jpg';
import AutomatedVideoImage from '../images/009 - Automated Video Prod.jpg';

interface BriefingDetailPageProps {
   onNavigate: (page: Page, hash?: string, id?: string) => void;
   id?: string | null;
}

interface BriefingSection {
   id: string;
   title: string;
   content: React.ReactNode;
}

interface BriefingData {
   id: string;
   title: string;
   metaDescription: string;
   publishDate: string;
   author: string;
   category: string;
   readTime: string;
   issueNo: string;
   image: string;
   quickAnswerTitle: string;
   quickAnswer: string;
   toc: string[];
   sections: BriefingSection[];
   faqs: { question: string; answer: string }[];
   furtherResources?: { title: string; url: string; type?: string }[];
}

// Briefing Data Dictionary
const briefings: Record<string, BriefingData> = {
   "agentic-workflow": {
      id: "agentic-workflow",
      title: "The Agentic Workflow: Architecting Swarms",
      metaDescription: "A technical guide to moving beyond chat interfaces. Learn how to architect autonomous agent swarms, implement the 4-stage reasoning pipeline, and deploy self-correcting AI workers.",
      publishDate: "2025-10-14",
      author: "Leonardo & Team",
      category: "Architecture",
      readTime: "15 min read",
      issueNo: "042",
      image: AgenticWorkflowImage,
      quickAnswerTitle: "What is an Agentic Workflow?",
      quickAnswer: "An **Agentic Workflow** is an iterative system design where Large Language Models (LLMs) function as autonomous engines capable of defining their own control flow. Unlike traditional linear automation (A → B → C), an agentic workflow utilizes a dynamic loop of **Reasoning, Action, Observation, and Reflection**.<br/><br/>This architecture allows the AI to:<br/>1. **Decompose** vague user goals into actionable sub-tasks.<br/>2. **Utilize Tools** (APIs, web search, code interpreters) to gather data.<br/>3. **Self-Correct** by analyzing the output of its tools and adjusting the plan in real-time.<br/><br/>Research suggests that wrapping an LLM in an agentic loop can improve performance on complex reasoning benchmarks (like HumanEval) by 40–60% compared to zero-shot prompting.",
      toc: ["The Shift", "Anatomy", "Design Patterns", "Swarms", "Real-World", "Tech Stack", "Challenges", "FAQ"],
      sections: [
         {
            id: "the-shift",
            title: "The Shift: From Prompt Engineering to Flow Engineering",
            content: (
               <>
                  <p>The era of "Prompt Engineering"—optimizing a single text input to get a perfect output—is rapidly fading. We are entering the era of <strong>Flow Engineering</strong>.</p>
                  <p>In a traditional "Zero-Shot" interaction, the LLM is treated as a magic black box: you put a question in, and you hope for a correct answer. However, LLMs are probabilistic token predictors, not logic engines. When asked to perform complex, multi-step tasks (e.g., "Research this company, crawl their website, and write a personalized sales email"), a single prompt often fails due to loss of context or hallucination.</p>
                  <p><strong>Agentic Workflows replace the "Black Box" with a "System."</strong></p>
                  <p>Instead of asking for the final output immediately, the system asks the LLM to act as a router and planner. The developer does not code the path; the developer codes the guardrails and tools, allowing the LLM to navigate the path itself.</p>
                  <div className="my-8 overflow-x-auto">
                     <table className="w-full text-sm text-left border-collapse">
                        <thead>
                           <tr className="border-b border-ink/10">
                              <th className="py-2 font-bold text-ink">Feature</th>
                              <th className="py-2 font-bold text-ink">Linear Chain (Zero-Shot)</th>
                              <th className="py-2 font-bold text-ink">Agentic Workflow</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Control Flow</td>
                              <td className="py-2 text-ink-muted">Hard-coded (A → B → C)</td>
                              <td className="py-2 text-ink-muted">Dynamic (LLM decides next step)</td>
                           </tr>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Error Handling</td>
                              <td className="py-2 text-ink-muted">Fails if one step breaks</td>
                              <td className="py-2 text-ink-muted">Retries or changes strategy</td>
                           </tr>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Complexity</td>
                              <td className="py-2 text-ink-muted">Low (Summarization, Chat)</td>
                              <td className="py-2 text-ink-muted">High (Coding, Research, Data Analysis)</td>
                           </tr>
                           <tr>
                              <td className="py-2 text-ink-muted">Latency</td>
                              <td className="py-2 text-ink-muted">Low (Single inference)</td>
                              <td className="py-2 text-ink-muted">High (Multiple loops/inferences)</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </>
            )
         },
         {
            id: "anatomy",
            title: "The Anatomy of an AI Agent",
            content: (
               <>
                  <p>To architect an agentic workflow, you must understand the four pillars of agent architecture (often referenced in the ReAct papers and Andrew Ng’s lectures):</p>
                  <ul className="list-none space-y-4 mt-4">
                     <li>
                        <strong className="text-ink block mb-1">1. The Brain (The Profile)</strong>
                        This is the LLM itself (e.g., GPT-4o, Gemini 1.5 Pro, Claude 3.5 Sonnet). The "Profile" defines the persona (e.g., "You are a Senior Python Engineer"). It provides the reasoning capability to understand the user's intent.
                     </li>
                     <li>
                        <strong className="text-ink block mb-1">2. Memory</strong>
                        Agents need context to iterate.
                        <ul className="list-disc list-inside pl-4 mt-2 text-ink-muted/80">
                           <li><strong>Short-term Memory:</strong> The chat history and the logs of previous steps taken during the current task.</li>
                           <li><strong>Long-term Memory:</strong> Vector databases (RAG) that allow the agent to recall information from days or weeks ago.</li>
                        </ul>
                     </li>
                     <li>
                        <strong className="text-ink block mb-1">3. Planning</strong>
                        Before acting, the agent must plan.
                        <ul className="list-disc list-inside pl-4 mt-2 text-ink-muted/80">
                           <li><strong>Decomposition:</strong> Breaking a goal like "Build a website" into "Write HTML," "Write CSS," and "Debug."</li>
                           <li><strong>Reflection:</strong> Reviewing past actions. "Did my last search query yield good results? No? I should try a different keyword."</li>
                        </ul>
                     </li>
                     <li>
                        <strong className="text-ink block mb-1">4. Tools (Action Space)</strong>
                        This is the most critical differentiator. Tools are executable functions the LLM can call.
                        <ul className="list-disc list-inside pl-4 mt-2 text-ink-muted/80">
                           <li><strong>Standard Tools:</strong> Web Search (Google), Calculator, Code Interpreter.</li>
                           <li><strong>Custom Tools:</strong> <code>get_customer_data(id)</code>, <code>send_slack_message(channel, msg)</code>.</li>
                        </ul>
                     </li>
                  </ul>
               </>
            )
         },
         {
            id: "design-patterns",
            title: "Design Patterns: Architecting the Loop",
            content: (
               <>
                  <p>You do not need to invent an agent from scratch. There are established patterns:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">The ReAct Pattern</h4>
                        <p className="text-sm">The standard baseline. The model outputs a thought, then an action, then observes the output.</p>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">The Reflection Pattern</h4>
                        <p className="text-sm">A "Critic" agent reviews the draft for errors, improving it before sending it to the user. Great for coding.</p>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">The Router Pattern</h4>
                        <p className="text-sm">The LLM acts as a traffic controller, analyzing input and routing it to a specialized sub-agent.</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "swarms",
            title: "Swarm Intelligence: Multi-Agent Orchestration",
            content: (
               <>
                  <p>For enterprise-grade tasks, a single agent is often insufficient. This leads to Multi-Agent Systems (Swarms), where distinct agents collaborate.</p>
                  <h4 className="font-bold text-ink mt-4 mb-2">Key Orchestration Methods:</h4>
                  <ul className="list-disc list-inside space-y-2">
                     <li><strong>Hierarchical (The Boss & Workers):</strong> A "Supervisor" agent breaks down the task and assigns it to "Worker" agents.</li>
                     <li><strong>Sequential Handoffs:</strong> Agent A completes a task and passes the entire context to Agent B.</li>
                     <li><strong>Joint Chat (Flat Hierarchy):</strong> Agents participate in a shared message thread, chiming in when their specific expertise is required.</li>
                  </ul>
                  <div className="mt-4 p-4 bg-accent/5 border-l-2 border-accent">
                     <p className="text-sm italic"><strong>Why Swarms?</strong> Specialization reduces hallucination. A prompt tuned for writing code is different from a prompt tuned for testing code. Separating them yields higher accuracy.</p>
                  </div>
               </>
            )
         },
         {
            id: "real-world",
            title: "Real-World Architecture: The Autonomous Support Triager",
            content: (
               <div className="bg-alt/10 p-6 rounded-sm border border-ink/5">
                  <p className="mb-4"><strong>The Problem:</strong> A SaaS company receives 500 tickets/day. Tier 1 support is drowning in repetitive queries about API limits.</p>
                  <p className="mb-4"><strong>The Workflow:</strong></p>
                  <ol className="list-decimal list-inside space-y-3 font-medium text-ink bg-white/50 p-6 rounded-sm border border-ink/5">
                     <li className="pl-2"><span className="font-bold">Trigger:</span> New Ticket arrives via Webhook.</li>
                     <li className="pl-2"><span className="font-bold">Agent 1 (Triage):</span> Classifies ticket urgency and category. Result: "Account Access."</li>
                     <li className="pl-2"><span className="font-bold">Agent 2 (Investigator):</span> Calls <code>stripe_api.get_customer_status(email)</code>. Observation: "Basic Plan".</li>
                     <li className="pl-2"><span className="font-bold">Agent 3 (Drafter):</span> Writes email explaining limitation and offering upgrade link.</li>
                     <li className="pl-2"><span className="font-bold">Supervisor:</span> Checks tone and link accuracy.</li>
                     <li className="pl-2"><span className="font-bold">Action:</span> Draft saved to Zendesk or sent automatically.</li>
                  </ol>
                  <p className="mt-4 text-sm text-green-700 font-bold">Result: 60% of tickets resolved without human intervention.</p>
               </div>
            )
         },
         {
            id: "tech-stack",
            title: "The Tech Stack: Building Blocks",
            content: (
               <>
                  <p>To build this, you need specific libraries designed for graph-based logic.</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                     <li className="p-3 border border-ink/10 hover:border-accent transition-colors">
                        <strong className="block text-accent">LangChain / LangGraph</strong>
                        <span className="text-xs">The industry standard for stateful, multi-actor apps. Allows explicit cyclical flows.</span>
                     </li>
                     <li className="p-3 border border-ink/10 hover:border-accent transition-colors">
                        <strong className="block text-accent">AutoGen (Microsoft)</strong>
                        <span className="text-xs">Excellent for conversational swarms where agents "talk" to each other.</span>
                     </li>
                     <li className="p-3 border border-ink/10 hover:border-accent transition-colors">
                        <strong className="block text-accent">CrewAI</strong>
                        <span className="text-xs">High-level framework for orchestrating role-based agents. Accessible and fast.</span>
                     </li>
                     <li className="p-3 border border-ink/10 hover:border-accent transition-colors">
                        <strong className="block text-accent">DSPy</strong>
                        <span className="text-xs">Focuses on optimizing prompts programmatically within the pipeline.</span>
                     </li>
                  </ul>
               </>
            )
         },
         {
            id: "challenges",
            title: "Challenges & Risk Mitigation",
            content: (
               <div className="space-y-6">
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> The "Infinite Loop" Trap</h4>
                     <p className="text-sm"><strong>Risk:</strong> Agent keeps retrying forever. <br /><strong>Solution:</strong> Implement Maximum Iterations (e.g., max_steps=5).</p>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> Latency & Cost</h4>
                     <p className="text-sm"><strong>Risk:</strong> 10 LLM calls for one question is slow and expensive. <br /><strong>Solution:</strong> Use smaller models (Llama-3-8b) for reasoning, and smart models (GPT-4o) for synthesis.</p>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1 flex items-center gap-2"><X className="w-4 h-4 text-orange-500" /> Tool Hallucination</h4>
                     <p className="text-sm"><strong>Risk:</strong> Agent invents tool parameters. <br /><strong>Solution:</strong> Provide robust Type Definitions (JSON Schema) for strict validation.</p>
                  </div>
               </div>
            )
         }
      ],
      faqs: [
         { question: "What is the difference between a Chain and an Agent?", answer: "A Chain is a hard-coded sequence (A → B → C). It is deterministic. An Agent uses an LLM as a reasoning engine to decide which steps to take and in what order. Chains are for known processes; Agents are for ambiguous goals." },
         { question: "Which model is best for agentic workflows?", answer: "Currently, Claude 3.5 Sonnet and GPT-4o are the leaders for coding and agentic reasoning due to their ability to follow complex instructions and adhere to tool schemas. For local deployment, Llama 3.1 (70B) is the top open-source contender." },
         { question: "How do I debug an agent?", answer: "Debugging agents is difficult because they are non-deterministic. You must implement 'Observability' using tools like LangSmith or Arize Phoenix. These tools trace the execution path, showing you the exact 'Thought' and 'Observation' at every step of the loop." },
         { question: "Are agents ready for production?", answer: "Yes, but with 'Human-in-the-loop' guardrails. Autonomous agents are widely used for data analysis, coding assistance, and internal research. Customer-facing agents usually require a final approval step before sending messages." }
      ],
      furtherResources: [
         { title: "Andrew Ng: Why Agents are the Future", url: "https://www.deeplearning.ai/the-batch/issue-242/" },
         { title: "Sequoia: Generative AI’s Act Two", url: "https://www.sequoiacap.com/article/generative-ai-act-two/" },
         { title: "Video: The Shift from Chatbots to Agentic Workflows", url: "https://www.youtube.com/watch?v=sal78ACtGTc" }
      ]
   },
   "synthetic-data": {
      id: "synthetic-data",
      title: "Synthetic Data Pipelines: The Infinite Dataset",
      metaDescription: "Running out of human data? Here is the playbook for generating high-fidelity synthetic datasets to fine-tune your models without privacy risks.",
      publishDate: "2025-10-21",
      author: "Leonardo & Team",
      category: "Engineering",
      readTime: "12 min read",
      issueNo: "043",
      image: SyntheticDataImage,
      quickAnswerTitle: "What is Synthetic Data?",
      quickAnswer: "**Synthetic Data** is information artificially generated by algorithms or AI models that mimics the statistical properties and patterns of real-world data without containing any actual user information.<br/><br/><strong>Why is it used?</strong><br/>It solves three primary bottlenecks in AI development:<br/>1. <strong>Privacy:</strong> Work with 'medical-grade' data without violating GDPR/HIPAA.<br/>2. <strong>Scarcity:</strong> Fill gaps where real data is expensive or rare.<br/>3. <strong>Balance:</strong> Fix biased datasets by upsampling underrepresented groups.",
      toc: ["Context", "Techniques", "Architecture", "Real-World", "Dangers", "Tools", "FAQ"],
      sections: [
         {
            id: "context",
            title: "The Context: Hitting the Data Wall",
            content: (
               <>
                  <p>By late 2025, the AI industry faced a critical realization: we are running out of high-quality human text. The internet has been crawled. To make models smarter, we cannot just add more data; we need better data.</p>
                  <h4 className="font-bold text-ink mt-4 mb-2">The "Cold Start" Problem</h4>
                  <p>Most teams get stuck because they want to fine-tune a specialized model (e.g., a "Legal Contract Reviewer"), but they cannot send their clients' actual confidential contracts to OpenAI or train on them locally due to privacy risks.</p>
                  <h4 className="font-bold text-ink mt-4 mb-2">The Synthetic Solution</h4>
                  <p>Instead of waiting years to collect 10,000 real contracts, teams now build <strong>Synthetic Data Pipelines</strong>. They take 5 "seed" examples, de-identify them, and use a massive reasoning model (like GPT-4o) to generate 10,000 variations. This creates an "Infinite Dataset" that is mathematically similar to reality but legally distinct.</p>
                  <div className="my-8 overflow-x-auto">
                     <table className="w-full text-sm text-left border-collapse">
                        <thead>
                           <tr className="border-b border-ink/10">
                              <th className="py-2 font-bold text-ink">Feature</th>
                              <th className="py-2 font-bold text-ink">Real World Data</th>
                              <th className="py-2 font-bold text-ink">Synthetic Data</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Cost</td>
                              <td className="py-2 text-ink-muted">High (Collection + Annotation)</td>
                              <td className="py-2 text-ink-muted">Low (Compute cost)</td>
                           </tr>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Privacy</td>
                              <td className="py-2 text-ink-muted">High Risk (PII leaks)</td>
                              <td className="py-2 text-ink-muted">Zero Risk (Math-generated)</td>
                           </tr>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Speed</td>
                              <td className="py-2 text-ink-muted">Months/Years</td>
                              <td className="py-2 text-ink-muted">Hours/Days</td>
                           </tr>
                           <tr>
                              <td className="py-2 text-ink-muted">Quality</td>
                              <td className="py-2 text-ink-muted">"Noisy" (Humans make typos)</td>
                              <td className="py-2 text-ink-muted">"Clean" (Structured output)</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </>
            )
         },
         {
            id: "techniques",
            title: "Techniques: How Data is Synthesized",
            content: (
               <>
                  <p>Not all synthetic data is created equal. Depending on the modality (Text, Tabular, Images), different architectures are used.</p>
                  <div className="space-y-6 mt-6">
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">1. LLM-for-LLM (Self-Instruct)</h4>
                        <p className="text-sm mb-2">Currently the dominant method for text. You use a "Teacher" model (e.g., GPT-4o) to generate training data for a "Student" model (e.g., Llama-3-8B).</p>
                        <p className="text-xs text-ink-muted italic">Method: "Generate 50 complex customer complaints regarding shipping delays, varying the tone from polite to furious."</p>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">2. Variational Autoencoders (VAEs) & GANs</h4>
                        <p className="text-sm">Used primarily for tabular data (Excel sheets) and images. The model learns the probability distribution of a dataset and samples new rows from that distribution.</p>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">3. Rules-Based / Procedural</h4>
                        <p className="text-sm">Used for coding and math. You write a script that generates random logic puzzles or Python functions with known correct answers. Guarantees 100% accuracy.</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "architecture",
            title: "Architecture: Building the Pipeline",
            content: (
               <>
                  <p>A robust Synthetic Data Pipeline acts as a refinery. You don't just "ask ChatGPT." You build a flow.</p>
                  <ul className="list-none space-y-4 mt-4">
                     <li>
                        <strong className="text-ink block mb-1">Phase 1: The Seed (The DNA)</strong>
                        You curate a small "Golden Set" of real data (10–50 examples). This defines the style, format, and complexity you want.
                     </li>
                     <li>
                        <strong className="text-ink block mb-1">Phase 2: The Expansion (The Generator)</strong>
                        An LLM iterates through the seed data and generates variations. Technique: "Evol-Instruct" (WizardLM method). The LLM is asked to make the data more complex, more rare, or more detailed in each step.
                     </li>
                     <li>
                        <strong className="text-ink block mb-1">Phase 3: The Filter (The Judge)</strong>
                        This is the most critical step. Synthetic generators hallucinate. You need a second agent (The Critic) to score the generated data.
                        <ul className="list-disc list-inside pl-4 mt-2 text-xs text-ink-muted">
                           <li>"Does this generated SQL query actually run? If not, discard."</li>
                           <li>"Is the sentiment of this text actually negative? If not, discard."</li>
                        </ul>
                     </li>
                     <li>
                        <strong className="text-ink block mb-1">Phase 4: Formatting</strong>
                        The surviving data is formatted into JSONL (JSON Lines) for fine-tuning frameworks like Axolotl or Unsloth.
                     </li>
                  </ul>
               </>
            )
         },
         {
            id: "real-world",
            title: "Real-World Example: The HIPAA-Compliant Doctor",
            content: (
               <div className="bg-alt/10 p-6 rounded-sm border border-ink/5">
                  <p className="mb-4"><strong>The Problem:</strong> A HealthTech startup wants to build a chatbot that helps triage patients in the ER. They have zero data because sharing patient logs is illegal.</p>
                  <p className="mb-4"><strong>The Synthetic Pipeline Solution:</strong></p>
                  <ul className="list-disc list-inside space-y-2 font-medium text-ink bg-white/50 p-6 rounded-sm border border-ink/5">
                     <li><span className="font-bold">Seed:</span> Doctors write 20 fake but realistic patient dialogues.</li>
                     <li><span className="font-bold">Generation:</span> Pipeline generates 100,000 unique patient encounters using specific medical variables.</li>
                     <li><span className="font-bold">Validation:</span> An automated "Doctor Agent" reviews the synthetic diagnosis to ensure it follows medical guidelines.</li>
                     <li><span className="font-bold">Training:</span> A local Llama-3 model is fine-tuned on this synthetic data.</li>
                  </ul>
                  <p className="mt-4 text-sm text-green-700 font-bold">Result: 90% accuracy on triage benchmarks without ever seeing a real patient's private data.</p>
               </div>
            )
         },
         {
            id: "dangers",
            title: "The Dangers: Model Collapse",
            content: (
               <div className="bg-orange-50/50 border border-orange-200/50 p-6 rounded-sm">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> What is it?</h4>
                  <p className="text-sm text-ink-muted mb-4">If you train a model entirely on synthetic data generated by another AI, the model eventually loses touch with reality. It begins to amplify the biases and hallucinations of the creator model. The data becomes "inbred."</p>
                  <h4 className="font-bold text-orange-900 mb-2">How to avoid it?</h4>
                  <ul className="list-disc list-inside text-sm text-ink-muted space-y-1">
                     <li><strong>The Mixer Strategy:</strong> Always mix synthetic data with at least 10-20% high-quality human data.</li>
                     <li><strong>Perplexity Filtering:</strong> Discard generated text that has low statistical probability (gibberish) or excessively high probability (repetitive clichés).</li>
                  </ul>
               </div>
            )
         },
         {
            id: "tools",
            title: "Tools & Frameworks",
            content: (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">Gretel.ai</strong>
                     <span className="text-xs">The enterprise standard for tabular and text synthetic data with privacy guarantees.</span>
                  </div>
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">Argilla / Distilabel</strong>
                     <span className="text-xs">Open-source tools specifically designed for "Human feedback" and building synthetic datasets.</span>
                  </div>
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">LangSmith</strong>
                     <span className="text-xs">Essential for tracing the generation loops and testing the quality of outputs.</span>
                  </div>
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">SDV</strong>
                     <span className="text-xs">Synthetic Data Vault. A Python library for generating tabular data.</span>
                  </div>
               </div>
            )
         }
      ],
      faqs: [
         { question: "Is synthetic data as good as real data?", answer: "For 'reasoning' tasks (coding, math, logic), it is often better than real data because it is cleaner and free of human noise. For 'nuance' tasks (creative writing, cultural slang), real human data is still superior." },
         { question: "Does synthetic data hallucinate?", answer: "Yes. The generator can invent facts. This is why the Validation/Filtering step in the pipeline is mandatory. You must programmatically verify the data before training on it." },
         { question: "Can I copyright a model trained on synthetic data?", answer: "This is a gray area in 2025. While you cannot copyright the synthetic data itself, the weights of the model you train may be proprietary depending on your jurisdiction." },
         { question: "How much synthetic data do I need?", answer: "For fine-tuning a specific behavior (e.g., 'Speak like a pirate'), you may only need 500–1,000 synthetic examples. For teaching a model a new skill, you need tens of thousands." }
      ],
      furtherResources: [
         { title: "Microsoft: Textbooks Are All You Need", url: "https://arxiv.org/abs/2306.11644" },
         { title: "Hugging Face: Cosmopedia Dataset", url: "https://huggingface.co/blog/cosmopedia" },
         { title: "Gretel.ai: The Synthetic Data Playbook", url: "https://gretel.ai/synthetic-data" }
      ]
   },
   "zero-touch-crm": {
      id: "zero-touch-crm",
      title: "The Zero-Touch CRM: Self-Healing Databases",
      metaDescription: "A technical deep dive into self-healing customer databases that enrich themselves without sales rep intervention.",
      publishDate: "2025-10-28",
      author: "Leonardo & Team",
      category: "Operations",
      readTime: "10 min read",
      issueNo: "044",
      image: ZeroTouchCRMImage,
      quickAnswerTitle: "What is a Zero-Touch CRM?",
      quickAnswer: "A **Zero-Touch CRM** is a data infrastructure that uses autonomous AI agents to maintain a System of Record without human intervention. Instead of relying on sales representatives to manually type notes, the system utilizes a \"Sensor Mesh\" (integrations with Email, Slack, Zoom, LinkedIn) to passively observe interactions.<br/><br/>It uses Large Language Models (LLMs) to extract entities (people, roles, budget), deduplicate records, and sync updates to platforms like Salesforce or HubSpot. It transforms the CRM from a passive database of \"what happened\" into a real-time engine of \"what is happening.\"",
      toc: ["Crisis", "Architecture", "Real-World", "Tech Stack", "Privacy", "Pros & Cons", "Implementation", "FAQ"],
      sections: [
         {
            id: "crisis",
            title: "The Crisis: The Entropy of Sales Data",
            content: (
               <>
                  <h4 className="font-bold text-ink mb-2">The "System of Garbage"</h4>
                  <p className="mb-4">By 2025, the industry standard metric for B2B data decay is roughly 30% per year.</p>
                  <ul className="list-disc list-inside space-y-1 mb-4 text-ink-muted">
                     <li>People change jobs (every 2.5 years on average).</li>
                     <li>Companies merge or rebrand.</li>
                     <li>Phone numbers change.</li>
                  </ul>
                  <p className="mb-6">In the traditional model, the CRM relies on the Sales Representative to update this information. However, sales reps are incentivized to close deals, not do data entry. Consequently, the CRM becomes a graveyard of outdated info.</p>

                  <h4 className="font-bold text-ink mb-2">The Paradigm Shift</h4>
                  <p>The Zero-Touch model operates on a simple premise: <strong>Data entry is a bug, not a feature.</strong> If a piece of information exists digitally (in an email signature, a LinkedIn update, or a Zoom transcript), the human should never have to re-type it.</p>
               </>
            )
         },
         {
            id: "architecture",
            title: "Architecture: How Self-Healing Works",
            content: (
               <>
                  <p className="mb-6">A self-healing database is not a single tool; it is a loop consisting of four distinct phases.</p>
                  <div className="space-y-6">
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-1">1. The Sensor Mesh (Ingest)</h4>
                        <p className="text-sm">The system needs "ears." It connects to unstructured data streams: Gmail/Outlook, Slack/Teams, Zoom/Meet, and public signals like LinkedIn APIs.</p>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-1">2. The Extraction Engine (The Brain)</h4>
                        <p className="text-sm mb-2">Unstructured text is passed through an LLM for Named Entity Recognition (NER).</p>
                        <div className="bg-ink/5 p-2 rounded text-xs font-mono text-ink-muted">
                           Input: "Leonardo, VP of Eng @ TechFlow | +1-555-0199"<br />
                           Extraction: &#123; Name: "Leonardo", Role: "VP of Engineering", Company: "TechFlow" &#125;
                        </div>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-1">3. Identity Resolution (The Match)</h4>
                        <p className="text-sm">The hardest engineering challenge. Using fuzzy matching and vector embeddings to decide if "Leonardo" in an email is the same as "Leo" in Salesforce.</p>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-1">4. The Write-Back (The Heal)</h4>
                        <p className="text-sm">The agent executes an API call to the CRM to update the specific field.</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "real-world",
            title: "Real-World Example: The \"Champion Movement\" Play",
            content: (
               <div className="bg-alt/10 p-6 rounded-sm border border-ink/5">
                  <p className="mb-4 font-medium"><strong>The Scenario:</strong> Alice is a "Head of Product" at Company A and is your main champion. She leaves to join Company B as a "VP of Product."</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="opacity-60">
                        <h5 className="font-bold text-xs uppercase tracking-widest mb-2">The Old Way</h5>
                        <p className="text-sm">The sales rep emails Alice at Company A. The email bounces. The rep marks the lead as "Dead." Relationship lost.</p>
                     </div>
                     <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest text-accent mb-2">The Zero-Touch Way</h5>
                        <ul className="list-disc list-inside text-sm space-y-2">
                           <li><strong>Signal:</strong> System detects LinkedIn update or auto-responder.</li>
                           <li><strong>Action 1:</strong> Marks Alice as "Left Company" in Company A. Triggers task: "Find replacement."</li>
                           <li><strong>Action 2:</strong> Creates new contact for Alice under Company B with inferred email.</li>
                           <li><strong>Action 3:</strong> Drafts congratulatory email: "Congrats on the VP role!"</li>
                        </ul>
                     </div>
                  </div>
                  <p className="mt-4 text-sm text-green-700 font-bold text-center">Result: One lost lead becomes two active opportunities automatically.</p>
               </div>
            )
         },
         {
            id: "tech-stack",
            title: "The Tech Stack: Sensors & Healers",
            content: (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">Clay</strong>
                     <span className="text-xs">The leader in "waterfalling" data providers. Can look up a domain, find the CEO, and write a personalized line.</span>
                  </div>
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">Attio</strong>
                     <span className="text-xs">A next-gen CRM built entirely around the concept of "Data Objects" that sync with email automatically.</span>
                  </div>
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">Fireflies.ai / Gong</strong>
                     <span className="text-xs">Transcribe calls and use AI to fill in "Deal Fields" (Budget, Timeline) directly into Salesforce.</span>
                  </div>
                  <div className="p-3 border border-ink/10 hover:border-accent transition-colors">
                     <strong className="block text-accent">Nango / Merge.dev</strong>
                     <span className="text-xs">Unified APIs to connect your internal AI agents to your customers' disparate systems.</span>
                  </div>
               </div>
            )
         },
         {
            id: "privacy",
            title: "Privacy, Security & Governance",
            content: (
               <>
                  <p>Giving AI read-access to your company's email and Slack is a massive security surface area.</p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                     <li><strong>PII Redaction Layers:</strong> Before text is sent to an external LLM, use a local library (like Microsoft Presidio) to scrub Credit Card numbers and SSNs.</li>
                     <li><strong>Local Inference:</strong> For highly sensitive industries, use local models (Llama-3-70b) hosted in your own VPC. The data never leaves your server.</li>
                     <li><strong>Role-Based Scope:</strong> The AI agent should only have permission to update records; it should generally not have permission to delete records without human approval.</li>
                  </ul>
               </>
            )
         },
         {
            id: "pros-cons",
            title: "Pros & Cons",
            content: (
               <div className="my-8 overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                     <thead>
                        <tr className="border-b border-ink/10">
                           <th className="py-2 font-bold text-ink w-1/2">Pros</th>
                           <th className="py-2 font-bold text-ink w-1/2">Cons</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className="border-b border-ink/5 align-top">
                           <td className="py-2 pr-4 text-ink-muted"><strong>Data Hygiene:</strong> Reaches nearly 100% accuracy on contact details.</td>
                           <td className="py-2 pl-4 text-ink-muted"><strong>Implementation Cost:</strong> Requires expensive API credits (Clay, OpenAI).</td>
                        </tr>
                        <tr className="border-b border-ink/5 align-top">
                           <td className="py-2 pr-4 text-ink-muted"><strong>Rep Productivity:</strong> Saves ~5-10 hours per week per rep on data entry.</td>
                           <td className="py-2 pl-4 text-ink-muted"><strong>Privacy Risks:</strong> Inadvertent ingestion of confidential internal discussions.</td>
                        </tr>
                        <tr className="align-top">
                           <td className="py-2 pr-4 text-ink-muted"><strong>Revenue Signals:</strong> Detects buying signals (e.g., "We are scaling") that humans miss.</td>
                           <td className="py-2 pl-4 text-ink-muted"><strong>"Over-Automation":</strong> Can trigger awkward automated emails if context is misread.</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            )
         },
         {
            id: "implementation",
            title: "Implementation Guide: Crawl, Walk, Run",
            content: (
               <div className="space-y-6">
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Phase 1: The Scribe (Meeting Notes)</h4>
                     <p className="text-sm text-ink-muted">Don't touch the database yet. Implement Fireflies or Gong. Goal: Ensure every client call results in a structured summary in the CRM notes field.</p>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Phase 2: The Updater (Signatures & Titles)</h4>
                     <p className="text-sm text-ink-muted">Use a tool like SigParser. Goal: When an email arrives, parse the signature. If the title/phone differs from the CRM, update it.</p>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Phase 3: The Hunter (Signal-Based Outbound)</h4>
                     <p className="text-sm text-ink-muted">Connect Clay or a custom agent. Goal: Monitor news/LinkedIn for job changes and have the AI automatically create new leads and draft initial outreach.</p>
                  </div>
               </div>
            )
         }
      ],
      faqs: [
         { question: "Can this replace a Revenue Operations (RevOps) team?", answer: "No. It augments them. RevOps currently spends 60% of their time cleaning data. Zero-Touch CRM handles the grunt work, allowing RevOps to focus on strategy, territory planning, and analytics." },
         { question: "Does this work with legacy CRMs like Salesforce?", answer: "Yes. While newer CRMs (Attio, folk) have this native, you can build Zero-Touch pipelines on top of Salesforce using their API or middleware tools like Zapier/Make combined with OpenAI." },
         { question: "How do you handle 'Hallucinations' in data entry?", answer: "You implement 'Confidence Scores.' If the AI is 99% sure it found a phone number, it updates the field. If it is only 60% sure, it creates a 'Task' for a human to verify the data." },
         { question: "Is it legal to scrape LinkedIn for this?", answer: "Direct scraping is against LinkedIn ToS. However, using authorized data vendors (like PeopleDataLabs or Clearbit) who aggregate public data is the standard, compliant workaround." }
      ],
      furtherResources: [
         { title: "Clay.com: The Self-Healing Data Platform", url: "https://www.clay.com/" },
         { title: "Census: The Modern Data Stack for Sales", url: "https://www.getcensus.com/blog/what-is-reverse-etl" }
      ]
   },
   "rag-vs-long-context": {
      id: "rag-vs-long-context",
      title: "RAG vs. Long Context: The Architecture of Memory",
      metaDescription: "Is RAG dead? We analyze the cost, latency, and reasoning trade-offs between Retrieval Augmented Generation and Gemini 1.5 Pro's 2M token context window.",
      publishDate: "2025-11-04",
      author: "Leonardo & Team",
      category: "Engineering",
      readTime: "12 min read",
      issueNo: "045",
      image: RagVsContextImage,
      quickAnswerTitle: "Should I use RAG or a Long Context Window?",
      quickAnswer: "The decision comes down to **Data Dynamism** and **Cost-per-Query**.<br/><br/>Use **RAG** (Retrieval Augmented Generation) when your dataset is massive (Gigabytes/Terabytes), rapidly changing (e.g., live news), or when you need low latency and low cost for thousands of simple queries. RAG is the \"Search Engine\" approach.<br/><br/>Use **Long Context** (Gemini 1.5 Pro, Claude 3.5) when your task requires \"Global Reasoning\" across a specific, static set of heavy documents (e.g., \"Find contradictions between these 10 legal contracts\"). Long Context is the \"Working Memory\" approach.<br/><br/><strong>The Verdict:</strong> RAG is not dead; it is evolving into an optimization layer. Long Context is for deep reasoning; RAG is for broad retrieval.",
      toc: ["Quick Answer", "The Debate", "Economics", "Latency", "Accuracy", "Decision Matrix", "Hybrid", "FAQ"],
      sections: [
         {
            id: "debate",
            title: "The Debate: Is RAG Dead?",
            content: (
               <>
                  <p>For years, RAG was the only way to give an LLM knowledge. You chunked documents, embedded them in a Vector Database (like Pinecone or Milvus), and retrieved the top 5 relevant chunks to feed the model.</p>
                  <p>Then came Gemini 1.5 Pro (2 Million tokens) and Claude 3.5 (200k+ tokens). Suddenly, you could fit the entire Harry Potter series, a full codebase, or a year’s worth of financial filings into a single prompt.</p>
                  <div className="p-4 bg-accent/5 border-l-2 border-accent my-6">
                     <p className="font-serif text-lg italic text-ink">This sparked a narrative: "RAG is dead. Just dump it all in the context window."</p>
                  </div>
                  <p>In reality, engineering is never about "better," it is about trade-offs. While Long Context solves the "lost in the middle" problem, it introduces new bottlenecks in Latency and Compute Cost.</p>
               </>
            )
         },
         {
            id: "economics",
            title: "The Economics: Cost Analysis",
            content: (
               <>
                  <p>This is where the battle is usually won or lost.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <div className="p-5 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">1. The Long Context Cost Model</h4>
                        <p className="text-sm mb-3">Long context models charge you per input token.</p>
                        <div className="bg-ink/5 p-3 rounded text-xs text-ink-muted mb-3 space-y-1">
                           <p><strong>Scenario:</strong> 1,000-page manual (500k tokens).</p>
                           <p><strong>Action:</strong> Put the whole manual in the prompt.</p>
                           <p><strong>Cost:</strong> Pay for 500k tokens <em>every single query</em>.</p>
                           <p className="text-red-600 font-bold">Total: ~$1.25 per question.</p>
                        </div>
                        <p className="text-xs text-ink-muted"><strong>Mitigation:</strong> Context Caching (pays a storage fee to keep memory loaded).</p>
                     </div>
                     <div className="p-5 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">2. The RAG Cost Model</h4>
                        <p className="text-sm mb-3">RAG separates storage from compute.</p>
                        <div className="bg-ink/5 p-3 rounded text-xs text-ink-muted mb-3 space-y-1">
                           <p><strong>Scenario:</strong> Same 1,000-page manual.</p>
                           <p><strong>Action:</strong> Retrieve only 3 relevant pages (1k tokens).</p>
                           <p><strong>Cost:</strong> Vector DB storage + 1k tokens.</p>
                           <p className="text-green-600 font-bold">Total: ~$0.0025 per question.</p>
                        </div>
                        <p className="text-xs text-ink-muted"><strong>Winner:</strong> RAG wins for high-volume transactions.</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "latency",
            title: "The Physics: Latency & Pre-fill",
            content: (
               <>
                  <p>Time-to-First-Token (TTFT) is the metric that kills user experience.</p>
                  <h4 className="font-bold text-ink mt-6 mb-2">Long Context Latency</h4>
                  <p>When you send 1 million tokens to Gemini, the model must process (read) all of them before it generates the first word. This is called the <strong>Pre-fill phase</strong>. Even with hardware acceleration, processing 1M tokens can take 10 to 60 seconds.</p>
                  <p className="text-sm text-ink-muted mt-2"><em>User Experience: The user stares at a spinner for a minute.</em></p>

                  <h4 className="font-bold text-ink mt-6 mb-2">RAG Latency</h4>
                  <ul className="list-disc list-inside space-y-1 text-ink-muted">
                     <li>Retrieval step: 50–100ms.</li>
                     <li>Inference step (reading 2k tokens): 500ms.</li>
                  </ul>
                  <p className="text-sm text-ink-muted mt-2"><em>User Experience: Instant answer.</em></p>

                  <div className="mt-6 p-4 bg-alt/10 border-l-2 border-ink/20">
                     <span className="font-bold text-ink">Winner:</span> RAG is mandatory for real-time applications (Chatbots). Long Context is acceptable for background, asynchronous workflows.
                  </div>
               </>
            )
         },
         {
            id: "accuracy",
            title: "The Brain: Accuracy & Reasoning",
            content: (
               <>
                  <p>This is where Long Context shines.</p>
                  <div className="space-y-6 mt-6">
                     <div>
                        <h4 className="font-bold text-ink text-lg mb-2">The "Needle in a Haystack" Test (NIAH)</h4>
                        <p>Long Context models have achieved nearly 100% recall. If you hide a secret code in the middle of a 2M token prompt, Gemini will find it.</p>
                     </div>
                     <div>
                        <h4 className="font-bold text-ink text-lg mb-2">The "Global Reasoning" Problem</h4>
                        <p className="mb-2"><strong>Prompt:</strong> "Summarize the major themes of this book."</p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-ink-muted">
                           <li><span className="text-red-500 font-bold">RAG Failure:</span> Retrieves 5 random chunks. Cannot summarize the whole because it can't see the whole.</li>
                           <li><span className="text-green-600 font-bold">Long Context Success:</span> Reads every word and synthesizes a perfect summary.</li>
                        </ul>
                     </div>
                     <div>
                        <h4 className="font-bold text-ink text-lg mb-2">The "Multi-Hop" Problem</h4>
                        <p className="mb-2"><strong>Prompt:</strong> "Compare revenue growth in 2023 (Page 10) with risk factors in 2021 (Page 300)."</p>
                        <p className="text-sm text-ink-muted">RAG often fails to fetch the second page because keywords don't match. Long Context sees both pages simultaneously and connects the dots.</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "decision-matrix",
            title: "Decision Matrix: When to Use Which",
            content: (
               <div className="my-8 overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                     <thead>
                        <tr className="border-b border-ink/10">
                           <th className="py-2 font-bold text-ink">Feature</th>
                           <th className="py-2 font-bold text-ink">RAG</th>
                           <th className="py-2 font-bold text-ink">Long Context (1M+)</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className="border-b border-ink/5">
                           <td className="py-2 text-ink-muted">Dataset Size</td>
                           <td className="py-2 text-ink-muted">Infinite (The Internet)</td>
                           <td className="py-2 text-ink-muted">Limited (Fits in RAM)</td>
                        </tr>
                        <tr className="border-b border-ink/5">
                           <td className="py-2 text-ink-muted">Data Updates</td>
                           <td className="py-2 text-ink-muted">Real-time</td>
                           <td className="py-2 text-ink-muted">Static (Re-cache needed)</td>
                        </tr>
                        <tr className="border-b border-ink/5">
                           <td className="py-2 text-ink-muted">Query Cost</td>
                           <td className="py-2 text-ink-muted">Very Low ($0.001)</td>
                           <td className="py-2 text-ink-muted">High (unless Cached)</td>
                        </tr>
                        <tr className="border-b border-ink/5">
                           <td className="py-2 text-ink-muted">Latency</td>
                           <td className="py-2 text-ink-muted">Sub-second</td>
                           <td className="py-2 text-ink-muted">Seconds to Minutes</td>
                        </tr>
                        <tr>
                           <td className="py-2 text-ink-muted">Best For</td>
                           <td className="py-2 text-ink-muted">Fact-checking, Search</td>
                           <td className="py-2 text-ink-muted">Code Auditing, Discovery</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            )
         },
         {
            id: "hybrid",
            title: "The Third Way: Hybrid Architectures",
            content: (
               <>
                  <p>Sophisticated teams in 2025 rarely choose just one. They use <strong>RAG-to-Long-Context</strong>.</p>
                  <div className="bg-white/50 border border-ink/10 p-6 rounded-sm mt-6">
                     <h4 className="font-bold text-ink mb-4">The Workflow</h4>
                     <ol className="list-decimal list-inside space-y-3 text-sm text-ink-muted">
                        <li><strong>Broad Search (RAG):</strong> User asks a vague question about a 100GB database.</li>
                        <li><strong>Filter:</strong> RAG retrieves the top 50 documents (instead of the usual 3).</li>
                        <li><strong>Context Stuffing:</strong> These 50 docs (approx 100k tokens) are stuffed into a Long Context window.</li>
                        <li><strong>Reasoning:</strong> The LLM performs deep reasoning over this filtered subset.</li>
                     </ol>
                     <p className="mt-4 text-sm italic">This balances cost and accuracy. You don't pay to load the whole database, but you give the model enough context to perform multi-hop reasoning.</p>
                  </div>
               </>
            )
         }
      ],
      faqs: [
         { question: "Does Long Context eliminate hallucinations?", answer: "No, but it reduces them compared to RAG. In RAG, if the retrieval step fetches the wrong document, the hallucination is guaranteed. In Long Context, the model has the correct data, but might still 'misread' it if the prompt is ambiguous." },
         { question: "What is Context Caching?", answer: "A feature (in Gemini/Anthropic) where you upload a file once and it is stored in GPU memory. You pay a rental fee, but subsequent queries are faster and cheaper because the model doesn't re-read the file." },
         { question: "Can I use Long Context for coding?", answer: "Yes, it is the best use case. You can upload an entire repo. However, for massive monolithic repos, a hybrid 'RAG for file search + Context for active files' is the standard IDE architecture (e.g., Cursor, GitHub Copilot)." }
      ]
   },
   "local-llm-stack": {
      id: "local-llm-stack",
      title: "Local LLM Stack 2025: Running Llama 4 for Legal Ops",
      metaDescription: "Running Llama 4 locally for privacy-focused legal analysis. Hardware specs and inference engines reviewed.",
      publishDate: "2025-12-07",
      author: "Leonardo & Team",
      category: "Architecture",
      readTime: "14 min read",
      issueNo: "040",
      image: LocalLLMImage,
      quickAnswerTitle: "What is the best stack for local Legal AI in 2025?",
      quickAnswer: "To run Llama 4 (70B) locally for reviewing sensitive legal documents without data egress, the industry standard is the **Apple Silicon Stack**:<br/><br/><strong>Hardware:</strong> Mac Studio (M4 Ultra) with at least 128GB Unified Memory.<br/><strong>Model:</strong> Llama-4-70B-Instruct (Quantized to Q4_K_M or Q5_K_M).<br/><strong>Engine:</strong> Ollama (for backend management) or MLX (for native Apple optimization).<br/><strong>Interface:</strong> Open WebUI (creates a ChatGPT-like experience).<br/><strong>Cost:</strong> ~$5,000 one-time hardware cost. $0 monthly subscription.<br/><br/>This setup allows for analyzing 500+ page PDFs with full privacy, zero latency, and no API costs.",
      toc: ["Mandate", "The Model", "Hardware", "Software Stack", "RAG Pipeline", "FAQ"],
      sections: [
         {
            id: "mandate",
            title: "The Mandate: Why \"Air-Gapped\" Legal AI?",
            content: (
               <>
                  <p>By late 2025, the \"SaaS Fatigue\" in the legal sector has hit a peak. While tools like Harvey and Casetext are powerful, they require sending client data to the cloud. For high-stakes M&A, patent litigation, and criminal defense, <strong>Data Sovereignty</strong> is not a feature; it is an ethical requirement.</p>
                  <div className="bg-alt/10 p-6 rounded-sm border border-ink/5 mt-6">
                     <h4 className="font-bold text-ink mb-2">The \"Air-Gapped\" Advantage:</h4>
                     <ul className="list-disc list-inside space-y-2 text-ink-muted">
                        <li><strong>Privilege Protection:</strong> If the data never leaves the building, it cannot be intercepted or subpoenaed from a third-party provider.</li>
                        <li><strong>GDPR/CCPA Compliance:</strong> Processing PII locally removes the complexity of cross-border data transfer agreements.</li>
                        <li><strong>Cost Control:</strong> Instead of paying $30/user/month + token fees, you pay for electricity.</li>
                     </ul>
                  </div>
               </>
            )
         },
         {
            id: "model",
            title: "The Model: Llama 4 & The Reasoning Shift",
            content: (
               <>
                  <p>Released in mid-2025, Llama 4 changed the landscape by introducing native System 2 Reasoning (similar to OpenAI's o1 series) into open weights.</p>
                  <h4 className="font-bold text-ink mt-6 mb-4">Which version should you run?</h4>
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left border-collapse">
                        <thead>
                           <tr className="border-b border-ink/10">
                              <th className="py-2 font-bold text-ink">Model Size</th>
                              <th className="py-2 font-bold text-ink">Use Case</th>
                              <th className="py-2 font-bold text-ink">Hardware Requirement</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted font-bold">Llama 4 (8B)</td>
                              <td className="py-2 text-ink-muted">Email drafting, basic summarization.</td>
                              <td className="py-2 text-ink-muted">Runs on any modern laptop (16GB RAM).</td>
                           </tr>
                           <tr className="border-b border-ink/5 bg-accent/5">
                              <td className="py-2 text-ink font-bold">Llama 4 (70B)</td>
                              <td className="py-2 text-ink">The Legal Standard. Contract analysis, reasoning.</td>
                              <td className="py-2 text-ink">Requires 48GB+ VRAM/RAM.</td>
                           </tr>
                           <tr>
                              <td className="py-2 text-ink-muted font-bold">Llama 4 (405B)</td>
                              <td className="py-2 text-ink-muted">Complex multi-jurisdictional research.</td>
                              <td className="py-2 text-ink-muted">Enterprise Servers (H200s) or clustered Macs.</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
                  <div className="mt-6 p-4 border border-ink/10 rounded-sm">
                     <h4 className="font-bold text-ink mb-2">The \"Quantization\" Factor</h4>
                     <p className="text-sm text-ink-muted">You do not need to run the full, uncompressed model.</p>
                     <ul className="list-disc list-inside mt-2 text-sm text-ink-muted">
                        <li><strong>FP16 (Full Precision):</strong> Requires ~140GB VRAM for 70B. (Overkill).</li>
                        <li><strong>Q4_K_M (4-bit Quantization):</strong> Requires ~42GB VRAM.</li>
                     </ul>
                     <p className="mt-2 text-sm font-bold text-green-700">Verdict: At Q4, the model retains 99% of its reasoning ability but fits on consumer hardware.</p>
                  </div>
               </>
            )
         },
         {
            id: "hardware",
            title: "Hardware: The \"VRAM Wall\" & Recommendations",
            content: (
               <>
                  <p>To run local AI, the bottleneck is not the speed of the chip; it is the <strong>Memory Bandwidth and Capacity</strong>.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <div className="p-6 bg-white/50 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">Option A: The Gold Standard (Apple Silicon)</h4>
                        <p className="text-sm text-ink-muted mb-4">Apple remains the king of local inference because of Unified Memory Architecture (UMA).</p>
                        <ul className="space-y-2 text-sm">
                           <li><strong>Recommended:</strong> Mac Studio M4 Ultra (128GB RAM).</li>
                           <li><strong>Why:</strong> Loads Llama-4-70B (42GB) with 80GB left for a massive 200k token context window.</li>
                        </ul>
                     </div>
                     <div className="p-6 bg-white/50 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">Option B: The PC Enthusiast (Nvidia)</h4>
                        <p className="text-sm text-ink-muted mb-4">If you are building a Linux server.</p>
                        <ul className="space-y-2 text-sm">
                           <li><strong>Recommended:</strong> Dual RTX 5090s (2x 32GB = 64GB).</li>
                           <li><strong>Note:</strong> Single cards cap at 32GB, insufficient for 70B. Requires "Tensor Parallelism".</li>
                        </ul>
                     </div>
                  </div>
                  <div className="mt-6 p-4 bg-alt/10 border-l-2 border-ink/20">
                     <h4 className="font-bold text-ink text-sm">Option C: The Distributed Fleet (Exo)</h4>
                     <p className="text-sm text-ink-muted">A rising trend in 2025. Stitch three MacBook Pros (M3 Max) together over Wi-Fi/LAN to run the massive 405B model.</p>
                  </div>
               </>
            )
         },
         {
            id: "software",
            title: "The Software Stack: Engines & UI",
            content: (
               <>
                  <p>Don't use the command line. The 2025 stack is user-friendly.</p>
                  <div className="space-y-4 mt-6">
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                           <h4 className="font-bold text-ink">The Engine: Ollama</h4>
                           <p className="text-sm text-ink-muted">The "Docker of AI." One-click install. Model management via <code>ollama run llama4:70b</code>.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                           <h4 className="font-bold text-ink">The Interface: Open WebUI</h4>
                           <p className="text-sm text-ink-muted">Polished interface identical to ChatGPT. Supports document upload ("The Jones Case") with auto-chunking.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                           <h4 className="font-bold text-ink">The Backend (Advanced): vLLM</h4>
                           <p className="text-sm text-ink-muted">For deployments with 50+ concurrent users. Requires Linux Docker container but offers higher throughput.</p>
                        </div>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "rag",
            title: "The RAG Pipeline: Talking to Case Files",
            content: (
               <>
                  <p>Running the model is step one. Step two is giving it memory using a <strong>Local RAG (Retrieval Augmented Generation)</strong> setup.</p>
                  <div className="bg-white/50 p-6 rounded-sm border border-ink/5 mt-6">
                     <h4 className="font-bold text-ink mb-4">The Workflow:</h4>
                     <ol className="list-decimal list-inside space-y-3 font-medium text-ink">
                        <li><strong>Ingestion:</strong> Unstructured.io parses PDFs, strips headers, and OCRs images.</li>
                        <li><strong>Vector Store:</strong> ChromaDB runs locally, storing the "mathematical meaning" of documents.</li>
                        <li><strong>Retrieval:</strong> Lawyer asks a question &rarr; RAG fetches top 10 relevant pages.</li>
                        <li><strong>Generation:</strong> Llama 4 analyzes those 10 pages and drafts the memo.</li>
                     </ol>
                  </div>
                  <div className="mt-4 p-4 text-sm bg-orange-50 text-orange-900 border border-orange-100 rounded-sm flex gap-2">
                     <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                     <span><strong>Tip:</strong> Ensure your RAG pipeline uses Hybrid Search (Keyword + Semantic). Legal documents often hinge on specific dates or names (Keyword) which semantic search sometimes misses.</span>
                  </div>
               </>
            )
         }
      ],
      faqs: [
         { question: "Is Llama 4 truly private?", answer: "The model weights are public, but the inference is private. If you pull the internet cable out of your Mac Studio, the model still works. No data leaves the machine." },
         { question: "Can Llama 4 write a motion to dismiss?", answer: "It can draft a very strong first pass. Llama 4 (70B) is roughly equivalent to GPT-4o in reasoning. However, it requires human review (Human-in-the-Loop) for case citations, as hallucinations can still occur." },
         { question: "What is the cost of electricity?", answer: "Running a Mac Studio M4 Ultra at full load draws ~300W. Running dual RTX 5090s draws ~1000W. For occasional queries, the cost is negligible. For 24/7 batch processing, the Mac is significantly cheaper to operate." },
         { question: "Why not just use Microsoft Copilot?", answer: "Copilot logs data for \"safety monitoring\" and enterprise improvement (unless you have a strict negotiated contract). For criminal defense or IP litigation, the risk of any third-party logging is often unacceptable." }
      ]
   },
   "prompt-patterns": {
      id: "prompt-patterns",
      title: "Prompt Engineering Patterns: Beyond Chain of Thought",
      metaDescription: "Moving beyond 'Chain of Thought'. Implementing 'Tree of Thoughts' and recursive criticism for complex reasoning tasks.",
      publishDate: "2025-12-07",
      author: "Leonardo & Team",
      category: "Strategy",
      readTime: "16 min read",
      issueNo: "039",
      image: PromptPatternsImage,
      quickAnswerTitle: "What is the difference between Chain of Thought and Tree of Thoughts?",
      quickAnswer: "**Chain of Thought (CoT)** is a linear reasoning method (\"Let's think step by step\") where the model follows a single path A → B → C. It is efficient but brittle; if one step is wrong, the final answer fails.<br/><br/>**Tree of Thoughts (ToT)** is a non-linear method where the model generates multiple possible \"branches\" of reasoning for each step, evaluates them (self-voting), and discards the bad paths. It mimics human brainstorming and is 70-80% more effective for complex planning, coding, and creative writing.",
      toc: ["Evolution", "Pattern 1: ToT", "Pattern 2: RCI", "Pattern 3: CoD", "Pattern 4: Maieutic", "Automation: DSPy", "FAQ"],
      sections: [
         {
            id: "evolution",
            title: "The Evolution: From Magic Words to Cognitive Architectures",
            content: (
               <>
                  <p>In 2023, \"Prompt Engineering\" was often derided as \"whispering to the machine.\" By 2025, it has evolved into <strong>Cognitive Architecture Design</strong>.</p>
                  <p>We are no longer searching for the perfect phrase. We are structuring the flow of computation. Advanced patterns like ToT and RCI are designed to break \"tunnel vision\" by forcing <strong>Inference-Time Compute</strong>—trading speed for accuracy.</p>
                  <div className="my-8 overflow-x-auto">
                     <table className="w-full text-sm text-left border-collapse">
                        <thead>
                           <tr className="border-b border-ink/10">
                              <th className="py-2 font-bold text-ink">Pattern</th>
                              <th className="py-2 font-bold text-ink">Topology</th>
                              <th className="py-2 font-bold text-ink">Best Use Case</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Chain of Thought (CoT)</td>
                              <td className="py-2 text-ink-muted">Linear (A→B→C)</td>
                              <td className="py-2 text-ink-muted">Math, simple logic</td>
                           </tr>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink-muted">Tree of Thoughts (ToT)</td>
                              <td className="py-2 text-ink-muted">Branching (A→B1/B2/B3→C)</td>
                              <td className="py-2 text-ink-muted">Strategy, coding, creative</td>
                           </tr>
                           <tr>
                              <td className="py-2 text-ink-muted">Graph of Thoughts (GoT)</td>
                              <td className="py-2 text-ink-muted">Networked (A+B → C)</td>
                              <td className="py-2 text-ink-muted">Aggregating research</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </>
            )
         },
         {
            id: "tot",
            title: "Pattern 1: Tree of Thoughts (ToT)",
            content: (
               <>
                  <h4 className="font-bold text-ink mb-2">The Concept</h4>
                  <p className="mb-4">Humans don't just think linearly. When planning a move in chess, we explore multiple options using \"If/Then\" scenarios. ToT forces the LLM to do the same.</p>
                  <div className="bg-alt/10 p-6 rounded-sm border border-ink/5">
                     <h4 className="font-bold text-ink mb-2">The \"System Prompt\" Template:</h4>
                     <p className="font-mono text-xs text-ink-muted whitespace-pre-wrap">
                        "Imagine three different experts are answering this question.<br />
                        All experts will write down 1 step of their thinking, then share it with the group.<br />
                        Then, all experts will critique each other's step and decide which path is the most promising.<br />
                        If a path is flawed, they must discard it and start a new branch.<br />
                        Continue this process until a consensus is reached."
                     </p>
                  </div>
                  <p className="mt-4 text-sm text-ink-muted"><strong>Why it works:</strong> It forces the model to generate diverse perspectives and perform a "majority vote" on its own logic before committing.</p>
               </>
            )
         },
         {
            id: "rci",
            title: "Pattern 2: Recursive Criticism & Improvement (RCI)",
            content: (
               <>
                  <h4 className="font-bold text-ink mb-2">The Concept</h4>
                  <p className="mb-4">LLMs are often better at spotting errors than avoiding them. RCI asks the model to act as its own editor (Reflexion Loop).</p>
                  <ul className="list-decimal list-inside space-y-2 bg-white/50 p-6 rounded-sm border border-ink/5">
                     <li><strong>Draft:</strong> Model generates a response.</li>
                     <li><strong>Critique:</strong> "Review the previous response for security vulnerabilities, logic gaps, or tone inconsistencies."</li>
                     <li><strong>Refine:</strong> "Rewrite the response strictly following the critique."</li>
                  </ul>
                  <p className="mt-4 text-sm text-green-700 font-bold">Result: Improves coding accuracy on HumanEval by over 30%.</p>
               </>
            )
         },
         {
            id: "density",
            title: "Pattern 3: Chain of Density (CoD)",
            content: (
               <>
                  <p>Standard summaries are often \"lossy\". Chain of Density is a recursive technique to pack more entities into a fixed-length summary.</p>
                  <div className="mt-4 p-4 border border-ink/10 rounded-sm">
                     <h4 className="font-bold text-ink mb-2">The Algorithm:</h4>
                     <ol className="list-decimal list-inside space-y-1 text-sm text-ink-muted">
                        <li>Write a sparse summary.</li>
                        <li>Identify "Missing Entities" (facts/names left out).</li>
                        <li>Rewrite the summary without increasing the length, fusing the missing entities.</li>
                        <li>Repeat 3-5 times.</li>
                     </ol>
                  </div>
                  <p className="mt-2 text-sm italic">Best For: Creating high-signal executive briefings or newsletters.</p>
               </>
            )
         },
         {
            id: "maieutic",
            title: "Pattern 4: Maieutic Prompting (Socratic)",
            content: (
               <>
                  <p>Named after the Socratic method, this pattern helps the model handle Ambiguity. If a user asks a vague question, a standard LLM guesses. A Maieutic agent asks clarifying questions.</p>
                  <div className="bg-alt/10 p-6 rounded-sm border border-ink/5 mt-4">
                     <h5 className="font-bold text-xs uppercase tracking-widest mb-2">The Template:</h5>
                     <p className="text-sm italic">"I will ask a question. If the answer depends on conditions, do not answer directly.<br />Instead: Identify ambiguity. Propose a tree of logical explanations ('If A, then X'). Assess contradictions."</p>
                  </div>
                  <p className="mt-2 text-sm"><strong>Best For:</strong> Legal analysis, Logical dilemmas, and Medical diagnosis.</p>
               </>
            )
         },
         {
            id: "dspy",
            title: "Automating the Patterns: DSPy & DSP",
            content: (
               <>
                  <p>By 2025, writing complex prompt chains by hand is considered brittle. The industry has moved toward <strong>DSPy</strong> (Declarative Self-Improving Language Programs).</p>
                  <h4 className="font-bold text-ink mt-6 mb-2">What is DSPy?</h4>
                  <p>Instead of writing text prompts ("You are a helpful assistant..."), you write Python code that compiles into prompts.</p>
                  <ul className="list-disc list-inside space-y-2 mt-4 text-sm bg-white/50 p-4 border border-ink/10 rounded-sm">
                     <li>You define a module: <code>ChainOfThought("question &rarr; answer")</code>.</li>
                     <li>You give it examples (Few-Shot).</li>
                     <li>The <strong>Compiler</strong> optimizes the prompt for you. It tests 1,000 variations against a metric and selects the best one.</li>
                  </ul>
                  <p className="mt-4 text-sm"><strong>Benefit:</strong> If you switch models (GPT-4 to Llama-3), DSPy recompiles the prompts to fit the new model automatically.</p>
               </>
            )
         }
      ],
      faqs: [
         { question: "Does OpenAI's o1 (Strawberry) make this obsolete?", answer: "OpenAI's o1 model performs 'Chain of Thought' internally. However, for Open Source models (Llama 4) or for granular control over logic, you still need to implement these patterns explicitly." },
         { question: "How much does Tree of Thoughts cost?", answer: "It is expensive. Generating 9 intermediate thoughts increases token usage by 10x. Use it only for high-value tasks." },
         { question: "Can I use these patterns in ChatGPT Plus?", answer: "Yes. You can paste the 'System Prompts' provided above into a Custom Instruction to force the model into these reasoning modes." },
         { question: "What is 'Skeleton-of-Thought'?", answer: "A latency-optimization pattern. You ask the model to first write an outline, then use parallel API calls to fill in each section simultaneously." }
      ]
   },
   "ai-compliance": {
      id: "ai-compliance",
      title: "AI Legal Compliance: Navigating the EU AI Act while Shipping Fast",
      metaDescription: "Navigating the EU AI Act while shipping fast. Practical checklists for automated decision-making systems.",
      publishDate: "2025-12-07",
      author: "Leonardo & Team",
      category: "Strategy",
      readTime: "12 min read",
      issueNo: "038",
      image: ComplianceImage,
      quickAnswerTitle: "How to ship fast without getting fined?",
      quickAnswer: "The EU AI Act is fully enforceable as of mid-2025. It applies to anyone placing an AI system on the EU market. To ship fast without getting fined:<br/><br/><strong>Adopt \"Compliance by Design\":</strong> Use automated tools to generate Model Cards, track Data Lineage, and enforce Human-in-the-Loop protocols for high-risk decisions. Do not treat compliance as a final legal review; treat it as part of your CI/CD pipeline.",
      toc: ["Landscape", "Risk Pyramid", "High Risk", "Checklist", "Technical", "Penalties", "FAQ"],
      sections: [
         {
            id: "landscape",
            title: "The Landscape: The \"Brussels Effect\" in 2025",
            content: (
               <>
                  <p>By December 2025, the grace periods for the EU AI Act have largely expired. The European AI Office is active, and the first fines are being processed. Just as GDPR became the global standard for privacy, the EU AI Act has become the global standard for model safety.</p>
                  <div className="bg-alt/10 p-6 rounded-sm border border-ink/5 mt-6">
                     <h4 className="font-bold text-ink mb-2">The \"SaaS Trap\"</h4>
                     <p className="text-sm text-ink-muted">Many developers assume they are safe because they just "wrap" OpenAI. <strong>Reality Check:</strong> If you wrap GPT-4 to build a "Candidate Screening Tool," YOU are the "Provider" of a High-Risk system under the Act. You inherit the liability, not OpenAI.</p>
                  </div>
               </>
            )
         },
         {
            id: "risk-pyramid",
            title: "The Risk Pyramid: Where does your tool fit?",
            content: (
               <>
                  <p>Before writing code, you must classify your system. The regulations are binary based on this classification.</p>
                  <div className="my-8 overflow-x-auto">
                     <table className="w-full text-sm text-left border-collapse">
                        <thead>
                           <tr className="border-b border-ink/10">
                              <th className="py-2 font-bold text-ink">Risk Level</th>
                              <th className="py-2 font-bold text-ink">Examples</th>
                              <th className="py-2 font-bold text-ink">Obligations</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-ink/5 bg-red-50">
                              <td className="py-2 text-ink font-bold">Unacceptable (Banned)</td>
                              <td className="py-2 text-ink-muted">Social Scoring, Emotion Recognition in Schools.</td>
                              <td className="py-2 text-ink-muted">Do Not Build. Immediate withdrawal.</td>
                           </tr>
                           <tr className="border-b border-ink/5 bg-orange-50">
                              <td className="py-2 text-ink font-bold">High Risk</td>
                              <td className="py-2 text-ink-muted">Resume scanners, Credit scoring, Medical Devices.</td>
                              <td className="py-2 text-ink-muted">Heavy Compliance. Conformity assessment.</td>
                           </tr>
                           <tr className="border-b border-ink/5">
                              <td className="py-2 text-ink font-bold">Limited Risk</td>
                              <td className="py-2 text-ink-muted">Chatbots, Image generators.</td>
                              <td className="py-2 text-ink-muted">Transparency. "You are talking to an AI."</td>
                           </tr>
                           <tr>
                              <td className="py-2 text-ink font-bold">Minimal Risk</td>
                              <td className="py-2 text-ink-muted">Spam filters, Video games.</td>
                              <td className="py-2 text-ink-muted">None.</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </>
            )
         },
         {
            id: "high-risk",
            title: "Focus: Automated Decision-Making (High-Risk Systems)",
            content: (
               <>
                  <p>If you are building \"Automated Decision-Making\" (ADM) systems, you are likely in the High-Risk category (Annex III of the Act).</p>
                  <ul className="list-disc list-inside space-y-2 mt-4 bg-white/50 p-6 rounded-sm border border-ink/5">
                     <li><strong>Employment:</strong> Tools that filter CVs or rank candidates.</li>
                     <li><strong>Education:</strong> Proctoring software or grading algorithms.</li>
                     <li><strong>Financial Services:</strong> Creditworthiness assessments.</li>
                     <li><strong>Critical Infrastructure:</strong> Traffic control, water, or electricity grids.</li>
                  </ul>
                  <div className="mt-4 p-4 border-l-4 border-accent bg-accent/5">
                     <p className="text-sm font-bold text-ink">The "Fundamental Rights" Test</p>
                     <p className="text-sm text-ink-muted">If your AI says "No" to a human (No job, No loan, No university admission), it is High Risk.</p>
                  </div>
               </>
            )
         },
         {
            id: "checklist",
            title: "The \"Ship Fast\" Checklist for Compliance",
            content: (
               <div className="space-y-6">
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Phase 1: Data Governance (Before Training)</h4>
                     <ul className="list-disc list-inside text-sm text-ink-muted pl-2">
                        <li><strong>Data Lineage:</strong> Trace training data back to source (DVC/Pachyderm).</li>
                        <li><strong>Bias Audit:</strong> Test dataset for representational bias.</li>
                        <li><strong>Copyright:</strong> Ensure legal right to use data.</li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Phase 2: The Technical File (During Dev)</h4>
                     <ul className="list-disc list-inside text-sm text-ink-muted pl-2">
                        <li><strong>Model Card:</strong> Live document detailing limitations.</li>
                        <li><strong>Logging:</strong> Automatically log Input/Output/Latency.</li>
                        <li><strong>metrics:</strong> Document F1 Score, Precision, Recall.</li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Phase 3: Human Oversight (Deployment)</h4>
                     <ul className="list-disc list-inside text-sm text-ink-muted pl-2">
                        <li><strong>The "Stop" Button:</strong> Capability to shut down immediately.</li>
                        <li><strong>Human-in-the-Loop (HITL):</strong> AI outputs recommendation, human clicks "Approve."</li>
                     </ul>
                  </div>
               </div>
            )
         },
         {
            id: "technical",
            title: "Technical Implementation: Compliance as Code",
            content: (
               <>
                  <p>Don't rely on lawyers to update Word documents. Automate compliance.</p>
                  <div className="space-y-6 mt-6">
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">1. The Model Card Generator</h4>
                        <p className="text-sm mb-2">Use <code>model-card-toolkit</code> to auto-generate reports.</p>
                        <div className="bg-ink text-white p-3 rounded text-xs font-mono">
                           with mlflow.start_run():<br />
                           &nbsp;&nbsp;mlflow.log_param("data_version", "v2.1-GDPR-cleaned")<br />
                           &nbsp;&nbsp;mlflow.log_metric("bias_disparity_index", 0.05)
                        </div>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">2. Watermarking (for GenAI)</h4>
                        <ul className="list-disc list-inside text-sm text-ink-muted">
                           <li><strong>Images:</strong> Use C2PA standards to sign as "AI Generated."</li>
                           <li><strong>Text:</strong> Add disclaimer: "I am an AI assistant."</li>
                        </ul>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">3. Explainability (XAI)</h4>
                        <p className="text-sm text-ink-muted">Use <strong>SHAP values</strong> to explain rejections. Legal Requirement: The user has a "Right to Explanation."</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "penalties",
            title: "Penalties & Enforcement",
            content: (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                     <div className="p-4 bg-red-50 border border-red-100 rounded-sm text-center">
                        <div className="text-2xl font-bold text-red-800">35M &euro;</div>
                        <div className="text-xs text-red-600 uppercase tracking-widest font-bold mt-1">Prohibited AI</div>
                        <p className="text-xs text-ink-muted mt-2">or 7% of Global Turnover</p>
                     </div>
                     <div className="p-4 bg-orange-50 border border-orange-100 rounded-sm text-center">
                        <div className="text-2xl font-bold text-orange-800">15M &euro;</div>
                        <div className="text-xs text-orange-600 uppercase tracking-widest font-bold mt-1">High-Risk Violations</div>
                        <p className="text-xs text-ink-muted mt-2">or 3% of Global Turnover</p>
                     </div>
                     <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-sm text-center">
                        <div className="text-2xl font-bold text-yellow-800">7.5M &euro;</div>
                        <div className="text-xs text-yellow-600 uppercase tracking-widest font-bold mt-1">Misinformation</div>
                        <p className="text-xs text-ink-muted mt-2">or 1.5% of Global Turnover</p>
                     </div>
                  </div>
               </>
            )
         }
      ],
      faqs: [
         { question: "I am a US company. Does this apply to me?", answer: "Yes. If your output is available to users in the EU, the Act applies. There is no 'Geoblocking' loophole if you actively market to the EU." },
         { question: "What about Open Source?", answer: "If you release a model under an open license and do not monetize it, many obligations are waived. However, this exception does not apply if the model is Prohibited or High-Risk." },
         { question: "Is 'General Purpose AI' (GPAI) High Risk?", answer: "Not automatically. GPAI models (like Llama 4) have their own tier. Typically they require technical docs and copyright compliance. 'Systemic Risk' models face stricter Red Teaming." },
         { question: "How do I start?", answer: "Perform a Fundamental Rights Impact Assessment (FRIA). It asks: 'Could this AI hurt someone's safety or rights?' If yes, call legal." }
      ]
   },

   "saas-pricing": {
      id: "saas-pricing",
      title: "The Death of SaaS Pricing: From \"Seats\" to \"Outcomes\"",
      metaDescription: "Why 'per seat' pricing is dying and how to transition your AI product to 'outcome-based' billing models.",
      publishDate: "2025-12-07",
      author: "Leonardo & Team",
      category: "Strategy",
      readTime: "10 min read",
      issueNo: "037",
      image: SaaSPricingImage,
      quickAnswerTitle: "Why is \"Per Seat\" pricing dying?",
      quickAnswer: "\"Per Seat\" pricing ($30/user/month) assumes software is a tool used by humans. However, AI Agents are now performing the work instead of humans.<br/><br/>If your AI is successful, your customer will hire fewer humans. If they hire fewer humans, your revenue drops. Therefore, in an agentic world, seat-based pricing penalizes efficiency. The industry is shifting to **Outcome-Based Pricing** (charging per ticket resolved, per report written, or per lead qualified).",
      toc: ["Crisis", "New Hierarchy", "Examples", "Strategy", "Tech Stack", "Risks", "FAQ"],
      sections: [
         {
            id: "crisis",
            title: "The Crisis: The Copilot Paradox",
            content: (
               <>
                  <p>In 2025, we face the Copilot Paradox: You build an amazing AI Agent that automates 80% of the Legal Department's work. The client realizes they don't need 10 paralegals; they only need 2 paralegals and your AI.</p>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-sm mt-4">
                     <p className="text-sm text-red-900 font-bold">Result: Your client saves millions, but your contract value drops from 10 seats to 2 seats. You effectively engineered your own revenue churn.</p>
                  </div>
                  <h4 className="font-bold text-ink mt-6 mb-2">The \"Service-as-Software\" Shift</h4>
                  <p>Investors are no longer valuing AI companies based on \"User Adoption.\" They are valuing them on \"Service Total Addressable Market\" (Service TAM). You aren't competing with Microsoft Word ($10/month); you are competing with the Paralegal ($60,000/year). Your pricing must capture a slice of that labor value.</p>
               </>
            )
         },
         {
            id: "hierarchy",
            title: "The New Hierarchy: Usage vs. Outcome",
            content: (
               <>
                  <p>If \"Seats\" are dead, what replaces them? There is a hierarchy of AI monetization.</p>
                  <div className="space-y-6 mt-6">
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-1">Level 1: Usage-Based (Snowflake Model)</h4>
                        <p className="text-sm mb-2">Metric: Per 1M Tokens, Per GPU Hour.</p>
                        <p className="text-xs text-ink-muted"><strong>Cons:</strong> Customers hate this. It punishes them for using the product. It feels like leaving the lights on.</p>
                     </div>
                     <div className="p-4 bg-white/40 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-1">Level 2: Credit-Based (Adobe Model)</h4>
                        <p className="text-sm mb-2">Metric: 500 \"Generations\" per month.</p>
                        <p className="text-xs text-ink-muted"><strong>Cons:</strong> Friction. Users hesitate to click \"Generate\" because of hoarding mentality.</p>
                     </div>
                     <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm">
                        <h4 className="font-bold text-accent mb-1">Level 3: Outcome-Based (Agency Model)</h4>
                        <p className="text-sm mb-2">Metric: Per Successful Resolution.</p>
                        <p className="text-xs text-ink-muted"><strong>Philosophy:</strong> \"We don't get paid for trying; we get paid for doing.\"</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "examples",
            title: "Real-World Examples: Intercom & Salesforce",
            content: (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     <div className="p-4 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">Intercom (Fin AI)</h4>
                        <p className="text-sm text-ink-muted"><strong>Price:</strong> $0.99 per resolution.</p>
                        <p className="text-xs mt-2 text-ink-muted">The Hook: If the AI answers but the user still requests a human, you pay $0. Aligns incentives perfectly.</p>
                     </div>
                     <div className="p-4 border border-ink/10 rounded-sm">
                        <h4 className="font-bold text-ink mb-2">Salesforce (Agentforce)</h4>
                        <p className="text-sm text-ink-muted"><strong>Price:</strong> $2 per conversation.</p>
                        <p className="text-xs mt-2 text-ink-muted">Logic: An Agent capable of handling unlimited conversations is worth far more than a single $300 seat.</p>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "strategy",
            title: "Strategy: Defining Your \"Atomic Unit of Work\"",
            content: (
               <>
                  <p>To transition, you must identify your metric. This is called the Atomic Unit of Work.</p>
                  <ul className="list-none space-y-4 mt-4">
                     <li className="p-3 bg-white/50 border-l-2 border-ink/20">
                        <strong className="block text-ink text-sm">Step 1: Identify the Deliverable</strong>
                        <span className="text-xs text-ink-muted">Recruiting AI: Not "emails sent," but "Interview Scheduled."</span>
                     </li>
                     <li className="p-3 bg-white/50 border-l-2 border-ink/20">
                        <strong className="block text-ink text-sm">Step 2: The \"Success\" Gate</strong>
                        <span className="text-xs text-ink-muted">How do you verify quality? <strong>Implicit Acceptance:</strong> You charge if the user doesn't edit the output within 24 hours.</span>
                     </li>
                     <li className="p-3 bg-white/50 border-l-2 border-ink/20">
                        <strong className="block text-ink text-sm">Step 3: The Hybrid Pricing</strong>
                        <span className="text-xs text-ink-muted">Don't go cold turkey. Charge a Platform Fee ($500/mo) for stability + Work Fee ($5/action) for upside.</span>
                     </li>
                  </ul>
               </>
            )
         },
         {
            id: "tech-stack",
            title: "The Tech Stack: Billing Infrastructure",
            content: (
               <>
                  <p>Stripe's default subscription model struggles with complex metering. You need specialized \"Metered Billing\" infrastructure.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                     <div className="p-3 border border-ink/10 text-center">
                        <strong className="block text-accent mb-1">Orb</strong>
                        <span className="text-xs text-ink-muted">Modern standard for flexible usage-based billing.</span>
                     </div>
                     <div className="p-3 border border-ink/10 text-center">
                        <strong className="block text-accent mb-1">Metronome</strong>
                        <span className="text-xs text-ink-muted">Scalable infra for enterprise pricing changes.</span>
                     </div>
                     <div className="p-3 border border-ink/10 text-center">
                        <strong className="block text-accent mb-1">Lago</strong>
                        <span className="text-xs text-ink-muted">Open-source alternative for metering.</span>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "risks",
            title: "Objections & Risk Mitigation",
            content: (
               <div className="space-y-6 mt-4">
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Objection: \"CFOs hate variable costs.\"</h4>
                     <p className="text-sm text-ink-muted"><strong>Solution: Drawdown Drawers.</strong> Customer pre-pays $60k/year for 60,000 credits. They draw down against this balance. Predictable budget, variable usage.</p>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">Objection: \"What if the AI loops?\"</h4>
                     <p className="text-sm text-ink-muted"><strong>Solution: Circuit Breakers.</strong> "Your agent is capped at $50/day. We will pause and email you if it hits this limit."</p>
                  </div>
               </div>
            )
         }
      ],
      faqs: [
         { question: "Does this apply to B2C?", answer: "No. Consumers prefer flat-rate (Netflix style). Outcome-based is primarily a B2B strategy where the output has a clear ROI." },
         { question: "Should I charge for 'Thinking Time' (Inference)?", answer: "Generally, no. Customers don't care how hard the AI thought; they care about the result. If you optimize your model to be 50% faster, keep that margin." },
         { question: "My AI isn't accurate enough yet. Can I use this?", answer: "No. If your success rate is below 80%, outcome-based pricing will bankrupt you. Stick to Seat or Usage pricing until your Agent is reliable." }
      ]
   },
   "automated-video": {
      id: "automated-video",
      title: "Automated Video Prod: The Age of Hyper-Personalization",
      metaDescription: "The age of hyper-personalization. Using Veo and Remotion to create 'segments of one' for sales outreach.",
      publishDate: "2025-12-07",
      author: "Leonardo & Team",
      category: "Strategy",
      readTime: "11 min read",
      issueNo: "036",
      image: AutomatedVideoImage,
      quickAnswerTitle: "What is Automated Video Production?",
      quickAnswer: "Automated Video Production (Programmatic Video) uses code and AI models to generate thousands of unique video assets without manual editing. By combining **Generative Video** (Google Veo), **Neural TTS** (ElevenLabs), and **Code-Based Rendering** (Remotion), companies can create \"segments of one.\"<br/><br/>Instead of sending a generic video to 1,000 prospects, you send 1,000 videos where the AI avatar speaks the prospect's name and shows their website.",
      toc: ["Shift", "Tech Stack", "Architecture", "Real-World", "QC", "FAQ"],
      sections: [
         {
            id: "shift",
            title: "The Shift: From Broadcast to Narrowcast",
            content: (
               <>
                  <p>In 2025, we have moved to a \"Narrowcast\" model. The goal is not to make one video that goes viral; it is to make 10,000 videos that each get 1 view, but that 1 view converts.</p>
                  <div className="bg-alt/10 p-6 rounded-sm border border-ink/5 mt-6">
                     <h4 className="font-bold text-ink mb-2">The \"Video Bottleneck\"</h4>
                     <p className="text-sm text-ink-muted">Sales teams know video works. But a sales rep can only record ~10 personalized Loom videos a day before burning out.</p>
                     <ul className="list-disc list-inside mt-2 text-sm text-ink-muted font-mono">
                        <li>Manual Limit: 10 videos/day.</li>
                        <li>Automated Limit: Infinite videos/day.</li>
                     </ul>
                  </div>
               </>
            )
         },
         {
            id: "tech-stack",
            title: "The Tech Stack: Veo, TTS, and Remotion",
            content: (
               <>
                  <p>To build this pipeline, you need three distinct engines working in harmony.</p>
                  <div className="space-y-6 mt-6">
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                           <h4 className="font-bold text-ink">The Visual Engine (Google Veo)</h4>
                           <p className="text-sm text-ink-muted">Generates the "Stock Footage." In 2025, Veo leads in "Prompt adherence" and text rendering.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                           <h4 className="font-bold text-ink">The Audio Engine (ElevenLabs)</h4>
                           <p className="text-sm text-ink-muted">Converts script to speech. "Speech-to-Speech" allows recording a rough draft with emotion that the AI polishes.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                           <h4 className="font-bold text-ink">The Compositor (Remotion)</h4>
                           <p className="text-sm text-ink-muted">The "Editor" that glues it together using React code.</p>
                           <div className="mt-2 bg-ink text-white p-3 rounded text-xs font-mono">
                              &lt;Sequence from={'{'}0{'}'} durationInFrames={'{'}90{'}'}&gt;<br />
                              &nbsp;&nbsp;&lt;Title text={`{`}`Hello, ${'{'}customerName{'}'}!`{`}`} /&gt;<br />
                              &nbsp;&nbsp;&lt;BackgroundVideo src={'{'}veoGeneratedAsset{'}'} /&gt;<br />
                              &lt;/Sequence&gt;
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            )
         },
         {
            id: "architecture",
            title: "Architecture: Building the Video Factory",
            content: (
               <>
                  <p>You are not editing; you are rendering. Here is the pipeline architecture.</p>
                  <ul className="list-none space-y-4 mt-4">
                     <li className="p-3 bg-white/50 border-l-2 border-ink/20">
                        <strong className="block text-ink text-sm">Phase 1: Data Enrichment</strong>
                        <span className="text-xs text-ink-muted">Agent visits techflow.io and takes a scrolling screenshot (Puppeteer). Extracts Name ("Sarah") and Industry ("Fintech").</span>
                     </li>
                     <li className="p-3 bg-white/50 border-l-2 border-ink/20">
                        <strong className="block text-ink text-sm">Phase 2: Script Generation</strong>
                        <span className="text-xs text-ink-muted">LLM writes a 45-second script based on industry context.</span>
                     </li>
                     <li className="p-3 bg-white/50 border-l-2 border-ink/20">
                        <strong className="block text-ink text-sm">Phase 3: Asset Generation</strong>
                        <span className="text-xs text-ink-muted">Audio via ElevenLabs. Background via Google Veo ("Generate modern digital banking interface").</span>
                     </li>
                     <li className="p-3 bg-white/50 border-l-2 border-accent">
                        <strong className="block text-ink text-sm">Phase 4: Assembly & Rendering</strong>
                        <span className="text-xs text-ink-muted">Remotion layers Avatar over background and overlays the website screenshot on a 3D laptop model.</span>
                     </li>
                  </ul>
               </>
            )
         },
         {
            id: "real-world",
            title: "Real-World Play: The Dynamic VSL",
            content: (
               <>
                  <p><strong>Scenario:</strong> Selling Cybersecurity software to CTOs.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                     <div className="p-4 border border-ink/10 rounded-sm text-center">
                        <h5 className="font-bold text-ink text-sm mb-2">The Hook (0-10s)</h5>
                        <p className="text-xs text-ink-muted">Avatar stands in front of a generated server room. <br />"Hi James. I noticed [Company] scaled AWS usage..."</p>
                     </div>
                     <div className="p-4 border border-ink/10 rounded-sm text-center bg-accent/5">
                        <h5 className="font-bold text-ink text-sm mb-2">The Proof (10-30s)</h5>
                        <p className="text-xs text-ink-muted">Camera zooms into laptop screen showing James's ACTUAL website with a red "Security Alert" overlay.</p>
                     </div>
                     <div className="p-4 border border-ink/10 rounded-sm text-center">
                        <h5 className="font-bold text-ink text-sm mb-2">The Close (30-45s)</h5>
                        <p className="text-xs text-ink-muted">Avatar returns. <br />"I made a full report. Click below."</p>
                     </div>
                  </div>
                  <p className="mt-4 text-center text-sm italic font-bold text-ink">Result: This is not viewed as "Marketing"; it is viewed as "Consulting."</p>
               </>
            )
         },
         {
            id: "qc",
            title: "Quality Control & The Uncanny Valley",
            content: (
               <div className="space-y-6 mt-4">
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">The Lip-Sync Problem</h4>
                     <p className="text-sm text-ink-muted">If audio and lips are out of sync, trust is destroyed. <strong>Solution:</strong> Use SyncLabs for "Universal Lip Sync" to modify video footage to match new audio tracks invisibly.</p>
                  </div>
                  <div>
                     <h4 className="font-bold text-ink text-sm mb-1">The "Hallucination" Problem</h4>
                     <p className="text-sm text-ink-muted">Veo might generate gibberish text in the background. <strong>Solution:</strong> Use "Negative Prompting" (negative_prompt: "text, watermark, blurry"). Overlay text using code instead.</p>
                  </div>
               </div>
            )
         }
      ],
      faqs: [
         { question: "Is this expensive?", answer: "Compared to human editing, no. Roughly $0.80 per personalized video. If it doubles book rate, ROI is massive." },
         { question: "How do I prevent the AI from saying something offensive?", answer: "Implement a Moderation Layer. Pass script through a 'Safety LLM' before sending to TTS." },
         { question: "Can I clone my own voice and face?", answer: "Yes. This is best practice. Record your CEO (with consent) and train a custom Instant Avatar. It feels authentic." },
         { question: "Does Veo generate sound?", answer: "Veo generates video. For sales assets, use clean, controlled TTS (Voiceover) rather than AI-generated ambient noise." }
      ]
   }
};

const BriefingDetailPage: React.FC<BriefingDetailPageProps> = ({ onNavigate, id }) => {
   const data = (id && briefings[id]) ? briefings[id] : briefings["agentic-workflow"];

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [id]);

   // AEO: Inject Structured Data (JSON-LD)
   useEffect(() => {
      const schemaData = {
         "@context": "https://schema.org",
         "@type": "TechArticle",
         "headline": data.title,
         "image": [data.image],
         "datePublished": data.publishDate,
         "author": [{
            "@type": "Organization",
            "name": "DaVeenci Consulting"
         }],
         "description": data.metaDescription,
         "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": (data.faqs || []).map((faq: any) => ({
               "@type": "Question",
               "name": faq.question,
               "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
               }
            }))
         }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);

      return () => {
         document.head.removeChild(script);
      };
   }, [data]);

   return (
      <div className="flex flex-col w-full min-h-screen bg-base">
         <Header onNavigate={onNavigate} currentPage="briefing-detail" />

         {/* Article Header */}
         <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden">
            <VitruvianBackground className="opacity-[0.1]" />
            <div className="max-w-4xl mx-auto relative z-10 text-center">
               <div className="flex items-center justify-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="px-3 py-1 bg-white/50 backdrop-blur border border-ink/10 rounded-sm text-[10px] font-bold tracking-widest uppercase text-accent">
                     {data.category}
                  </span>
                  <span className="text-ink-muted/40 font-mono text-xs">#{data.issueNo}</span>
               </div>

               <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  {data.title}
               </h1>

               <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-ink-muted/70 font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  <div className="flex items-center gap-2">
                     <span className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-serif italic text-xs">D</span>
                     <span>By {data.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4" />
                     <span>{data.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Tag className="w-4 h-4" />
                     <span>{data.publishDate}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24">

            {/* Sidebar - TOC (Great for AEO Site Links) */}
            <aside className="hidden lg:block lg:col-span-3 relative">
               <div className="sticky top-32 p-6 border-l border-ink/10">
                  <h3 className="font-sans text-xs font-bold text-ink uppercase tracking-widest mb-4">Contents</h3>
                  <ul className="space-y-3">
                     {data.toc.map((item, i) => (
                        <li key={i}>
                           <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-ink-muted hover:text-accent transition-colors flex items-center gap-2 group">
                              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {item}
                           </a>
                        </li>
                     ))}
                  </ul>
                  <div className="mt-8 pt-8 border-t border-ink/10">
                     <p className="text-xs text-ink-muted mb-4">Need this implemented?</p>
                     <Button variant="primary" className="w-full text-xs py-2" onClick={() => onNavigate('landing', 'booking')}>Book Strategy</Button>
                  </div>
               </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-9 max-w-3xl mx-auto">

               {/* AEO: Quick Answer Box (Featured Snippet Optimization) */}
               <div className="bg-accent/5 border border-accent/20 p-6 md:p-8 rounded-sm mb-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Lightbulb className="w-12 h-12 text-accent" />
                  </div>
                  <h2 className="font-serif text-2xl text-accent mb-4 flex items-center gap-2">
                     <span className="text-sm font-sans font-bold uppercase tracking-widest bg-white/50 px-2 py-1 rounded-sm text-ink-muted">Quick Answer</span>
                     {data.quickAnswerTitle}
                  </h2>
                  <div className="prose prose-lg text-ink-muted leading-relaxed">
                     <p dangerouslySetInnerHTML={{ __html: data.quickAnswer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
               </div>

               <img src={data.image} alt={data.title} className="w-full h-[500px] object-cover object-center rounded-sm mb-12 shadow-xl shadow-ink/5" />

               {/* Dynamic Sections */}
               {data.sections.map((section) => (
                  <div key={section.id} id={section.id} className="mb-16">
                     <h3 className="font-serif text-2xl text-ink mb-6">{section.title}</h3>
                     <div className="prose prose-lg text-ink-muted/90">
                        {section.content}
                     </div>
                  </div>
               ))}

               {/* FAQ (Schema Optimized) */}
               <div id="faq" className="mb-16">
                  <h3 className="font-serif text-3xl text-ink mb-8 text-center">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                     {data.faqs.map((faq, i) => (
                        <div key={i} className="border-b border-ink/10 pb-4">
                           <h4 className="font-bold text-ink text-lg mb-2">{faq.question}</h4>
                           <p className="text-ink-muted text-base leading-relaxed">{faq.answer}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Further Reading */}
               {data.furtherResources && data.furtherResources.length > 0 && (
                  <div id="further-reading" className="bg-ink text-base p-8 rounded-sm">
                     <h3 className="font-serif text-xl text-white mb-4">Further Resources</h3>
                     <ul className="space-y-2 text-white/70">
                        {data.furtherResources.map((resource, i) => (
                           <li key={i} className="hover:text-accent cursor-pointer transition-colors">
                              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group/link">
                                 <span className="opacity-50 group-hover/link:opacity-100 transition-opacity">→</span>
                                 <span className="border-b border-transparent group-hover/link:border-accent transition-colors">{resource.title}</span>
                              </a>
                           </li>
                        ))}
                     </ul>
                  </div>
               )}

            </article>
         </div>

         <Footer onNavigate={onNavigate} />
      </div>
   );
};

export default BriefingDetailPage;
