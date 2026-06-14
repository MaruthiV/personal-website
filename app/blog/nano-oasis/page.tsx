"use client"

import Image from "next/image"
import { BlogLayout } from "@/components/blog-layout"
import { MathBlock, M } from "@/components/math"

const toc = [
  { id: "intro", title: "No Game Engine", level: 1 },
  { id: "world-model", title: "What a World Model Is", level: 1 },
  { id: "failure-boring", title: "Failure #1: Too Boring", level: 1 },
  { id: "failure-breakout", title: "Failure #2: Fighting a Ball", level: 1 },
  { id: "reframe", title: "The Reframe", level: 1 },
  { id: "snake-works", title: "Snake Works (Eventually)", level: 1 },
  { id: "the-math", title: "How It Actually Works", level: 1 },
  { id: "browser", title: "Into the Browser", level: 1 },
  { id: "cost", title: "What It Cost", level: 1 },
  { id: "try-it", title: "Try It, Fork It", level: 1 },
]

// Small helper for inline external links, styled to match the prose.
function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  )
}

// Figure helper. `strip` mode keeps a wide filmstrip legible by holding a fixed
// height and letting it scroll horizontally; the default mode centers an image
// at an optional max width so small pixel-art GIFs aren't blown up and blurred.
function Figure({
  src,
  alt,
  caption,
  width,
  height,
  maxWidth,
  strip = false,
}: {
  src: string
  alt: string
  caption: string
  width: number
  height: number
  maxWidth?: number
  strip?: boolean
}) {
  return (
    <figure className="my-8">
      {strip ? (
        <div className="overflow-x-auto rounded-lg border">
          <Image src={src} alt={alt} width={width} height={height} className="h-28 w-auto max-w-none" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="mx-auto h-auto w-full rounded-lg border"
          style={maxWidth ? { maxWidth } : undefined}
        />
      )}
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  )
}

