import { HeaderSection } from "@/components/header-section"
import { PostsColumn } from "@/components/posts-column"
import { ProjectsColumn } from "@/components/projects-column"
import { ArtColumn } from "@/components/art-column"
import { SpotifyNowPlaying } from "@/components/spotify-now-playing"

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
      <HeaderSection />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        <PostsColumn />
        <ProjectsColumn />
        <ArtColumn />
      </div>

      <footer className="mt-16 pt-8 border-t border-border flex justify-center">
        <SpotifyNowPlaying />
      </footer>
    </main>
  )
}
