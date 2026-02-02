"use client"

import { BlogLayout } from "@/components/blog-layout"

const toc = [
  { id: "intro", title: "Introduction", level: 1 },
  { id: "sequential-problem", title: "The Sequential Agent Problem", level: 1 },
  { id: "wall-clock-pain", title: "The Wall-Clock Pain", level: 2 },
  { id: "critical-path", title: "Critical Path vs Total Work", level: 1 },
  { id: "amdahls-law", title: "Amdahl's Law for Agents", level: 2 },
  { id: "what-is-swarm", title: "What 'Agent Swarm' Actually Means", level: 1 },
  { id: "orchestrator-architecture", title: "The Orchestrator Architecture", level: 2 },
  { id: "trained-not-hacked", title: "Trained, Not Prompt-Hacked", level: 1 },
  { id: "parl-explained", title: "PARL Explained", level: 2 },
  { id: "critical-steps", title: "The Critical Steps Metric", level: 1 },
  { id: "credit-assignment", title: "The Credit Assignment Problem", level: 1 },
  { id: "blame-in-parallel", title: "Blame in Parallel Systems", level: 2 },
  { id: "failure-modes", title: "Failure Modes of Swarms", level: 1 },
  { id: "when-swarms-help", title: "When Swarms Help vs Hurt", level: 1 },
  { id: "connection-to-gat", title: "The Connection to Message Passing", level: 1 },
  { id: "conclusion", title: "Conclusion", level: 1 },
]

