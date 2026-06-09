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
    description: "A 12-part walkthrough of the ML II course notes — intuition, math, code.",
    posts: [
      { part: 1,  title: "What is Machine Learning?",                 slug: "ml-what-is-machine-learning",                published: true  },
      { part: 2,  title: "Data Cleaning & Preprocessing",             slug: "ml-from-scratch-02-data-cleaning",           published: true  },
      { part: 3,  title: "Feature Engineering",                        slug: "ml-from-scratch-03-feature-engineering",     published: true  },
      { part: 4,  title: "Classification Metrics",                     slug: "ml-from-scratch-04-classification-metrics",  published: true  },
      { part: 5,  title: "Cross-Validation & Probability Models",      slug: "ml-from-scratch-05-cross-validation",        published: true  },
      { part: 6,  title: "Naïve Bayes",                                slug: "ml-from-scratch-06-naive-bayes",             published: true  },
      { part: 7,  title: "Decision Trees",                             slug: "ml-from-scratch-07-decision-trees",          published: true  },
      { part: 8,  title: "Random Forest & Boosting",                   slug: "ml-from-scratch-08-random-forest-boosting",  published: true  },
      { part: 9,  title: "Support Vector Machines",                    slug: "ml-from-scratch-09-svm",                     published: true  },
      { part: 10, title: "PCA & Dimensionality Reduction",             slug: "ml-from-scratch-10-pca",                     published: true  },
      { part: 11, title: "LDA & QDA",                                  slug: "ml-from-scratch-11-lda-qda",                 published: true  },
      { part: 12, title: "KNN & Recommender Systems",                  slug: "ml-from-scratch-12-knn",                     published: true  },
    ],
  },
];
