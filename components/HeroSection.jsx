'use client'
// Drop into: flauntr-web/components/HeroSection.jsx

import { motion } from 'framer-motion'
import PhoneMockup from './PhoneMockup'

export default function HeroSection({ waitlistCount }) {
    return (
        <section
            className="min-height-screen flex items-center relative overflow-hidden"
            style={{
                minHeight: '100vh',
                padding: '140px 60px 100px',
                backgroundImage:
                    'linear-gradient(rgba(201,168,76,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.025) 1px,transparent 1px)',
                backgroundSize: '80px 80px',
            }}
        >
            {/* Glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '50%', left: '35%',
                    transform: 'translate(-50%,-50%)',
                    width: '700px', height: '700px',
                    background: 'radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%)',
                }}
            />

            <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-16 max-md:flex-col relative z-10">

                {/* Left copy */}
                <div className="flex-1 max-w-xl max-md:text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xs tracking-widest uppercase mb-7 flex items-center gap-3 max-md:justify-center"
                        style={{ color: '#C9A84C' }}
                    >
                        <span style={{ width: 32, height: '0.5px', background: 'rgba(201,168,76,0.4)', display: 'inline-block' }} />
                        Introducing Fluntr
                        <span style={{ width: 32, height: '0.5px', background: 'rgba(201,168,76,0.4)', display: 'inline-block' }} />
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="font-cormorant font-light leading-none mb-7"
                        style={{ fontSize: 'clamp(52px,7vw,96px)', letterSpacing: '-1px' }}
                    >
                        <span className="block">Your Wardrobe.</span>
                        <span className="block" style={{ fontStyle: 'italic', color: '#E2C97E' }}>Your Runway.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="text-sm leading-relaxed mb-12 max-w-md max-md:mx-auto"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                        <strong className="text-white font-normal">
                            Fluntr is the social commerce app that turns your wardrobe into a runway.
                        </strong>
                        <br />
                        Digitise your closet, plan every occasion, and never open your wardrobe clueless again.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                        className="flex gap-4 flex-wrap mb-12 max-md:justify-center"
                    >
                        <a href="#waitlist" className="btn-gold">Join the Waitlist ✦</a>
                        <a href="#features" className="btn-outline">See How it Works</a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                        className="flex gap-10 flex-wrap max-md:justify-center"
                    >
                        {[
                            [waitlistCount, 'On Waitlist'],
                            [3, 'Core Pillars'],
                            [1, 'App. All of it.'],
                        ].map(([num, label]) => (
                            <div key={label}>
                                <span className="font-cormorant block font-light" style={{ fontSize: '30px', color: '#E2C97E', lineHeight: 1 }}>{num}</span>
                                <span className="block text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.58)' }}>{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Phone stack with real screenshots */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="flex-1 flex justify-center items-center max-md:w-full"
                >
                    <div className="relative" style={{ width: '300px', height: '560px' }}>
                        {/* Back left — login screen */}
                        <div className="absolute" style={{ left: 0, top: 80, zIndex: 1 }}>
                            <PhoneMockup screen="login" tilt={-7} opacity={0.35} scale={0.83} width={200} />
                        </div>
                        {/* Back right — closet screen */}
                        <div className="absolute" style={{ left: 80, top: 80, zIndex: 1 }}>
                            <PhoneMockup screen="closet" tilt={7} opacity={0.28} scale={0.83} width={200} />
                        </div>
                        {/* Main — splash screen */}
                        <div className="absolute" style={{ left: 25, top: 0, zIndex: 3 }}>
                            <PhoneMockup screen="splash" width={250} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
