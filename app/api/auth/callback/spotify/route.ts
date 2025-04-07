import { NextResponse } from "next/server"

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
      throw new Error("No refresh token received")
    }

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
              <p>1. Open your .env.local file</p>
              <p>2. Add this line: SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</p>
              <p>3. Save the file and restart your development server</p>
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