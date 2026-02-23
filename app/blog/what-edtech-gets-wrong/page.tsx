"use client"

import { BlogLayout } from "@/components/blog-layout"
import Image from "next/image"

const toc = [
  { id: "intro", title: "The Problem", level: 1 },
  { id: "my-experience", title: "My Experience", level: 1 },
  { id: "what-i-built", title: "What I Built", level: 1 },
  { id: "the-brain-map", title: "The Brain Map", level: 2 },
  { id: "drilling-nodes", title: "Drilling Weak Concepts", level: 2 },
  { id: "ai-features", title: "AI That Actually Helps", level: 2 },
  { id: "how-it-works", title: "How It Works", level: 1 },
  { id: "whats-next", title: "What's Next", level: 1 },
]

export default function WhatEdTechGetsWrong() {
  return (
    <BlogLayout
      title="What Ed-Tech Gets Wrong"
      date="Feb 22, 2026"
      toc={toc}
    >
      <section id="intro">
        <p>
          Here's something I've been thinking about for a while: we have more educational resources than ever before. Khan Academy, Coursera, YouTube, practice problem databases, AI tutors - you name it. And yet most students still struggle with the same fundamental problem they always have.
        </p>
        <p>
          It's not a lack of content. It's not that the explanations aren't good enough. The problem is that most ed-tech treats learning like a straight line - start at Chapter 1, work through to Chapter 20, and you'll be fine. But that's not how learning actually works, and it's definitely not how you should study.
        </p>
        <p>
          The real issue is figuring out <em>what</em> to study. And I think that's where education technology needs to go next.
        </p>
      </section>

      <h2 id="my-experience">My Experience</h2>
      <p>
        Back in high school, I remember spending hours studying for AP exams and feeling like I was making progress, only to bomb a practice test and realize I had no idea what went wrong. It wasn't that I wasn't putting in the time - I was putting in plenty. The problem was that I was spending that time on the wrong things.
      </p>
      <p>
        I'd study kinematics for hours because it felt familiar and I could solve those problems, meanwhile I had gaps in forces and energy that were killing me on the harder questions. I didn't know what I didn't know. And every resource I used just gave me more problems to solve without telling me which problems I actually needed to focus on.
      </p>
      <p>
        That experience stuck with me. The bottleneck wasn't resources - it was <strong>knowing where my weak points were</strong> and understanding which concepts were blocking me from getting the harder stuff.
      </p>

      <h2 id="what-i-built">What I Built</h2>
      <p>
        So I built something to solve this. I call it BrainMap, and the core idea is simple: instead of following a fixed curriculum, the app figures out what you're actually weak at and tells you exactly what to study next.
      </p>
      <p>
        It's diagnostic-first. You take a quick assessment, and based on how you perform, the system builds a live concept map of your understanding. It shows you where you're strong (green), where you're shaky (yellow), and where you're struggling (red). More importantly, it tells you which weak spots are bottlenecks - concepts that are blocking your progress on other topics.
      </p>

      <h3 id="the-brain-map">The Brain Map</h3>
      <p>
        The main dashboard shows your concept graph. Each node is a topic, and the connections show prerequisites - what you need to understand before you can tackle the next thing. The colors tell you your mastery level at a glance.
      </p>
      <figure className="my-6">
        <Image
          src="/images/blog/brainmap/dashboard.png"
          alt="BrainMap dashboard showing the concept graph with color-coded mastery levels and top 3 recommended nodes"
          width={1200}
          height={800}
          className="rounded-lg border"
        />
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          The main dashboard with the concept graph and recommended next nodes
        </figcaption>
      </figure>
      <p>
        On the right side, you can see the "Next 3 Nodes" - these are the concepts the system thinks you should focus on. It's not random. The algorithm considers how weak you are on a concept, how many other concepts depend on it (the bottleneck effect), and whether you've recently missed questions on it. High-impact gaps rise to the top.
      </p>
      <p>
        There's also a Mistake Bank that tracks concepts you've gotten wrong and schedules them for review. It's basically spaced repetition, but tied to your actual errors instead of arbitrary flashcards.
      </p>

      <h3 id="drilling-nodes">Drilling Weak Concepts</h3>
      <p>
        When you click into a specific node, you get a detailed view of that concept. You can see your mastery percentage, how many attempts you've made, what prerequisites it has, and what concepts it unlocks.
      </p>
      <figure className="my-6">
        <Image
          src="/images/blog/brainmap/node-detail.png"
          alt="Node detail view showing mastery, prerequisites, and micro lesson for Net Force concept"
          width={1200}
          height={800}
          className="rounded-lg border"
        />
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          Drilling into a specific concept - Net Force
        </figcaption>
      </figure>
      <p>
        Each concept also has a micro-lesson attached - a quick refresher on the definition, key equations, common mistakes, and examples. It's not trying to be a full textbook. The goal is to give you just enough to jog your memory before you start drilling problems.
      </p>

      <h3 id="ai-features">AI That Actually Helps</h3>
      <p>
        The AI features in BrainMap are designed to help you in the moment, not just give you generic explanations. When you're stuck on a problem, you can ask for a hint that's specific to that question - it'll nudge you in the right direction without giving away the answer.
      </p>
      <figure className="my-6">
        <Image
          src="/images/blog/brainmap/question-ai.png"
          alt="Question interface showing AI hint and detailed explanation of why you missed a question"
          width={1200}
          height={900}
          className="rounded-lg border"
        />
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          A diagnostic question with AI hint and "Why I Missed It" explanation
        </figcaption>
      </figure>
      <p>
        And when you get a question wrong, there's a "Why I Missed It" button that gives you a breakdown: what was tempting about your wrong answer, why it's wrong, how you should think about problems like this, and what to do next. It's not just "the correct answer is B" - it's trying to diagnose your misconception.
      </p>
      <p>
        There's also a feature to generate similar problems. If you missed a question on inclined planes, you can instantly get a variant problem to practice the same concept with different numbers. The AI generates isomorphic problems so you can drill until the concept clicks.
      </p>

      <h2 id="how-it-works">How It Works</h2>
      <p>
        Under the hood, the system is doing a few things to figure out what you should study:
      </p>
      <p>
        <strong>Mastery tracking</strong> - Every time you answer a question, it updates your mastery score on the tagged concepts. If you're confident and get it right, your mastery goes up more. If you're confident and get it wrong, it goes down more. This captures not just whether you got it right, but how solid your understanding actually is.
      </p>
      <p>
        <strong>Graph-based recommendations</strong> - The concepts are connected in a prerequisite graph. When figuring out what to recommend next, the system looks at which weak concepts are blocking the most other concepts downstream. A gap in Newton's Laws matters more than a gap in some niche topic because so many other concepts build on it.
      </p>
      <p>
        <strong>Mistake scheduling</strong> - When you miss a question, that concept goes into your Mistake Bank with a review date. Get it wrong again? The review gets scheduled sooner and more frequently. Get it right a few times in a row? It's considered resolved. It's spaced repetition, but automated based on your actual performance.
      </p>
      <p>
        The current version is focused on AP Physics 1 with about 20 concepts and 40 questions as a proof of concept. But the architecture is designed to work for any subject where you can define concepts and their relationships.
      </p>

      <h2 id="whats-next">What's Next</h2>
      <p>
        I think personalization is where ed-tech needs to go. We have all this data about how students learn - what they get right, what they get wrong, what they're confident about, how long they spend on problems. But most platforms just use it for analytics dashboards instead of actually adapting the learning experience.
      </p>
      <p>
        The future I'm imagining is one where every student has a real-time map of their understanding, and the system is constantly updating its model of what they need to work on. Not "here's the next chapter" but "here's the specific gap that's holding you back, and here's exactly what you need to do to fix it."
      </p>
      <p>
        That's what I tried to build with BrainMap. It's not a finished product - there's a lot more I want to add. But the core idea of diagnostic-first, graph-aware learning is something I think matters. Study smarter, not just harder.
      </p>
      <p>
        If you want to check out the code, it's on <a href="https://github.com/MaruthiV/brainmap" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
      </p>
    </BlogLayout>
  )
}
