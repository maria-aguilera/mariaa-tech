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
    slug: "spaceship-titanic",
    title: "Kaggle Competition: Spaceship Titanic",
    subtitle: "Feature relationships, missing values, and modeling pipelines.",
    date: "February 2024",
    updated: "February 2024",
    excerpt:
      "Explored missing-value patterns and model pipelines for Kaggle's sci-fi classification challenge.",
    tags: ["Kaggle", "Data Cleaning", "Feature Engineering"],
    source: "Project",
    coverImage: "https://maria-aguilera.github.io/images/Model%20Results.png",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "This project predicts passenger outcomes in the Spaceship Titanic dataset. The work focuses on data cleaning, feature relationships, and pipeline experimentation.",
          },
        ],
      },
      {
        id: "data-preparation",
        title: "Data Preparation",
        blocks: [
          {
            type: "list",
            items: [
              "Explored missingness patterns and potential leakage.",
              "Created a reproducible preprocessing pipeline.",
              "Encoded categorical variables and scaled numeric features.",
            ],
          },
        ],
      },
      {
        id: "modeling",
        title: "Modeling and Validation",
        blocks: [
          {
            type: "list",
            items: [
              "Compared baseline models to more expressive learners.",
              "Used cross-validation to evaluate generalization.",
              "Iterated on feature sets and hyperparameters.",
            ],
          },
        ],
      },
      {
        id: "takeaways",
        title: "Takeaways",
        blocks: [
          {
            type: "paragraph",
            text:
              "Systematic handling of missing values made the biggest difference, especially when paired with consistent validation.",
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
              "Data cleaning",
              "Pipeline development",
              "Grid search",
              "Exploratory data analysis",
              "Cross-validation",
            ],
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
                label: "Notebook (Jupyter)",
                href: "https://maria-aguilera.github.io/projects/spaceship-titanic.html",
              },
              {
                label: "GitHub Repository",
                href: "https://github.com/maria-aguilera/spaceship-titanic",
              },
              {
                label: "Run on Colab",
                href:
                  "https://colab.research.google.com/drive/1GgTDc8bqNdoxLfQ9bRVZQ1OFKEhcYz4x#scrollTo=kpC_nDA0OkkQ",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "bike-sharing-demand",
    title: "Bike Sharing Demand Forecasting",
    subtitle: "Predicting hourly bicycle usage in Washington, D.C.",
    date: "January 2024",
    updated: "January 2024",
    excerpt:
      "Forecasted hourly bike demand with time-aware validation and a focus on seasonality patterns.",
    tags: ["Forecasting", "Time Series", "Python"],
    source: "Project",
    coverImage: "https://maria-aguilera.github.io/images/bike-sharing.png",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "This project predicts hourly bike usage for Washington, D.C. It covers exploratory analysis, feature engineering, and time-based validation to avoid leakage.",
          },
        ],
      },
      {
        id: "data-features",
        title: "Data and Features",
        blocks: [
          {
            type: "paragraph",
            text:
              "The dataset includes calendar and weather signals that drive demand. Capturing daily cycles and seasonal trends is essential for good forecasts.",
          },
          {
            type: "list",
            items: [
              "Engineered time-based features for hourly and weekly patterns.",
              "Explored weather effects on usage spikes and drop-offs.",
              "Reviewed distributions to guide transformations.",
            ],
          },
        ],
      },
      {
        id: "modeling",
        title: "Modeling Approach",
        blocks: [
          {
            type: "list",
            items: [
              "Established baseline forecasts for comparison.",
              "Evaluated models using time-based splits.",
              "Iterated on features and validation strategy.",
            ],
          },
        ],
      },
      {
        id: "insights",
        title: "Insights",
        blocks: [
          {
            type: "paragraph",
            text:
              "The biggest lift came from feature engineering around time and weather, plus strict time-aware validation.",
          },
        ],
      },
      {
        id: "skills-tools",
        title: "Skills and Tools",
        blocks: [
          {
            type: "list",
            items: ["Python", "Data visualization", "Time series validation"],
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
                label: "Notebook (Jupyter)",
                href: "https://maria-aguilera.github.io/projects/bike-sharing.html",
              },
              {
                label: "GitHub Repository",
                href: "https://github.com/maria-aguilera/bike-sharing",
              },
              {
                label: "Run on Colab",
                href:
                  "https://colab.research.google.com/drive/1ryydAJtLAJnjCMqVtIGNvLQh4qfEnSXc",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "instagram-graph-analysis",
    title: "Instagram Graph Analysis and Community Detection",
    subtitle: "GraphX-based community detection on a large Instagram network.",
    date: "December 2023",
    updated: "December 2023",
    excerpt:
      "Applied graph algorithms to map community structure and identify influential nodes in an Instagram dataset.",
    tags: ["GraphX", "Community Detection", "Networks"],
    source: "Project",
    coverImage: "https://maria-aguilera.github.io/images/gephi.jpeg",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "This project explores community detection and influence analysis in a large Instagram graph using GraphX.",
          },
        ],
      },
      {
        id: "graph-analysis",
        title: "Graph Analysis",
        blocks: [
          {
            type: "list",
            items: [
              "Built the interaction graph and validated its structure.",
              "Computed network statistics and centrality measures.",
              "Applied community detection to uncover clusters.",
            ],
          },
        ],
      },
      {
        id: "insights",
        title: "Insights",
        blocks: [
          {
            type: "paragraph",
            text:
              "The analysis highlights natural clusters and influential nodes that can inform targeting and discovery.",
          },
        ],
      },
      {
        id: "skills-tools",
        title: "Skills and Tools",
        blocks: [
          {
            type: "list",
            items: ["GraphX", "Community detection algorithms", "Network analysis"],
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
                label: "GitHub Repository",
                href: "https://github.com/maria-aguilera/graph-analysis",
              },
              {
                label: "Run on Colab",
                href:
                  "https://colab.research.google.com/drive/1ryydAJtLAJnjCMqVtIGNvLQh4qfEnSXc",
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
    slug: "aws-deepracer-training",
    title: "Training AWS DeepRacer",
    subtitle:
      "A full walkthrough: infrastructure, reward function inputs, hyperparameters, action spaces, sim-to-real, and the reward I shipped.",
    date: "October 2023",
    updated: "October 2023",
    excerpt:
      "Everything I learned training an AWS DeepRacer agent — the AWS infrastructure underneath the console, the 20+ reward function inputs, the hyperparameters that actually move the needle, sim-to-real strategies, SAC vs PPO, and the reward function I ended up shipping.",
    tags: ["Reinforcement Learning", "AWS DeepRacer", "Reward Shaping"],
    source: "Project",
    coverImage: "/images/blog/aws-deepracer.jpg",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "AWS DeepRacer is a 1/18 scale autonomous race car you train with reinforcement learning. You don't program how it drives — you describe what counts as good driving, and the agent figures out the rest from millions of simulated laps.",
          },
          {
            type: "paragraph",
            text:
              "On paper that sounds simple. In practice almost all of the work happens inside one function — the reward function — and getting it wrong is a fast way to end up with a car that drives backwards, hugs the wall, or stops moving entirely.",
          },
          {
            type: "paragraph",
            text:
              "My goal for this project was specific: design a reward function that makes the agent consistently complete laps near the racing line, without sacrificing the speed needed to be competitive. The track I trained on was the Cumulo Turnpike — 60 m long and 106 cm wide — which shifts between high-speed straightaways and tight, technical corners.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_09_p03_6e90124b4c.png",
            alt: "Cumulo Turnpike track card showing the track shape and dimensions: 60m long, 106cm wide.",
            caption: "The Cumulo Turnpike — a mix of long straightaways and tight corners, requiring both speed and accurate navigation.",
          },
          {
            type: "paragraph",
            text:
              "This post is the long version: not just the reward function I shipped, but everything I had to learn about the AWS plumbing, the 20+ inputs available to a reward function, the hyperparameters that move the needle, action spaces, and the sim-to-real strategies that bridge the simulated track and the physical car.",
          },
        ],
      },
      {
        id: "how-deepracer-works",
        title: "How DeepRacer works under the hood",
        blocks: [
          {
            type: "paragraph",
            text:
              "AWS DeepRacer is the user-facing console, but it's not a single product — it's a small cluster of AWS services stitched together to let an RL agent learn to drive a tiny RC car. Understanding what each piece does makes everything else (action spaces, reward parameters, sim-to-real gaps) much easier to reason about.",
          },
          {
            type: "subheading",
            text: "The services involved",
          },
          {
            type: "list",
            items: [
              "Amazon SageMaker — the part that trains the reinforcement learning model. SageMaker's RL-aware notebooks pick up the architecture, run gradient updates, and produce new versions of the policy.",
              "Amazon RoboMaker — the simulation environment. RoboMaker spins up a virtual track and lets the agent interact with it.",
              "Gazebo — the physics engine inside RoboMaker. Gazebo simulates the chassis, wheels, camera (including its field of view), how the components connect, mass properties, collisions, friction, and acceleration.",
              "Amazon S3 — durable storage for the trained model. The persistent copy of the policy lives in S3 between training iterations and is what gets uploaded to the physical car at the end.",
              "Redis — an in-memory database that caches the experiences (state, action, reward, next state tuples) the agent generates during simulation. Redis is what makes the training loop fast enough to be useful.",
              "ROS (Robot Operating System) — the communication layer that lets SageMaker, RoboMaker, and the car's components talk to each other. When you move the model from the simulator to the physical car, ROS nodes are what infer driving decisions from the car's camera in real time.",
            ],
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_08_p02_c9684101c9.png",
            alt: "AWS service architecture diagram: Amazon SageMaker connects to S3, S3 connects to AWS RoboMaker, and RoboMaker connects back to Redis, forming a training loop.",
            caption: "How the AWS services hand work to each other — SageMaker trains the model, models persist to S3, RoboMaker pulls them for simulation, and experience streams back through Redis.",
          },
          {
            type: "subheading",
            text: "Episodes, steps, and experience",
          },
          {
            type: "paragraph",
            text:
              "Training is structured into episodes and steps. An episode is one run around the track from the starting line to an end state — either crossing the finish line or going off-track. The figure below shows a single episode in progress.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_05_p02_932471d92f.png",
            alt: "Episode diagram: an entire run from the starting line to an end state like the finish line, traced around a track.",
            caption: "An episode — one full run of the track from start line to finish (or off-track).",
          },
          {
            type: "paragraph",
            text:
              "Each episode is composed of steps. A step is a single action the agent takes under its current policy: turn this much, throttle this much, for one tick of simulator time. Inside each step you get one (state, action, reward, next state) tuple.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_07_p02_34cd119af5.png",
            alt: "Step diagram showing an episode broken into discrete steps along the track.",
            caption: "Steps — discrete actions inside an episode. Each one generates an experience tuple that gets cached in Redis.",
          },
          {
            type: "paragraph",
            text:
              "For each step, the experience tuple is cached in Redis. SageMaker pulls these in batches to update the policy. The updated policy gets persisted to S3, RoboMaker pulls the latest model, and the next batch of episodes runs. The longer you train, the more experience accumulates and the better the policy gets — at the cost of training time and AWS credits.",
          },
        ],
      },
      {
        id: "parameters-vs-hyperparameters",
        title: "Parameters, hyperparameters, and reward functions",
        blocks: [
          {
            type: "paragraph",
            text:
              "Before diving into the reward function itself, it's worth being precise about a piece of vocabulary that gets fuzzy in ML conversations:",
          },
          {
            type: "list",
            items: [
              "Parameters are internal to the model. They're learned from the data during training. A neural network's weights are parameters.",
              "Hyperparameters are external. They aren't estimated from the data — you set them yourself. Learning rate, batch size, discount factor, network depth: those are hyperparameters. You can't compute them; you find decent ones through trial and error.",
              "Reward functions are a third concept that only exists in reinforcement learning. The reward function is the thing you write that tells the agent what counts as good behaviour. Unlike supervised learning, where the target label is given, in RL the agent has to figure out which actions led to reward through delayed feedback. The reward function is how you steer that.",
            ],
          },
          {
            type: "paragraph",
            text:
              "Most of the rest of this post is about the third one. But the first two come back later — hyperparameter tuning is a big part of getting a DeepRacer model to converge in reasonable time, and we'll get to those.",
          },
        ],
      },
      {
        id: "reward-function-inputs",
        title: "The 20+ inputs to a DeepRacer reward function",
        blocks: [
          {
            type: "paragraph",
            text:
              "Every time step, AWS passes your reward function a dictionary called params with more than twenty fields describing the state of the car and its environment. Knowing what's available is the entire reason you can build something more interesting than \"go fast\" — but it's also a trap, because the more signals you read, the harder the reward is to reason about. I found it easier to learn what was available first, then use a small subset deliberately.",
          },
          {
            type: "paragraph",
            text:
              "The figure below shows the main spatial parameters laid out on a single car-on-track illustration — it's the diagram I came back to most often while writing reward functions.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_20_p05_25070b4996.png",
            alt: "Diagram showing all spatial reward function parameters at once: track width, heading of the car, distance from center, steering angle, position of the car, and waypoints.",
            caption: "All the spatial parameters on one figure — track width, heading, distance from center, steering angle, position, and waypoints.",
          },
          {
            type: "subheading",
            text: "Position and orientation",
          },
          {
            type: "list",
            items: [
              "x, y (float, meters) — location of the car's center in the simulated environment. The origin is the lower-left corner of the simulator.",
              "heading (float, degrees, -180 to +180) — yaw of the car relative to the x-axis. 0 means facing along positive x; 90 means facing along positive y.",
            ],
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_12_p03_247bb91688.png",
            alt: "Heading parameter diagram: a small angle of 2 degrees shown between the car's orientation and the centerline.",
            caption: "heading — the yaw of the car in degrees. Small angles like this 2° mean the car is nearly aligned with the track.",
          },
          {
            type: "subheading",
            text: "Track geometry",
          },
          {
            type: "list",
            items: [
              "track_width (float, meters) — width of the track.",
              "track_length (float, meters) — total length of the track. Varies by track.",
              "waypoints (list of [x, y] pairs) — an ordered list of milestones along the center of the track. On a closed track the first and last waypoints are the same.",
              "closest_waypoints ([int, int]) — the indices of the two waypoints closest to the car: the first is the closest one behind, the second is the closest one ahead.",
              "distance_from_center (float, meters, 0 to ~track_width/2) — absolute displacement from the centerline.",
              "is_left_of_center (Boolean) — which side of the centerline the car is on.",
            ],
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_10_p03_775b7caf8b.png",
            alt: "Waypoints diagram showing the centerline of the track marked with numbered waypoints 1 through 30.",
            caption: "waypoints — the ordered list of milestones along the centerline. closest_waypoints[0] is the one behind the car, closest_waypoints[1] the one ahead.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_13_p04_141cb662d3.png",
            alt: "distance_from_center diagram: a car positioned 0.23 meters from the centerline, with a speed reading of 0.4 m/s shown.",
            caption: "distance_from_center — how far the car has drifted laterally from the centerline. Always positive; pair it with is_left_of_center to know which side.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_15_p04_b95d9f59ab.png",
            alt: "Track width diagram showing a track measured at 0.60 meters wide.",
            caption: "track_width — the width of the track in meters. Useful for normalizing distance_from_center.",
          },
          {
            type: "subheading",
            text: "Motion",
          },
          {
            type: "list",
            items: [
              "speed (float, 0.0 to 5.0 m/s) — observed speed of the car. 5 m/s is the action-space ceiling.",
              "steering_angle (float, -30 to +30 degrees) — angle of the front wheels relative to the car's centerline. Negative is steering right, positive is left.",
              "steps (int) — number of steps completed in the current episode.",
              "progress (float, 0 to 100) — percentage of the track completed.",
            ],
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_14_p04_b86cfdd345.png",
            alt: "steering_angle diagram: a car steering left at +30 degrees, the maximum allowed angle.",
            caption: "steering_angle — front wheel angle. Positive is left, negative is right; the range is -30° to +30°.",
          },
          {
            type: "subheading",
            text: "Termination and status flags",
          },
          {
            type: "list",
            items: [
              "all_wheels_on_track (Boolean) — True only if every wheel is inside the track borders.",
              "is_offtrack (Boolean) — termination flag, True when the car has gone off track.",
              "is_crashed (Boolean) — termination flag, True when the car has hit another object.",
              "is_reversed (Boolean) — whether the car is driving clockwise (True) or counter-clockwise (False), used when direction-change-per-episode is enabled.",
            ],
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_11_p03_6c2091c8e3.png",
            alt: "all_wheels_on_track diagram: a car with at least one wheel off the track border, returning False.",
            caption: "all_wheels_on_track — False the moment any wheel leaves the borders. If all four go off, the car resets.",
          },
          {
            type: "subheading",
            text: "Object detection (head-to-head and obstacle racing)",
          },
          {
            type: "list",
            items: [
              "closest_objects ([int, int]) — indices of the two closest objects (behind, ahead).",
              "objects_location (list of (x, y)) — coordinates of every object on the track.",
              "objects_distance (list of floats) — distance of each object from the start line along the centerline.",
              "objects_heading (list of floats) — heading of each object in degrees. Stationary obstacles have heading 0; bot vehicles use their own heading.",
              "objects_left_of_center (list of Booleans) — which side of the centerline each object is on.",
              "objects_speed (list of floats, 0 to 12.0 m/s) — speed of each object. Stationary obstacles are 0.",
            ],
          },
          {
            type: "paragraph",
            text:
              "Inside the reward function you can also import math, random, NumPy, SciPy, and Shapely. That's enough to write almost anything you'd want, including geometric reasoning over waypoints.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_17_p04_38d881d87c.png",
            alt: "Summary table of the 13 main reward function parameters with one-line descriptions of each.",
            caption: "All the main parameters at a glance, with one-line descriptions.",
          },
        ],
      },
      {
        id: "reward-patterns",
        title: "Common reward function patterns",
        blocks: [
          {
            type: "paragraph",
            text:
              "Before settling on my own reward function, I worked through the AWS reference patterns. Each one teaches a different lesson about what a reward signal can express. The most common starter pattern is centerline-following with discrete markers — three concentric bands at 10%, 25%, and 50% of the track width, with the reward dropping as the car drifts outward.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_22_p05_24caca1524.png",
            alt: "Annotated centerline-following reward function code, with arrows pointing out the parameter being read and the reward returned for each behaviour bucket.",
            caption: "The annotated centerline-following reward function — distance_from_center is the parameter, the reward varies in stepped bands.",
          },
          {
            type: "subheading",
            text: "Pattern 1 — Stay on track and don't go too slow",
          },
          {
            type: "code",
            language: "python",
            code: [
              "def reward_function(params):",
              "    all_wheels_on_track = params['all_wheels_on_track']",
              "    speed = params['speed']",
              "    SPEED_THRESHOLD = 1.0",
              "",
              "    if not all_wheels_on_track:",
              "        reward = 1e-3",
              "    elif speed < SPEED_THRESHOLD:",
              "        reward = 0.5",
              "    else:",
              "        reward = 1.0",
              "    return float(reward)",
            ].join("\n"),
          },
          {
            type: "paragraph",
            text:
              "Three discrete tiers — off track, slow, or good. Easy to reason about, gives a clean gradient (off → slow → fast), and doesn't reward anything in detail.",
          },
          {
            type: "subheading",
            text: "Pattern 2 — Centerline following with markers",
          },
          {
            type: "code",
            language: "python",
            code: [
              "def reward_function(params):",
              "    track_width = params['track_width']",
              "    distance_from_center = params['distance_from_center']",
              "",
              "    marker_1 = 0.1 * track_width",
              "    marker_2 = 0.5 * track_width",
              "",
              "    if distance_from_center <= marker_1:",
              "        reward = 1.0",
              "    elif distance_from_center <= marker_2:",
              "        reward = 0.5",
              "    else:",
              "        reward = 1e-3",
              "    return float(reward)",
            ].join("\n"),
          },
          {
            type: "paragraph",
            text:
              "Stepped reward that drops off as the car drifts from the center. The agent learns to hug the line. Simple and surprisingly effective on tracks where the racing line is close to the centerline.",
          },
          {
            type: "subheading",
            text: "Pattern 3 — Heading aligned with the track",
          },
          {
            type: "code",
            language: "python",
            code: [
              "import math",
              "",
              "def reward_function(params):",
              "    waypoints = params['waypoints']",
              "    closest_waypoints = params['closest_waypoints']",
              "    heading = params['heading']",
              "    reward = 1.0",
              "",
              "    next_point = waypoints[closest_waypoints[1]]",
              "    prev_point = waypoints[closest_waypoints[0]]",
              "    track_direction = math.atan2(",
              "        next_point[1] - prev_point[1],",
              "        next_point[0] - prev_point[0],",
              "    )",
              "    track_direction = math.degrees(track_direction)",
              "",
              "    direction_diff = abs(track_direction - heading)",
              "    if direction_diff > 180:",
              "        direction_diff = 360 - direction_diff",
              "",
              "    DIRECTION_THRESHOLD = 10.0",
              "    if direction_diff > DIRECTION_THRESHOLD:",
              "        reward *= 0.5",
              "    return float(reward)",
            ].join("\n"),
          },
          {
            type: "paragraph",
            text:
              "Uses waypoints to compute the local direction of the track and penalises the agent when it's pointing too far away from it. Useful for keeping the car from drifting sideways into corners.",
          },
          {
            type: "subheading",
            text: "Pattern 4 — Anti-zigzag (penalize over-steering)",
          },
          {
            type: "code",
            language: "python",
            code: [
              "def reward_function(params):",
              "    steering = abs(params['steering_angle'])",
              "    reward = 1.0",
              "",
              "    ABS_STEERING_THRESHOLD = 20.0",
              "    if steering > ABS_STEERING_THRESHOLD:",
              "        reward *= 0.8",
              "    return float(reward)",
            ].join("\n"),
          },
          {
            type: "paragraph",
            text:
              "Punishes the agent for steering sharply. Stops it from zigzagging back and forth across the centerline, which often looks like high reward but produces awful lap times.",
          },
          {
            type: "subheading",
            text: "Pattern 5 — Faster-than-expected progress bonus",
          },
          {
            type: "code",
            language: "python",
            code: [
              "def reward_function(params):",
              "    steps = params['steps']",
              "    progress = params['progress']",
              "    reward = 1.0",
              "    TOTAL_NUM_STEPS = 300",
              "",
              "    if (steps % 100) == 0 and progress > (steps / TOTAL_NUM_STEPS) * 100:",
              "        reward += 10.0",
              "    return float(reward)",
            ].join("\n"),
          },
          {
            type: "paragraph",
            text:
              "Every 100 steps, check whether progress is ahead of the schedule needed to finish in TOTAL_NUM_STEPS. If so, give a big bonus. This pattern rewards being on a fast trajectory, not just being on track.",
          },
        ],
      },
      {
        id: "why-reward-shaping",
        title: "Why reward shaping is the whole game",
        blocks: [
          {
            type: "paragraph",
            text:
              "Reinforcement learning agents will optimize whatever you actually reward — not what you meant to reward. If you give a flat bonus for staying on track, the agent might learn to crawl forever instead of finishing. If you reward speed without penalising drift, it will fly off the first corner.",
          },
          {
            type: "paragraph",
            text:
              "With 20+ signals available, the first design question isn't \"how do I write the formula\" — it's \"which of these signals actually matter for the behaviour I'm trying to teach?\" The fewer inputs, the simpler the learning problem and the easier the reward is to reason about. So I framed the design around three questions before writing any code:",
          },
          {
            type: "list",
            items: [
              "What single behaviour is most important — staying on track, finishing fast, or staying smooth?",
              "Should the reward be continuous or have hard penalties? A gate (\"off-track → near-zero\") is harsher than a gradient, but it teaches the boundary unambiguously.",
              "How do you encourage speed without the agent flying off corners? Reward speed directly, but only when it's also on track.",
            ],
          },
        ],
      },
      {
        id: "reward-function",
        title: "The reward function I used",
        blocks: [
          {
            type: "paragraph",
            text:
              "My final reward function leaned on three signals: a hard gate on staying on the track, a measure of how efficient the agent was at completing the lap (progress per step), and a direct speed bonus.",
          },
          {
            type: "code",
            language: "python",
            code: [
              "def reward_function(params):",
              "    if params['all_wheels_on_track'] and params['steps'] > 0:",
              "        reward = (params['progress'] / params['steps']) * 100",
              "        reward += params['speed'] ** 2",
              "    else:",
              "        reward = 0.01",
              "    return float(reward)",
            ].join("\n"),
          },
          {
            type: "paragraph",
            text:
              "Each piece is doing a specific job. The all_wheels_on_track gate gives near-zero reward (0.01) the moment any wheel leaves the track, so the agent learns to treat the borders as a wall. The progress / steps term rewards the agent for completing more of the lap in fewer steps — it's an efficiency signal, since a tighter, more confident line covers more track per decision. And speed squared is the part that pushes the agent to push the throttle: the squaring means the difference between 4 m/s and 5 m/s (the action-space ceiling on DeepRacer) is worth a lot more than the difference between 1 m/s and 2 m/s.",
          },
          {
            type: "paragraph",
            text:
              "What I deliberately didn't reward: steering angle, distance from center, heading, waypoints. Those are all in the params dictionary, but I wanted the agent to discover its own racing line rather than be told where it had to be. Constraining the inputs to three made the reward easy to reason about, and made it obvious when the agent was gaming it (e.g. crawling slowly along the centerline to avoid the off-track penalty).",
          },
        ],
      },
      {
        id: "hyperparameters",
        title: "Hyperparameter tuning",
        blocks: [
          {
            type: "paragraph",
            text:
              "Hyperparameters are the dials you turn outside the reward function. They control how the model learns, not what it learns. DeepRacer exposes eight of them through the console. Each one has a default that works fine for getting started, but knowing what they do is how you go from \"finishes most laps\" to \"finishes most laps fast\".",
          },
          {
            type: "subheading",
            text: "Batch size",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_23_p06_8da8720492.png",
            alt: "Batch size hyperparameter card showing valid values 32, 64, 128, 256, 512 and default 32, with a diagram of training data sampling.",
            caption: "Valid values: 32, 64, 128, 256, 512. Default 32.",
          },
          {
            type: "paragraph",
            text:
              "The number of training examples the model processes before updating its weights. Larger batches give a less noisy gradient estimate per update but each update takes longer. Smaller batches update more often but with noisier gradients.",
          },
          {
            type: "subheading",
            text: "Number of epochs",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_25_p06_3732bed571.png",
            alt: "Epoch hyperparameter card showing valid values 3 to 10 and default 3, with a small neural-network update diagram.",
            caption: "Valid values: 3 to 10. Default 3.",
          },
          {
            type: "paragraph",
            text:
              "How many passes the algorithm makes through a batch before updating. Larger epoch counts are acceptable when the batch is also large — otherwise the model overfits the batch.",
          },
          {
            type: "subheading",
            text: "Learning rate",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_26_p06_9de9d1b784.png",
            alt: "Learning rate hyperparameter card showing the range 1e-5 to 1e-3, default 0.001, with loss-vs-parameter curves illustrating large and small learning rates.",
            caption: "Valid range: 1e-8 to 1e-3. Default 0.001. Too large overshoots the optimum; too small never converges in time.",
          },
          {
            type: "paragraph",
            text:
              "The size of each weight update. Too large and the weights overshoot the optimum and never settle. Too small and training never converges in the time you've allocated. The default is a reasonable starting point; if training looks unstable, decrease it.",
          },
          {
            type: "subheading",
            text: "Exploration",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_29_p07_f23b90c06e.png",
            alt: "Exploration hyperparameter diagram showing exploitation (using known good paths) versus exploration (trying new ones) on a small track.",
            caption: "Exploitation uses what the agent already knows. Exploration tries new actions to find better paths.",
          },
          {
            type: "paragraph",
            text:
              "Two valid strategies: CategoricalParameters (for discrete action spaces) and EpsilonGreedy (for continuous ones). Default Categorical. The exploration value starts at 1 and linearly decays to 0.1 over a configurable number of steps (typically 10,000 to 100,000). Early in training, the agent takes lots of random actions to discover what's out there. Later, it exploits what it has already learned.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_32_p08_b65e867e0a.png",
            alt: "Exploration decay curve showing the exploration value falling from 1 to 0.1 over a range of 10,000 to 100,000 steps.",
            caption: "The exploration value decays from 1 toward 0.1 over training — the agent gradually shifts from exploration to exploitation.",
          },
          {
            type: "subheading",
            text: "Entropy",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_27_p07_952da73b31.png",
            alt: "Entropy hyperparameter diagram showing high entropy (more random actions) vs low entropy (less random actions), with sliders.",
            caption: "Entropy controls how random the agent's actions are. Higher entropy means more exploration; lower entropy means committing to the current policy.",
          },
          {
            type: "paragraph",
            text:
              "Valid range: 1e-4 to 1e-2. Default 0.5. Controls how random the agent's actions are within its current policy. Higher entropy means more random behaviour — more exploration. Lower entropy means the agent commits to its preferred actions. Too high and the agent never converges; too low and it gets stuck in suboptimal patterns.",
          },
          {
            type: "subheading",
            text: "Discount factor",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_30_p07_1be696360e.png",
            alt: "Discount factor diagram comparing a larger discount factor (longer-horizon thinking) vs a smaller one (focused on immediate rewards), with two flags at the end of a corner.",
            caption: "Larger discount factors look further ahead. Smaller ones focus on immediate rewards.",
          },
          {
            type: "paragraph",
            text:
              "Valid range: 0 to 1. Default 0.999. How much future rewards count relative to immediate ones. A discount factor of 1 means the agent values all future rewards equally — long-horizon thinking. A factor of 0.9 means future rewards are heavily discounted, so the agent focuses on the next few steps. 0.999 is unusually high; if your reward function is per-step (like mine), a lower factor often helps.",
          },
          {
            type: "subheading",
            text: "Loss type",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_28_p07_d2551341a7.png",
            alt: "Loss type diagram comparing Mean squared error loss to Huber loss, showing the two functions with Huber growing more slowly for large errors.",
            caption: "Huber loss vs MSE. Huber's slower growth on large errors makes it more stable when convergence is hard.",
          },
          {
            type: "paragraph",
            text:
              "Valid values: Huber loss or Mean squared error. Default Huber. Both behave similarly for small updates. For larger updates, Huber takes smaller increments than MSE, which makes it more stable when convergence is hard. Use MSE if convergence is fine and you just want to train faster.",
          },
          {
            type: "subheading",
            text: "Number of episodes",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_31_p07_cc7156c996.png",
            alt: "Number of episodes hyperparameter card showing valid range 1 to 1000 and default 20, with a track diagram.",
            caption: "Valid range: 1 to 1000. Default 20. More episodes means more experience — and more training time.",
          },
          {
            type: "paragraph",
            text:
              "How many full episodes (start to end-state) the training session runs through. More episodes means more experience for the model to learn from, but also more training time and credits.",
          },
        ],
      },
      {
        id: "action-space",
        title: "Action space and calibration",
        blocks: [
          {
            type: "paragraph",
            text:
              "The action space defines every possible move the agent can make. DeepRacer's default discrete action space has six options:",
          },
          {
            type: "list",
            items: [
              "Straight",
              "Shallow left",
              "Deep left",
              "Shallow right",
              "Deep right",
              "Slow",
            ],
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_33_p09_d6fa3ff89b.png",
            alt: "Action space diagram showing the steering range from Max Left to Max Right with 0 (straight) at the top.",
            caption: "The car's steering action space — bounded by max-left and max-right. When you calibrate the physical car, you map these bounds to the real wheel angles.",
          },
          {
            type: "paragraph",
            text:
              "Each action combines a throttle value and a steering angle. When you calibrate the physical car you set the upper and lower bounds for throttle and the max left/right steering — and those bounds need to match the simulator's action space, otherwise sim-to-real transfer breaks. A larger action space (more granular steering, more speed buckets) gives the agent more options but takes longer to train, because the agent has to explore each combination.",
          },
          {
            type: "paragraph",
            text:
              "Faster speeds take longer to train. Models with higher maximum speeds take more episodes to converge than slower ones, because the agent has to learn to handle higher-momentum mistakes — it can't crawl around corners.",
          },
        ],
      },
      {
        id: "sim-to-real",
        title: "From simulator to the real world",
        blocks: [
          {
            type: "paragraph",
            text:
              "A model trained in simulation almost never works identically in the real world. The simulator can't capture everything — gravity quirks, friction variation between surfaces, tire grip, lighting, shadows, surface texture, reflections, or just the colour of the tape on the corner of a real track. An action that produces a result in Gazebo doesn't necessarily produce the same result on a physical track. There are three strategies for closing the gap.",
          },
          {
            type: "subheading",
            text: "1. Environment control",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_34_p09_0bdb366d10.png",
            alt: "Environment control text block: building a simulator environment representative of the real world (blue sky, green grass, dark road, and matched physics).",
            caption: "Environment control — keep the simulated environment representative of what the car sees in the real world.",
          },
          {
            type: "paragraph",
            text:
              "This one is built into DeepRacer by default. The simulated environment is engineered to look like what the car will see in the real world: blue sky, green grass, dark road, plus physics that approximate the real car's behaviour. The goal is to keep the simulated and real environments close enough that the model trained in one will work in the other.",
          },
          {
            type: "subheading",
            text: "2. Domain randomization",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_35_p10_621bf79102.png",
            alt: "Domain randomization text block explaining that the car sees greyscale, and training on varied colours/textures helps it focus on shapes instead of specific colours.",
            caption: "Domain randomization — train on varied colours and textures so the model learns the shape of features, not their specific colours.",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_37_p10_b4d9121d0c.png",
            alt: "Two road images stacked — one with colour (teal sides, yellow centre dashes), one in greyscale — illustrating domain randomization input variation.",
            caption: "Same road, different colour palettes. The point is to make the model agnostic to the specific colours and focus on the road structure.",
          },
          {
            type: "paragraph",
            text:
              "Right now, the car captures colour images, but those are converted to greyscale before they reach the model. The model learns gradients — \"the road is dark, the lane line is light\" — not specific colours. That's a brittle thing to learn: put the car on a wooden floor or a white carpet and the gradient inverts. Domain randomization is the idea of training the model on randomized colours, textures, and lighting so it learns to focus on the shape of features (\"a line\") rather than their specific colour. It takes longer to train, but the model that comes out generalises better. This is theoretical for DeepRacer — not built into the console — but it's the standard fix when sim-to-real transfer fails.",
          },
          {
            type: "subheading",
            text: "3. Modularity and abstraction",
          },
          {
            type: "image",
            src: "/images/blog/aws-deepracer/img_36_p10_2ce2723712.png",
            alt: "Modularity and abstraction text block explaining how a pre-trained CNN can classify generic visual concepts like road, building, or car, then plug into the RL model.",
            caption: "Modularity and abstraction — pre-train a CNN classifier on generic visual concepts, then plug it in as a feature extractor.",
          },
          {
            type: "paragraph",
            text:
              "The third strategy, also theoretical for DeepRacer, is to pre-train a CNN on classifying generic visual concepts — \"road\", \"not road\", \"line\", \"car\", \"building\" — and then plug that classifier in as a feature extractor before your RL model. The reasoning is that visual understanding is reusable. A CNN that already knows what a road is can teach an RL model faster than starting from raw pixels.",
          },
          {
            type: "paragraph",
            text:
              "Closing the sim-to-real gap is mostly about being mindful of the colours, shapes, and dimensions the car will see in the real world, and carefully calibrating the physical car's throttle and steering so its action space aligns with the simulator's.",
          },
        ],
      },
      {
        id: "sac-vs-ppo",
        title: "SAC vs PPO",
        blocks: [
          {
            type: "paragraph",
            text:
              "DeepRacer lets you choose between two reinforcement learning algorithms: Proximal Policy Optimization (PPO) and Soft Actor-Critic (SAC). They differ in three meaningful ways.",
          },
          {
            type: "subheading",
            text: "Action space compatibility",
          },
          {
            type: "paragraph",
            text:
              "PPO works with both discrete and continuous action spaces. SAC only works with continuous ones. If you're using the default 6-action discrete space, that decides for you — you're using PPO.",
          },
          {
            type: "subheading",
            text: "On-policy vs off-policy",
          },
          {
            type: "paragraph",
            text:
              "PPO is on-policy: it only learns from experiences generated by its current policy. Past experiences from earlier policies get thrown away. SAC is off-policy: it can reuse observations made by previous policies, which makes it more data-efficient — fewer episodes needed to reach the same level of performance.",
          },
          {
            type: "paragraph",
            text:
              "The trade-off is stability. On-policy methods are more stable between training iterations: each new policy is similar to the last one, so performance improves smoothly. Off-policy methods can be more unstable — a policy might do well in one iteration and then completely lose its grip in the next, because experiences from very different past policies are being mixed in.",
          },
          {
            type: "subheading",
            text: "How they use entropy",
          },
          {
            type: "paragraph",
            text:
              "Entropy measures how uncertain a policy is about which action to take in a given state. Low entropy means the policy is very confident; high entropy means it's unsure and would happily try alternatives.",
          },
          {
            type: "paragraph",
            text:
              "PPO uses entropy as a regularizer — a small bonus for higher-entropy policies, which encourages the agent to keep exploring rather than locking into the first decent policy it finds. SAC goes further: it builds entropy directly into the objective. SAC tries to maximise total reward and entropy simultaneously, which makes it explore aggressively. The SAC alpha hyperparameter (between 0.0 and 1.0) controls how much entropy weight matters; 0 turns SAC into a standard reward-maximizer, 1 makes it maximally exploratory. A reasonable starting point is 0.5.",
          },
          {
            type: "paragraph",
            text:
              "For most DeepRacer use cases — discrete action spaces, fast training feedback loops — PPO is the default and reasonable choice. SAC is interesting if you're using a continuous action space and willing to trade stability for data efficiency.",
          },
        ],
      },
      {
        id: "training-strategy",
        title: "Training strategy",
        blocks: [
          {
            type: "paragraph",
            text:
              "Training was an iterative loop between simulation results and reward tweaks. I cared more about the shape of the learning curve than the peak lap time of any single run — a reward that produces 80% lap completion across many episodes is more useful than one that produces a freakishly fast single lap and then collapses.",
          },
          {
            type: "list",
            items: [
              "Tracked off-track frequency separately from average reward. Average reward hides catastrophic failures — a few runs where the agent went off track and got 0.01 the whole episode can drag the mean down without telling you what went wrong.",
              "Watched the balance between the two reward terms. If speed² dominated, the agent flew off corners; if progress / steps dominated, it crawled cautiously. The shape of the learning curve told me which way to nudge.",
              "Iterated on hyperparameters too — discount factor, entropy, exploration vs. exploitation. Lower discount factors made the agent care more about immediate rewards, which paired well with the per-step structure of my reward function.",
              "Kept the action space modest. With the default six discrete actions, the agent has fewer ways to game the reward and learning is faster.",
            ],
          },
        ],
      },
      {
        id: "what-i-learned",
        title: "What I learned",
        blocks: [
          {
            type: "paragraph",
            text:
              "The biggest takeaway was that almost every problem I hit during training traced back to the reward, not the algorithm or the hyperparameters. When the agent did something strange, the answer wasn't to tune learning rates — it was to ask: \"Is this actually the behaviour my reward function is rewarding?\" Usually the answer was yes, and the reward needed to change.",
          },
          {
            type: "paragraph",
            text:
              "The second lesson was about sim-to-real. The simulator can't capture everything — gravity, friction variations, tire grip, shadows on the camera. A policy that's perfect in simulation can underperform in the real world because the action that produced a result in Gazebo doesn't produce the same result on a real track. Domain randomization, modularity, and careful action-space calibration are the standard fixes; in this project I leaned on environment control being built in and accepted the gap on the other two.",
          },
          {
            type: "paragraph",
            text:
              "Third: the gap between \"I understand how DeepRacer works\" and \"I have a model that wins races\" is much bigger than it looks from the console. The plumbing — SageMaker, RoboMaker, Gazebo, ROS, S3, Redis — is mostly hidden, but how each piece behaves shapes how training actually unfolds. Knowing what's underneath was the difference between treating training as a black box and being able to debug it.",
          },
        ],
      },
      {
        id: "skills-tools",
        title: "Skills and tools",
        blocks: [
          {
            type: "list",
            items: [
              "Reinforcement learning (PPO and SAC, policy-gradient methods)",
              "Reward shaping and curriculum design",
              "AWS DeepRacer console, action-space configuration, hyperparameter tuning",
              "Amazon SageMaker, RoboMaker, S3, Redis, Gazebo, ROS",
              "Sim-to-real transfer (environment control, domain randomization, modularity & abstraction)",
              "Iterative experiment tracking",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "corporate-data-breaches",
    title: "Corporate Data Breaches and Narrative Disclosures",
    subtitle: "Undergraduate thesis on disclosure behavior after breaches.",
    date: "2020",
    updated: "2020",
    excerpt:
      "An undergraduate thesis examining how public firms adjust narrative disclosures after data breaches.",
    tags: ["Econometrics", "Statistics", "R"],
    source: "Project",
    coverImage: "https://maria-aguilera.github.io/images/abnormal_tone.png",
    sections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "paragraph",
            text:
              "This thesis examines how U.S. public firms adjust narrative disclosures after data breaches, focusing on managerial discretion and information asymmetry.",
          },
        ],
      },
      {
        id: "research-question",
        title: "Research Question",
        blocks: [
          {
            type: "paragraph",
            text:
              "How do breach events influence the tone and structure of 10-K narrative disclosures, and what does that imply about transparency?",
          },
        ],
      },
      {
        id: "methodology",
        title: "Methodology",
        blocks: [
          {
            type: "list",
            items: [
              "Built a dataset linking breach events to firm filings.",
              "Applied econometric models to test disclosure changes.",
              "Validated results with alternative specifications.",
            ],
          },
        ],
      },
      {
        id: "outputs",
        title: "Outputs",
        blocks: [
          {
            type: "list",
            items: [
              "Undergraduate thesis project and 2019/2020 INNCYYBER Innovation Award.",
              "Studied disclosure behavior in corporate 10-K reports.",
              "Final grade: 9.7/10.",
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
              "R (Tidyverse, ggplot, lubridate, PostgreSQL)",
              "Fuzzy matching",
              "Econometrics and statistics (DID, Logit, Fixed Effects)",
            ],
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
                label: "PDF",
                href:
                  "https://maria-aguilera.github.io/pdf/version_final_corporate_data_breaches_and_narrative_disclosures.pdf",
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
