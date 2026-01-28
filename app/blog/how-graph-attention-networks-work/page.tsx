"use client"

import { BlogLayout } from "@/components/blog-layout"
import { Math, MathBlock, M } from "@/components/math"

const toc = [
  { id: "intro", title: "Introduction", level: 1 },
  { id: "graphs-primer", title: "Graphs - A Quick Primer", level: 1 },
  { id: "why-graphs-matter", title: "Why Graphs Matter", level: 2 },
  { id: "node-features", title: "Node Features", level: 2 },
  { id: "problem-with-nns", title: "The Problem with Regular Neural Networks", level: 1 },
  { id: "message-passing", title: "Message Passing - The Core Idea", level: 1 },
  { id: "aggregation-problem", title: "The Aggregation Problem", level: 2 },
  { id: "enter-attention", title: "Enter Attention", level: 1 },
  { id: "attention-intuition", title: "Building the Intuition", level: 2 },
  { id: "what-attention-gives-us", title: "What Attention Gives Us", level: 2 },
  { id: "gat-mechanism", title: "The GAT Mechanism", level: 1 },
  { id: "step-1-transform", title: "Step 1: Transform the Features", level: 2 },
  { id: "step-2-attention-scores", title: "Step 2: Compute Attention Scores", level: 2 },
  { id: "step-3-normalize", title: "Step 3: Normalize with Softmax", level: 2 },
  { id: "step-4-aggregate", title: "Step 4: Aggregate", level: 2 },
  { id: "putting-it-together", title: "Putting It All Together", level: 2 },
  { id: "multi-head", title: "Multi-Head Attention", level: 1 },
  { id: "why-multiple-heads", title: "Why Multiple Heads?", level: 2 },
  { id: "importance-vs-correlation", title: "Importance vs. Correlation", level: 1 },
  { id: "when-gats-struggle", title: "When GATs Struggle", level: 1 },
  { id: "conclusion", title: "Conclusion", level: 1 },
]

