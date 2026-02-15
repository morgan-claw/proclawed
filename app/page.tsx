"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import s from "./landing.module.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const CALENDAR_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3lYZ1HrlKksgPDdiaohMneviHs6BblWcRdbGJci0qveB5vUNtDY2thNcw_y8kJQ_LKG-T3BfGV";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "joined" | "already_joined" | "error">("idle");
  const joinWaitlist = useMutation(api.waitlist.join);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0.08, 0.25], [0, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0.08, 0.25], [0, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0.08, 0.25], [0, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0.08, 0.25], [0, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0.08, 0.25], [0, 1.2]);

  // Fade-up observer
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const els = document.querySelectorAll(`.${s.fadeUp}`);

    if (reducedMotion) {
      els.forEach((el) => el.classList.add(s.fadeUpVisible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(s.fadeUpVisible);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Count-up observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            countUp(e.target as HTMLElement);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll("[data-count]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`${s.landing} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      {/* NAV */}
      <nav className={s.nav}>
        <div className={`${s.container} ${s.navInner}`}>
          <a href="#" className={s.logo}>
            Pro<span className={s.logoAccent}>Clawed</span>
          </a>
          <button
            className={`${s.hamburger} ${menuOpen ? s.hamburgerActive : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
          <div
            className={`${s.navLinks} ${menuOpen ? s.navLinksOpen : ""}`}
          >
            <a href="#pain" onClick={() => setMenuOpen(false)}>
              The Problem
            </a>
            <a href="#transform" onClick={() => setMenuOpen(false)}>
              The Shift
            </a>
            <a href="#journey" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
            <a href="#proof" onClick={() => setMenuOpen(false)}>
              Proof
            </a>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={s.navCta}
            >
              Book a Call
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={s.hero} ref={heroRef}>
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
          className={s.heroBg}
        />
        <div className={`${s.heroContent} ${s.fadeUp}`}>
          <h1 className={s.heroH1}>
            Skip the AI strategy.
            <br />
            <span className={s.accent}>Deploy agents that run your business.</span>
          </h1>
          <p className={s.heroP}>
            We build, secure, and ship production AI agents that
            actually operate your workflows so you don&apos;t have to.
          </p>
          <div className={s.heroActions}>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={s.btnPrimary}
            >
              Book a Discovery Call
            </a>
            <div className={s.heroEmailWrap}>
              {waitlistStatus === "joined" || waitlistStatus === "already_joined" ? (
                <p className={s.heroEmailSuccess}>You&apos;re in. We&apos;ll be in touch.</p>
              ) : (
                <form
                  className={s.heroEmailForm}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!waitlistEmail || waitlistStatus === "submitting") return;
                    setWaitlistStatus("submitting");
                    try {
                      const result = await joinWaitlist({
                        email: waitlistEmail,
                        interest: "both",
                        source: "hero",
                      });
                      setWaitlistStatus(result.status === "already_joined" ? "already_joined" : "joined");
                    } catch {
                      setWaitlistStatus("error");
                    }
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className={s.heroEmailInput}
                  />
                  <button
                    type="submit"
                    disabled={waitlistStatus === "submitting"}
                    className={s.heroEmailSubmit}
                  >
                    {waitlistStatus === "submitting" ? "..." : "Get Early Access"}
                  </button>
                </form>
              )}
              {waitlistStatus === "error" && (
                <p className={s.heroEmailError}>Failed. Try again.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section id="pain" className={s.section}>
        <div className={s.container}>
          <div className={s.painGrid}>
            <div className={s.fadeUp}>
              <div className={s.sectionLabel}>The reality</div>
              <h2 className={s.sectionHeading}>
                You&apos;ve tried AI.
                <br />
                It didn&apos;t stick.
              </h2>

              <div className={s.painPoint}>
                <div className={s.painIcon} />
                <p>
                  <strong>40+ hours</strong> burned configuring tools that still
                  don&apos;t talk to each other.
                </p>
              </div>
              <div className={s.painPoint}>
                <div className={s.painIcon} />
                <p>
                  <strong>Security gaps</strong> you can feel but can&apos;t find.
                  API keys in plaintext, no audit trail.
                </p>
              </div>
              <div className={s.painPoint}>
                <div className={s.painIcon} />
                <p>
                  <strong>Agents that break</strong> the moment you stop
                  babysitting them.
                </p>
              </div>
              <div className={s.painPoint}>
                <div className={s.painIcon} />
                <p>
                  <strong>Your competitors</strong> are automating. You&apos;re
                  still copy-pasting.
                </p>
              </div>

              <p className={s.painBridge}>There&apos;s a faster way. →</p>
            </div>
            <div className={s.fadeUp} style={{ transitionDelay: "0.15s" }}>
              <div className={s.terminalCard}>
                <div className={s.terminalDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={s.lineDim}>$ agent status --all</div>
                <div className={s.lineRed}>
                  ✗ sales-agent &nbsp;&nbsp;&nbsp;&nbsp; crashed (memory leak)
                </div>
                <div className={s.lineRed}>
                  ✗ support-bot &nbsp;&nbsp;&nbsp; offline (auth expired)
                </div>
                <div className={s.lineDim}>
                  ⚠ data-pipeline &nbsp; degraded (3h behind)
                </div>
                <div className={s.lineRed}>
                  ✗ email-agent &nbsp;&nbsp;&nbsp; failed (API key revoked)
                </div>
                <br />
                <div className={s.lineDim}>uptime: 23.4%</div>
                <div className={s.lineDim}>last healthy: 6 days ago</div>
                <br />
                <div className={s.lineRed}>
                  ALERT: 147 unprocessed tasks in queue
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORMATION */}
      <section id="transform" className={s.section}>
        <div className={s.container}>
          <div className={s.fadeUp}>
            <div className={s.sectionLabel}>The shift</div>
            <h2 className={s.sectionHeading}>
              From experimenting to <span className={s.accent}>compounding.</span>
            </h2>
          </div>
          <div className={s.transformGrid}>
            <div
              className={`${s.transformCard} ${s.transformCardBefore} ${s.fadeUp}`}
            >
              <h3>Before ProClawed</h3>
              <ul>
                <li>40 hours of configuration per agent</li>
                <li>Security gaps you discover in production</li>
                <li>Agents that break when you&apos;re not looking</li>
                <li>
                  &ldquo;AI strategy&rdquo; that&apos;s really just prompt
                  tweaking
                </li>
              </ul>
            </div>
            <div
              className={`${s.transformCard} ${s.transformCardAfter} ${s.fadeUp}`}
              style={{ transitionDelay: "0.1s" }}
            >
              <h3>After ProClawed</h3>
              <ul>
                <li>Live in 48 hours. Hardened, monitored, running</li>
                <li>Enterprise security from day one</li>
                <li>Agents working your workflows while you sleep</li>
                <li>A system that compounds, not another experiment</li>
              </ul>
            </div>
          </div>
          <p className={`${s.identityLine} ${s.fadeUp}`}>
            <strong>ProClawed clients</strong> are the ones who stopped
            experimenting and started operating.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="journey" className={s.section}>
        <div className={s.container}>
          <div className={s.fadeUp} style={{ textAlign: "center" }}>
            <div className={s.sectionLabel}>Pricing</div>
            <h2 className={s.sectionHeading}>
              Four steps to <span className={s.accent}>autonomous.</span>
            </h2>
          </div>
          <div className={s.pricingGrid}>
            {/* The Scan */}
            <div className={`${s.pricingCard} ${s.fadeUp}`}>
              <div className={s.pricingStep}>Step 01</div>
              <h3>The Scan</h3>
              <div className={s.pricingAmount}>
                <span className={s.pricingValue}>$750</span>
              </div>
              <p className={s.pricingDesc}>
                Audit your workflows and find the highest-leverage automation
                opportunities.
              </p>
              <div className={s.pricingDivider} />
              <ul className={s.pricingFeatures}>
                <li>
                  <span className={s.pricingCheck} />
                  Full workflow audit
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  ROI analysis per automation
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Prioritized opportunity map
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  30-minute strategy call
                </li>
              </ul>
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.pricingCta}
              >
                Start Here
              </a>
            </div>

            {/* Ignition */}
            <div
              className={`${s.pricingCard} ${s.fadeUp}`}
              style={{ transitionDelay: "0.08s" }}
            >
              <div className={s.pricingStep}>Step 02</div>
              <h3>Ignition</h3>
              <div className={s.pricingAmount}>
                <span className={s.pricingValue}>$2,500</span>
              </div>
              <p className={s.pricingDesc}>
                Your first production agent, deployed, secured, and delivering
                value in 48 hours.
              </p>
              <div className={s.pricingDivider} />
              <ul className={s.pricingFeatures}>
                <li>
                  <span className={s.pricingCheck} />
                  1 production-grade agent
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Enterprise security hardened
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  48-hour deployment
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Monitoring &amp; alerting
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  14-day support window
                </li>
              </ul>
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.pricingCta}
              >
                Get Started
              </a>
            </div>

            {/* Architect - Popular */}
            <div
              className={`${s.pricingCard} ${s.pricingCardPopular} ${s.fadeUp}`}
              style={{ transitionDelay: "0.16s" }}
            >
              <div className={s.pricingBadge}>Most Popular</div>
              <div className={s.pricingStep}>Step 03</div>
              <h3>Architect</h3>
              <div className={s.pricingAmount}>
                <span className={s.pricingValue}>$7,500</span>
              </div>
              <p className={s.pricingDesc}>
                A multi-agent system designed around your business. Agents that
                coordinate, not just execute.
              </p>
              <div className={s.pricingDivider} />
              <ul className={s.pricingFeatures}>
                <li>
                  <span className={s.pricingCheck} />
                  Multi-agent architecture
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Custom workflow integration
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Agent-to-agent coordination
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Full security audit
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Dashboard &amp; analytics
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  30-day support window
                </li>
              </ul>
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.pricingCta} ${s.pricingCtaPrimary}`}
              >
                Book a Call
              </a>
            </div>

            {/* Command */}
            <div
              className={`${s.pricingCard} ${s.fadeUp}`}
              style={{ transitionDelay: "0.24s" }}
            >
              <div className={s.pricingStep}>Step 04</div>
              <h3>Command</h3>
              <div className={s.pricingAmount}>
                <span className={s.pricingValue}>$2,000</span>
                <span className={s.pricingPeriod}>/mo</span>
              </div>
              <p className={s.pricingDesc}>
                Ongoing management, monitoring, and evolution. Your AI
                operations team, without the headcount.
              </p>
              <div className={s.pricingDivider} />
              <ul className={s.pricingFeatures}>
                <li>
                  <span className={s.pricingCheck} />
                  24/7 agent monitoring
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Performance optimization
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  New agent deployments
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Monthly strategy review
                </li>
                <li>
                  <span className={s.pricingCheck} />
                  Priority support
                </li>
              </ul>
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.pricingCta}
              >
                Subscribe
              </a>
            </div>
          </div>
          <p className={`${s.pricingNote} ${s.fadeUp}`}>
            Most clients start with The Scan. All prices in USD.
          </p>
        </div>
      </section>

      {/* PROOF */}
      <section id="proof" className={s.section}>
        <div className={s.container}>
          <div className={s.fadeUp} style={{ textAlign: "center" }}>
            <div className={s.sectionLabel}>We run what we sell</div>
            <h2 className={s.sectionHeading}>
              Our own business is{" "}
              <span className={s.accent}>agent-operated.</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              ProClawed runs on a 5-agent system we built for ourselves. Same
              architecture. Same standards. Every day.
            </p>
          </div>
          <div className={s.statsGrid}>
            <div className={`${s.statCard} ${s.fadeUp}`}>
              <div className={s.statNumber} data-count="5">
                0
              </div>
              <div className={s.statLabel}>Agents Running</div>
            </div>
            <div
              className={`${s.statCard} ${s.fadeUp}`}
              style={{ transitionDelay: "0.08s" }}
            >
              <div className={s.statNumber} data-count="12">
                0
              </div>
              <div className={s.statLabel}>Channels Connected</div>
            </div>
            <div
              className={`${s.statCard} ${s.fadeUp}`}
              style={{ transitionDelay: "0.16s" }}
            >
              <div
                className={s.statNumber}
                data-count="99.9"
                data-suffix="%"
                data-decimal="1"
              >
                0
              </div>
              <div className={s.statLabel}>Uptime</div>
            </div>
            <div
              className={`${s.statCard} ${s.fadeUp}`}
              style={{ transitionDelay: "0.24s" }}
            >
              <div className={s.statNumber} data-count="50" data-suffix="+">
                0
              </div>
              <div className={s.statLabel}>Workflows Automated</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className={s.finalCta}>
        <div className={s.container}>
          <div className={s.fadeUp}>
            <div className={s.sectionLabel}>Ready?</div>
            <h2 className={s.sectionHeading}>
              Stop configuring.
              <br />
              <span className={s.accent}>Start operating.</span>
            </h2>
            <p>
              One call. We&apos;ll map your highest-leverage automation and show
              you exactly what&apos;s possible.
            </p>
            <div className={s.ctaButtons}>
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.btnPrimary}
              >
                Book a Discovery Call
              </a>
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={s.btnSecondary}
              >
                Start with The Scan · $750
              </a>
            </div>

            {/* Email signup */}
            <div className={s.waitlistDivider}>
              <span>or stay in the loop</span>
            </div>
            {waitlistStatus === "joined" || waitlistStatus === "already_joined" ? (
              <p className={s.waitlistInlineSuccess}>
                {waitlistStatus === "already_joined"
                  ? "You're already on the list."
                  : "You're in. We'll be in touch."}
              </p>
            ) : (
              <form
                className={s.waitlistForm}
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!waitlistEmail || waitlistStatus === "submitting") return;
                  setWaitlistStatus("submitting");
                  try {
                    const result = await joinWaitlist({
                      email: waitlistEmail,
                      interest: "both",
                      source: "landing",
                    });
                    setWaitlistStatus(result.status === "already_joined" ? "already_joined" : "joined");
                  } catch {
                    setWaitlistStatus("error");
                  }
                }}
              >
                <div className={s.waitlistInputRow}>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className={s.waitlistInput}
                  />
                  <button
                    type="submit"
                    disabled={waitlistStatus === "submitting"}
                    className={s.waitlistSubmit}
                  >
                    {waitlistStatus === "submitting" ? "Sending..." : "Get Updates"}
                  </button>
                </div>
                {waitlistStatus === "error" && (
                  <p className={s.waitlistError}>Something went wrong. Try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={`${s.container} ${s.footerInner}`}>
          <div className={s.copyright}>
            © 2026 ProClawed. All rights reserved.
          </div>
          <div className={s.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="mailto:hello@proclawed.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function countUp(el: HTMLElement) {
  const target = parseFloat(el.dataset.count || "0");
  const suffix = el.dataset.suffix || "";
  const decimal = parseInt(el.dataset.decimal || "0", 10);
  const duration = 1800;
  const start = performance.now();

  function update(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent =
      (decimal ? current.toFixed(decimal) : Math.floor(current).toString()) +
      suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
