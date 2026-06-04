export type SeriesPost = {
  part: number;
  title: string;
  /** Target post slug at /blog/{slug}. */
  slug: string;
  /** False = greyed out in the dropdown, not yet linked. */
  published: boolean;
};

export type Series = {
  id: string;
  title: string;
  description: string;
  posts: SeriesPost[];
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
    description: "An 8-part walkthrough of the ML II course notes — intuition, math, code.",
    posts: [
      { part: 1, title: "What is Machine Learning?",          slug: "ml-from-scratch-01-what-is-ml",         published: false },
      { part: 2, title: "Data Cleaning & Preprocessing",      slug: "ml-from-scratch-02-data-cleaning",      published: false },
      { part: 3, title: "Evaluation Metrics",                  slug: "ml-from-scratch-03-evaluation-metrics", published: false },
      { part: 4, title: "Naive Bayes",                         slug: "ml-from-scratch-04-naive-bayes",        published: false },
      { part: 5, title: "Trees, Forests, Boosting",            slug: "ml-from-scratch-05-trees-forests",      published: false },
      { part: 6, title: "Support Vector Machines",             slug: "ml-from-scratch-06-svm",                published: false },
      { part: 7, title: "PCA & Dimensionality Reduction",      slug: "ml-from-scratch-07-pca",                published: false },
      { part: 8, title: "LDA, QDA, KNN",                       slug: "ml-from-scratch-08-lda-qda-knn",        published: false },
    ],
  },
];
