import { PreviewHead, OpenInApp, Unavailable, API_BASE } from '../../components/SharePreview'

// Share-link landing page: fluntr.com/post/:id
export async function getServerSideProps({ params, res }) {
  try {
    const r = await fetch(`${API_BASE}/api/public/post/${encodeURIComponent(params.id)}`)
    if (!r.ok) { res.statusCode = 404; return { props: { post: null } } }
    const { post } = await r.json()
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return { props: { post } }
  } catch {
    return { props: { post: null } }
  }
}

export default function PostPage({ post }) {
  if (!post) return <Unavailable what="post" />
  const name = post.user.profileName || `@${post.user.username}`
  const caption = post.caption ? post.caption.slice(0, 160) : `A post by ${name} on Fluntr`
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <PreviewHead
        title={`${name} on Fluntr`}
        description={caption}
        image={post.mediaUrls?.[0]}
        url={`https://fluntr.com/post/${post.id}`}
      />
      <div className="w-full max-w-md">
        <a href={`/u/${post.user.username}`} className="flex items-center gap-3 mb-4">
          {post.user.profileImage
            ? <img src={post.user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
            : <div className="w-10 h-10 rounded-full bg-neutral-800" />}
          <div>
            <div className="font-semibold">{post.user.username}</div>
            {post.location && <div className="text-xs text-neutral-400">{post.location}</div>}
          </div>
        </a>
        {post.mediaUrls?.[0] && (
          <img src={post.mediaUrls[0]} alt={post.altText || caption} className="w-full rounded-2xl object-cover" />
        )}
        <div className="flex gap-4 text-sm text-neutral-300 mt-3">
          {post.likeCount !== null && <span>♥ {post.likeCount}</span>}
          <span>💬 {post.commentCount}</span>
          {post.mediaUrls?.length > 1 && <span>+{post.mediaUrls.length - 1} more photos in the app</span>}
        </div>
        {post.caption && <p className="mt-3 whitespace-pre-wrap text-neutral-100">{post.caption}</p>}
        <OpenInApp path={`post/${post.id}`} />
      </div>
    </main>
  )
}
