import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import Link from "next/link"

export default function SocialLinks() {
  return (
    <div className="fixed right-4 bottom-16 z-20 flex flex-col gap-3">
      <Link
        href="https://github.com/MaruthiV"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 p-2 rounded-full transition-all duration-300 hover:bg-gray-700 hover:scale-125 hover:shadow-lg hover:shadow-cyan-500/50 group"
        title="GitHub"
      >
        <Github className="h-5 w-5 text-white group-hover:text-cyan-400" />
      </Link>

      <Link
        href="https://www.linkedin.com/in/maruthivemula"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 p-2 rounded-full transition-all duration-300 hover:bg-gray-700 hover:scale-125 hover:shadow-lg hover:shadow-purple-500/50 group"
        title="LinkedIn"
      >
        <Linkedin className="h-5 w-5 text-white group-hover:text-purple-400" />
      </Link>

      <Link
        href="https://x.com/VemVemRu"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 p-2 rounded-full transition-all duration-300 hover:bg-gray-700 hover:scale-125 hover:shadow-lg hover:shadow-yellow-500/50 group"
        title="Twitter"
      >
        <Twitter className="h-5 w-5 text-white group-hover:text-yellow-400" />
      </Link>

      <Link
        href="mailto:vemula.maruthimukhesh@gmail.com"
        className="bg-gray-800 p-2 rounded-full transition-all duration-300 hover:bg-gray-700 hover:scale-125 hover:shadow-lg hover:shadow-green-500/50 group"
        title="Email"
      >
        <Mail className="h-5 w-5 text-white group-hover:text-green-400" />
      </Link>
    </div>
  )
}

