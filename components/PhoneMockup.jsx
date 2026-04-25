export function ClosetScreen() {
  const items = ['👗','👕','👖','👟','🧥','👜','🩱','🥿','🧣']
  const bgs = ['#f8f4f0','#f0f4f8','#f4f0f8','#f8f0f0','#f0f8f4','#f8f8f0','#f8f4f0','#f0f4f8','#f4f0f8']
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
        <span className="font-jost text-xs font-medium text-black">🔒 Your Closet</span>
      </div>
      <div className="flex gap-2 px-4 py-2 overflow-hidden">
        {['All','Tops','Bottoms','Shoes'].map((c,i) => (
          <span key={c} className="text-xs px-3 py-1 rounded-full whitespace-nowrap font-jost"
            style={{ background: i===0?'#111':'#f5f5f5', color: i===0?'#fff':'#888' }}>{c}</span>
        ))}
      </div>
      <div className="flex gap-1 px-4 pb-2">
        <span className="text-xs px-3 py-1 rounded-full font-jost" style={{ background: '#111', color: '#fff' }}>Public</span>
        <span className="text-xs px-3 py-1 rounded-full font-jost" style={{ border: '1px solid #eee', color: '#888' }}>Private</span>
      </div>
      <div className="grid grid-cols-3 gap-1 px-4 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-center rounded-lg text-xl aspect-square"
            style={{ background: bgs[i] }}>{item}</div>
        ))}
      </div>
    </div>
  )
}

export function PollScreen() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3 font-jost text-xs text-gray-400" style={{ borderBottom: '1px solid #f0f0f0' }}>Help Me Choose</div>
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="w-6 h-6 rounded-full bg-gray-200" />
        <span className="text-xs font-jost text-black">@stylebypriya</span>
      </div>
      <p className="text-xs font-jost text-gray-400 px-4 pb-2">Date night in 20 mins. Which one? 🤍</p>
      <div className="grid grid-cols-2 gap-0.5 mx-4 rounded-xl overflow-hidden flex-1">
        <div className="flex items-center justify-center text-4xl relative" style={{ background: '#f5f0eb', aspectRatio: '0.7' }}>
          <span>👗</span>
          <div className="absolute bottom-0 left-0 right-0 py-1.5 text-center text-xs text-white font-jost" style={{ background: 'rgba(0,0,0,0.6)' }}>62%</div>
        </div>
        <div className="flex items-center justify-center text-4xl relative" style={{ background: '#0e0e0e', aspectRatio: '0.7' }}>
          <span>🖤</span>
          <div className="absolute bottom-0 left-0 right-0 py-1.5 text-center text-xs text-white font-jost" style={{ background: 'rgba(0,0,0,0.6)' }}>38%</div>
        </div>
      </div>
      <div className="flex gap-3 px-4 py-2">
        {['❤️ 248','💬 42','📤 Share'].map(s => <span key={s} className="text-xs text-gray-400 font-jost">{s}</span>)}
      </div>
    </div>
  )
}

export function VibeScreen() {
  return (
    <div className="flex flex-col h-full relative" style={{ background: '#0e0e0e' }}>
      <div className="flex-1 flex items-center justify-center text-5xl relative"
        style={{ background: 'linear-gradient(180deg,#1a1a1a 0%,#2a2520 60%,#1a1a1a 100%)' }}>
        <span>👗</span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-center">
          {[['❤️','12.4k'],['💬','342'],['📤','Share']].map(([icon,num]) => (
            <div key={num} className="flex flex-col items-center gap-0.5">
              <span className="text-base">{icon}</span>
              <span className="text-xs font-jost" style={{ color: '#888' }}>{num}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-2.5 right-2.5 rounded-xl p-2 flex justify-between items-center"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
          <div>
            <p className="text-xs font-jost text-white">Vintage Denim Jacket</p>
            <p className="text-xs font-jost" style={{ color: '#C9A84C' }}>₹2,499 · @streetwear_delhi</p>
          </div>
          <span className="text-xs font-jost px-2 py-1 rounded-lg" style={{ background: '#C9A84C', color: '#000' }}>Buy ✦</span>
        </div>
      </div>
      <div className="px-4 py-2" style={{ background: '#0e0e0e' }}>
        <span className="text-xs font-jost" style={{ color: 'rgba(255,255,255,0.5)' }}>@streetwear_delhi · Styling the new drop 🔥</span>
      </div>
    </div>
  )
}

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3" style={{ background: '#0a0a0a' }}>
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width={52} height={52}
        style={{ filter: 'drop-shadow(0 0 16px rgba(201,168,76,0.4)', animation: 'sparkle 8s ease-in-out infinite' }}>
        <path d="M40 5 L44.5 35.5 L75 40 L44.5 44.5 L40 75 L35.5 44.5 L5 40 L35.5 35.5 Z" fill="#C9A84C"/>
        <circle cx="70" cy="12" r="4" fill="#C9A84C" opacity="0.4"/>
        <circle cx="12" cy="70" r="3" fill="#C9A84C" opacity="0.22"/>
      </svg>
      <span className="font-cormorant text-2xl tracking-widest text-white" style={{ fontWeight: 300 }}>flauntr</span>
      <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(201,168,76,0.5)', fontSize: '9px' }}>Your Runway Awaits</span>
    </div>
  )
}

export default function PhoneMockup({ screen = 'splash', tilt = 0, opacity = 1, scale = 1 }) {
  const screens = { splash: SplashScreen, closet: ClosetScreen, poll: PollScreen, vibe: VibeScreen }
  const Screen = screens[screen] || SplashScreen

  return (
    <div style={{
      width: '240px',
      borderRadius: '36px',
      overflow: 'hidden',
      border: `1.5px solid rgba(201,168,76,${opacity === 1 ? 0.18 : 0.08})`,
      boxShadow: opacity === 1 ? '0 40px 80px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.05)' : 'none',
      transform: `rotate(${tilt}deg) scale(${scale})`,
      opacity,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
        width: '60px', height: '6px', background: '#000', borderRadius: '3px', zIndex: 10
      }} />
      <div style={{ width: '100%', aspectRatio: '9/19.5', overflow: 'hidden' }}>
        <Screen />
      </div>
    </div>
  )
}
