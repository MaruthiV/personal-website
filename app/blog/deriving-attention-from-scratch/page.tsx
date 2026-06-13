"use client"

import { BlogLayout } from "@/components/blog-layout"
import { MathBlock, M } from "@/components/math"
import { BottleneckDiagram, AttentionHeatmap, ParallelismDiagram } from "@/components/blog/attention-diagrams"

const toc = [
  { id: "the-claim", title: "The Claim", level: 1 },
  { id: "what-we-had", title: "1986: Training Neural Nets", level: 1 },
  { id: "language-problem", title: "1990: Language Doesn't Fit in a Box", level: 1 },
  { id: "vanishing-gradients", title: "1997: The First Crack", level: 1 },
  { id: "the-wall", title: "2014: Building a Translator", level: 1 },
  { id: "deriving-attention", title: "2014: Deriving Attention", level: 1 },
  { id: "what-do-we-want", title: "Start From What We Want", level: 2 },
  { id: "query-key", title: "Queries and Keys", level: 2 },
  { id: "dot-product", title: "Scoring With the Dot Product", level: 2 },
  { id: "softmax", title: "Turning Scores Into Weights", level: 2 },
  { id: "weighted-sum", title: "Blending the Values", level: 2 },
  { id: "the-formula", title: "The Whole Thing, in One Line", level: 2 },
  { id: "still-a-crutch", title: "It Works, But There's a Crutch", level: 1 },
  { id: "what-rnn-contributing", title: "2017: What Is the RNN For?", level: 1 },
  { id: "parallelism", title: "The Real Prize: Parallelism", level: 2 },
  { id: "positional-encoding", title: "Putting Order Back In", level: 2 },
  { id: "multi-head", title: "Many Questions at Once", level: 2 },
  { id: "feedforward", title: "Room to Think", level: 2 },
  { id: "three-things", title: "2018 On: The Three Things That Compounded", level: 1 },
  { id: "the-point", title: "The Point", level: 1 },
]

// Small helper for inline external links, styled to match the prose.
function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  )
}

