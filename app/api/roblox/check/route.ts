import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = body?.username?.trim();

    if (!username) {
      return NextResponse.json(
        { success: false, found: false, message: "Username Roblox wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Fetch user ID and profile from Roblox Users API
    const userLookupResponse = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Zenwol-Roblox-Checker/1.0",
        },
        body: JSON.stringify({
          usernames: [username],
          excludeBannedUsers: false,
        }),
        cache: "no-store",
      }
    );

    if (!userLookupResponse.ok) {
      throw new Error(`Roblox API responded with status ${userLookupResponse.status}`);
    }

    const userData = await userLookupResponse.json();
    const matchedUser = userData?.data?.[0];

    if (!matchedUser || !matchedUser.id) {
      return NextResponse.json({
        success: true,
        found: false,
        message: `Username Roblox "${username}" tidak ditemukan. Pastikan ejaan sudah benar.`,
      });
    }

    const userId = matchedUser.id;
    let avatarUrl = `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`;

    // 2. Fetch avatar headshot thumbnail from Roblox Thumbnails API
    try {
      const thumbnailResponse = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Zenwol-Roblox-Checker/1.0",
          },
          cache: "no-store",
        }
      );

      if (thumbnailResponse.ok) {
        const thumbData = await thumbnailResponse.json();
        const foundThumb = thumbData?.data?.[0]?.imageUrl;
        if (foundThumb) {
          avatarUrl = foundThumb;
        }
      }
    } catch {
      // Use fallback thumbnail URL if thumbnail API fails
    }

    return NextResponse.json({
      success: true,
      found: true,
      data: {
        id: userId,
        name: matchedUser.name,
        displayName: matchedUser.displayName || matchedUser.name,
        hasVerifiedBadge: Boolean(matchedUser.hasVerifiedBadge),
        avatarUrl,
        profileUrl: `https://www.roblox.com/users/${userId}/profile`,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Terjadi kesalahan server";
    return NextResponse.json(
      {
        success: false,
        found: false,
        message: "Gagal menghubungkan ke server Roblox API. Silakan coba beberapa saat lagi.",
        error: errMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json(
      { success: false, found: false, message: "Parameter query 'username' wajib disertakan." },
      { status: 400 }
    );
  }

  // Reuse POST logic with mock request
  const mockReq = new NextRequest(req.url, {
    method: "POST",
    body: JSON.stringify({ username }),
    headers: { "Content-Type": "application/json" },
  });

  return POST(mockReq);
}
