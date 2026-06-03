// Drop into: flauntr-web/pages/privacy.jsx
// Live at: yoursite.com/privacy

import Head from 'next/head'
import Link from 'next/link'

const SECTIONS = [
    {
        num: '01',
        title: 'Information We Collect',
        content: [
            {
                sub: 'Account Information',
                text: 'When you register on Fluntr, we collect your name, email address, password (stored in encrypted form), and profile preferences.',
            },
            {
                sub: 'User-Generated Content',
                text: 'We collect images of clothing items, digitised wardrobe entries, personalised collections, and outfit content you upload directly to the App.',
            },
            {
                sub: 'Technical & Usage Data',
                text: 'We collect device identifiers, log files, and app interaction data to improve performance, fix errors, and optimise the experience.',
            },
        ],
    },
    {
        num: '02',
        title: 'How We Use Your Data',
        content: [
            {
                sub: 'Core Services',
                text: 'We use your data to organise and display your digital wardrobe, store your uploaded images securely via trusted cloud infrastructure (AWS S3), and deliver all features of the Fluntr platform.',
            },
            {
                sub: 'Improving the App',
                text: 'Usage data helps us fix bugs, improve performance, and build better features for our community.',
            },
            {
                sub: 'Communications',
                text: 'We may send you product updates, waitlist confirmations, or important account notices. You may opt out of non-essential communications at any time.',
            },
        ],
    },
    {
        num: '03',
        title: 'Data Sharing & Third Parties',
        content: [
            {
                sub: 'We do not sell your data',
                text: 'Fluntr does not sell, rent, or trade your personal information to third parties for marketing purposes.',
            },
            {
                sub: 'Service Providers',
                text: 'We share data only with trusted service providers who help us operate the App — including cloud storage (AWS), payment processing (Razorpay / Stripe), and analytics tools. These providers are bound by confidentiality obligations.',
            },
            {
                sub: 'Legal Obligations',
                text: 'We may disclose your information if required by law, court order, or governmental authority.',
            },
        ],
    },
    {
        num: '04',
        title: 'Data Protection & Security',
        content: [
            {
                sub: 'Encryption',
                text: 'All data transmitted between your device and our servers is protected using industry-standard SSL/TLS encryption. Stored data is encrypted at rest.',
            },
            {
                sub: 'Access Controls',
                text: 'Access to our production databases is restricted to authorised personnel only. We follow security best practices to prevent unauthorised access.',
            },
        ],
    },
    {
        num: '05',
        title: 'Your Rights & Account Deletion',
        content: [
            {
                sub: 'Access & Correction',
                text: 'You may access, update, or correct your personal information at any time through your profile settings in the App.',
            },
            {
                sub: 'Account Deletion — In-App',
                text: 'You can permanently delete your account and all associated data by navigating to: Profile → Settings → Delete Account.',
            },
            {
                sub: 'Account Deletion — Web Form',
                text: 'If you have uninstalled the App or prefer to submit a request externally, use our official data deletion form:',
                link: {
                    href: 'https://forms.gle/kM4CPqDnbuvgk2QZ6',
                    label: 'Submit Data Deletion Request →',
                },
            },
            {
                sub: 'What gets deleted',
                text: 'Upon a verified deletion request, we permanently remove your account, all uploaded wardrobe images, profile data, and personal information from our systems within 30 days. This action is irreversible.',
            },
        ],
    },
    {
        num: '06',
        title: "Children's Privacy",
        content: [
            {
                sub: 'Age Requirement',
                text: 'Fluntr is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal data, we will delete it immediately.',
            },
        ],
    },
    {
        num: '07',
        title: 'Changes to This Policy',
        content: [
            {
                sub: 'Policy Updates',
                text: 'We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the effective date at the top of this page and, where appropriate, through in-app notifications. Continued use of the App after changes constitutes your acceptance of the updated policy.',
            },
        ],
    },
    {
        num: '08',
        title: 'Contact Us',
        content: [
            {
                sub: 'Legal & Privacy Enquiries',
                text: 'For any questions about this Privacy Policy or how we handle your data, contact us at:',
                link: {
                    href: 'mailto:support@fluntr.com',
                    label: 'support@fluntr.com',
                },
            },
            {
                sub: 'Company',
                text: 'Melchizedek Technologies Private Limited (MTPL), India.',
            },
        ],
    },
]

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy — Fluntr</title>
                <meta name="description" content="Fluntr Privacy Policy — how we collect, use, and protect your data." />
            </Head>

            <div style={{
                background: '#09090b',
                minHeight: '100vh',
                fontFamily: "'Jost', sans-serif",
                color: '#fff',
            }}>
                {/* Nav */}
                <nav style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '0.5px solid rgba(201,168,76,0.1)',
                    background: 'rgba(9,9,11,0.95)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
                            <path d="M30 4 L33.5 26.5 L56 30 L33.5 33.5 L30 56 L26.5 33.5 L4 30 L26.5 26.5 Z" fill="#C9A84C" />
                        </svg>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', letterSpacing: '3px', color: '#fff', fontWeight: 400 }}>
                            fluntr
                        </span>
                    </Link>
                    <Link href="/" style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', textTransform: 'uppercase' }}>
                        ← Back to Home
                    </Link>
                </nav>

                {/* Hero */}
                <div style={{
                    padding: '60px 24px 40px',
                    maxWidth: '760px',
                    margin: '0 auto',
                    borderBottom: '0.5px solid rgba(201,168,76,0.1)',
                }}>
                    <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 400 }}>
                        Legal
                    </p>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(36px, 8vw, 64px)',
                        fontWeight: 300,
                        lineHeight: 1.05,
                        color: '#fff',
                        marginBottom: '20px',
                        letterSpacing: '-0.5px',
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
                        Effective Date: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>June 3, 2026</strong>
                    </p>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginTop: '8px' }}>
                        Melchizedek Technologies Private Limited ("MTPL", "we", "us", or "our") operates the Fluntr mobile application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our digital wardrobe and social commerce platform.
                    </p>

                    {/* Quick deletion CTA — Google Play requires this to be prominent */}
                    <div style={{
                        marginTop: '28px',
                        padding: '20px 24px',
                        background: 'rgba(201,168,76,0.06)',
                        border: '0.5px solid rgba(201,168,76,0.25)',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                    }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#fff', fontWeight: 500, marginBottom: '4px' }}>Want to delete your account?</p>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>Submit a data deletion request instantly.</p>
                        </div>
                        <a
                            href="https://forms.gle/kM4CPqDnbuvgk2QZ6"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '10px 24px',
                                background: '#C9A84C',
                                color: '#09090b',
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Delete My Data →
                        </a>
                    </div>
                </div>

                {/* Sections */}
                <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px' }}>
                    {SECTIONS.map((section, si) => (
                        <div
                            key={section.num}
                            style={{
                                padding: '40px 0',
                                borderBottom: '0.5px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <span style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '13px',
                                    color: 'rgba(201,168,76,0.5)',
                                    letterSpacing: '0.1em',
                                    flexShrink: 0,
                                    paddingTop: '4px',
                                }}>
                                    {section.num}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: 'clamp(22px, 5vw, 30px)',
                                        fontWeight: 400,
                                        color: '#fff',
                                        marginBottom: '24px',
                                        letterSpacing: '-0.2px',
                                    }}>
                                        {section.title}
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {section.content.map((item, ci) => (
                                            <div key={ci}>
                                                <p style={{
                                                    fontSize: '12px',
                                                    letterSpacing: '0.1em',
                                                    color: '#C9A84C',
                                                    textTransform: 'uppercase',
                                                    marginBottom: '6px',
                                                    fontWeight: 400,
                                                }}>
                                                    {item.sub}
                                                </p>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: 'rgba(255,255,255,0.55)',
                                                    lineHeight: 1.85,
                                                    letterSpacing: '0.01em',
                                                }}>
                                                    {item.text}
                                                </p>
                                                {item.link && (
                                                    <a
                                                        href={item.link.href}
                                                        target={item.link.href.startsWith('http') ? '_blank' : undefined}
                                                        rel={item.link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                        style={{
                                                            display: 'inline-block',
                                                            marginTop: '10px',
                                                            fontSize: '13px',
                                                            color: '#C9A84C',
                                                            textDecoration: 'underline',
                                                            letterSpacing: '0.02em',
                                                        }}
                                                    >
                                                        {item.link.label}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    borderTop: '0.5px solid rgba(201,168,76,0.1)',
                    padding: '32px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    maxWidth: '760px',
                    margin: '0 auto',
                }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
                        © 2026 Melchizedek Technologies Private Limited. All rights reserved.
                    </p>
                    <Link href="/" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        fluntr.com
                    </Link>
                </div>
            </div>
        </>
    )
}
