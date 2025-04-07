"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import SocialLinks from "@/components/social-links"

export default function ResumePage() {
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoaded(true)

    // Add ESC key handler to go back
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center font-press-start text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back Home
          </Link>
        </div>

        {/* Resume Content */}
        <div className={`transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
          <h1 className="font-press-start text-3xl text-center mb-8">RESUME</h1>

          {/* Education Section */}
          <section className="mb-12">
            <h2 className="font-press-start text-xl text-cyan-500 mb-4 border-b border-cyan-500 pb-2">EDUCATION</h2>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-cyan-500 p-3 text-center font-press-start text-xs">2024-2028</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">University of North Carolina at Chapel Hill</h3>
                <p className="text-gray-300 mt-1">
                  Bachelor of Science, Business Administration and Computer Science; Minor in Statistics
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  GPA: 3.60 | Honors: Assured Admission into Kenan-Flagler School of Business (60/400 students)
                </p>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-cyan-500 p-3 text-center font-press-start text-xs">2022-2024</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">North Carolina School of Science and Mathematics</h3>
                <p className="text-gray-300 mt-1">Durham, NC</p>
                <p className="text-gray-400 text-sm mt-2">
                  Courses: Machine Learning, Combinatorics and Game Theory, Cybersecurity, AP Statistics, AP Calculus BC
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Cumulative GPA: 4.97/5.00 | SAT: Math 790 | Reading & Writing 780
                </p>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-12">
            <h2 className="font-press-start text-xl text-purple-500 mb-4 border-b border-purple-500 pb-2">
              EXPERIENCE
            </h2>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-purple-500 p-3 text-center font-press-start text-xs">Aug 2024 - Present</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">Model Pretraining Engineer</h3>
                <p className="text-gray-300 mt-1">Humanity Unleashed</p>
                <ul className="text-gray-400 text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Designed multimodal architectures integrating language and time series data, achieving a 15% boost
                    in predictive accuracy
                  </li>
                  <li>
                    Coordinated large-scale model pretraining on a dataset of over 3 trillion tokens across a
                    distributed system of 50+ GPUs
                  </li>
                  <li>
                    Optimized hyperparameters via RPCs to improve training efficiency by 20% and enhance model
                    robustness
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-purple-500 p-3 text-center font-press-start text-xs">May 2024 - Jul 2024</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">Portfolio Risk Management Intern</h3>
                <p className="text-gray-300 mt-1">Caspian Impact Investments</p>
                <ul className="text-gray-400 text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Analyzed and assessed risk profiles of 25+ portfolio companies using BlackRock Aladdin, reducing
                    overall portfolio risk by 15%
                  </li>
                  <li>Built a risk assessment model using Python that improved risk prediction accuracy by 12%</li>
                  <li>
                    Reported on a $2M USD loan portfolio, identifying performance trends and providing actionable
                    insights
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.27s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-purple-500 p-3 text-center font-press-start text-xs">Feb 2024 - Jul 2024</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">Research Fellow</h3>
                <p className="text-gray-300 mt-1">Vellore Institute of Technology</p>
                <ul className="text-gray-400 text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Led multiple research projects in collaboration with senior faculty, developing novel algorithms for
                    software vulnerability detection
                  </li>
                  <li>
                    Filed patents for an enhanced NLP algorithm leveraging RNNs and transformers for improved query
                    comprehension
                  </li>
                  <li>
                    Integrated cutting-edge AI models into cybersecurity frameworks, enhancing vulnerability detection
                    accuracy by over 20%
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-purple-500 p-3 text-center font-press-start text-xs">Jun 2023 - May 2024</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">Research Assistant</h3>
                <p className="text-gray-300 mt-1">Samuel DuBois Cook Center on Social Equity at Duke University</p>
                <ul className="text-gray-400 text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Collaborated with Dr. Quran Karriem on LISES, a legislative document simplification ML model,
                    increasing comprehensibility by over 120%
                  </li>
                  <li>Developed a classification program in R using Tidy-Text to analyze Zillow housing listings</li>
                  <li>
                    Conducted statistical analysis on stock market data to examine the impact of economic inequality on
                    asset mispricing
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.35s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-purple-500 p-3 text-center font-press-start text-xs">Oct 2023 - May 2024</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">Ryden AI Program Teaching Assistant</h3>
                <p className="text-gray-300 mt-1">North Carolina School of Science and Mathematics</p>
                <ul className="text-gray-400 text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Organized "SMathHacks", a state-wide hackathon with over 200+ high school participants, fostering
                    innovation and hands-on experience in artificial intelligence
                  </li>
                  <li>
                    Designed a comprehensive AI curriculum for national implementation, introducing AI education to over
                    20 schools
                  </li>
                  <li>
                    Developed and deployed an AI agriculture robot using NVIDIA Jetson Nano, TensorFlow, and OpenCV for
                    autonomous navigation
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-purple-500 p-3 text-center font-press-start text-xs">Jul 2022 - Aug 2022</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">Software Innovation Intern</h3>
                <p className="text-gray-300 mt-1">Lenovo</p>
                <ul className="text-gray-400 text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Developed machine learning algorithms using Python, increasing accessibility for over 500
                    individuals with disabilities
                  </li>
                  <li>
                    Designed robotic mechanics software using Python and ROS for individuals with ALS, resulting in a
                    40% improvement in user interaction
                  </li>
                  <li>
                    Created a go-to-market strategy focusing on digital marketing, partnerships, and targeted user
                    outreach
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fall-in"
              style={{ animationDelay: "0.45s" }}
            >
              <div className="md:col-span-1">
                <div className="bg-purple-500 p-3 text-center font-press-start text-xs">May 2021 - Aug 2021</div>
              </div>
              <div className="md:col-span-3">
                <h3 className="font-press-start text-sm">Software Engineering Intern</h3>
                <p className="text-gray-300 mt-1">Bumper Investing</p>
                <ul className="text-gray-400 text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Developed portfolio tracking and goal-based investment dashboards using React Native, TypeScript,
                    and Redux
                  </li>
                  <li>
                    Integrated APIs such as Plaid for secure bank account linking and Stripe for payment processing
                  </li>
                  <li>Implemented a real-time notification system using Firebase Cloud Messaging</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="mb-12">
            <h2 className="font-press-start text-xl text-green-500 mb-4 border-b border-green-500 pb-2">PROJECTS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fall-in" style={{ animationDelay: "0.5s" }}>
              <div className="border border-green-500 p-4 rounded">
                <h3 className="font-press-start text-sm text-green-400">SplitShare</h3>
                <p className="text-gray-300 mt-1 text-xs">Co-Founder and CEO</p>
                <p className="text-gray-400 text-sm mt-2">
                  Led a team of 6 developers to build a full-stack web application for securely splitting recurring
                  subscriptions with payment processing via Stripe API.
                </p>
                <div className="mt-3 text-xs text-gray-500">Next.js, React, Firebase, MongoDB</div>
              </div>

              <div className="border border-green-500 p-4 rounded">
                <h3 className="font-press-start text-sm text-green-400">Sleep Stage Classification</h3>
                <p className="text-gray-300 mt-1 text-xs">Research Paper Co-Author</p>
                <p className="text-gray-400 text-sm mt-2">
                  Published paper on advancing sleep stage classification with EEG signal analysis, optimizing LSTM
                  models using the Puffer Fish Algorithm.
                </p>
                <div className="mt-3 text-xs text-gray-500">EEG Analysis, LSTM, Explainable AI</div>
              </div>

              <div className="border border-green-500 p-4 rounded">
                <h3 className="font-press-start text-sm text-green-400">Software Vulnerability Detection</h3>
                <p className="text-gray-300 mt-1 text-xs">Research Paper Co-Author</p>
                <p className="text-gray-400 text-sm mt-2">
                  Developed MDSADNet, a multi-scale convolutional neural network for software vulnerability detection,
                  achieving an F1-score of 98%.
                </p>
                <div className="mt-3 text-xs text-gray-500">CNN, Mantis Search Algorithm, Cybersecurity</div>
              </div>

              <div className="border border-green-500 p-4 rounded">
                <h3 className="font-press-start text-sm text-green-400">Cryptocurrency Price Prediction</h3>
                <p className="text-gray-300 mt-1 text-xs">Research Paper Co-Author</p>
                <p className="text-gray-400 text-sm mt-2">
                  Published paper on cryptocurrency price prediction using LSTM and Transformer models with momentum and
                  volatility technical indicators.
                </p>
                <div className="mt-3 text-xs text-gray-500">Python, TensorFlow, PyTorch, Time Series Analysis</div>
              </div>

              <div className="border border-green-500 p-4 rounded">
                <h3 className="font-press-start text-sm text-green-400">Cancer-Drug Efficacy Prediction</h3>
                <p className="text-gray-300 mt-1 text-xs">Research Paper Co-Author</p>
                <p className="text-gray-400 text-sm mt-2">
                  Developed a predictive model integrating a 2D U-Net CNN for MRI tumor segmentation and Gompertz
                  differential equation for treatment efficacy.
                </p>
                <div className="mt-3 text-xs text-gray-500">Deep Learning, Differential Equations, Medical Imaging</div>
              </div>

              <div className="border border-green-500 p-4 rounded">
                <h3 className="font-press-start text-sm text-green-400">Stock Volatility Prediction</h3>
                <p className="text-gray-300 mt-1 text-xs">Research Project</p>
                <p className="text-gray-400 text-sm mt-2">
                  Developed stock volatility prediction models using Neural Networks and SVMs across seven market
                  sectors, achieving 31% increase in accuracy.
                </p>
                <div className="mt-3 text-xs text-gray-500">Black-Scholes, Neural Networks, SVMs</div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="font-press-start text-xl text-yellow-500 mb-4 border-b border-yellow-500 pb-2">SKILLS</h2>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fall-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">Python</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">JavaScript</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">TypeScript</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">C/C++</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">React</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">Next.js</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">TensorFlow</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">PyTorch</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">MongoDB</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">Flask</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">Django</div>
              <div className="bg-yellow-500 p-3 text-center font-press-start text-xs text-black">Git</div>
            </div>
          </section>
        </div>
      </div>

      {/* Social Links */}
      <SocialLinks />

      {/* Keyboard Instructions */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-10 text-gray-400 font-press-start text-xs">
        Press ESC to go back
      </div>
    </main>
  )
}

