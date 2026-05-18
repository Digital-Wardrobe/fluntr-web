// Drop into: flauntr-web/components/PhoneMockup.jsx
// Your images go in: flauntr-web/public/screens/

const screenMap = {
  splash: '/screens/splash.png',
  home: '/screens/home.png',
  login: '/screens/login.png',
  closet: '/screens/closet.png',
  posts: '/screens/posts.png',
  addcloset: '/screens/addcloset.png',
}

export default function PhoneMockup({
  screen = 'splash',
  tilt = 0,
  opacity = 1,
  scale = 1,
  width = 240,
}) {
  const src = screenMap[screen] || '/screens/splash.png'

  return (
    <div
      style={{
        width: `${width}px`,
        borderRadius: '36px',
        overflow: 'hidden',
        border: `1.5px solid rgba(201,168,76,${opacity === 1 ? 0.2 : 0.07})`,
        boxShadow: opacity === 1
          ? '0 40px 80px rgba(0,0,0,0.65), 0 0 32px rgba(201,168,76,0.06)'
          : 'none',
        transform: `rotate(${tilt}deg) scale(${scale})`,
        opacity,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Notch */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '6px',
        background: '#000',
        borderRadius: '3px',
        zIndex: 10,
      }} />
      <img
        src={src}
        alt={`Fluntr ${screen} screen`}
        style={{ width: '100%', display: 'block' }}
      />
    </div>
  )
}
