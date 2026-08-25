import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

// Spotify refresh tokens get revoked (password change, app removed from the
// account, Spotify rotating it). When that happens every shelf fetch fails and
// the cached albums silently go stale, so re-running this flow is the fix.
// In development we write the new token straight into .env.local rather than
// making you copy it by hand. Never in production — that filesystem is
// read-only and ephemeral, so prod tokens are set in the host's env instead.
async function persistToEnvLocal(token: string): Promise<string | null> {
  if (process.env.NODE_ENV === "production") return null

  const file = path.join(process.cwd(), ".env.local")
  const line = `SPOTIFY_REFRESH_TOKEN=${token}`

  try {
    let contents = ""
    try {
      contents = await fs.readFile(file, "utf8")
    } catch {
      // No .env.local yet — we'll create one.
    }

    const updated = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(contents)
      ? contents.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line)
      : `${contents.replace(/\s*$/, "")}\n${line}\n`

    await fs.writeFile(file, updated.startsWith("\n") ? updated.slice(1) : updated, "utf8")
    return file
  } catch (error) {
    console.error("Could not write refresh token to .env.local:", error)
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64")
  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirect_uri!,
      }),
    })

    const data = await response.json()

    if (!data.refresh_token) {
      throw new Error(
        `No refresh token received: ${data.error_description ?? data.error ?? "unknown error"}`,
      )
    }

    const written = await persistToEnvLocal(data.refresh_token)

    // Create a simple HTML page to display the refresh token
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Refresh Token</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: #1a1a1a;
              color: white;
            }
            .container {
              background: #2a2a2a;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .token {
              background: #3a3a3a;
              padding: 10px;
              border-radius: 4px;
              word-break: break-all;
              font-family: monospace;
            }
            .instructions {
              margin-top: 20px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <h1>Your Spotify Refresh Token</h1>
          <div class="container">
            <p>Copy this refresh token and add it to your .env.local file:</p>
            <div class="token">${data.refresh_token}</div>
            <div class="instructions">
              ${
                written
                  ? `<p>Already written to ${written} — restart the dev server to pick it up.</p>
                     <p>Also update SPOTIFY_REFRESH_TOKEN in your production env (Vercel) with the value above.</p>`
                  : `<p>1. Open your .env.local file</p>
                     <p>2. Set this line: SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</p>
                     <p>3. Save the file and restart your development server</p>`
              }
            </div>
          </div>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error getting refresh token:", error)
    return new NextResponse("Error getting refresh token. Please try again.", {
      status: 500,
    })
  }
} 