export default function HowAgentSwarmsWork() {
  return (
    <BlogLayout
      title="How Agent Swarms Actually Work"
      date="Feb 2, 2026"
      toc={toc}
    >
      <section id="intro">
        <p>
          If you've used AI coding assistants or chatbots with tool use, you know the feeling. You ask it to do something moderately complex, and then you wait. And wait. The agent thinks, calls a tool, waits for the result, thinks again, calls another tool, waits again. Each step is sequential. Each step adds latency.
        </p>
        <p>
          I've been building with agents at work, and this sequential bottleneck has been driving me crazy. A task that conceptually should take seconds ends up taking minutes because the agent can only do one thing at a time. It's like having a brilliant assistant who can only use one hand.
        </p>
        <p>
          So when I started hearing about "agent swarms" - systems that spawn multiple sub-agents working in parallel - I got curious. But I also got skeptical. Is this just marketing hype? Is "more agents" really different from "more prompts"? What does it actually mean for a swarm to be <em>trained</em> rather than just prompt-engineered?
        </p>
        <p>
          I went down the rabbit hole. I read the Kimi K2.5 technical report, dug into the research on multi-agent reinforcement learning, and tried to understand what's actually going on under the hood. And here's what I found: the shift from sequential to parallel agents isn't just an optimization - it fundamentally changes the failure modes, the training challenges, and even what "intelligence" means in this context.
        </p>
        <p>
          This post is my attempt to explain agent swarms the way I wish someone had explained them to me. By the end, you should be able to answer these questions:
        </p>
        <ul>
          <li>What does it mean for an agent swarm to be trained, not prompt-hacked?</li>
          <li>Why does parallelism change the failure modes compared to single-agent tool use?</li>
          <li>What's the real bottleneck: model intelligence or critical-path latency?</li>
          <li>How do you assign credit/blame when parallel branches produce a wrong answer?</li>
          <li>When do swarms actually help vs. when are they overkill?</li>
        </ul>
        <p>Let's dig in.</p>
      </section>

      <h2 id="sequential-problem">The Sequential Agent Problem</h2>
      <p>
        Let's start with how most AI agents work today. Whether you're using ChatGPT with plugins, Claude with computer use, or some custom agent framework, the basic loop looks the same:
      </p>
      <ol>
        <li><strong>Think</strong>: The model reasons about what to do next</li>
        <li><strong>Act</strong>: It calls a tool (search, code execution, API call, etc.)</li>
        <li><strong>Observe</strong>: It receives the tool's output</li>
        <li><strong>Repeat</strong>: Back to thinking, incorporating the new information</li>
      </ol>
      <p>
        This is the ReAct pattern, and it works. But there's a problem hiding in plain sight.
      </p>

      <h3 id="wall-clock-pain">The Wall-Clock Pain</h3>
      <p>
        Every iteration through this loop takes time. The model needs to generate tokens (let's say 1-2 seconds). The tool call needs to execute (maybe 2-5 seconds for an API call or file operation). Then the model processes the result and generates more tokens.
      </p>
      <p>
        For a simple task - "what's the weather in New York?" - this is fine. One tool call, done.
      </p>
      <p>
        But for complex tasks, the number of steps explodes. Consider a coding task: "Find the bug in this codebase, write a fix, and verify it works." That might involve:
      </p>
      <ul>
        <li>Reading 5-10 files to understand the codebase</li>
        <li>Searching for relevant functions</li>
        <li>Running the existing tests to see the failure</li>
        <li>Writing a fix</li>
        <li>Running tests again</li>
        <li>Maybe iterating if the fix didn't work</li>
      </ul>
      <p>
        That's easily 20+ tool calls. If each cycle takes 5 seconds, you're looking at nearly 2 minutes of wall-clock time - even though the actual "thinking" work might only be a few seconds total.
      </p>
      <p>
        <strong>The insight</strong>: The bottleneck isn't the total amount of work. It's the <em>sequential dependency chain</em>. You can't run test number 2 until test number 1 finishes. You can't write the fix until you've read the files. Every step depends on the previous one.
      </p>
      <p>
        Or does it?
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/swarms/swarms - fig 1.png"
          alt="Sequential agent loop showing Think → Tool → Think → Tool chain with time delays between each step"
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 1: The sequential agent loop. Each step waits for the previous one, and the delays add up.
        </figcaption>
      </figure>

      <h2 id="critical-path">Critical Path vs Total Work</h2>
      <p>
        Here's a mental model that changed how I think about agent efficiency. I call it the "physics of agents," and it boils down to two concepts:
      </p>
      <p>
        <strong>Total work</strong>: The sum of all operations that need to happen. If you need 20 tool calls, your total work is 20 tool calls.
      </p>
      <p>
        <strong>Critical path</strong>: The longest chain of operations where each step depends on the previous one. This is what actually determines how long the task takes.
      </p>
      <p>
        Let me give you a concrete example. Say you're researching a topic and need to:
      </p>
      <ul>
        <li>Search 3 different databases</li>
        <li>Read 4 academic papers</li>
        <li>Synthesize everything into a summary</li>
      </ul>
      <p>
        In a sequential agent, you'd do these one at a time: search 1, search 2, search 3, read paper 1, read paper 2, etc. Total time = sum of all operations.
      </p>
      <p>
        But here's the thing: the three searches don't depend on each other. Neither do reading the four papers (once you have them). The only true dependency is that synthesis needs all the inputs.
      </p>
      <p>
        If you could parallelize:
      </p>
      <ul>
        <li>Run all 3 searches simultaneously → time = max(search times), not sum</li>
        <li>Read all 4 papers simultaneously → time = max(read times), not sum</li>
        <li>Then synthesize</li>
      </ul>
      <p>
        The critical path drops from ~8 sequential steps to ~3 parallel stages. Same total work, fraction of the time.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/swarms/swarms - fig 2.png"
          alt="DAG showing critical path highlighted - the longest dependency chain determines total time, not total work"
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 2: Critical path vs total work. The highlighted path is what determines total time - parallel branches finish early but you still wait for the longest chain.
        </figcaption>
      </figure>

      <h3 id="amdahls-law">Amdahl's Law for Agents</h3>
      <p>
        If you've studied parallel computing, you might recognize this as Amdahl's Law in disguise. The law says that the speedup from parallelization is limited by the sequential portion of your task.
      </p>
      <p>
        If 50% of your work is inherently sequential (step B must follow step A), then even with infinite parallelism, you can only get a 2x speedup. The sequential portion becomes the bottleneck.
      </p>
      <p>
        For agents, this has a clear implication: <strong>the real bottleneck isn't model intelligence or total compute - it's critical-path latency</strong>. A smarter model that still runs sequentially will still be slow. A dumber model that can parallelize effectively might finish faster.
      </p>
      <p>
        This is why "agent swarms" matter. It's not about having more agents for the sake of it. It's about shortening the critical path.
      </p>

      <h2 id="what-is-swarm">What "Agent Swarm" Actually Means</h2>
      <p>
        Okay, so parallelism is good. But what does an "agent swarm" actually look like? Is it just running multiple prompts at once?
      </p>
      <p>
        Not quite. And this distinction matters.
      </p>
      <p>
        <strong>Fake parallelism</strong>: You could take any agent and just run 5 copies of it on different parts of a problem. But this doesn't actually help if:
      </p>
      <ul>
        <li>The copies don't know about each other and duplicate work</li>
        <li>The task has dependencies that aren't respected</li>
        <li>There's no way to meaningfully merge the results</li>
      </ul>
      <p>
        <strong>Real parallelism</strong> requires something smarter: a system that understands the task structure, figures out what can be parallelized, spawns the right sub-agents, and coordinates their outputs.
      </p>

      <h3 id="orchestrator-architecture">The Orchestrator Architecture</h3>
      <p>
        The architecture that's emerged for this looks like a hub-and-spoke model:
      </p>
      <ul>
        <li><strong>Orchestrator</strong>: A central agent that receives the task, decomposes it into subtasks, and decides which can run in parallel</li>
        <li><strong>Sub-agents</strong>: Specialized (or general-purpose) agents that each handle a subtask</li>
        <li><strong>Merge step</strong>: The orchestrator collects results and synthesizes the final output</li>
      </ul>
      <p>
        Kimi K2.5, which I've been studying as a case study, takes this to an extreme. According to their technical report, their Agent Swarm can:
      </p>
      <ul>
        <li>Spawn up to <strong>100 sub-agents</strong> dynamically</li>
        <li>Coordinate up to <strong>1,500 tool calls</strong> across them</li>
        <li>Achieve <strong>4.5x wall-clock speedup</strong> compared to single-agent execution</li>
      </ul>
      <p>
        The key word there is "dynamically." The orchestrator doesn't follow a fixed workflow. It looks at the task and decides, on the fly, how to decompose it. Maybe this task needs 3 sub-agents. Maybe that one needs 50. The decomposition itself is learned.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/swarms/swarms - fig 3.png"
          alt="Orchestrator architecture: central orchestrator spawns sub-agents (Researcher, Coder, Verifier) that run in parallel and merge results back"
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 3: The orchestrator architecture. The orchestrator decides what to parallelize, spawns sub-agents, and merges their results.
        </figcaption>
      </figure>

      <h2 id="trained-not-hacked">Trained, Not Prompt-Hacked</h2>
      <p>
        Here's where it gets interesting. You could build the orchestrator architecture I just described with clever prompting:
      </p>
      <p>
        <em>"You are a task orchestrator. Given a complex task, break it into subtasks. For each subtask that doesn't depend on others, spawn a sub-agent. Wait for results. Synthesize."</em>
      </p>
      <p>
        This is what I'd call "prompt-hacking" - using instructions to get emergent behavior from a model that wasn't specifically trained for it. It can work! But it's brittle. The model might:
      </p>
      <ul>
        <li>Over-decompose (spawn 50 agents for a task that needs 2)</li>
        <li>Under-decompose (do everything sequentially despite parallelization opportunity)</li>
        <li>Miss dependencies (run step B before step A completes)</li>
        <li>Struggle with the merge step (can't synthesize 20 partial results coherently)</li>
      </ul>
      <p>
        The alternative is to <em>train</em> the orchestration behavior directly. Make parallelism a learned skill, not an emergent hack.
      </p>

      <h3 id="parl-explained">PARL Explained</h3>
      <p>
        Kimi K2.5 uses something they call PARL - Parallel-Agent Reinforcement Learning. The core idea is elegant, and it addresses a fundamental training challenge.
      </p>
      <p>
        <strong>The problem</strong>: If you just train on task success (did the agent get the right answer?), the model has no incentive to parallelize. Sequential execution works fine for getting correct answers - it's just slow. From the model's perspective during training, why bother with the complexity of spawning sub-agents?
      </p>
      <p>
        <strong>The solution</strong>: Staged reward shaping that explicitly rewards parallelism early in training.
      </p>
      <p>
        PARL uses two reward components:
      </p>
      <ol>
        <li><strong>Instantiation reward</strong>: Rewards the model for spawning sub-agents and running them concurrently. This is high early in training.</li>
        <li><strong>Task outcome reward</strong>: Rewards the model for actually completing the task correctly. This becomes dominant later in training.</li>
      </ol>
      <p>
        The balance between these is controlled by a parameter λ that anneals from 0.1 to 0.0 over the course of training. Early on, the model gets significant reward just for attempting parallelism. Later, it only gets reward for parallelism that actually helps task completion.
      </p>
      <p>
        There's also a clever trick: they introduce a "computational bottleneck that makes sequential execution impractical." Essentially, they make the training environment hostile to sequential approaches, forcing the model to discover parallel strategies.
      </p>
      <p>
        The result is a model that doesn't just <em>can</em> parallelize - it <em>knows when to</em> parallelize. That's the difference between a skill and a hack.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/swarms/swarms - fig 4.png"
          alt="PARL training curves: instantiation reward starts high and decreases, task outcome reward starts low and increases, crossing at lambda annealing point"
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 4: PARL's staged reward shaping. Early training rewards spawning sub-agents; later training shifts focus to task success.
        </figcaption>
      </figure>

      <h2 id="critical-steps">The Critical Steps Metric</h2>
      <p>
        If you want to measure whether parallelism is actually helping, you need the right metric. "Total tool calls" is misleading - you could make 1,000 parallel calls, but if they're all redundant, you've wasted compute without reducing latency.
      </p>
      <p>
        K2.5 introduces what they call "Critical Steps" - a latency-oriented metric inspired by critical path analysis:
      </p>
      <p>
        <strong>Critical Steps = Σ(orchestration overhead + max sub-agent time per stage)</strong>
      </p>
      <p>
        In other words: for each "stage" of parallel execution, you count only the slowest sub-agent (since you have to wait for all of them anyway). Then you sum across stages, plus any orchestration overhead.
      </p>
      <p>
        Let me make this concrete with numbers:
      </p>
      <p>
        <strong>Sequential execution</strong>:
      </p>
      <ul>
        <li>20 tool calls × 2 seconds each = 40 seconds</li>
      </ul>
      <p>
        <strong>Parallel execution (4 branches of 5 tool calls each)</strong>:
      </p>
      <ul>
        <li>Stage 1: max(5 calls × 2 sec) = 10 seconds (all branches run in parallel)</li>
        <li>Plus orchestration overhead: ~2 seconds</li>
        <li>Total: 12 seconds</li>
      </ul>
      <p>
        Same 20 tool calls, 3.3x faster. But this only works if the branches are truly independent! If branch 2 secretly depends on branch 1's output, you're back to sequential.
      </p>
      <p>
        The Critical Steps metric captures this: it only rewards parallelism that actually shortens the critical path. Spawning more sub-agents doesn't help your score unless they're doing genuinely parallel work.
      </p>

      <h2 id="credit-assignment">The Credit Assignment Problem</h2>
      <p>
        Now we get to what I think is the hardest part of training agent swarms - and something that's not talked about enough.
      </p>
      <p>
        In a sequential agent, if something goes wrong, debugging is relatively straightforward. You can look at the trace:
      </p>
      <ul>
        <li>Step 1: Read file → worked</li>
        <li>Step 2: Parse data → worked</li>
        <li>Step 3: Make API call → <strong>failed</strong></li>
        <li>Step 4: Never reached</li>
      </ul>
      <p>
        Step 3 is the problem. You know exactly where to look.
      </p>

      <h3 id="blame-in-parallel">Blame in Parallel Systems</h3>
      <p>
        In a parallel system, this gets much harder. Imagine:
      </p>
      <ul>
        <li>Sub-agent A: Researches topic X → returns result A</li>
        <li>Sub-agent B: Researches topic Y → returns result B</li>
        <li>Sub-agent C: Researches topic Z → returns result C</li>
        <li>Orchestrator: Merges A, B, C → produces wrong final answer</li>
      </ul>
      <p>
        Where did it go wrong? Maybe result B was subtly incorrect. Maybe results A and C were fine but contradicted each other. Maybe the merge logic itself was flawed. Maybe B was actually fine but got drowned out by A and C.
      </p>
      <p>
        This is the <strong>credit assignment problem</strong>, and it's combinatorial. With n branches, there are 2^n possible combinations of "which branches contributed to the failure." For 10 branches, that's over 1,000 possibilities. For 100 branches (K2.5's max), it's... a lot.
      </p>
      <p>
        This matters for training because reinforcement learning depends on assigning credit. If the final answer is wrong, you need to adjust the behavior that caused it. But if you can't figure out <em>which</em> behavior caused it, you can't learn effectively.
      </p>
      <p>
        The research literature on multi-agent RL has developed various approaches to this:
      </p>
      <ul>
        <li><strong>Value decomposition</strong>: Try to decompose the global reward into per-agent contributions (VDN, QMIX)</li>
        <li><strong>Per-branch intermediate rewards</strong>: Give feedback to each sub-agent individually, not just at the end</li>
        <li><strong>Trajectory-level analysis</strong>: Look at the full execution trace to identify problematic patterns</li>
      </ul>
      <p>
        I suspect PARL does some combination of these, though the exact details aren't public. What I can say is that this is fundamentally harder than single-agent RL, and it's one of the reasons "just spawn more agents" doesn't automatically work.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/swarms/swarms - fig 5 .png"
          alt="Credit assignment ambiguity: three branches A, B, C all look correct but merge produces wrong answer - which branch caused the failure?"
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 5: The credit assignment problem. All branches look correct, but the final answer is wrong. Which branch caused the failure?
        </figcaption>
      </figure>

      <h2 id="failure-modes">Failure Modes of Swarms</h2>
      <p>
        Let's be honest about when swarms go wrong. This isn't just theoretical - these failure modes show up in practice, and understanding them helps you know when <em>not</em> to use swarms.
      </p>
      <p>
        <strong>1. Serial Collapse</strong>
      </p>
      <p>
        This is the most common failure mode: the orchestrator has the ability to spawn parallel sub-agents but defaults to sequential execution anyway. It's like having 10 employees available but still doing everything yourself.
      </p>
      <p>
        Why does this happen? Sequential execution is "safer" from the model's perspective. There are fewer moving parts, less coordination required, lower risk of conflicting outputs. Without explicit training pressure (like PARL's instantiation reward), models naturally drift toward sequential approaches.
      </p>
      <p>
        <strong>2. Fake Parallelism</strong>
      </p>
      <p>
        The model spawns multiple sub-agents, but the work isn't actually independent. Maybe sub-agent B is secretly waiting for sub-agent A's output before it can proceed. The DAG looks parallel, but the execution is still sequential.
      </p>
      <p>
        This is particularly insidious because it <em>looks</em> like the system is working correctly. You see multiple agents, you see parallel execution, but your wall-clock time doesn't improve.
      </p>
      <p>
        <strong>3. Coordination Overhead (The Telephone Game)</strong>
      </p>
      <p>
        Every time information passes between agents, there's a risk of degradation. The orchestrator summarizes the task for sub-agents. Sub-agents summarize their results for the orchestrator. Each summarization loses nuance.
      </p>
      <p>
        Research from Anthropic found that in some multi-agent setups, "subagents spent more tokens on coordination than on actual work." When coordination overhead exceeds the parallelism benefit, you've made things worse.
      </p>
      <p>
        <strong>4. Error Propagation</strong>
      </p>
      <p>
        A swarm is only as good as its weakest link. If one sub-agent consistently produces bad output, it can poison the entire merge step. Unlike sequential execution where you can potentially catch and correct errors, parallel execution commits to all branches simultaneously.
      </p>
      <p>
        <strong>5. Agent Overwhelm</strong>
      </p>
      <p>
        This is like "overthinking" but for multi-agent systems. Too many sub-agents produce too many inputs, and the orchestrator or downstream agents can't process them all coherently. The system generates more information than it can synthesize.
      </p>

      <h2 id="when-swarms-help">When Swarms Help vs Hurt</h2>
      <p>
        Given all these failure modes, when should you actually use swarms?
      </p>
      <p>
        <strong>Swarms help when:</strong>
      </p>
      <ul>
        <li><strong>Wide search problems</strong>: Exploring multiple solution paths simultaneously. If you're searching for a bug that could be in any of 10 modules, checking all 10 in parallel beats checking them one by one.</li>
        <li><strong>Verification tasks</strong>: Multiple independent checkers catch different types of errors. One agent checks logic, another checks formatting, another checks security.</li>
        <li><strong>Multi-source synthesis</strong>: Gathering information from many independent sources. Research across multiple databases, APIs, or documents.</li>
        <li><strong>"Committee" decisions</strong>: When you want multiple perspectives and can meaningfully aggregate them. Code review by multiple agents, each focusing on different aspects.</li>
        <li><strong>Context overflow</strong>: When a single agent's context window can't hold all the necessary information, but you can distribute it across multiple specialized agents.</li>
      </ul>
      <p>
        <strong>Swarms hurt when:</strong>
      </p>
      <ul>
        <li><strong>Tightly-coupled reasoning</strong>: When every step depends on every other step. Mathematical proofs, complex logical arguments, chain-of-thought that can't be decomposed.</li>
        <li><strong>Rate-limited APIs</strong>: If your parallel tool calls all hit the same rate limit, parallelism doesn't help - it just generates errors faster.</li>
        <li><strong>Single agent suffices</strong>: If the task is simple enough that one agent can handle it cleanly, the coordination overhead of a swarm just makes things worse.</li>
        <li><strong>Lack of architectural understanding</strong>: If agents don't understand how pieces fit together, parallel failures become parallel disasters. As one researcher put it: "Perfect agent coordination accelerates failure when agents lack architectural understanding."</li>
      </ul>

      <figure className="my-8">
        <img
          src="/images/blog/swarms/swarms - fig 6.png"
          alt="When swarms help vs hurt: left side shows wide search, verification, independent tasks; right side shows tightly coupled, rate limits, single agent suffices"
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 6: When swarms help vs hurt. Parallelize only when tasks are truly independent.
        </figcaption>
      </figure>

      <p>
        <strong>The honest advice</strong>: Start with a single agent. Master prompt engineering and context management. Understand your task's true dependencies. Measure actual parallelization potential. Only when you hit genuine single-agent limitations should you consider swarms.
      </p>
      <p>
        Anthropic's multi-agent documentation puts it well: "A well-designed single agent with appropriate tools can accomplish far more than many developers expect."
      </p>

      <h2 id="connection-to-gat">The Connection to Message Passing</h2>
      <p>
        If you read my previous post on Graph Attention Networks, you might notice something familiar here.
      </p>
      <p>
        In GATs, we had nodes in a graph passing messages to each other. Each node aggregated information from its neighbors, with attention weights determining how much to listen to each neighbor. The key insight was that not all neighbors are equally important - the network learns which connections matter.
      </p>
      <p>
        Agent swarms have the same structure. The orchestrator is a central node. Sub-agents are neighbors. The orchestrator decides which sub-agents to spawn (which "edges" to create), and when aggregating results, it implicitly weights them (attention over sub-agent outputs).
      </p>
      <p>
        But there's a twist: the swarm graph is <em>dynamic</em>. In a GAT, the graph structure is fixed - you're learning weights over existing edges. In a swarm, the structure itself changes during execution. At t=0, you have just the orchestrator. At t=1, it spawns 5 sub-agents (5 new edges). At t=2, some sub-agents finish and their edges disappear. At t=3, maybe new sub-agents spawn based on intermediate results.
      </p>
      <p>
        This is why I think of swarm orchestration as "message passing over a dynamic graph." The orchestrator is learning not just which edges to weight highly, but which edges to create in the first place.
      </p>
      <p>
        If that sounds hard to train, it is. But it's also why trained orchestration (PARL) beats prompt-hacked orchestration. Learning to construct the right graph is a skill that improves with practice.
      </p>

      <figure className="my-8">
        <img
          src="/images/blog/swarms/swarms - fig 7.png"
          alt="Swarm as dynamic graph: T=0 shows orchestrator alone, T=1 shows spawned sub-agents with attention weights, T=2 shows results flowing back"
          className="w-full rounded-lg"
        />
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          Figure 7: The swarm as a dynamic graph. The structure grows and shrinks during execution - compare to message passing in GATs.
        </figcaption>
      </figure>

      <h2 id="conclusion">Conclusion</h2>
      <p>
        Let me leave you with the key insight that ties this all together:
      </p>
      <p>
        <strong>"Scaling out changes the unit of intelligence from a single chain-of-thought to a coordination policy."</strong>
      </p>
      <p>
        In a single agent, intelligence is about generating the right sequence of thoughts and actions. In a swarm, intelligence is about decomposing problems, delegating appropriately, and synthesizing results. It's a different skill.
      </p>
      <p>
        To recap the five questions we set out to answer:
      </p>
      <ol>
        <li><strong>What does it mean for a swarm to be trained?</strong> It means the orchestration behavior - when to parallelize, how to decompose, how to merge - is learned through reinforcement learning (like PARL), not hand-coded through prompts.</li>
        <li><strong>Why does parallelism change failure modes?</strong> New failure modes emerge: serial collapse, fake parallelism, coordination overhead, error propagation, and agent overwhelm. These don't exist in sequential systems.</li>
        <li><strong>What's the real bottleneck?</strong> Critical-path latency, not total work. Parallelism helps only when it shortens the critical path.</li>
        <li><strong>How do you assign credit/blame?</strong> It's hard. With n parallel branches, there are 2^n possible blame attributions. This is an active research area in multi-agent RL.</li>
        <li><strong>When do swarms help vs hurt?</strong> They help for wide search, verification, multi-source synthesis, and committee decisions. They hurt for tightly-coupled reasoning, rate-limited APIs, or when a single agent suffices.</li>
      </ol>
      <p>
        I'm still exploring this space. The next things I want to dig into are heterogeneous swarms (where different sub-agents have different capabilities) and hierarchical orchestration (orchestrators that spawn orchestrators). But that's for another post.
      </p>
      <p>
        If you're building with agents and hitting the sequential bottleneck, I hope this gave you a framework for thinking about when and how parallelism might help. And if you're skeptical of the hype around "agent swarms" - good. A healthy skepticism will serve you better than blindly adding more agents.
      </p>
      <p>
        As always, feel free to reach out on Twitter if you have questions or want to chat about this stuff.
      </p>
    </BlogLayout>
  )
}
