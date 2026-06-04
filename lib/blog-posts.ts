export type BlogPostLink = {
  label: string;
  href: string;
};

export type BlogPostBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language?: string; code: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "subheading"; text: string }
  | { type: "links"; items: BlogPostLink[] };

export type BlogPostSection = {
  id: string;
  title: string;
  blocks: BlogPostBlock[];
};

export type BlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  updated?: string;
  excerpt: string;
  tags: string[];
  source: "Blog" | "Project" | "Notes";
  coverImage: string;
  sections: BlogPostSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "forest-cover-type-prediction",
    title: "Before You Fix Your Data, Understand It.",
    subtitle: "Feature meaning, sanity checks, and what the model can’t tell you.",
    date: "April 2024",
    updated: "April 2024",
    excerpt:
      "A practical walkthrough of feature interpretation and sanity checks before training models on the Forest Cover Type Prediction dataset.",
    tags: ["Machine Learning", "Kaggle", "Feature Engineering", "EDA"],
    source: "Project",
    coverImage: "https://maria-aguilera.github.io/images/forest-cover-type2.png",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "This project tackles the Forest Cover Type Prediction challenge: classify forest cover types from cartographic variables such as elevation, slope, distances, and soil categories.",
          },
          {
            type: "paragraph",
            text:
              "Instead of jumping straight into modeling, I focused on what tends to break ML projects in practice: misunderstanding the features. The goal was not only to build a strong multiclass classifier, but to validate what the data actually represents — and whether strange patterns were errors or real signal.",
          },
          {
            type: "paragraph",
            text:
              "In other words: before tuning models, I tried to answer the questions you normally ignore until it’s too late.",
          },
          {
            type: "list",
            items: [
              "What do these cartographic features actually mean?",
              "Are unusual values (zeros, negatives) valid or corrupted measurements?",
              "Are outliers noise… or class-specific signal?",
            ],
          },
        ],
      },
      {
        id: "dataset",
        title: "Dataset and Target",
        blocks: [
          {
            type: "paragraph",
            text:
              "The dataset is tabular and contains a mix of continuous and categorical signals. It is structured into three main feature groups:",
          },
          {
            type: "list",
            items: [
              "10 numerical features (elevation, slope, distances to hydrology, hillshade).",
              "4 one-hot wilderness area indicators.",
              "40 one-hot soil type indicators.",
            ],
          },
          {
            type: "paragraph",
            text:
              "The target variable is Cover_Type with 7 classes. The training dataset is relatively balanced, so accuracy is a reasonable first metric — although per-class performance still matters for model selection.",
          },
        ],
      },
      {
        id: "understanding-the-features",
        title: "Understanding the Features",
        blocks: [
          {
            type: "paragraph",
            text:
              "A key insight in this dataset is that multiple features describe the same physical phenomenon from different angles. That’s powerful — but also risky: redundancy can lead to inflated confidence and noisy decision boundaries.",
          },
          {
            type: "subheading",
            text: "3.1 Terrain geometry",
          },
          {
            type: "list",
            items: [
              "Slope captures steepness.",
              "Aspect captures slope orientation (0–360 degrees).",
              "Hillshade captures illumination (0–255 index), derived from slope, aspect, and sun position.",
            ],
          },
          {
            type: "paragraph",
            text:
              "This naturally raises the question: are hillshade, slope, and aspect partially redundant? Scatter plots confirmed strong correlations — especially between hillshade and aspect — suggesting overlapping signal and potential for dimensionality reduction.",
          },
          {
            type: "subheading",
            text: "3.2 Weird values that deserved validation",
          },
          {
            type: "list",
            items: [
              "Negative vertical distance to hydrology is not necessarily an error; it can mean the nearest water feature lies below the point.",
              "Hillshade_3pm zeros can represent no illumination — but the frequency was high enough that it deserved investigation.",
            ],
          },
          {
            type: "paragraph",
            text:
              "Instead of blindly cleaning these values, I tested whether they were predictable from the other terrain variables. I trained a small RandomForestRegressor to estimate plausible hillshade values and compared results with and without replacing zeros.",
          },
        ],
      },
      {
        id: "approach",
        title: "Approach",
        blocks: [
          {
            type: "paragraph",
            text:
              "The workflow followed a disciplined sequence: validate the dataset, understand distributions, establish baselines, then iterate on stronger models only after confirming the data made sense.",
          },
          {
            type: "subheading",
            text: "4.1 Data checks",
          },
          {
            type: "list",
            items: [
              "Verified feature types and ranges.",
              "Confirmed one-hot groups sum to exactly one per row.",
              "Checked class balance.",
              "Reviewed numerical distributions and scaling needs.",
            ],
          },
          {
            type: "paragraph",
            text:
              "A quick sanity check for the one-hot groups looked like this:",
          },
          {
            type: "code",
            language: "python",
            code: [
              "wilderness_cols = [c for c in df.columns if c.startswith(\"Wilderness_Area\")]",
              "soil_cols = [c for c in df.columns if c.startswith(\"Soil_Type\")]",
              "",
              "assert (df[wilderness_cols].sum(axis=1) == 1).all()",
              "assert (df[soil_cols].sum(axis=1) == 1).all()",
            ].join("\n"),
          },
          {
            type: "subheading",
            text: "4.2 Outlier analysis",
          },
          {
            type: "paragraph",
            text:
              "Because many numerical features are not normally distributed, I used a conservative 3×IQR rule to flag extreme values — then checked whether those values were random noise or linked to specific cover types.",
          },
          {
            type: "list",
            items: [
              "Outliers were not evenly distributed across classes.",
              "Many outliers were concentrated in specific cover types.",
              "Removing them did not improve validation performance, so they were kept.",
            ],
          },
          {
            type: "paragraph",
            text:
              "The outlier mask was computed with a simple IQR rule:",
          },
          {
            type: "code",
            language: "python",
            code: [
              "q1 = df[numeric_cols].quantile(0.25)",
              "q3 = df[numeric_cols].quantile(0.75)",
              "iqr = q3 - q1",
              "",
              "outlier_mask = (df[numeric_cols] < (q1 - 3 * iqr)) | (df[numeric_cols] > (q3 + 3 * iqr))",
            ].join("\n"),
          },
          {
            type: "subheading",
            text: "4.3 Baseline models",
          },
          {
            type: "paragraph",
            text:
              "Before using heavy models, I started with lightweight baselines to establish reference performance and detect obvious issues.",
          },
          {
            type: "list",
            items: ["Naive Bayes", "KNN", "Logistic Regression"],
          },
          {
            type: "subheading",
            text: "4.4 Feature engineering and dimensionality reduction",
          },
          {
            type: "paragraph",
            text:
              "Given redundancy between terrain features, I tested feature selection and PCA as a way to reduce noise and improve generalization.",
          },
          {
            type: "list",
            items: [
              "Feature selection experiments",
              "PCA to reduce redundancy and stabilize decision boundaries",
            ],
          },
          {
            type: "subheading",
            text: "4.5 Stronger models + tuning",
          },
          {
            type: "paragraph",
            text:
              "Tree-based ensembles performed best due to non-linear interactions between elevation, slope, soil, and wilderness indicators.",
          },
          {
            type: "list",
            items: [
              "Gradient Boosting",
              "Random Forest",
              "Extra Trees",
              "Hyperparameter tuning to improve generalization",
            ],
          },
        ],
      },
      {
        id: "results",
        title: "Results and Key Takeaways",
        blocks: [
          {
            type: "paragraph",
            text:
              "The final pipeline achieved strong accuracy, but the most valuable lessons were not about the model — they were about the data. Feature interpretation and sanity checks had a larger impact than algorithm choice.",
          },
          {
            type: "list",
            items: [
              "Elevation is the strongest discriminator across cover types.",
              "Outliers can be useful signal, especially when they cluster by class.",
              "Some features encode redundant information (hillshade vs aspect).",
              "The highest leverage step was validating what the dataset actually measures.",
            ],
          },
          {
            type: "paragraph",
            text:
              "If I had to summarize the project in one sentence: the model becomes easier when the data stops being a mystery.",
          },
        ],
      },
      {
        id: "skills-tools",
        title: "Skills and Tools",
        blocks: [
          {
            type: "list",
            items: [
              "Python",
              "Matplotlib, Seaborn, Plotly",
              "Scikit-learn pipelines",
              "Feature engineering and preprocessing",
              "Model comparison and hyperparameter tuning",
            ],
          },
        ],
      },
      {
        id: "resources",
        title: "Resources",
        blocks: [
          {
            type: "paragraph",
            text:
              "If you want to explore the full notebook or reproduce the workflow, the links below contain the full implementation and results.",
          },
          {
            type: "list",
            items: [
              "Kaggle competition: Forest Cover Type Prediction",
              "UCI Covertype dataset",
              "ArcGIS: how hillshade works",
            ],
          },
          {
            type: "links",
            items: [
              {
                label: "Notebook (Jupyter)",
                href: "https://maria-aguilera.github.io/projects/forest-cover-type-classification.html",
              },
              {
                label: "GitHub Repository",
                href: "https://github.com/maria-aguilera/forest-cover-type-prediction",
              },
              {
                label: "Run on Colab",
                href: "https://colab.research.google.com/drive/15ZeArEeEWVRx-fLyK-ZtKPeqxLpz3H_B",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "lunar-landing-assignment",
    title: "Lunar Landing Assignment",
    subtitle: "Training a PPO agent to land precisely between two flags.",
    date: "November 2023",
    updated: "November 2023",
    excerpt:
      "Trained a reinforcement learning agent with reward shaping to maximize stable, accurate landings.",
    tags: ["Reinforcement Learning", "PPO", "Game Theory"],
    source: "Project",
    coverImage: "/images/blog/lunar-landing.jpg",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "The goal of this assignment is to teach a Lunar Lander agent how to land between two flags. The reward encourages accuracy and stability.",
          },
        ],
      },
      {
        id: "reward-design",
        title: "Reward Design",
        blocks: [
          {
            type: "list",
            items: [
              "Balanced precision and stability through reward shaping.",
              "Penalized unsafe landings and high-velocity impacts.",
              "Emphasized landing within the target region.",
            ],
          },
        ],
      },
      {
        id: "training",
        title: "Training and Evaluation",
        blocks: [
          {
            type: "paragraph",
            text:
              "A PPO agent was trained across multiple episodes and evaluated on landing consistency to validate behavior.",
          },
        ],
      },
      {
        id: "skills-tools",
        title: "Skills and Tools",
        blocks: [
          {
            type: "list",
            items: ["Reinforcement learning", "Game theory", "Hyperparameter tuning"],
          },
        ],
      },
      {
        id: "resources",
        title: "Resources",
        blocks: [
          {
            type: "links",
            items: [
              {
                label: "Hugging Face Model",
                href: "https://huggingface.co/maria-aguilera/ppo-LunarLander-v2",
              },
              {
                label: "Run on Colab",
                href:
                  "https://colab.research.google.com/drive/19m9fhUUrC8mJQzE6Ilieipgss8JIw4Xq",
              },
              {
                label: "GitHub Repository",
                href: "https://github.com/maria-aguilera/lunar-landing-ppo",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "master-thesis-forecasting",
    title: "Master Thesis: Raw Material Forecasting of Industrias Duero",
    subtitle: "Forecasting demand to improve inventory turnover.",
    date: "2023",
    updated: "2023",
    excerpt:
      "A collaborative master thesis on demand forecasting and supply chain optimization using ML and time-series methods.",
    tags: ["Forecasting", "Time Series", "Supply Chain"],
    source: "Project",
    coverImage: "https://maria-aguilera.github.io/images/industrias_duero.jpg",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "Collaborated with a team to predict raw material demand and improve inventory turnover for Industrias Duero.",
          },
        ],
      },
      {
        id: "data-pipeline",
        title: "Data Pipeline",
        blocks: [
          {
            type: "paragraph",
            text:
              "We integrated supply-chain data sources and built a clean forecasting dataset, then validated assumptions with stakeholders.",
          },
        ],
      },
      {
        id: "modeling",
        title: "Modeling",
        blocks: [
          {
            type: "list",
            items: [
              "Implemented time-series and ML forecasting strategies.",
              "Compared classical models with ML baselines.",
              "Designed evaluation to reflect operational lead times.",
            ],
          },
        ],
      },
      {
        id: "outcomes",
        title: "Outcomes",
        blocks: [
          {
            type: "list",
            items: [
              "Analyzed over 1.5 million data points across the supply chain.",
              "Built dashboards to communicate forecasting outcomes.",
              "Delivered recommendations for inventory turnover improvements.",
            ],
          },
        ],
      },
      {
        id: "skills-tools",
        title: "Skills and Tools",
        blocks: [
          {
            type: "list",
            items: [
              "Python",
              "Facebook Prophet",
              "Time-series forecasting",
              "XGBoost, CatBoost",
              "Microsoft Power BI",
            ],
          },
        ],
      },
    ],
  },
];
