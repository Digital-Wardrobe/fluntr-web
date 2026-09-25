import { PreviewHead, OpenInApp, Unavailable, API_BASE } from '../../components/SharePreview'

// Share-link landing page: fluntr.com/u/:username
export async function getServerSideProps({ params, res }) {
  try {
    const r = await fetch(`${API_BASE}/api/public/user/${encodeURIComponent(params.username)}`)
    if (!r.ok) { res.statusCode = 404; return { props: { user: null } } }
    const { user } = await r.json()
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return { props: { user } }
  } catch {
    return { props: { user: null } }
  }
}

export default function ProfilePage({ user }) {
  if (!user) return <Unavailable what="account" />
  const name = user.profileName || user.username
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <PreviewHead
        title={`${name} (@${user.username}) on Fluntr`}
        description={user.bio || `See ${name}'s outfits and closet on Fluntr.`}
        image={user.profileImage}
        url={`https://fluntr.com/u/${user.username}`}
      />
      <div className="w-full max-w-md text-center">
        {user.profileImage
          ? <img src={user.profileImage} alt="" className="w-24 h-24 rounded-full object-cover mx-auto" />
          : <div className="w-24 h-24 rounded-full bg-neutral-800 mx-auto" />}
        <h1 className="text-xl font-bold mt-3">{name}</h1>
        <div className="text-neutral-400">@{user.username}</div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <span><b>{user._count.posts}</b> posts</span>
          <span><b>{user._count.followers}</b> followers</span>
          <span><b>{user._count.following}</b> following</span>
        </div>
        {user.bio && <p className="mt-3 text-neutral-200 whitespace-pre-wrap">{user.bio}</p>}
        {user.isPrivate ? (
          <p className="mt-8 text-neutral-400">🔒 This account is private. Follow them in the app to see their posts.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1 mt-6">
            {user.posts.map(p => (
              <a key={p.id} href={`/post/${p.id}`}>
                <img src={p.mediaUrls?.[0]} alt={p.altText || ''} className="w-full aspect-square object-cover" />
              </a>
            ))}
          </div>
        )}
        <OpenInApp path={`u/${user.username}`} />
      </div>
    </main>
  )
}
