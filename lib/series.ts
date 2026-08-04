export type SeriesPost = {
  part: number;
  title: string;
  /** Target post slug at /blog/{slug}. */
  slug: string;
  /** False = greyed out in the dropdown, not yet linked. */
  published: boolean;
  /** Optional nested sub-posts that expand under this part in the series panel. */
  children?: SeriesPost[];
};

export type Series = {
  id: string;
  title: string;
  description: string;
  posts: SeriesPost[];
  /** If true, this series lives in the private work-OS at /private/series/[id]. */
  private?: boolean;
};

/**
 * Editorial series. Each `posts` entry corresponds to a planned or
 * published blog post at /blog/{slug}. Unpublished entries appear in
 * the nav dropdown but are not clickable.
 */
export const series: Series[] = [
  {
    id: "ml-from-scratch",
    title: "Machine Learning from Scratch",
    description: "A 12-part walkthrough of the ML II course notes — intuition, math, code.",
    posts: [
      { part: 1,  title: "What is Machine Learning?",                  slug: "ml-what-is-machine-learning",                published: true  },
      { part: 2,  title: "Data Cleaning & Preprocessing",             slug: "ml-from-scratch-02-data-cleaning",           published: true  },
      { part: 3,  title: "Feature Engineering",                        slug: "ml-from-scratch-03-feature-engineering",     published: true  },
      { part: 4,  title: "Evaluation Metrics",                         slug: "ml-from-scratch-04-classification-metrics",  published: true  },
      { part: 5,  title: "Model Validation & Cross-Validation",        slug: "ml-from-scratch-05-cross-validation",        published: true  },
      { part: 6,  title: "Naïve Bayes",                                slug: "ml-from-scratch-06-naive-bayes",             published: true  },
      { part: 7,  title: "Decision Trees",                             slug: "ml-from-scratch-07-decision-trees",          published: true  },
      { part: 8,  title: "Random Forest & Boosting",                   slug: "ml-from-scratch-08-random-forest-boosting",  published: true  },
      { part: 9,  title: "Support Vector Machines",                    slug: "ml-from-scratch-09-svm",                     published: true  },
      { part: 10, title: "PCA & Dimensionality Reduction",             slug: "ml-from-scratch-10-pca",                     published: true  },
      { part: 11, title: "LDA & QDA",                                  slug: "ml-from-scratch-11-lda-qda",                 published: true  },
      { part: 12, title: "KNN & Recommender Systems",                  slug: "ml-from-scratch-12-knn",                     published: true  },
    ],
  },
  {
    id: "nlp-from-scratch",
    title: "NLP from Scratch",
    description: "A 10-part walkthrough of the NLP course notes — intuition, math, code.",
    posts: [
      { part: 1,  title: "What NLP is (and what it isn't)",             slug: "nlp-from-scratch-01-introduction",            published: true  },
      { part: 2,  title: "From Text to Vectors",                        slug: "nlp-from-scratch-02-from-text-to-vectors",    published: true  },
      { part: 3,  title: "Tagging & Parsing",                           slug: "nlp-from-scratch-03-tagging-parsing",         published: true  },
      { part: 4,  title: "Semantics & Word Embeddings",                 slug: "nlp-from-scratch-04-semantics",               published: true  },
      { part: 5,  title: "Language Modeling",                           slug: "nlp-from-scratch-05-language-modeling",       published: true  },
      { part: 6,  title: "Text Classification — Classical",             slug: "nlp-from-scratch-06-text-classification",     published: true  },
      { part: 7,  title: "Text Classification — Deep Learning",         slug: "nlp-from-scratch-07-text-classification-dl",  published: true  },
      { part: 8,  title: "Information Retrieval",                       slug: "nlp-from-scratch-08-information-retrieval",   published: true  },
      { part: 9,  title: "Question Answering",                          slug: "nlp-from-scratch-09-question-answering",      published: true  },
      { part: 10, title: "Transformers & the Modern Stack",             slug: "nlp-from-scratch-10-transformers",            published: false },
    ],
  },
  {
    id: "generative-ai-engineering",
    title: "Generative AI Engineering",
    description: "An 8-part walkthrough of modern GenAI engineering — LLMs, prompting, RAG, agents, guardrails, LLMOps.",
    posts: [
      { part: 1, title: "The Generative AI Engineering Cheatsheet",         slug: "genai-interview-prep-cheatsheet",             published: true  },
      { part: 2, title: "LLM Foundations — transformers, RLHF, sampling",   slug: "genai-01-llm-foundations",                    published: true  },
      { part: 3, title: "Prompting & Reasoning Loops",                      slug: "genai-02-prompting-reasoning",                published: true  },
      { part: 4, title: "RAG & Retrieval Deep Dive",                        slug: "genai-03-rag-retrieval",                      published: true  },
      { part: 5, title: "Memory & State Management",                        slug: "genai-04-memory-state",                       published: true  },
      { part: 6, title: "Multi-Agent Systems & Tool Use",                   slug: "genai-05-multi-agent-tools",                  published: true  },
      { part: 7, title: "Guardrails, Security & LLMOps",                    slug: "genai-06-guardrails-security-llmops",         published: true  },
      { part: 8, title: "Cost, Latency & Deployment",                       slug: "genai-07-cost-latency-deployment",            published: true  },
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "A 15-part visual walkthrough of the modern web-development floor — layout, responsive, design systems, components, accessibility.",
    posts: [
      { part: 1,  title: "Every element is a box",                        slug: "web-development-01-box-model",           published: true },
      { part: 2,  title: "Flexbox — 1D layouts",                          slug: "web-development-02-flexbox",             published: true },
      { part: 3,  title: "CSS Grid — 2D layouts",                         slug: "web-development-03-grid",                published: true },
      { part: 4,  title: "Responsive: breakpoints & mobile-first",        slug: "web-development-04-responsive-basics",   published: true },
      { part: 5,  title: "Modern responsive: container queries & clamp",  slug: "web-development-05-responsive-modern",   published: true },
      { part: 6,  title: "Design tokens — the single source of truth",    slug: "web-development-06-design-tokens",       published: true },
      { part: 7,  title: "Colour hierarchy — 60/30/10",                   slug: "web-development-07-color-hierarchy",     published: true },
      { part: 8,  title: "Typography scale",                              slug: "web-development-08-type-scale",          published: true },
      { part: 9,  title: "Spacing scale — rhythm over randomness",        slug: "web-development-09-spacing-scale",       published: true },
      { part: 10, title: "Shadow hierarchy — elevation",                  slug: "web-development-10-shadow-hierarchy",    published: true },
      { part: 11, title: "Buttons — three variants, five states",         slug: "web-development-11-buttons",             published: true },
      { part: 12, title: "Forms — anatomy, states, feedback",             slug: "web-development-12-forms",               published: true },
      { part: 13, title: "Cards — the universal container",               slug: "web-development-13-cards",               published: true },
      { part: 14, title: "Component states",                              slug: "web-development-14-component-states",    published: true },
      { part: 15, title: "Accessibility — the 4 essentials",              slug: "web-development-15-accessibility",       published: true },
    ],
  },
  {
    id: "genai-interview-prep",
    title: "GFT · Interview Prep",
    description: "The personal-preparation half of my GFT interview loop — strengths and weaknesses, why GFT, questions I want to ask them. Private. The technical study material lives in the public Generative AI Engineering series.",
    private: true,
    posts: [
      { part: 1, title: "My Strengths & Weaknesses for this role", slug: "gft-prep-strengths-weaknesses", published: true },
      { part: 2, title: "Why I want to work for GFT",              slug: "gft-prep-why-gft",              published: true },
      { part: 3, title: "Questions I have to ask GFT",             slug: "gft-prep-questions-to-ask",     published: true },
    ],
  },
];
