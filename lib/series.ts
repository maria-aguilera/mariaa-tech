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
    description: "Modern GenAI engineering, one topic at a time — LLMs, prompting, RAG, agents, guardrails, LLMOps. A 4-page visual cheatsheet plus 7 in-depth deep dives, each with example prompts, Python code, comparison tables, and the questions a GenAI Engineer interviewer typically asks on that topic.",
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
