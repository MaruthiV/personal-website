"use client"

import { BlogLayout } from "@/components/blog-layout"

const toc = [
  { id: "intro", title: "Introduction", level: 1 },
  { id: "reality-check", title: "The Reality Check", level: 1 },
  { id: "the-battle", title: "The Daily Battle", level: 1 },
  { id: "crossroads", title: "At a Crossroads", level: 1 },
  { id: "its-okay", title: "It's Okay Not to Know", level: 1 },
  { id: "looking-ahead", title: "Looking Ahead", level: 1 },
]

export default function BalancingFreshmanYear() {
  return (
    <BlogLayout
      title="Balancing Freshman Year"
      date="Apr 7, 2025"
      toc={toc}
    >
      <section id="intro">
        <p>
          As I sit here in my dorm room, surrounded by textbooks and half-finished coding projects, I can't help but reflect on how much has changed since I first stepped onto campus. Freshman year has been a whirlwind of new experiences, challenges, and self-discovery.
        </p>
      </section>

      <h2 id="reality-check">The Reality Check</h2>
      <p>
        One of the biggest realizations I've had is how different college life is from what I expected. The freedom to choose your own path is both exhilarating and daunting. I came in with so many ideas - I wanted to start a SaaS company, dive deep into research, maybe even launch a startup. But reality has a way of tempering those ambitions with the practicalities of daily life.
      </p>

      <h2 id="the-battle">The Daily Battle</h2>
      <p>
        Right now, with finals looming on the horizon, I find myself in a constant battle between my academic responsibilities and my entrepreneurial aspirations. There are so many ideas I want to pursue, so many projects I want to build, but time seems to slip through my fingers like sand. The more I learn about the tech industry and business world, the more I realize how much there is to explore.
      </p>

      <h2 id="crossroads">At a Crossroads</h2>
      <p>
        I'm at a crossroads in terms of my career path. On one hand, I'm drawn to the analytical and strategic aspects of consulting and business research. The idea of helping companies solve complex problems and optimize their operations is fascinating. On the other hand, my passion for technology and coding keeps pulling me towards the more technical side of things. Building something from scratch, seeing code come to life, and solving technical challenges is incredibly rewarding.
      </p>

      <h2 id="its-okay">It's Okay Not to Know</h2>
      <p>
        What I've learned most this year is that it's okay not to have everything figured out. The pressure to have a clear career path can be overwhelming, but I'm starting to see that the journey of exploration is just as important as the destination. Each class I take, each project I work on, and each conversation I have with professors and peers helps me understand a little more about what truly excites me.
      </p>

      <h2 id="looking-ahead">Looking Ahead</h2>
      <p>
        As I look ahead to the rest of my college journey, I'm trying to embrace the uncertainty. Maybe I don't need to choose between business and tech right now. Maybe the best path forward is to continue exploring both, to build a foundation that combines technical skills with business acumen. After all, some of the most successful people I've met didn't follow a straight path - they embraced the twists and turns, learning from each experience.
      </p>
      <p>
        For now, I'll focus on getting through finals, but I'm keeping my entrepreneurial spirit alive. The ideas will still be there when I have more time to pursue them. And who knows? Maybe the perfect opportunity to combine my interests in business and technology will present itself when I least expect it.
      </p>
    </BlogLayout>
  )
}