export default function HowGraphAttentionNetworksWork() {
  return (
    <BlogLayout
      title="How Graph Attention Networks Work"
      date="Jan 27, 2026"
      toc={toc}
    >
      <section id="intro">
        <p>
          I've been playing around with graph neural networks (GNNs) at my work recently, specifically using them to model relationships in healthcare data. And honestly? I was confused for a while. I could follow tutorials, copy code, and get models to train - but I didn't really <em>understand</em> what was happening.
        </p>
        <p>
          Questions kept nagging at me: What does it actually mean for a node to "attend" to its neighbors? Where do those attention weights come from - like, what's the actual computation? And is the model learning which neighbors are important, or is it learning something else entirely?
        </p>
        <p>
          So I did what I always do when I want to really understand something - I went back to the original paper and worked through the math myself. And here's the thing: once I saw how all the pieces fit together, it clicked. The core ideas behind Graph Attention Networks (GATs) are surprisingly elegant.
        </p>
        <p>
          This post is my attempt to explain GATs the way I wish someone had explained them to me. We'll start from absolute basics - what even is a graph? - and build up to the full mechanism. I'll show you the math, but more importantly, I want you to develop the intuition for <em>why</em> it works.
        </p>
        <p>
          By the end, you should be able to answer these questions:
        </p>
        <ul>
          <li>What does it mean to "attend" over neighbors on a graph?</li>
          <li>Where do the attention weights come from, exactly?</li>
          <li>Is attention actually learning importance, or just correlation?</li>
          <li>What does multi-head attention buy you in graphs?</li>
          <li>When does GAT fail or become noisy?</li>
        </ul>
        <p>Let's jump in.</p>
      </section>

      <h2 id="graphs-primer">Graphs - A Quick Primer</h2>
      <p>
        Before we get to the fancy stuff, let's make sure we're on the same page about what a graph actually is. If you've taken a discrete math or data structures class, you've seen this before - but it's worth revisiting because the intuition matters.
      </p>
      <p>
        A graph is really just two things:
      </p>
      <ul>
        <li><strong>Nodes</strong> (also called vertices) - these are the "things" in your graph</li>
        <li><strong>Edges</strong> - these are the connections between things</li>
      </ul>
      <p>
        That's it. A graph is a collection of things and the relationships between them.
      </p>

      <h3 id="why-graphs-matter">Why Graphs Matter</h3>
      <p>
        Here's what took me a while to appreciate: graphs are <em>everywhere</em>. Once you start looking for them, you see them in everything:
      </p>
      <ul>
        <li><strong>Social networks</strong>: People are nodes, friendships are edges. Facebook's entire business is built on a graph.</li>
        <li><strong>Molecules</strong>: Atoms are nodes, chemical bonds are edges. This is huge for drug discovery.</li>
        <li><strong>The internet</strong>: Web pages are nodes, hyperlinks are edges. This is literally how Google started - PageRank is a graph algorithm.</li>
        <li><strong>Knowledge bases</strong>: Concepts are nodes, relationships are edges. "Albert Einstein" → "born in" → "Germany".</li>
        <li><strong>Road networks</strong>: Intersections are nodes, roads are edges. Google Maps uses graph algorithms to find your route.</li>
        <li><strong>Biological networks</strong>: Proteins are nodes, interactions are edges. Understanding these graphs could help cure diseases.</li>
      </ul>
      <p>
        The point is: a <em>lot</em> of real-world data naturally has this structure where you have entities and relationships between them. And if we want machine learning to work on this kind of data, we need neural networks that understand graphs.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/gat/gat - fig 1.png"
          alt="A simple social graph with 5 nodes representing people (Alice, Bob, Carol, Dave, Eve) connected by edges representing friendships. Each node has a feature vector shown."
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 1: A simple social graph. Nodes represent people, edges represent friendships, and each node has features describing their traits and interests.
        </figcaption>
      </figure>

      <h3 id="node-features">Node Features</h3>
      <p>
        Here's something crucial: in machine learning on graphs, each node typically has <strong>features</strong>. These are just numbers that describe that node.
      </p>
      <p>
        Think about a social network. Each person (node) might have features like:
      </p>
      <ul>
        <li>Age</li>
        <li>Number of posts per week</li>
        <li>Interests encoded as a vector</li>
        <li>Location (encoded somehow)</li>
      </ul>
      <p>
        We typically represent a node's features as a vector <M>{"h_i"}</M> - just a list of numbers. So node 1 might have features <M>{"h_1 = [0.5, 1.2, -0.3, ...]"}</M>, node 2 might have <M>{"h_2 = [0.8, 0.1, 0.9, ...]"}</M>, and so on.
      </p>
      <p>
        The goal of a graph neural network is to learn better representations of these nodes - representations that capture not just the node's own features, but also information about its neighborhood.
      </p>
      <p>
        This brings us to the key question: how do we actually process graph-structured data with neural networks?
      </p>

      <h2 id="problem-with-nns">The Problem with Regular Neural Networks</h2>
      <p>
        Here's the thing - you can't just throw graph data into a standard neural network. Let me explain why.
      </p>
      <p>
        Regular neural networks expect inputs with a <strong>fixed structure</strong>:
      </p>
      <ul>
        <li>Images are always grids of pixels (say, 224 × 224 × 3)</li>
        <li>Audio is a sequence of samples at a fixed rate</li>
        <li>Text, after tokenization, is a sequence of token IDs</li>
      </ul>
      <p>
        The network architecture is built around this fixed structure. A CNN expects a grid. An RNN expects a sequence. The weights are shaped to match.
      </p>
      <p>
        But graphs? Graphs are messy:
      </p>
      <ul>
        <li><strong>Variable size</strong>: Different graphs have different numbers of nodes</li>
        <li><strong>Variable connectivity</strong>: Different nodes have different numbers of neighbors</li>
        <li><strong>No natural ordering</strong>: There's no "first" node or "second" node. Who's first in a social network?</li>
        <li><strong>Permutation invariance</strong>: The same graph can be represented in many equivalent ways just by relabeling the nodes</li>
      </ul>
      <p>
        Imagine trying to flatten a social network into a fixed-size input vector. What if you have 1000 friends? What if you have 10? What order do you put them in? It just doesn't work.
      </p>
      <p>
        This is where Graph Neural Networks (GNNs) come in. They're specifically designed to handle this variable, orderless structure.
      </p>

      <h2 id="message-passing">Message Passing - The Core Idea</h2>
      <p>
        Okay, here's the big insight that makes GNNs work. It's called <strong>message passing</strong>, and once you understand it, everything else falls into place.
      </p>
      <p>
        The intuition is simple: <strong>to understand a node, look at its neighbors</strong>.
      </p>
      <p>
        Let me give you a concrete example. Imagine you're at a huge party and you don't know anyone. You want to figure out what kind of person someone is. What do you do?
      </p>
      <p>
        You look at who they're hanging out with.
      </p>
      <p>
        If all their friends are talking about startups and venture capital, they're probably into the startup world. If their friends are all musicians, they're probably into music. If they're surrounded by academics discussing research, they're probably an academic.
      </p>
      <p>
        The people around you say something about you. Your social context is informative.
      </p>
      <p>
        GNNs formalize this exact intuition. In each layer of a GNN, every node:
      </p>
      <ol>
        <li><strong>Collects "messages" from its neighbors</strong> - basically, it looks at their feature vectors</li>
        <li><strong>Aggregates these messages</strong> - combines them somehow (we'll talk about how)</li>
        <li><strong>Updates its own representation</strong> - incorporates this neighborhood information</li>
      </ol>
      <p>
        This happens for <em>every</em> node in parallel. Then we repeat for multiple layers. After a few layers, each node's representation captures information not just from its immediate neighbors, but from neighbors of neighbors, and so on.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/gat/gat - fig 2.png"
          alt="Message passing without attention: Bob receives messages from Alice, Carol, and Dave with equal weight, averaging their features together."
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 2: Message passing without attention. Bob aggregates information from all neighbors equally - but should he really weight Alice, Carol, and Dave the same?
        </figcaption>
      </figure>

      <h3 id="aggregation-problem">The Aggregation Problem</h3>
      <p>
        So here's the question: how do you actually aggregate messages from neighbors?
      </p>
      <p>
        The simplest approach is to just <strong>average</strong> them. If node <M>i</M> has neighbors <M>{"j_1, j_2, j_3"}</M>, its new representation is just:
      </p>
      <MathBlock>{"h'_i = \\frac{1}{|\\mathcal{N}_i|} \\sum_{j \\in \\mathcal{N}_i} h_j"}</MathBlock>
      <p>
        Where <M>{"\\mathcal{N}_i"}</M> is the set of neighbors of node <M>i</M>, and <M>{"|\\mathcal{N}_i|"}</M> is how many neighbors there are.
      </p>
      <p>
        In plain English: add up all your neighbors' feature vectors, then divide by the number of neighbors.
      </p>
      <p>
        This works! And simple averaging-based GNNs can be pretty effective. But there's a problem.
      </p>
      <p>
        <strong>All neighbors are treated equally.</strong>
      </p>
      <p>
        Let's go back to the party analogy. Imagine you want career advice. You could ask:
      </p>
      <ul>
        <li>Your best friend who knows you really well and has great judgment</li>
        <li>A random person you just met five minutes ago</li>
        <li>That guy who keeps giving terrible advice and doesn't really understand you</li>
      </ul>
      <p>
        Would you weight their opinions equally? Of course not! Your best friend's advice is probably way more valuable than the random stranger's.
      </p>
      <p>
        But simple averaging treats them all the same. It doesn't distinguish between highly relevant neighbors and barely relevant ones.
      </p>
      <p>
        Some neighbors are more relevant than others. We need a way to learn which ones matter more.
      </p>

      <h2 id="enter-attention">Enter Attention - "Who Should I Listen To?"</h2>
      <p>
        This is exactly what attention gives us. Instead of treating all neighbors equally, we learn <strong>attention weights</strong> that determine how much each neighbor contributes.
      </p>

      <h3 id="attention-intuition">Building the Intuition</h3>
      <p>
        Let's stick with the party analogy because I think it really helps here.
      </p>
      <p>
        When you're at a party, you naturally pay more attention to some people than others. Think about what affects how much attention you give someone:
      </p>
      <ul>
        <li><strong>Similarity</strong>: You lean in more when someone shares your interests</li>
        <li><strong>Relevance</strong>: If you're thinking about career stuff, you pay more attention to people who can help with that</li>
        <li><strong>Trust/Familiarity</strong>: You weight your close friend's opinion more than a stranger's</li>
        <li><strong>Expertise</strong>: You listen more to people who know what they're talking about</li>
      </ul>
      <p>
        You don't consciously decide "I'm going to weight Alice at 0.4 and Bob at 0.1." But your brain is doing something like that automatically.
      </p>
      <p>
        GATs learn to do the same thing. Given a node and its neighbors, the network learns to assign attention weights that reflect "how much should I listen to this neighbor?"
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/gat/gat - fig 3.png"
          alt="Attention weights intuition: Bob receives messages from neighbors with different weights - Alice gets 0.6, Dave gets 0.3, Carol gets 0.1 - based on relevance."
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 3: Attention weights let us differentiate between neighbors. Alice (close friend, similar interests) gets weight 0.6, while Carol (barely knows her) gets only 0.1.
        </figcaption>
      </figure>

      <h3 id="what-attention-gives-us">What Attention Gives Us</h3>
      <p>
        For each node <M>i</M> and each of its neighbors <M>j</M>, GAT computes an attention weight <M>{"\\alpha_{ij}"}</M>. These weights have some nice properties:
      </p>
      <ul>
        <li><strong>They're learned</strong>: The network figures out what makes a neighbor "important" during training. We don't hand-code the rules.</li>
        <li><strong>They're normalized</strong>: The weights across all neighbors sum to 1. So they're like a probability distribution - "what fraction of my attention goes to each neighbor?"</li>
        <li><strong>They're dynamic</strong>: The weight depends on <em>both</em> the node and its neighbor, not just the graph structure. Same neighbor might get different attention from different nodes.</li>
      </ul>
      <p>
        Now instead of simple averaging, we compute a <strong>weighted sum</strong>:
      </p>
      <MathBlock>{"h'_i = \\sum_{j \\in \\mathcal{N}_i} \\alpha_{ij} \\cdot h_j"}</MathBlock>
      <p>
        Let's break this down:
      </p>
      <ul>
        <li><M>{"h'_i"}</M> is the new representation for node <M>i</M> (the output)</li>
        <li>We sum over all neighbors <M>j</M> in the neighborhood <M>{"\\mathcal{N}_i"}</M></li>
        <li>Each neighbor's features <M>{"h_j"}</M> are multiplied by their attention weight <M>{"\\alpha_{ij}"}</M></li>
      </ul>
      <p>
        So if Alice has weight 0.6, Dave has weight 0.3, and Carol has weight 0.1, the new representation is:
      </p>
      <MathBlock>{"h'_{\\text{Bob}} = 0.6 \\cdot h_{\\text{Alice}} + 0.3 \\cdot h_{\\text{Dave}} + 0.1 \\cdot h_{\\text{Carol}}"}</MathBlock>
      <p>
        Bob's new representation is mostly influenced by Alice, somewhat by Dave, and barely by Carol. That's the power of attention.
      </p>
      <p>
        But here's the million-dollar question: <strong>where do these attention weights actually come from?</strong>
      </p>

      <h2 id="gat-mechanism">The GAT Mechanism</h2>
      <p>
        Alright, now we get to the heart of how GAT actually works. I'm going to walk through this step by step, showing both the math and the intuition. Don't worry if the math looks intimidating at first - I'll explain every piece.
      </p>
      <p>
        The high-level idea is:
      </p>
      <ol>
        <li>Transform node features into a new space</li>
        <li>Compute a "compatibility score" for each pair of connected nodes</li>
        <li>Normalize these scores into proper weights</li>
        <li>Use the weights to aggregate neighbor information</li>
      </ol>
      <p>
        Let's go through each step.
      </p>

      <h3 id="step-1-transform">Step 1: Transform the Features</h3>
      <p>
        First, we apply a <strong>linear transformation</strong> to each node's features. This is just matrix multiplication:
      </p>
      <MathBlock>{"z_i = W \\cdot h_i"}</MathBlock>
      <p>
        Let's unpack this:
      </p>
      <ul>
        <li><M>{"h_i"}</M> is the original feature vector for node <M>i</M> (say, a vector of length <M>F</M>)</li>
        <li><M>W</M> is a learnable weight matrix (size <M>{"F' \\times F"}</M>)</li>
        <li><M>{"z_i"}</M> is the transformed feature vector (length <M>{"F'"}</M>)</li>
      </ul>
      <p>
        Why do we do this? A few reasons:
      </p>
      <ul>
        <li><strong>Change dimensionality</strong>: We might want to project into a smaller or larger space</li>
        <li><strong>Learn what matters</strong>: The matrix <M>W</M> learns to emphasize features that are important for the task</li>
        <li><strong>Create a common space</strong>: Before comparing two nodes, we want their features in the same "language"</li>
      </ul>
      <p>
        Think of it like this: before comparing two people at a party, you first translate everyone's profile into a standardized format that highlights the things that matter for your comparison.
      </p>
      <p>
        <strong>Key point</strong>: The same matrix <M>W</M> is applied to every node. This is important for making the network efficient and ensuring it generalizes.
      </p>

      <h3 id="step-2-attention-scores">Step 2: Compute Attention Scores</h3>
      <p>
        Now comes the clever part. We need to compute how much node <M>i</M> should "attend to" node <M>j</M>.
      </p>
      <p>
        The intuition is: we want to measure "compatibility" between two nodes. Are their features such that <M>j</M> would be helpful for <M>i</M>?
      </p>
      <p>
        GAT does this in a specific way:
      </p>
      <ol>
        <li>Take the transformed features of both nodes: <M>{"z_i"}</M> and <M>{"z_j"}</M></li>
        <li>Concatenate them: stack them together into one longer vector <M>{"[z_i \\| z_j]"}</M></li>
        <li>Pass this through a learnable "attention mechanism"</li>
        <li>Apply a non-linearity</li>
      </ol>
      <p>
        In math:
      </p>
      <MathBlock>{"e_{ij} = \\text{LeakyReLU}\\Big(\\mathbf{a}^T \\cdot [z_i \\| z_j]\\Big)"}</MathBlock>
      <p>
        Let me explain each piece:
      </p>
      <p>
        <strong>The concatenation <M>{"[z_i \\| z_j]"}</M>:</strong> We're just stacking the two vectors. If <M>{"z_i"}</M> has length <M>{"F'"}</M> and <M>{"z_j"}</M> has length <M>{"F'"}</M>, then <M>{"[z_i \\| z_j]"}</M> has length <M>{"2F'"}</M>.
      </p>
      <p>
        <strong>The attention vector <M>{"\\mathbf{a}"}</M>:</strong> This is the second set of learnable parameters (after <M>W</M>). It's a vector of length <M>{"2F'"}</M>. When we compute <M>{"\\mathbf{a}^T \\cdot [z_i \\| z_j]"}</M>, we're taking a dot product - this gives us a single number.
      </p>
      <p>
        What does this dot product mean intuitively? The vector <M>{"\\mathbf{a}"}</M> learns a kind of "compatibility function." It learns which combinations of features between node <M>i</M> and node <M>j</M> indicate that <M>j</M> is relevant to <M>i</M>.
      </p>
      <p>
        <strong>The LeakyReLU:</strong> This is a non-linearity. Regular ReLU sets all negative values to zero:
      </p>
      <MathBlock>{"\\text{ReLU}(x) = \\max(0, x)"}</MathBlock>
      <p>
        LeakyReLU instead lets a small fraction of negative values through:
      </p>
      <MathBlock>{"\\text{LeakyReLU}(x) = \\begin{cases} x & \\text{if } x > 0 \\\\ 0.01x & \\text{if } x \\leq 0 \\end{cases}"}</MathBlock>
      <p>
        Why LeakyReLU? It helps with training stability. If we used regular ReLU, some attention scores could get "stuck" at zero and never recover during training.
      </p>
      <p>
        The output <M>{"e_{ij}"}</M> is called the <strong>raw attention score</strong>. It's a single number that represents "how compatible are nodes <M>i</M> and <M>j</M>?"
      </p>
      <p>
        But we're not done yet. These raw scores could be any real number - positive, negative, large, small. We need to turn them into proper weights.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/gat/gat - fig 4.png"
          alt="GAT mechanism step-by-step: Transform features with W, concatenate, compute attention score with learnable vector a, apply LeakyReLU, then softmax to get normalized weights."
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 4: The GAT mechanism step-by-step. The learnable parameters W and a are highlighted - these are what the network learns during training.
        </figcaption>
      </figure>

      <h3 id="step-3-normalize">Step 3: Normalize with Softmax</h3>
      <p>
        We have raw scores <M>{"e_{ij}"}</M> for each neighbor. Now we need to convert them into proper attention weights that:
      </p>
      <ol>
        <li>Are all positive (you can't have negative attention)</li>
        <li>Sum to 1 across all neighbors (so they're like a probability distribution)</li>
      </ol>
      <p>
        The standard way to do this is <strong>softmax</strong>:
      </p>
      <MathBlock>{"\\alpha_{ij} = \\text{softmax}_j(e_{ij}) = \\frac{\\exp(e_{ij})}{\\sum_{k \\in \\mathcal{N}_i} \\exp(e_{ik})}"}</MathBlock>
      <p>
        Let me break this down, because softmax trips people up:
      </p>
      <ul>
        <li>The numerator <M>{"\\exp(e_{ij})"}</M> is <M>e</M> raised to the power of <M>{"e_{ij}"}</M>. This makes everything positive.</li>
        <li>The denominator sums this over ALL neighbors <M>k</M> of node <M>i</M>. This normalizes so everything sums to 1.</li>
      </ul>
      <p>
        Let's work through a concrete example. Say node <M>i</M> has three neighbors with raw scores:
      </p>
      <ul>
        <li><M>{"e_{i,\\text{Alice}} = 2.0"}</M></li>
        <li><M>{"e_{i,\\text{Carol}} = 1.0"}</M></li>
        <li><M>{"e_{i,\\text{Dave}} = 0.5"}</M></li>
      </ul>
      <p>
        First, we compute <M>{"\\exp"}</M> of each:
      </p>
      <ul>
        <li><M>{"\\exp(2.0) \\approx 7.39"}</M></li>
        <li><M>{"\\exp(1.0) \\approx 2.72"}</M></li>
        <li><M>{"\\exp(0.5) \\approx 1.65"}</M></li>
      </ul>
      <p>
        The sum is <M>{"7.39 + 2.72 + 1.65 = 11.76"}</M>
      </p>
      <p>
        So the attention weights are:
      </p>
      <ul>
        <li><M>{"\\alpha_{i,\\text{Alice}} = 7.39 / 11.76 \\approx 0.63"}</M></li>
        <li><M>{"\\alpha_{i,\\text{Carol}} = 2.72 / 11.76 \\approx 0.23"}</M></li>
        <li><M>{"\\alpha_{i,\\text{Dave}} = 1.65 / 11.76 \\approx 0.14"}</M></li>
      </ul>
      <p>
        Notice: <M>{"0.63 + 0.23 + 0.14 = 1.0"}</M>. The weights sum to 1, as promised.
      </p>
      <p>
        Softmax has a nice property: it <strong>amplifies differences</strong>. Alice's raw score was only twice Dave's (2.0 vs 0.5), but her attention weight is more than four times larger (0.63 vs 0.14). The exponential function makes the highest scores dominate.
      </p>

      <h3 id="step-4-aggregate">Step 4: Aggregate</h3>
      <p>
        Finally! We have our attention weights <M>{"\\alpha_{ij}"}</M>. Now we just use them to compute a weighted sum:
      </p>
      <MathBlock>{"h'_i = \\sigma\\left(\\sum_{j \\in \\mathcal{N}_i} \\alpha_{ij} \\cdot z_j\\right)"}</MathBlock>
      <p>
        Breaking this down:
      </p>
      <ul>
        <li>For each neighbor <M>j</M>, take their transformed features <M>{"z_j"}</M></li>
        <li>Multiply by the attention weight <M>{"\\alpha_{ij}"}</M></li>
        <li>Sum all these up</li>
        <li>Apply a non-linearity <M>{"\\sigma"}</M> (often ReLU or ELU)</li>
      </ul>
      <p>
        The result <M>{"h'_i"}</M> is the new representation for node <M>i</M>. It's a combination of its neighbors' information, but weighted by how much <M>i</M> should "attend to" each one.
      </p>

      <h3 id="putting-it-together">Putting It All Together</h3>
      <p>
        Let's recap the full GAT layer. Given node <M>i</M> with neighbors <M>{"\\mathcal{N}_i"}</M>:
      </p>
      <ol>
        <li><strong>Transform</strong>: <M>{"z_i = W \\cdot h_i"}</M> for all nodes</li>
        <li><strong>Score</strong>: <M>{"e_{ij} = \\text{LeakyReLU}(\\mathbf{a}^T [z_i \\| z_j])"}</M> for all edges</li>
        <li><strong>Normalize</strong>: <M>{"\\alpha_{ij} = \\text{softmax}_j(e_{ij})"}</M></li>
        <li><strong>Aggregate</strong>: <M>{"h'_i = \\sigma(\\sum_j \\alpha_{ij} z_j)"}</M></li>
      </ol>
      <p>
        The learnable parameters are:
      </p>
      <ul>
        <li><M>W</M> - the feature transformation matrix (learns what features matter)</li>
        <li><M>{"\\mathbf{a}"}</M> - the attention vector (learns what makes nodes compatible)</li>
      </ul>
      <p>
        During training, backpropagation adjusts both <M>W</M> and <M>{"\\mathbf{a}"}</M> to minimize your loss function. The network learns both what features are important AND how to compute compatibility between nodes.
      </p>
      <p>
        That's the core GAT mechanism! But there's one more trick that makes it work even better.
      </p>

      <h2 id="multi-head">Multi-Head Attention</h2>
      <p>
        Here's a question that might have occurred to you: what if different types of "importance" matter in different ways?
      </p>

      <h3 id="why-multiple-heads">Why Multiple Heads?</h3>
      <p>
        Think about what makes a neighbor "relevant." There could be many reasons:
      </p>
      <ul>
        <li>Maybe they're structurally similar (same number of connections)</li>
        <li>Maybe they have similar features</li>
        <li>Maybe they're in the same community</li>
        <li>Maybe they have complementary information</li>
      </ul>
      <p>
        A single attention mechanism (one <M>W</M> and one <M>{"\\mathbf{a}"}</M>) might not capture all these different notions of relevance.
      </p>
      <p>
        The solution is <strong>multi-head attention</strong>. Instead of computing one set of attention weights, we compute <M>K</M> independent sets, each with its own parameters.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/gat/gat - fig 5.png"
          alt="Multi-head attention: node i receives messages through 3 different heads, each focusing on different aspects, then concatenates the outputs."
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 5: Multi-head attention. Each head learns to focus on different aspects of relevance, like consulting multiple experts. The outputs are concatenated for a richer representation.
        </figcaption>
      </figure>

      <p>
        Think of it like consulting multiple experts:
      </p>
      <ul>
        <li>Expert 1 focuses on one aspect of the problem</li>
        <li>Expert 2 focuses on a different aspect</li>
        <li>Expert 3 focuses on yet another aspect</li>
      </ul>
      <p>
        By combining their perspectives, you get a richer understanding than any single expert could provide.
      </p>
      <p>
        In math, we have <M>K</M> attention heads, each computing:
      </p>
      <MathBlock>{"h'^{(k)}_i = \\sigma\\left(\\sum_{j \\in \\mathcal{N}_i} \\alpha^{(k)}_{ij} \\cdot W^{(k)} h_j\\right)"}</MathBlock>
      <p>
        Where the superscript <M>{"(k)"}</M> indicates the <M>k</M>-th head, each with its own <M>{"W^{(k)}"}</M> and <M>{"\\mathbf{a}^{(k)}"}</M>.
      </p>
      <p>
        We then combine the outputs from all heads. Typically, we <strong>concatenate</strong> them:
      </p>
      <MathBlock>{"h'_i = \\Big\\|_{k=1}^{K} h'^{(k)}_i"}</MathBlock>
      <p>
        Where <M>{"\\|"}</M> means concatenation. If each head outputs a vector of length <M>{"F'"}</M>, and we have <M>K</M> heads, the final output has length <M>{"K \\cdot F'"}</M>.
      </p>
      <p>
        For the <strong>final layer</strong> of the network, we often <strong>average</strong> instead of concatenate, to get a fixed output size:
      </p>
      <MathBlock>{"h'_i = \\sigma\\left(\\frac{1}{K}\\sum_{k=1}^{K} \\sum_{j \\in \\mathcal{N}_i} \\alpha^{(k)}_{ij} \\cdot W^{(k)} h_j\\right)"}</MathBlock>
      <p>
        In practice, 4 to 8 attention heads is common. More heads = more expressive power, but also more parameters and computation.
      </p>
      <p>
        Multi-head attention also helps stabilize training. If one head learns something weird, the others can compensate. It's like having multiple independent "votes" on what's important.
      </p>

      <h2 id="importance-vs-correlation">Importance vs. Correlation</h2>
      <p>
        Now for a question that bugged me for a while: is attention actually learning which neighbors are "important"? Or is it learning something else?
      </p>
      <p>
        The honest answer is: <strong>it's complicated</strong>.
      </p>
      <p>
        What attention is actually doing: it's learning which neighbors have features that are <strong>useful for the task you're training on</strong>.
      </p>
      <p>
        Let me make this concrete. Say you're training a GAT to classify nodes in a social network as "will churn" or "won't churn" (i.e., will they stop using the service).
      </p>
      <p>
        The attention mechanism learns: "which of my neighbors' features are predictive of whether I'll churn?"
      </p>
      <p>
        This might align with human intuition about "importance":
      </p>
      <ul>
        <li>Maybe close friends who have churned are highly predictive → high attention</li>
        <li>Maybe acquaintances you barely interact with are less predictive → low attention</li>
      </ul>
      <p>
        But it might not always match our intuition:
      </p>
      <ul>
        <li>Maybe a seemingly "unimportant" neighbor is actually highly predictive because they provide unique information</li>
        <li>Maybe attention is spread evenly because many neighbors are equally informative</li>
        <li>Maybe the model learns spurious correlations in the training data</li>
      </ul>
      <p>
        The key insight: <strong>attention weights are task-dependent</strong>. They're not an objective measure of "importance" - they're a learned measure of relevance for the specific thing you're trying to predict.
      </p>
      <p>
        This is actually a common point of confusion with attention mechanisms in general (including in transformers for NLP). High attention weight doesn't necessarily mean "important" in a human-intuitive sense. It means "useful for reducing the loss function."
      </p>
      <p>
        That said, attention weights can still be useful for interpretability - they give you <em>some</em> signal about what the model is looking at. Just don't over-interpret them.
      </p>

      <h2 id="when-gats-struggle">When GATs Struggle</h2>
      <p>
        GATs are powerful, but they're not magic. Let me walk you through the main failure modes so you know what to watch out for.
      </p>
      <p>
        <strong>1. Over-smoothing</strong>
      </p>
      <p>
        This is probably the biggest issue with GNNs in general, not just GATs.
      </p>
      <p>
        Remember how message passing works: each layer aggregates information from neighbors. After one layer, each node knows about its 1-hop neighbors. After two layers, it knows about 2-hop neighbors. And so on.
      </p>
      <p>
        The problem: as you stack more layers, node representations start to <strong>converge</strong>. Everyone starts looking the same.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/gat/gat - fig 6.png"
          alt="Over-smoothing problem: as layers increase, node representations converge - distinct colors at layer 1 become uniform gray by layer 6+."
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 6: The over-smoothing problem. With too many layers, node representations converge and individual differences wash out - like a game of telephone.
        </figcaption>
      </figure>

      <p>
        It's like a game of telephone. After enough rounds of passing messages, everyone's heard from everyone else, and individual differences wash out.
      </p>
      <p>
        This limits how deep you can make your GNN. While CNNs can be hundreds of layers deep, GNNs typically use 2-4 layers before over-smoothing becomes a problem.
      </p>
      <p>
        There are techniques to mitigate this (residual connections, normalization, etc.), but it's an active area of research.
      </p>
      <p>
        <strong>2. Heterogeneous Graphs</strong>
      </p>
      <p>
        What if your graph has different types of nodes or edges?
      </p>
      <p>
        For example, in a knowledge graph: "Einstein" (person) → "born_in" → "Germany" (country) → "located_in" → "Europe" (continent). You have different node types and different edge types.
      </p>
      <p>
        A single GAT attention mechanism might struggle here. The same "compatibility function" might not make sense for all edge types. Why would "born_in" relationships have the same attention pattern as "located_in" relationships?
      </p>
      <p>
        Variants like <strong>Heterogeneous Graph Attention Networks (HAN)</strong> address this by having separate attention mechanisms for different edge types.
      </p>
      <p>
        <strong>3. When Neighbors Genuinely Don't Vary in Importance</strong>
      </p>
      <p>
        Sometimes, all your neighbors really are equally important.
      </p>
      <p>
        In these cases, learning attention weights adds parameters without benefit. You're essentially learning to approximate uniform weighting - but with extra steps and extra parameters.
      </p>
      <p>
        If your task doesn't benefit from differentiated attention, simpler GNNs (like GCN) might actually work better - fewer parameters, faster training, less overfitting risk.
      </p>
      <p>
        <strong>4. Computational Cost</strong>
      </p>
      <p>
        Computing attention scores requires looking at every edge in the graph. For each edge, we do a concatenation and a dot product.
      </p>
      <p>
        For large, dense graphs, this can be expensive. If you have millions of nodes and billions of edges, those attention computations add up.
      </p>
      <p>
        There are approximations and sampling techniques to make this more tractable, but it's worth being aware of the cost.
      </p>

      <h2 id="conclusion">Conclusion</h2>
      <p>
        Let's recap what we've learned:
      </p>
      <ul>
        <li><strong>Graphs are everywhere</strong> - social networks, molecules, knowledge bases - and they need special neural network architectures that respect their structure.</li>
        <li><strong>Message passing</strong> is the core idea behind GNNs: understand a node by aggregating information from its neighbors.</li>
        <li><strong>The aggregation problem</strong>: simple averaging treats all neighbors equally, but some neighbors are more relevant than others.</li>
        <li><strong>Attention solves this</strong> by learning weights that reflect how much to "listen to" each neighbor.</li>
        <li><strong>GATs compute attention</strong> by transforming features, computing compatibility scores, normalizing with softmax, and aggregating.</li>
        <li><strong>Multi-head attention</strong> lets the model capture different notions of relevance simultaneously.</li>
        <li><strong>Attention weights are task-dependent</strong> - they reflect what's useful for prediction, not necessarily human intuition about importance.</li>
        <li><strong>GATs have limitations</strong> - over-smoothing, heterogeneous graphs, computational cost - that you should be aware of.</li>
      </ul>
      <p>
        Working through GATs really helped me understand not just how they work, but why they're designed the way they are. The math is elegant, and the intuitions carry over to other attention-based architectures too.
      </p>
      <p>
        If you're working with graph data - whether that's social networks, molecules, knowledge graphs, or something else entirely - GATs are a powerful tool to have in your toolkit. And now you actually understand what's happening under the hood.
      </p>
      <p>
        Next up, I want to dig into some of the variants - like how Graph Transformers handle attention differently, or how heterogeneous graph networks extend these ideas to multi-relational data. But that's for another post.
      </p>
      <p>
        If you found this helpful or have questions, feel free to reach out on Twitter. I'm always happy to chat about this stuff.
      </p>
    </BlogLayout>
  )
}
