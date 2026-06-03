"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Twitter, Linkedin, GraduationCap, Mail } from "lucide-react"
import { profile } from "@/lib/data"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/projects", label: "projects" },
  { href: "/media", label: "media" },
  { href: "/blogs", label: "blogs" },
]

const socials = [
  { label: "GitHub", href: profile.social.github, Icon: Github },
  { label: "X", href: profile.social.twitter, Icon: Twitter },
  { label: "LinkedIn", href: profile.social.linkedin, Icon: Linkedin },
  { label: "Google Scholar", href: profile.social.scholar, Icon: GraduationCap },
  { label: "Email", href: "mailto:vemula.maruthimukhesh@gmail.com", Icon: Mail },
]

// Header: a top utility row (social icons + theme toggle) above the bold name,
// with the section nav on the right of the name row.
export function V2Nav() {
  const pathname = usePathname()

  return (
    <header className="mb-14">
      <div className="mb-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-[18px] w-[18px]" />
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </div>

      <div className="flex items-baseline justify-between gap-6">
        <Link href="/" className="text-4xl font-bold tracking-tight">
          {profile.name}
        </Link>
        <nav className="flex items-center gap-5 text-lg">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