export default function DerivingAttentionFromScratch() {
  return (
    <BlogLayout
      title="Why Attention Ended Up Being All We Needed: Deriving Attention from Scratch"
      date="Jun 12, 2026"
      toc={toc}
    >
      <section id="the-claim">
        <p>
          I wanted to actually understand how we got to ChatGPT, and it kept coming back to one
          mechanism called attention, from a 2017 paper with the slightly cocky title{" "}
          <em>Attention Is All You Need</em>. So I traced the whole path, from the first neural
          networks anyone could train up to modern chatbots, to see where attention fits and why it
          was the tipping point.
        </p>
        <p>
          The fun part is that attention doesn't come out of nowhere. It took real insight, and it
          took the field a long time, but once you sit with the problem it solves, the shape of the
          answer is already sitting there in the problem. So we'll walk the path in order, starting in
          the 1980s and asking, at each step, the same question the people at the time were asking.
          Hopefully by the end you'll see exactly how attention gets derived, and why it's the one
          piece modern chatbots couldn't exist without. Let's go.
        </p>
      </section>

      <h2 id="what-we-had">1986: Training Neural Nets</h2>
      <p>
        Quick background on what a neural network even is. You've got a bunch of numbers flowing
        through layers of mathematical operations, and at the end you get an output, something like
        "this email is spam" or "this image is a cat." The network has millions of internal knobs
        called weights, and training just means adjusting those knobs until the outputs come out
        right.
      </p>
      <p>
        The hard part is knowing which knobs to turn. You can measure how wrong the output is. That's
        the loss, basically a score of how bad the answer was. But there are millions of knobs, and
        you need to know which ones caused the error, and by how much.
      </p>
      <p>
        <Ref href="https://www.nature.com/articles/323533a0">Backpropagation</Ref> solves this. It's
        the chain rule from calculus, applied cleverly: start from the error at the output and work
        backwards through every layer, asking "how much did this knob contribute to that error?" What
        comes out is a gradient for every weight, a number telling you which direction to nudge that
        knob to make the output a little less wrong.
      </p>
      <p>
        Do that millions of times over millions of examples and the network learns. That's the whole
        foundation, and everything from here is built on top of it. The thing to carry forward is
        just this: we can train neural networks.
      </p>

      <h2 id="language-problem">1990: Language Doesn't Fit in a Box</h2>
      <p>
        Here's the new problem. A standard neural network takes a fixed-size input. You hand it 784
        numbers, a 28×28 image, and it hands back a category. The shape of the input is baked into
        the shape of the network.
      </p>
      <p>
        Language isn't like that. A sentence has variable length. "Hi" is two characters. "The quick
        brown fox jumped over the lazy dog" is much longer. There's no fixed-size box to pour it into.
      </p>
      <p>
        And the meaning of a word depends on the words around it. "Bank" means one thing in "river
        bank" and another in "bank account." So what we really need is an architecture that reads
        words one at a time and builds up meaning as it goes.
      </p>
      <p>
        That's the <Ref href="https://onlinelibrary.wiley.com/doi/10.1207/s15516709cog1402_1">RNN</Ref>,
        short for recurrent neural network. The idea is simple. You keep a hidden state, which is just
        a vector of numbers. Think of it as the model's working memory.
      </p>
      <p>
        Read word 1, and the hidden state updates. Read word 2, and it updates again, folding in the
        new word together with whatever the hidden state was already holding. Word 3, same thing. The
        memory carries forward as you go.
      </p>
      <p>The update rule is a single line:</p>
      <MathBlock>{"h_t = \\tanh\\!\\left(W \\cdot [\\,h_{t-1},\\, x_t\\,] + b\\right)"}</MathBlock>
      <p>
        Worth naming every piece. <M>{"x_t"}</M> is the current word, written as a vector.{" "}
        <M>{"h_{t-1}"}</M> is the previous hidden state, the memory so far. You stick them together,
        multiply by a weight matrix <M>W</M> that gets learned during training, add a learned bias{" "}
        <M>b</M>, and squash the result through <M>{"\\tanh"}</M>, a function that keeps every number
        between <M>{"-1"}</M> and <M>1</M> so things don't blow up. Out comes the new hidden state{" "}
        <M>{"h_t"}</M>.
      </p>
      <p>
        Read a sentence word by word and, at the end, that final hidden state is supposed to summarize
        the whole thing. Good enough for short sentences. Let's keep going.
      </p>

      <h2 id="vanishing-gradients">1997: The First Crack, Vanishing Gradients</h2>
      <p>
        Try training an RNN on long sequences and it just won't learn. The reason is the{" "}
        <Ref href="https://ieeexplore.ieee.org/document/279181">vanishing gradient problem</Ref>, and
        it's worth understanding because it's the first real crack in the wall.
      </p>
      <p>
        Remember that backprop flows gradients backwards to figure out which knobs to adjust. In an
        RNN you flow them backwards through time as well. Process 50 words, then backpropagate through
        all 50 steps.
      </p>
      <p>
        The trouble is that each step multiplies the gradient by the weight matrix and the{" "}
        <M>{"\\tanh"}</M> derivative. When those factors are a little less than 1, which they usually
        are, multiplying them together 50 times gives you something vanishingly small. By the time the
        signal reaches the early words, the update that should adjust them is effectively zero.
      </p>
      <p>
        So the early words stop contributing to training at all. The network literally cannot learn
        long-range dependencies. It forgets.
      </p>
      <p>
        Hochreiter and Schmidhuber's fix in 1997 was the{" "}
        <Ref href="https://www.bioinf.jku.at/publications/older/2604.pdf">LSTM</Ref>, short for long
        short-term memory. The key move is this: instead of one kind of memory that gets rewritten
        every step, use two.
      </p>
      <p>
        You keep the hidden state for short-term context, and you add a cell state, a separate highway
        of information that flows through time with much gentler edits. The cell state doesn't get
        overwritten each step. Instead, gates decide what to add to it, what to erase, and what to
        read out.
      </p>
      <p>
        A gate is just a sigmoid. It outputs a number between 0 and 1, where 0 means "block
        everything" and 1 means "let it all through." There's a forget gate (should we erase part of
        the cell state?), an input gate (should we write something new in?), and an output gate (what
        should we expose right now?). The gates are learned, so the network works out for itself
        what's worth keeping.
      </p>
      <p>
        This helps the vanishing gradient a lot, because information can ride the cell-state highway
        for many steps without getting multiplied away. LSTMs became state of the art for basically
        everything sequential, speech, translation, text, and stayed there for almost two decades.
      </p>
      <p>
        But notice what they don't fix. The architecture is still sequential: word 5 still has to wait
        for word 4. And the cell state, however cleverly gated, is still a single fixed-size vector.
        The shape of the problem hasn't actually changed. There's still a bottleneck, and it's worth
        holding onto that.
      </p>

      <h2 id="the-wall">2014: Building a Translator</h2>
      <p>
        Right, so now it's 2014. We want to build a system that translates French to English. We have
        LSTMs. The natural approach is a <Ref href="https://arxiv.org/abs/1409.3215">seq2seq</Ref>{" "}
        model, sequence to sequence. You have an encoder LSTM that reads the French sentence word by
        word and at the end produces one final hidden state. Then a decoder LSTM takes that final
        hidden state and generates English words one at a time.
      </p>
      <p>
        This works. It's actually deployed in production. But there's a clear pattern: short sentences
        translate well, long sentences degrade noticeably.
      </p>
      <p>
        And when you think about why, it's obvious. The encoder is reading, say, 30 French words and
        trying to compress all of that meaning into a single vector of maybe 512 numbers. That's the
        entire representation the decoder has to work from. It has to generate every English word, in
        the right order, from that one vector. For a long, complex sentence, that's an unreasonable
        amount of information to cram into 512 numbers. Some of it gets lost.
      </p>
      <figure className="my-10">
        <BottleneckDiagram />
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          Figure 1: The seq2seq bottleneck. The encoder reads every word, but the decoder only ever
          sees one fixed-size vector. The whole sentence has to squeeze through that single point, and
          for long sentences, information gets lost in the pinch.
        </figcaption>
      </figure>
      <p>
        Here's the analogy that makes it concrete. Imagine you're a translator and you read the whole
        French paragraph once, then you're not allowed to look at it again. You have to translate
        entirely from memory. For a short sentence, fine. For a long paragraph, you're going to miss
        things.
      </p>
      <p>
        What do actual human translators do? They glance back. When they're writing the English word
        for a specific French noun, they look back at that noun.
      </p>
      <p>So now you have the question on the whiteboard: why are we not letting the model look back?</p>

      <h2 id="deriving-attention">2014: Deriving Attention</h2>
      <p>
        Someone did ask exactly that, and acted on it. That someone was{" "}
        <Ref href="https://arxiv.org/abs/1409.0473">Dzmitry Bahdanau</Ref>, a PhD student working on
        this same translation problem. He looked at the seq2seq setup and asked: why does the decoder
        only get to see the final encoder state? The encoder produced a hidden state at every single
        step, <M>{"h_1, h_2, \\dots, h_n"}</M>, and we threw all of them away except the last one.
        Why?
      </p>
      <p>
        His idea was to stop throwing them away. Keep all of them. Then, at each decoding step, let
        the decoder look over the whole set and decide which ones matter right now.
      </p>
      <p>
        That's the goal in plain English. The rest of this section is just turning that sentence into
        math, one honest step at a time. And the thing worth watching for is how little cleverness
        each step takes on its own. Every piece ends up being close to the simplest thing that could
        possibly work, which is exactly why the result held up.
      </p>

      <h3 id="what-do-we-want">Start From What We Want</h3>
      <p>
        Let's think about the behavior we actually want, intuitively, before writing down a single
        symbol.
      </p>
      <p>
        Go back to the translator. The input is a French sentence and the model produces the English
        one word at a time. Take a concrete example: the French "Je mange du pain," which translates
        to "I eat bread." Those French words are the input the model reads, and "pain" is French for
        bread, "mange" is a form of "eat."
      </p>
      <p>
        Now picture the exact moment the decoder is about to produce the English word "bread." Which
        French words should it be leaning on? Obviously "pain," since that's the one that means bread.
        A little bit of the words around it for context, and basically none of the rest. A moment
        later, when it's about to produce "eat," the spotlight should swing over to "mange."
      </p>
      <p>
        So whatever we build needs two abilities. First, for the current step, score how relevant
        each input word is to what we're trying to produce right now. Second, use those scores to pull
        together a custom blend of the input, weighted toward the words that matter.
      </p>
      <p>
        That's the whole thing. Score, then blend. Everything that follows is just picking the
        simplest possible version of each.
      </p>

      <h3 id="query-key">Queries and Keys</h3>
      <p>
        To score relevance, you need two things to compare: what the decoder is looking for right now,
        and what each input word has to offer.
      </p>
      <p>
        Call the first one the <strong>query</strong>. It's a vector representing what the decoder
        wants at this step, since it's effectively querying the input. Call each of the second ones a{" "}
        <strong>key</strong>. There's one key per input word, and it's a vector advertising what that
        word is about, the thing you match the query against when you go looking.
      </p>
      <p>
        The names come from dictionaries, on purpose. A dictionary lookup takes a query, finds the key
        that matches, and returns its value. That's almost exactly what we're building, except soft,
        so the whole thing stays differentiable and we can actually train it.
      </p>
      <p>
        Where do the query and keys come from? You don't design them by hand. You let each be a small
        learned projection of the relevant hidden state, meaning you multiply that hidden state by a
        weight matrix the network learns. So the model itself gets to decide, over training, what
        "looking for" and "offering" should even mean. For now, just assume we've got a query vector{" "}
        <M>q</M> and a key vector <M>{"k_i"}</M> for each input position <M>i</M>.
      </p>

      <h3 id="dot-product">Scoring With the Dot Product</h3>
      <p>
        Now we need a single number that says how well query <M>q</M> matches key <M>{"k_i"}</M>.
        What's the simplest way to measure how much two vectors agree?
      </p>
      <p>The dot product.</p>
      <MathBlock>{"e_i = q \\cdot k_i = \\sum_{d} q_d \\, k_{i,d}"}</MathBlock>
      <p>
        Here's why it's the natural pick. The dot product is large and positive when two vectors point
        in the same direction, around zero when they're perpendicular, and negative when they point
        opposite ways. It's a similarity score almost by definition.
      </p>
      <p>
        And it lines up exactly with what we want training to do. If "relevant" is going to mean "the
        query and key agree," then we want the network to learn projections that make relevant pairs
        point the same way. The dot product rewards precisely that. We're not hand-coding what
        relevance is, we're handing the network a dial and letting the gradient decide what to do with
        it.
      </p>
      <p>
        Run this for every input word and you get a list of raw scores, one per position:{" "}
        <M>{"e_1, e_2, \\dots, e_n"}</M>. They're unbounded, though. Any of them could be huge, tiny,
        or negative, so they're not yet usable as "how much to pay attention." That's the next fix.
      </p>
      <p>
        One honest footnote: Bahdanau actually scored relevance with a small learned network rather
        than a bare dot product. The dot product is the cleaner choice we'd reach for today, and it's
        the one the transformer ends up using, so it's what we'll build on here.
      </p>

      <h3 id="softmax">Turning Scores Into Weights</h3>
      <p>
        We're about to blend the input words together using these scores, which means taking a
        weighted average. For a weighted average to even make sense, the weights have to be positive
        and they have to sum to 1. Raw dot products are neither.
      </p>
      <p>
        The standard tool that takes any list of numbers and turns it into positive weights that sum
        to 1 is the <strong>softmax</strong>. Exponentiate each score so everything comes out
        positive, then divide by the total so the whole set sums to 1.
      </p>
      <MathBlock>{"\\alpha_i = \\operatorname{softmax}(e)_i = \\frac{\\exp(e_i)}{\\sum_{j=1}^{n} \\exp(e_j)}"}</MathBlock>
      <p>
        Now <M>{"\\alpha_1, \\dots, \\alpha_n"}</M> are the attention weights, a genuine probability
        distribution over the input positions. You can read them straight off: this step put 70% of
        its attention on "pain," 15% on "du," and so on.
      </p>
      <p>
        The exponential isn't only there to force positivity. It also sharpens. A word that scores a
        bit higher than the rest ends up with a lot more weight than that small lead would suggest, so
        attention tends to commit to a few positions rather than smear itself evenly across all of
        them. Which is exactly the behavior we were after, a spotlight rather than a fog.
      </p>

      <h3 id="weighted-sum">Blending the Values</h3>
      <p>
        Last step. We've got weights saying how much each word matters. Now we actually pull the
        information across.
      </p>
      <p>
        What do we pull? Each input word contributes a <strong>value</strong> vector, the content we
        take away when we attend to it. In Bahdanau's original version the key and the value were the
        same encoder hidden state, but it's cleaner to keep them as two separate ideas: the key is
        what you match against, the value is what you walk away with. (The transformer later makes
        them genuinely separate projections, and it ends up mattering.)
      </p>
      <p>Take the weighted sum of the values, using the attention weights:</p>
      <MathBlock>{"c = \\sum_{i=1}^{n} \\alpha_i \\, v_i"}</MathBlock>
      <p>
        That's the context vector <M>c</M>, a single vector that's a custom blend of the input,
        concentrated on whichever words this step found relevant. The decoder uses it to produce the
        next English word, and then the whole process repeats for the next word, with a fresh query
        and a fresh blend.
      </p>

      <h3 id="the-formula">The Whole Thing, in One Line</h3>
      <p>Stack the three steps back together and read them as one recipe:</p>
      <MathBlock>{"c = \\sum_{i} \\underbrace{\\operatorname{softmax}_i\\big(q \\cdot k_i\\big)}_{\\text{how much to attend}} \\; \\underbrace{v_i}_{\\text{what to take}}"}</MathBlock>
      <p>
        Score with a dot product, normalize with a softmax, blend the values. That's attention. It's a
        soft, differentiable dictionary lookup, and because every operation in it is smooth, you can
        backpropagate straight through the whole thing and learn the projections that make the scoring
        come out right.
      </p>
      <p>
        Look back at what we just did, though. At no point did we reach for a trick. We wrote down the
        behavior we wanted, and at each step picked the simplest operation that produced it. Relevance
        between two vectors, so a dot product. Weights that average cleanly, so a softmax. Pulling the
        information across, so a weighted sum. The famous mechanism is really just those three plain
        choices stacked together. The insight was in asking for that behavior in the first place, and
        in trusting that something this simple would actually hold.
      </p>

      <h2 id="still-a-crutch">It Works, But There's a Crutch</h2>
      <p>
        Bahdanau bolted this onto the translator and the results jumped right away, especially on the
        long sentences that used to fall apart. The bottleneck was gone. The decoder no longer leaned
        on a single crushed-down vector, because it could reach back to any input word on demand.
      </p>
      <p>
        And you got something out of it nobody had before: you could see what the model was doing.
        Plot the attention weights as a grid and they're actually interpretable. "bread" lights up on
        "pain," "eat" lights up on "mange." Hidden states had always been an opaque smear of numbers.
        Attention, you could read.
      </p>
      <figure className="my-10">
        <AttentionHeatmap />
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          Figure 2: Attention weights for translating "Je mange du pain" into "I eat bread." Each row
          is an English word the decoder is producing; each column is a French input word. The brighter
          the cell, the more attention. "bread" leans on "pain," "eat" on "mange," exactly as you'd
          want, and you can read it straight off the grid.
        </figcaption>
      </figure>
      <p>
        But here's what Bahdanau's paper didn't do: it didn't question the RNN. Attention was an
        add-on sitting on top of an LSTM. The encoder still read the sentence one word at a time, each
        step waiting on the last. Training was still slow. The bottleneck had been bypassed, but the
        sequential machine underneath it was untouched.
      </p>
      <p>
        Attention was riding on top of the RNN like a passenger. It took three more years for someone
        to ask whether the RNN should be driving at all.
      </p>

      <h2 id="what-rnn-contributing">2017: What Is the RNN Even For?</h2>
      <p>
        By 2017, attention was everywhere. Everyone was bolting it onto their LSTM. And the{" "}
        <Ref href="https://arxiv.org/abs/1706.03762">Vaswani team</Ref> at Google asked the
        uncomfortable question:
      </p>
      <p>
        If attention is doing all the real work of routing information from the right places to the
        right places, what exactly is the RNN contributing?
      </p>
      <p>
        Think it through. The whole original case for the RNN was that its hidden state carries
        context along the sequence: word 5 knows about word 1 because the memory got passed forward,
        step by step. But attention already does that, and does it better. It gives every position a
        direct line to every other position. No relay, no game of telephone, no distance for the
        signal to fade over.
      </p>
      <p>So the RNN's sequential propagation is redundant. Attention already covers it.</p>
      <p>
        And it's worse than redundant, it's actively in the way. Let me make that precise, because
        it's the real reason the RNN had to go.
      </p>

      <h3 id="parallelism">The Real Prize: Parallelism</h3>
      <p>
        Sequential processing means you can't parallelize. To compute <M>{"h_5"}</M> you need{" "}
        <M>{"h_4"}</M>. To compute <M>{"h_4"}</M> you need <M>{"h_3"}</M>. The steps form a chain, and
        a chain has to be walked in order. There's no way to throw more hardware at a chain and make
        it go faster.
      </p>
      <p>
        That's the whole problem, because parallelism, doing many computations at the same time, is
        exactly what modern hardware is built for. A GPU has thousands of cores that tear through
        matrix multiplications all at once. An RNN can't touch that, because it's stuck feeding each
        step into the next.
      </p>
      <p>
        Now look at what pure attention does to that picture. Drop the RNN, and every token can compute
        its query, key, and value at the same time, and every token can attend to every other token at
        the same time. There's no ordering constraint left, because nothing is waiting on a previous
        hidden state.
      </p>
      <p>
        Better still, the whole operation collapses into matrix multiplications. Stack the queries into
        a matrix <M>Q</M>, the keys into <M>K</M>, the values into <M>V</M>. Then every pairwise score,
        every softmax, and every blend happens in one shot:
      </p>
      <MathBlock>{"\\operatorname{Attention}(Q, K, V) = \\operatorname{softmax}\\!\\left(\\frac{Q K^{\\top}}{\\sqrt{d_k}}\\right) V"}</MathBlock>
      <p>
        It's the same score, normalize, blend from before, just done for every position at once
        instead of one query at a time. <M>{"Q K^{\\top}"}</M> is every query dotted with every key,
        the full grid of scores. The softmax normalizes each row. Multiplying by <M>V</M> blends the
        values. One matrix multiply, one softmax, one more matrix multiply.
      </p>
      <p>
        The only unfamiliar symbol is the <M>{"\\sqrt{d_k}"}</M> in the denominator, and it's there for
        a pretty mundane reason. When the key dimension <M>{"d_k"}</M> is large, the dot products get
        large too, which pushes the softmax into a regime where it's basically all-or-nothing and the
        gradients dry up. Dividing by <M>{"\\sqrt{d_k}"}</M> scales the scores back into a reasonable
        range. It's a patch, not an idea.
      </p>
      <p>
        This is the trade that mattered. GPUs are extraordinarily good at exactly this kind of matrix
        multiplication, so you can churn through a sentence of a thousand words in roughly the time an
        RNN took to crawl through ten. We swapped a fundamentally sequential machine for a
        fundamentally parallel one.
      </p>
      <figure className="my-10">
        <ParallelismDiagram />
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          Figure 3: The RNN computes its tokens one at a time, so the same work takes four steps. The
          transformer does it all in one matrix multiply, finishing in a single step. That saved time is
          why transformers can train at scale.
        </figcaption>
      </figure>
      <p>
        But ripping out the RNN broke two things it had quietly been handling. Pure attention has no
        sense of order, and it's a fairly shallow operation. The transformer adds two pieces to patch
        exactly those holes, and both of them fall out of the constraints the same way everything else
        has.
      </p>

      <h3 id="positional-encoding">Putting Order Back In</h3>
      <p>
        Here's a strange property of the attention we just built: it has no idea about order. Attention
        treats its input as a set of positions, not a sequence. Shuffle the French words and the
        scores come out identical, because a dot product doesn't care where its inputs were sitting.
      </p>
      <p>
        For an RNN, order came for free. It read left to right, so position was baked into the process
        itself. But we just threw that machine out. So word order, which obviously matters enormously
        for language, has gone missing.
      </p>
      <p>
        The fix is direct. If order isn't in the process anymore, put it in the data. Add a{" "}
        <strong>positional encoding</strong> to each token vector, a pattern of numbers that depends
        only on the position, so a token at position 3 carries a "position 3" signature that's
        distinct from the same token at position 10. Now the dot products can pick up on position,
        because it's right there in the vectors being compared. Order, restored.
      </p>

      <h3 id="multi-head">Many Questions at Once</h3>
      <p>
        One more thing nags at a single attention operation. When the model is working on a word,
        there's usually more than one kind of relationship worth tracking at once. For a verb, you
        might care about its subject, its object, and its tense, all simultaneously. A single query has
        to mash all of those concerns into one vector and hope for the best.
      </p>
      <p>
        So don't make it choose. Run several attention operations in parallel, each with its own
        learned query, key, and value projections. That's <strong>multi-head attention</strong>. Each
        head is free to specialize, one chasing grammar, another tracking which words refer to the
        same thing, another doing something we don't even have a clean name for. Then you concatenate
        whatever the heads pulled and mix it back together.
      </p>
      <p>
        It costs almost nothing, because the heads run at the same time. It's the same parallel
        matrix-multiply story, just wider. We wanted to ask several questions of each word at once, and
        parallelism lets us, basically for free.
      </p>

      <h3 id="feedforward">Room to Think</h3>
      <p>
        Last gap. Attention, at heart, is a clever way to move information between positions. It
        routes, it gathers, it blends. What it doesn't do is much heavy nonlinear computation on the
        information once it's been gathered.
      </p>
      <p>
        So after each attention layer, hand every position a small feedforward network, a couple of
        dense layers applied to each position on its own. Attention decides what each position should
        be looking at, and the feedforward layer gives it room to actually transform what it found. The
        two alternate, stacked many times over.
      </p>
      <p>
        Put it all together. Attention to move information, positional encodings for order, multiple
        heads for multiple relationships, feedforward layers to do the computing, all wrapped in
        residual connections and stacked into a deep network. That's the <strong>transformer</strong>.
        And the title of the paper, <em>Attention Is All You Need</em>, is just the blunt answer to the
        question this section opened with. What was the RNN contributing? Nothing that attention
        couldn't do better.
      </p>

      <h2 id="three-things">2018 Onward: The Three Things That Compounded</h2>
      <p>
        Once the transformer existed, three things lined up that had never been able to line up before,
        and it's their product that produced the models people actually use.
      </p>
      <p>
        Attention gives you context with no real ceiling. Every token reaches every other token
        directly, so there's no bottleneck and nothing to forget. The transformer gives you
        parallelism, so you can train on hundreds of billions of words across thousands of GPUs at
        once, which on an RNN would have taken something closer to centuries than months. And
        next-token prediction gives you infinite free training data, because every sentence ever
        written is already a training example. The label is just the next word, so no human has to
        label anything.
      </p>
      <p>
        Stack those together and scale takes over.{" "}
        <Ref href="https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf">GPT-1</Ref>{" "}
        in 2018 was small but proved the recipe worked.{" "}
        <Ref href="https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf">GPT-2</Ref>{" "}
        in 2019 was bigger and started producing unsettlingly coherent paragraphs.{" "}
        <Ref href="https://arxiv.org/abs/2005.14165">GPT-3</Ref> in 2020 was 175 billion parameters and
        began doing things nobody had explicitly trained it to do, translating, writing code, answering
        questions with the appearance of reasoning. Capability showing up out of sheer scale.
      </p>
      <p>
        ChatGPT in 2022 was roughly GPT-3.5 plus{" "}
        <Ref href="https://arxiv.org/abs/2203.02155">RLHF</Ref>, a training step where humans rate
        outputs and the model is tuned toward the ones people prefer. That's the part that made it feel
        like a conversation instead of an autocomplete. But it was a coat of polish on top of the real
        unlock, not the unlock itself.
      </p>
      <p>All three legs were necessary. Attention was the one holding up the other two.</p>

      <h2 id="the-point">The Point</h2>
      <p>
        The transformer wasn't conjured out of thin air. It's what you arrive at by asking "why can't
        we just..." over and over and following each answer to the next question.
      </p>
      <p>
        Why can't the model handle variable-length input? Build an RNN. Why does it forget? Add a gated
        memory. Why does the translator choke on long sentences? Let the decoder look back. How does it
        decide where to look? Score with a dot product, normalize, blend, and there's attention. If
        attention is doing the routing, what's the RNN even for? Nothing, so drop it, and to make that
        work, put order back into the data and let the whole thing run in parallel. There's the
        transformer.
      </p>
      <p>
        Every step is a local, almost forced response to the previous failure. The RNN was a historical
        artifact of treating a sequence as something that has to be processed in time, one step after
        another. Attention reframes it: a sequence is just a set of positions, and understanding it
        means working out which positions matter to which others. Once you see it that way,
        dot-product attention stops looking like a leap and starts looking like the obvious move. The
        hard part, really, was asking the question plainly enough to see it. It took the field the
        better part of three decades to get there.
      </p>
    </BlogLayout>
  )
}
