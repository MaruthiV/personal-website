export const profile = {
  name: "Maruthi Vemula",
  bio: "Student at UNC Chapel Hill studying Computer Science and Business Administration. Passionate about AI, finance, and building things that matter.",
  currently: [
    "Working at a health-tech startup called Careset",
    "Researching stochastic volatility modeling",
  ],
  image: "/images/maruthi_deca.JPG",
  social: {
    github: "https://github.com/MaruthiV",
    linkedin: "https://www.linkedin.com/in/maruthivemula",
    twitter: "https://x.com/VemVemRu",
  },
}

export const posts = [
  {
    title: "How Agent Swarms Actually Work",
    date: "Feb 2026",
    slug: "how-agent-swarms-work",
  },
  {
    title: "How Graph Attention Networks Work",
    date: "Jan 2026",
    slug: "how-graph-attention-networks-work",
  },
  {
    title: "Why Knowledge is Key",
    date: "Oct 2025",
    slug: "why-knowledge-is-key",
  },
  {
    title: "Balancing Freshman Year",
    date: "Apr 2025",
    slug: "balancing-freshman-year",
  },
]

export const projects = [
  {
    name: "SplitShare",
    slug: "splitshare",
    description: "Platform for securely splitting recurring subscriptions",
    longDescription: `This one started from a real problem I had - trying to split a Spotify Family plan with my roommates was way more annoying than it should be. Venmo requests every month, people forgetting to pay, the whole mess. So I got a few friends together and we built SplitShare.

I led a team of 6 developers and we created a platform where you can securely split any recurring subscription. We integrated Stripe for payments so everything happens automatically - no more chasing people down. The tech stack was Next.js and React on the frontend with Firebase and MongoDB on the backend. It was my first real experience managing a dev team and shipping something people actually use.`,
    tags: ["Next.js", "React", "Firebase", "MongoDB"],
    link: { label: "Acquired by Splitwise", url: "https://www.splitwise.com/" },
  },
  {
    name: "Sleep Stage Classification",
    slug: "sleep-stage-classification",
    description: "EEG signal analysis with optimized LSTM models",
    longDescription: `Sleep research has always fascinated me - we spend a third of our lives doing it but there's still so much we don't understand. For this project, I worked on improving how we classify different sleep stages using EEG brain signals.

The interesting part was using something called the Puffer Fish Algorithm to optimize our LSTM models. It's a bio-inspired optimization technique that helped us squeeze out better performance. We ended up publishing a paper on this work. What I find exciting about this research is the potential applications - better sleep disorder diagnosis, understanding how sleep affects memory, and maybe even helping people optimize their sleep schedules.`,
    tags: ["Python", "LSTM", "Explainable AI"],
    link: { label: "Read the paper", url: "https://ijeer.forexjournal.co.in/papers-pdf/ijeer-120235.pdf" },
  },
  {
    name: "Software Vulnerability Detection",
    slug: "software-vulnerability-detection",
    description: "MDSADNet CNN achieving 98% F1-score",
    longDescription: `Cybersecurity is one of those fields where the stakes are incredibly high - one vulnerability can compromise millions of users. I wanted to see if we could use deep learning to automatically detect vulnerabilities in code before they become problems.

We developed MDSADNet, which is a multi-scale convolutional neural network that looks at code at different levels of abstraction. The results were pretty exciting - we hit a 98% F1-score, which means the model is both precise and comprehensive in finding vulnerabilities. This research showed me how AI can be a powerful tool for making software more secure, essentially giving developers an extra set of eyes that never gets tired.`,
    tags: ["CNN", "Cybersecurity"],
    link: { label: "Read the paper", url: "https://library.acadlore.com/IDA/2024/3/2/IDA_03.02_04.pdf" },
  },
  {
    name: "Crypto Price Prediction",
    slug: "crypto-price-prediction",
    description: "LSTM and Transformer models with technical indicators",
    longDescription: `I got into crypto during college like a lot of people, but I was more interested in the technical challenge of prediction than actually trading. Crypto markets are notoriously volatile and unpredictable, which makes them a perfect testing ground for machine learning models.

For this project, I built prediction models using both LSTMs and Transformers, feeding them technical indicators like momentum and volatility metrics. The Transformer architecture was particularly interesting because of how it handles sequential data. We published a paper on our findings. While I'm not claiming we solved market prediction (nobody has), we did find some patterns that traditional analysis misses. It taught me a lot about time series analysis and the limits of prediction.`,
    tags: ["Python", "TensorFlow", "PyTorch"],
    link: { label: "Read the paper", url: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10393319" },
  },
  {
    name: "Cancer-Drug Efficacy Prediction",
    slug: "cancer-drug-efficacy",
    description: "2D U-Net CNN for MRI tumor segmentation",
    longDescription: `This project hit close to home for me. Cancer treatment is still so much trial and error - doctors often can't predict how a patient will respond to a specific drug until they try it. I wanted to see if we could help change that.

We built a two-part system: first, a 2D U-Net CNN that segments tumors from MRI scans, and second, a model using Gompertz differential equations to predict how those tumors would respond to different treatments. The goal is to give oncologists better tools to personalize treatment plans. It's the kind of work where even small improvements in accuracy could mean real differences in patient outcomes. Definitely one of the most meaningful projects I've worked on.`,
    tags: ["Deep Learning", "Medical Imaging"],
    link: { label: "Read the paper", url: "https://www.sciencedirect.com/science/article/pii/S2666521223000303" },
  },
  {
    name: "Stock Volatility Prediction",
    slug: "stock-volatility-prediction",
    description: "Neural Networks and SVMs across market sectors",
    longDescription: `My interest in finance led me to this project - I wanted to understand if machine learning could do better than traditional models at predicting stock volatility. Volatility is crucial for options pricing, risk management, and just understanding market dynamics.

I built models using both Neural Networks and SVMs, testing them across seven different market sectors. The approach combined the classic Black-Scholes framework with modern ML techniques. We saw a 31% improvement in prediction accuracy compared to baseline models. What I learned is that different sectors have different volatility patterns - tech stocks behave differently than utilities, for example. The project gave me a solid foundation in quantitative finance and reinforced my interest in the intersection of AI and markets.`,
    tags: ["Neural Networks", "SVMs"],
  },
  {
    name: "VIXcelerate",
    slug: "vixcelerate",
    description: "Parallel density estimation for VIX calculation",
    longDescription: `This project came from wanting to understand how the VIX - the "fear index" - actually gets calculated. The VIX measures expected market volatility, and it turns out the computation involves some pretty intensive density estimation that can be slow when done naively.

I built VIXcelerate to speed this up using parallel computing. The idea is to distribute the density estimation across multiple cores so you can calculate VIX values much faster. This matters if you're doing backtesting or running simulations where you need to compute thousands of VIX values. It was a fun project that combined my interests in finance and high-performance computing.`,
    tags: ["Python", "Parallel Computing", "Finance"],
    link: { label: "View on GitHub", url: "https://github.com/MaruthiV/VIXcelerate" },
  },
  {
    name: "Movie Recommendation System",
    slug: "movie-recommendation",
    description: "Personalized movie recommendations using collaborative filtering",
    longDescription: `I built this project because I was tired of scrolling through Netflix for 30 minutes just to rewatch The Office. Recommendation systems are everywhere - Netflix, Spotify, Amazon - and I wanted to understand how they actually work under the hood.

This system uses collaborative filtering to find patterns in how people rate movies. The basic idea is that if you and someone else liked the same movies in the past, you'll probably like similar movies in the future. I implemented both user-based and item-based approaches and compared their performance. It was a great way to learn about recommendation algorithms and matrix factorization techniques. Plus, I actually use it now to find movies to watch.`,
    tags: ["Python", "Machine Learning", "Collaborative Filtering"],
    link: { label: "View on GitHub", url: "https://github.com/MaruthiV/movie_recommendation" },
  },
]

export type ArtItem = {
  title: string
  type: "book" | "movie" | "tv"
  rating: number
}

// Placeholder art data - user should fill in their own
export const art: ArtItem[] = [
  { title: "Harry Potter and the Order of the Phoenix", type: "book", rating: 9.7 },
  { title: "Casino Royale", type: "movie", rating: 9.8 },
  { title: "The Social Network", type: "movie", rating: 9.5 },
  { title: "Breaking Bad", type: "tv", rating: 9.8 },
  { title: "Zero to One", type: "book", rating: 9.0 },
  { title: "Interstellar", type: "movie", rating: 9.2 },
  { title: "Silicon Valley", type: "tv", rating: 8.5 },
  { title: "The Lean Startup", type: "book", rating: 8.0 },
  { title: "The Brothers Karamazov", type: "book", rating: 8.8 },
  { title: "The Dark Knight", type: "movie", rating: 10.0 },
  { title: "Swades", type: "movie", rating: 9.2 },
  { title: "Yeh Jawani Hai Deewani", type: "movie", rating: 9.5 },
  { title: "Industry", type: "tv", rating: 8.9 },
  { title: "Better Call Saul", type: "tv", rating: 9.1 },
]