export default function NanoOasis() {
  return (
    <BlogLayout
      title="There Is No Game Engine: Building a Diffusion World Model"
      date="Jun 14, 2026"
      toc={toc}
    >
      <section id="intro">
        <p>
          Open{" "}
          <Ref href="https://nano-oasis.vercel.app">the demo</Ref>, press the arrow keys, and play a
          game of Snake.
        </p>
        <p>
          Here is the strange part: there is no game engine. No grid, no collision code, no{" "}
          <code>if ate_apple: grow()</code>. Every frame you see is being hallucinated, one at a time,
          by a neural network reacting to your keypresses. The snake, the apple, the way the body grows
          when you eat, the way you die when you hit a wall: the model learned all of it from watching
          pixels, and now it <em>is</em> the game.
        </p>

        <Figure
          src="/images/blog/nano-oasis/snake-demo.gif"
          alt="The model generating Snake, frame by frame"
          caption="The model generating Snake one frame at a time. No engine underneath — every pixel is a prediction."
          width={560}
          height={424}
          maxWidth={520}
        />

        <p>
          I built this to understand a class of models called <strong>diffusion world models</strong>,
          the same idea behind projects like Oasis, GameNGen, and DIAMOND. Those are big and impressive
          and mostly opaque. I wanted the small, readable version: the whole thing in about 2,400 lines
          of Python, trainable end to end for under $50, running in your browser. I called it nanoOasis.
        </p>
        <p>
          This post is the honest story of building it, which means it is mostly a story about failure.
          The model you can play today is the <em>fourth</em> game I tried to make a network learn, and
          it only works because I eventually stopped trying to make the model smarter and started making
          the problem easier. That turned out to be the whole lesson.
        </p>
      </section>

      <h2 id="world-model">What a world model actually is</h2>
      <p>
        A normal game has an engine: code that holds the state of the world and updates it. A{" "}
        <strong>world model</strong> replaces that engine with a neural network. You show it the last
        few frames and the button you just pressed, and it predicts what the next frame should look
        like. Feed that prediction back in as history, predict again, and again, and you have something
        you can play. The "engine" is just the model running in a loop.
      </p>
      <p>The version I built has three pieces:</p>

      <Figure
        src="/images/blog/nano-oasis/pipeline.png"
        alt="game.py feeds a VAE encoder; the DiT predicts the next latent from your action; the VAE decodes it to a frame; the latent loops back as context"
        caption="The whole loop: encode a frame to latents, predict the next latent from your action, decode it back to pixels, repeat."
        width={1200}
        height={1160}
        maxWidth={620}
      />

      <p>
        First, a small <strong>autoencoder</strong> (a ViT-VAE) squeezes each 256x192 frame down into a
        compact latent, because predicting raw pixels is expensive. Second, a{" "}
        <strong>diffusion transformer</strong> (a "DiT") looks at the last 8 latents plus your action
        and predicts the next latent. It is trained the way image diffusion models are trained, with EDM
        preconditioning and a trick called Diffusion Forcing that keeps long rollouts stable. Third, the
        decoder turns the predicted latent back into a frame on your screen.
      </p>
      <p>
        That is the recipe. The hard part was never the recipe. The hard part was finding a game it
        could actually learn.
      </p>

      <h2 id="failure-boring">Failure #1: the game was too boring</h2>
      <p>
        My first game was a little platformer: a character that runs and jumps around a static screen. I
        trained the model, rolled it out, and it produced a perfectly stable, perfectly dead image. The
        character just froze.
      </p>
      <p>
        The reason, once I measured it, was obvious in hindsight. About 99.6% of the pixels in a
        platformer frame are identical to the previous frame. The character is a tiny sprite on a still
        background, and half the time it is standing still. So the model learned the laziest solution
        that minimizes its training loss: copy the last frame and call it a day. Why predict motion when
        "nothing changed" is right 99.6% of the time?
      </p>
      <p>
        The lesson: a world model needs a world that actually moves. Every frame has to carry a signal
        worth learning.
      </p>

      <h2 id="failure-breakout">Failure #2: Breakout, or how I spent weeks fighting a ball</h2>
      <p>
        So I switched to Breakout. The ball moves every single frame, there is no "nothing changed"
        shortcut, and it is the exact setting DIAMOND uses for Atari. This felt like the obvious fix. It
        became the longest, most humbling stretch of the project.
      </p>
      <p>
        <strong>The ball that wasn't there.</strong> My first Breakout model dropped the ball,
        literally. The autoencoder was trained to minimize average pixel error, and a 4-pixel ball
        inside an 8-pixel compression tile is a rounding error: the encoder learned it could throw the
        ball away and barely pay for it. The fix was to double the game's resolution so the ball fills a
        whole tile and becomes too expensive to ignore.
      </p>
      <p>
        <strong>The paddle that followed the ball.</strong> Next, the paddle ignored my keys. It moved
        on its own, sensibly, tracking the ball. That sounds like success until you realize the model
        was supposed to be controlled by <em>me</em>. This one was not a model bug, it was a{" "}
        <strong>data bug</strong>: half of my training games were played by a bot that follows the ball,
        so the model learned the shortcut "the paddle goes where the ball is" instead of "the paddle
        goes where the key says." The action was redundant, so it ignored it. I regenerated the data
        with purely random actions, breaking the correlation, so the only way to explain a paddle move
        was the button press.
      </p>
      <p>
        <strong>The ball that faded away.</strong> Now control worked and the ball existed, but over a
        long rollout the ball slowly dissolved into nothing. Single-frame predictions looked perfect; it
        was only when the model consumed its own output, over and over, that things decayed. This is a
        known failure called <strong>autoregressive exposure bias</strong>: the model trains on perfect
        history but plays on its own slightly-wrong history, and it was never taught to recover from its
        own mistakes. The fix, borrowed from GameNGen, is to corrupt the history <em>during training</em>{" "}
        so the model learns to predict from imperfect context.
      </p>

      <Figure
        src="/images/blog/nano-oasis/breakout-ghosting-rollout.png"
        alt="Over a rollout the Breakout ball ghosts and fades"
        caption="Over a long rollout the Breakout ball ghosts and fades — the model drifting on its own slightly-wrong history."
        width={2322}
        height={192}
        strip
      />

      <p>
        <strong>The knob with no good setting.</strong> The bricks flickered (a brick the ball hadn't
        touched would quietly change color frame to frame), so I added a loss term that rewards keeping
        static regions static. And here I hit the wall that ended Breakout for me. That static loss is a
        single knob, and it has no good setting. Turn it up and the scene is rock-stable: the ball
        persists beautifully, but the bricks never break, because a brick breaking <em>is</em> a change
        in the region I just told the model to keep frozen. Turn it down and the bricks break, but the
        ball fades again. Ball or bricks, never both. And every time I wanted to test a setting, it was
        an $80, fourteen-hour training run, because the small-scale experiments never predicted what the
        big model would do.
      </p>

      <Figure
        src="/images/blog/nano-oasis/breakout-launch-rollout.gif"
        alt="A launch-tier Breakout rollout: the bricks stay rock-solid but the ball has faded to almost nothing"
        caption="A launch-tier run: the bricks stay rock-solid, but the ball has faded to almost nothing. Ball or bricks, never both."
        width={256}
        height={192}
        maxWidth={420}
      />

      <p>
        <strong>The metrics lied.</strong> My biggest Breakout model, a 104M-parameter run I'll call M7,
        scored <em>great</em> on the plausibility metrics I'd built. Ball detected 83% of frames,
        near-constant speed, bricks breaking. By the numbers it worked. Then I actually played it, and it
        was mush: a garbled HUD, a paddle that barely responded, smeared physics. The metric had counted
        a faint blob as "ball detected."
      </p>

      <Figure
        src="/images/blog/nano-oasis/breakout-m7-mush.gif"
        alt="M7 scored well on metrics and played like mush"
        caption="M7 scored great on every plausibility metric and played like mush."
        width={480}
        height={360}
        maxWidth={480}
      />

      <p>
        That was the most expensive lesson of the project, and the most useful:{" "}
        <strong>judge the model by playing it, not by a number.</strong> Every plausibility metric I
        trusted had given me a false positive at least once.
      </p>
      <p>
        Add it all up and I had burned roughly <strong>$600</strong> on Breakout training runs across all
        the variations, and I still did not have one version I would call playable. That number is what
        finally made me stop trying to fix the model and start questioning the game.
      </p>

      <h2 id="reframe">The reframe: stop fighting the model</h2>
      <p>
        After weeks of this I finally asked the right question. I had been trying to force a latent
        diffusion model to do the two things it is worst at: track a tiny, fast, <em>continuous</em>{" "}
        object, and commit to a <em>rare, discrete</em> event (a brick breaking). What if I stopped
        trying to make the model better at Breakout, and instead picked a game that doesn't ask for
        either of those?
      </p>
      <p>That game is Snake.</p>
      <p>
        Snake is <strong>grid-native</strong>. The snake moves exactly one cell per tick, so there is no
        sub-pixel motion and no continuous physics, no bounce angles to get subtly wrong. And then
        there's the design choice the whole project pivots on: I made the game grid line up exactly with
        the model's tokens. The board is 8x6 cells, which is exactly the 48 tokens the transformer
        already uses. <strong>One game cell is one model token.</strong> Nothing the model ever has to
        draw is smaller than its own atomic unit. The thing that made the Breakout ball impossible (an
        object smaller than a tile) simply cannot happen.
      </p>
      <p>
        The best part: the entire recipe carried over unchanged. The autoencoder, the transformer, the
        diffusion training, the context-noise fix. All I rewrote was the game itself and the bots that
        play it for data. The months of Breakout pain were not wasted; they were the recipe. I just
        needed a problem shaped to fit it.
      </p>

      <h2 id="snake-works">Snake works (eventually)</h2>
      <p>It did not work immediately, which by now will not surprise you.</p>
      <p>
        I trained in stages. The autoencoder was easy: flat blocks of color compress almost perfectly,
        and it reconstructed every cell of every test frame correctly. The transformer was the question
        mark. My first three training runs <em>played</em> okay, but the snake's body wouldn't reliably
        grow and stay connected. It would eat an apple and sometimes shed a segment, or fray after a few
        turns.
      </p>
      <p>
        I spent a while convinced this was a recipe problem and tried more loss-function tricks. It
        wasn't. It was a <strong>sample-count</strong> problem. DIAMOND, the system that does this
        successfully on Atari, trains on roughly 13 million windows of gameplay. I had trained on about
        400 thousand. The reason was mundane: running the autoencoder inside my training loop capped my
        batch size at 4. So I pre-encoded the entire dataset to latents once, took the autoencoder off
        the hot path, and my batch size jumped to 32. That alone was 16x the training data per run. The
        next run, the body chained and grew reliably. Growth went from 56% of eats to 96%. It played
        like Snake.
      </p>

      <Figure
        src="/images/blog/nano-oasis/snake-eval-strip.png"
        alt="Snake working: crisp token-aligned cells with a connected body and a single apple"
        caption="Snake working: crisp, token-aligned cells, a connected body, and a single apple."
        width={4096}
        height={192}
        strip
      />

      <h2 id="the-math">How it actually works, with the math</h2>
      <p>
        Everything above is the story. Here is the machinery, start to finish: how one frame becomes the
        next. If you just want to play, skip to the next section; nothing below is required to enjoy the
        demo.
      </p>
      <p>
        <strong>Step 1: shrink the frame.</strong> Predicting a 256x192 image pixel by pixel is wasteful,
        so an autoencoder first compresses each frame into a small grid of latent vectors. It is a little
        vision transformer trained to reconstruct frames (an L1 pixel loss plus a tiny regularizer on the
        latent). For Snake, the 8x6 board becomes exactly 48 latent tokens, one per cell, which is the
        alignment the whole project leans on.
      </p>
      <p>
        <strong>Step 2: the diffusion part.</strong> The idea is almost suspiciously simple. Take a clean
        latent <M>{"x"}</M> and add Gaussian noise at some scale <M>{"\\sigma"}</M>:
      </p>
      <MathBlock>{"x_\\sigma = x + \\sigma\\,\\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, I)"}</MathBlock>
      <p>
        Then train a network <M>{"D"}</M> to undo it, recovering <M>{"x"}</M> from <M>{"x_\\sigma"}</M>.
        If you can denoise at every scale, you can generate: start from pure noise and walk back down to
        a clean sample. The trick that makes this train nicely (Karras et al.'s EDM) is to not have the
        network predict the clean latent directly, but to wrap it so its job is about equally hard at
        every noise level:
      </p>
      <MathBlock>{"D(x;\\sigma) = c_\\text{skip}(\\sigma)\\,x + c_\\text{out}(\\sigma)\\,F_\\theta\\big(c_\\text{in}(\\sigma)\\,x,\\; c_\\text{noise}(\\sigma)\\big)"}</MathBlock>
      <p>
        where <M>{"F_\\theta"}</M> is the actual transformer and the <M>{"c"}</M> terms are fixed
        functions of <M>{"\\sigma"}</M>:
      </p>
      <MathBlock>{"c_\\text{skip} = \\frac{\\sigma_\\text{data}^2}{\\sigma^2 + \\sigma_\\text{data}^2}, \\quad c_\\text{out} = \\frac{\\sigma\\,\\sigma_\\text{data}}{\\sqrt{\\sigma^2 + \\sigma_\\text{data}^2}}, \\quad c_\\text{in} = \\frac{1}{\\sqrt{\\sigma^2 + \\sigma_\\text{data}^2}}, \\quad c_\\text{noise} = \\tfrac{1}{4}\\ln\\sigma"}</MathBlock>
      <p>
        In plain terms: when the noise is tiny, <M>{"c_\\text{skip} \\approx 1"}</M>, so the noisy input
        is already almost the answer and the network barely has to do anything; when the noise is huge,{" "}
        <M>{"c_\\text{skip} \\approx 0"}</M> and the network has to predict the frame from scratch.{" "}
        <M>{"\\sigma_\\text{data}"}</M> is just the standard deviation of the latents (about 2.6 here),
        so everything is scaled to the real data. Training minimizes a weighted denoising error, with
        noise levels drawn from a log-normal so the network sees the whole range:
      </p>
      <MathBlock>{"\\mathcal{L} = \\mathbb{E}_{x,\\,\\sigma,\\,\\epsilon}\\Big[\\lambda(\\sigma)\\,\\big\\|D(x + \\sigma\\epsilon;\\,\\sigma) - x\\big\\|^2\\Big], \\qquad \\lambda(\\sigma) = \\frac{\\sigma^2 + \\sigma_\\text{data}^2}{(\\sigma\\,\\sigma_\\text{data})^2}, \\qquad \\ln\\sigma \\sim \\mathcal{N}(P_\\text{mean}, P_\\text{std})"}</MathBlock>
      <p>
        The weight <M>{"\\lambda(\\sigma)"}</M> makes every noise level contribute about equally; without
        it the easy low-noise levels dominate and the model never learns the hard part.
      </p>
      <p>
        <strong>Step 3: make it a <em>world</em> model.</strong> So far this just generates frames. To
        make it a game, the denoiser is conditioned on the past and on your button. The transformer sees
        a window of the last 8 frames, and folds a per-frame vector{" "}
        <M>{"c_t = \\text{TimeEmb}(\\sigma_t) + \\text{ActionEmb}(a_t)"}</M> into every layer. Your
        keypress literally becomes part of the conditioning. And, crucially for stability, every frame in
        the window gets its <em>own</em> independent noise level <M>{"\\sigma_t"}</M> instead of sharing
        one ("Diffusion Forcing"). That lets generation hold the past frames at near-zero noise (they are
        known) while the next frame starts at full noise (it is what you are predicting). Attention
        across time is causal, so frame <M>{"t"}</M> can only look backward.
      </p>
      <p>
        <strong>Step 4: teach it to survive its own mistakes.</strong> A model trained only on perfect
        history falls apart once it has to eat its own slightly-wrong output, frame after frame. The fix
        is one line: during training, add a little noise to the <em>context</em> frames too, not just
        the target. Now it has practiced predicting from imperfect history, which is exactly what
        inference is. This one change is what took rollouts from "dissolves in twenty frames" to "holds
        together."
      </p>
      <p>
        <strong>Step 5: play.</strong> To make the next frame, start it as pure noise at the largest
        scale and run a few steps down a decreasing noise schedule{" "}
        <M>{"\\sigma_\\text{max} \\to \\sigma_\\text{min}"}</M>, conditioned on the clean past frames and
        your action. Each Euler step nudges the sample toward the model's current estimate of the clean
        frame:
      </p>
      <MathBlock>{"x \\leftarrow x + (\\sigma_{i+1} - \\sigma_i)\\,\\frac{x - D(x;\\sigma_i)}{\\sigma_i}"}</MathBlock>
      <p>
        Four steps is enough. Decode the latent back to pixels, show it, append it to the history, and
        repeat on the next tick. That loop, a handful of matrix multiplies per frame, is the entire
        "engine."
      </p>

      <h2 id="browser">Into the browser: the model dreams, a referee calls the game</h2>
      <p>
        The point of all this was to let <em>you</em> play it, in a browser, with no server doing the
        work. So I exported the transformer and the decoder to ONNX, ran them with WebGPU, and put the
        autoregressive loop in JavaScript. Because four sampling steps is enough, it runs in real time
        without any distillation. (There's also a fallback path that runs the model on a server over a
        WebSocket, for browsers without WebGPU.)
      </p>
      <p>
        The last problem was the most interesting one, and it is a nice illustration of what these models
        can and cannot do: <strong>death.</strong>
      </p>
      <p>
        My first instinct was to detect death by reading the model's output. Look at the generated frame,
        find the snake's head, check if it ran into a wall. It did not work, and the reason is genuinely
        deep. A diffusion model <em>cannot render a head off the screen</em>, because there are no pixels
        out there. So when you steer into a wall, the single most important event in the game is{" "}
        <em>invisible in the model's output</em>. You cannot read it back, even in principle.
      </p>
      <p>
        The fix reframes the whole thing. The model is a brilliant <em>renderer</em> and an unreliable{" "}
        <em>rule-keeper</em>, so I split those jobs. About thirty lines of plain JavaScript act as a{" "}
        <strong>referee</strong>: they track the head and the body and call wall and self collisions by
        the actual rule of Snake. The model still generates every pixel you see. It just doesn't get to
        decide when you died. The model dreams the world; a referee calls the game. Honestly, this feels
        less like a hack and more like the right division of labor for this whole class of models.
      </p>

      <h2 id="cost">What it cost, and what it can't do</h2>
      <p>
        The shipped model trained for under $50, which is the funny part: after the ~$600 I poured into
        Breakout, the version that actually works is the cheap one. It is 13.5M parameters, and it plays
        like a 13.5M parameter model: crisp Snake for the first five or six apples, and then, as the body
        gets long, it starts to fray. Diffusion models are bad at long thin structures, and small errors
        accumulate over a rollout. That's why every death re-seeds a clean starting position rather than
        asking the model to keep going from a degraded state. It is a reference implementation, not a
        product.
      </p>
      <p>
        But you can open a webpage and play a game that has no engine, and the entire stack that makes
        that possible is small enough to read in an evening. That was the goal.
      </p>

      <h2 id="try-it">Try it, fork it</h2>
      <ul>
        <li>
          <Ref href="https://nano-oasis.vercel.app">
            <strong>Play it</strong>
          </Ref>{" "}
          in your browser.
        </li>
        <li>
          <Ref href="https://github.com/MaruthiV/nanoOasis">
            <strong>Read the code</strong>
          </Ref>{" "}
          (about 2,400 lines).
        </li>
        <li>
          <Ref href="https://huggingface.co/VemVemRu/nanoOasis">
            <strong>Grab the weights</strong>
          </Ref>{" "}
          on HuggingFace.
        </li>
      </ul>
      <p>
        If you want to make your own game with no engine, the recipe is all there. Just pick a problem
        shaped to fit the model, and judge it by playing.
      </p>
    </BlogLayout>
  )
}
