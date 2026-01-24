import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { profile } from "@/lib/data"
import { ThemeToggle } from "./theme-toggle"

export function HeaderSection() {
  return (
    <header className="flex flex-col sm:flex-row items-center gap-6 mb-12">
      <div className="relative w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={profile.image}
          alt={profile.name}
          className="object-cover w-full h-full scale-[2]" style={{ transformOrigin: '57% center' }}
        />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          <div className="flex items-center gap-1">
            <Link
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href={profile.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[590px]">
          {profile.bio}
        </p>
        <p className="text-muted-foreground text-[15px] leading-relaxed mt-3">
          <span className="text-foreground font-medium">Currently:</span>{" "}
          {profile.currently.join(" and ")}.
        </p>
      </div>

      <div className="flex-shrink-0">
        <ThemeToggle />
      </div>
    </header>
  )
}
