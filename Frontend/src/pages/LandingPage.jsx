import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Share2,
  Users,
  Bell,
  Search,
  Shield,
  Moon,
  ArrowRight,
  Sparkles,
  Heart,
  MessageCircle,
  TrendingUp,
  Zap,
  Globe,
  ChevronRight,
  Star,
  Compass,
  User,
} from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle";
import Button from "../components/ui/Button";
import Logo from "../components/common/Logo";
import { axiosInstance } from "../utils/api";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const Section = ({ children, className = "", delay = 0, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/* ─── Landing Nav ─── */
const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide
        setIsVisible(false);
      } else {
        // Scrolling up - show
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }
        ${scrolled
          ? "bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--border)] shadow-[var(--shadow)]"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-2">
          <Logo height={54} />
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-base font-semibold text-[var(--text)] opacity-85 hover:opacity-100 transition-opacity">Features</a>
          <a href="#how-it-works" className="text-base font-semibold text-[var(--text)] opacity-85 hover:opacity-100 transition-opacity">How it works</a>
          <a href="#testimonials" className="text-base font-semibold text-[var(--text)] opacity-85 hover:opacity-100 transition-opacity">Testimonials</a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="secondary"
            size="md"
            as="link"
            to="/login"
            className="text-base font-semibold px-4 py-2"
          >
            Sign in
          </Button>
          <Button
            variant="primary"
            size="md"
            as="link"
            to="/register"
            className="text-base font-semibold px-4 py-2"
          >
            Get started
          </Button>
        </div>
      </div>
    </nav>
  );
};

/* ─── Animated Gradient Blobs ─── */
const GradientBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div
      className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30
        bg-gradient-to-br from-brand-400 to-violet-500
        blur-[100px] animate-blob-1"
    />
    <div
      className="absolute -top-16 right-0 w-[400px] h-[400px] rounded-full opacity-25
        bg-gradient-to-br from-violet-400 to-teal-400
        blur-[100px] animate-blob-2"
    />
    <div
      className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full opacity-20
        bg-gradient-to-br from-brand-500 to-indigo-400
        blur-[120px] animate-blob-3"
    />

    {/* Subtle grain overlay */}
    <div
      className="absolute inset-0 opacity-[0.03] dark:hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />

    <style>{`
      @keyframes blob1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
      }
      @keyframes blob2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-40px, 30px) scale(1.05); }
        66% { transform: translate(25px, -35px) scale(0.95); }
      }
      @keyframes blob3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(35px, 25px) scale(0.95); }
        66% { transform: translate(-30px, -40px) scale(1.1); }
      }
      .animate-blob-1 { animation: blob1 20s ease-in-out infinite; }
      .animate-blob-2 { animation: blob2 25s ease-in-out infinite; }
      .animate-blob-3 { animation: blob3 22s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .animate-blob-1, .animate-blob-2, .animate-blob-3 {
          animation: none;
        }
      }
    `}</style>
  </div>
);

/* ─── Interactive Preview component ─── */
const InteractivePreview = () => {
  const [mockPosts, setMockPosts] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      username: "sarah_chen",
      role: "Product Designer at Figma",
      avatarText: "SC",
      text: "Just shipped our new design system! 🎨 Consistency across 40+ components, warm neutral tones, and system-aware dark mode.",
      likes: 12,
      comments: [
        {
          name: "Marcus Johnson",
          username: "marcus_johnson",
          text: "Looks extremely clean! The warm greige tone is perfect.",
          replies: [
            { name: "Sarah Chen", username: "sarah_chen", text: "Thank you Marcus! Appreciate the feedback." }
          ]
        }
      ],
      liked: false,
      showComments: false,
    },
    {
      id: 2,
      name: "Marcus Johnson",
      username: "marcus_johnson",
      role: "Full Stack Dev",
      avatarText: "MJ",
      text: "Real-time notifications with Socket.IO are a game changer. Live updates feel so much better. Try clicking like or adding a comment to this card! 👇",
      likes: 8,
      comments: [],
      liked: false,
      showComments: false,
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);

  const toggleLike = (id) => {
    setMockPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  const toggleComments = (id) => {
    setMockPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, showComments: !p.showComments };
        }
        return p;
      })
    );
  };

  const addComment = (e, postId) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setMockPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, { name: "You (Guest)", text: newComment.trim() }]
          };
        }
        return p;
      })
    );
    setNewComment("");
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-lg)]
      p-4 sm:p-6 max-w-3xl mx-auto text-left relative backdrop-blur-md bg-opacity-70">
      {/* Fake browser bar */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
          <span className="w-3 h-3 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[var(--surface-2)] rounded-md px-4 py-1 text-xs text-[var(--text-faint)] font-mono select-none">
            connectify.app/feed (Interactive Demo)
          </div>
        </div>
      </div>

      {/* Mock Feed */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-[var(--surface-2)] rounded-xl p-4 sm:p-5 border border-[var(--border-light)] hover:border-brand-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                  {post.avatarText}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text)] flex items-center gap-1.5 flex-wrap">
                    {post.name}
                    <span className="text-xs font-normal text-[var(--text-faint)]">@{post.username}</span>
                  </div>
                  <div className="text-xs text-[var(--text-faint)]">{post.role}</div>
                </div>
              </div>
              <span className="text-[10px] text-[var(--text-faint)]">Just now</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{post.text}</p>
            
            {/* Action Row */}
            <div className="flex items-center gap-6 pt-3 border-t border-[var(--border-light)]">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors
                  ${post.liked ? 'text-brand-600 dark:text-brand-400' : 'text-[var(--text-faint)] hover:text-brand-600'}`}
              >
                <Heart size={14} className={post.liked ? 'fill-current scale-110 transition-transform' : ''} />
                <span>{post.likes}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer transition-colors"
              >
                <MessageCircle size={14} />
                <span>{post.comments.length}</span>
              </button>
            </div>

            {/* Comments List */}
            {post.showComments && (
              <div className="mt-4 pt-3 border-t border-[var(--border-light)] space-y-3">
                {post.comments.map((c, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex gap-2 text-xs">
                      <div className="w-6 h-6 rounded-full bg-[var(--surface-3)] flex items-center justify-center font-bold text-[var(--text-muted)] shrink-0">
                        {c.name[0]}
                      </div>
                      <div className="flex-1 bg-[var(--surface-3)] rounded-lg p-2">
                        <div className="font-semibold text-[var(--text)] flex items-center gap-1.5 flex-wrap">
                          {c.name}
                          {c.username && <span className="text-[10px] font-normal text-[var(--text-faint)]">@{c.username}</span>}
                        </div>
                        <p className="text-[var(--text-muted)] mt-0.5">{c.text}</p>
                      </div>
                    </div>

                    {/* Nested Replies */}
                    {c.replies && c.replies.map((r, ri) => (
                      <div key={ri} className="flex gap-2 text-xs ml-8 border-l-2 border-[var(--border-light)] pl-2">
                        <div className="w-5 h-5 rounded-full bg-[var(--surface-3)] flex items-center justify-center font-bold text-[var(--text-muted)] text-[10px] shrink-0">
                          {r.name[0]}
                        </div>
                        <div className="flex-1 bg-[var(--surface-3)] rounded-lg p-2">
                          <div className="font-semibold text-[var(--text)] flex items-center gap-1.5 flex-wrap">
                            {r.name}
                            {r.username && <span className="text-[10px] font-normal text-[var(--text-faint)]">@{r.username}</span>}
                          </div>
                          <p className="text-[var(--text-muted)] mt-0.5">{r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Add new mock comment */}
                <form onSubmit={(e) => addComment(e, post.id)} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Type a comment and hit enter..."
                    value={activePostId === post.id ? newComment : ""}
                    onChange={(e) => {
                      setActivePostId(post.id);
                      setNewComment(e.target.value);
                    }}
                    className="flex-1 bg-[var(--surface-3)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Hero ─── */
const Hero = () => (
  <div className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden" id="hero">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-brand-600/10 text-brand-600 dark:text-brand-400 text-sm font-medium
          border border-brand-600/20 mb-8">
          <Sparkles size={14} />
          V1.5 - Now with real-time updates
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text)] leading-[1.08] mb-6 text-balance"
      >
        Build your
        <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-400 dark:from-brand-400 dark:via-indigo-300 dark:to-violet-200 bg-clip-text text-transparent"> professional </span>
        network
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Share ideas, follow industry leaders, and discover opportunities.
        A modern platform designed for professionals who move fast.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button variant="primary" size="lg" as="link" to="/register">
          Get started free
          <ArrowRight size={18} />
        </Button>
        <Button variant="secondary" size="lg" as="link" to="/login">
          Sign in
        </Button>
      </motion.div>

      {/* Product preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 sm:mt-20 relative"
      >
        <InteractivePreview />

        {/* Glow behind mockup */}
        <div className="absolute -inset-4 bg-gradient-to-r from-brand-600/5 via-violet-500/5 to-brand-400/5 rounded-3xl -z-10 blur-2xl" />
      </motion.div>
    </div>
  </div>
);

/* ─── Animated Counter Helper ─── */
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const isPercent = typeof value === "string" && value.endsWith("%");
    const isPlus = typeof value === "string" && value.endsWith("+");
    const numStr = isPercent ? value.slice(0, -1) : isPlus ? value.slice(0, -1) : value;
    const target = parseFloat(numStr);

    if (isNaN(target) || target <= 0) {
      setCount(value);
      return;
    }

    let current = 0;
    const duration = 1200; // 1.2 seconds animation
    const steps = 40;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Number.isInteger(target) ? Math.floor(current) : parseFloat(current.toFixed(1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const isPercent = typeof value === "string" && value.endsWith("%");
  const isPlus = typeof value === "string" && value.endsWith("+");
  return (
    <span>
      {count}
      {isPercent ? "%" : isPlus ? "+" : ""}
    </span>
  );
};

/* ─── Social Proof Strip ─── */
const SocialProof = ({ stats }) => {
  const members = stats && !stats.loading ? `${stats.totalUsers}` : "10+";
  const posts = stats && !stats.loading ? `${stats.totalPosts}` : "50+";
  const likes = stats && !stats.loading ? `${stats.totalLikes}` : "120+";

  const data = [
    { 
      value: members, 
      label: "Members", 
      icon: Users, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-500/10 dark:bg-blue-500/20", 
      border: "hover:border-blue-500/40 dark:hover:border-blue-400/40",
      gradient: "from-blue-500 to-indigo-500",
      glow: "rgba(59,130,246,0.15)"
    },
    { 
      value: posts, 
      label: "Posts shared", 
      icon: MessageCircle, 
      color: "text-indigo-600 dark:text-indigo-400", 
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20", 
      border: "hover:border-indigo-500/40 dark:hover:border-indigo-400/40",
      gradient: "from-indigo-500 to-purple-500",
      glow: "rgba(99,102,241,0.15)"
    },
    { 
      value: likes, 
      label: "Likes given", 
      icon: Heart, 
      color: "text-pink-600 dark:text-pink-400", 
      bg: "bg-pink-500/10 dark:bg-pink-500/20", 
      border: "hover:border-pink-500/40 dark:hover:border-pink-400/40",
      gradient: "from-pink-500 to-rose-500",
      glow: "rgba(236,72,153,0.15)"
    },
    { 
      value: "99.9%", 
      label: "Uptime SLA", 
      icon: Globe, 
      color: "text-teal-600 dark:text-teal-400", 
      bg: "bg-teal-500/10 dark:bg-teal-500/20", 
      border: "hover:border-teal-500/40 dark:hover:border-teal-400/40",
      gradient: "from-teal-500 to-emerald-500",
      glow: "rgba(20,184,166,0.15)"
    }
  ];

  return (
    <Section className="py-16 sm:py-24 bg-[var(--surface)]/10 backdrop-blur-md border-y border-[var(--border)]/70 relative overflow-hidden">
      {/* Decorative Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/2 bg-gradient-to-r from-brand-600/5 to-violet-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-base sm:text-2xl text-[var(--text-faint)] font-bold uppercase tracking-widest">
            Trusted by professionals worldwide
          </p>
          <div className="text-sm sm:text-base text-brand-600 dark:text-brand-400 font-bold mt-2 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)] animate-pulse" />
            Live platform activity updated in real-time
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i} 
                className={`group relative p-8 rounded-3xl bg-[var(--surface)]/40 backdrop-blur-md border border-[var(--border)]/70
                  ${item.border} hover:bg-[var(--surface-2)]/60 hover:-translate-y-2
                  hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_20px_40px_var(--glow-shadow)]
                  transition-all duration-500 ease-out flex flex-col items-center text-center overflow-hidden`}
                style={{ "--glow-shadow": item.glow }}
              >
                {/* Top Accent Color Bar */}
                <div className={`absolute top-0 left-8 h-[3px] w-12 rounded-b-full bg-gradient-to-r ${item.gradient} opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500`} />

                {/* Glowing Corner Bubble on Hover */}
                <div className={`absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-all duration-700 ease-out pointer-events-none`} />

                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                  <Icon size={24} className={item.color} />
                </div>
                
                <div className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
                  <AnimatedCounter value={item.value} />
                </div>
                
                <div className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] mt-2 group-hover:text-[var(--text)] transition-colors duration-300">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

/* ─── Features Grid ─── */
const features = [
  { icon: Share2, title: "Share & Publish", desc: "Write posts, share insights, and build your professional voice.", color: "from-blue-500 to-indigo-500", glow: "rgba(37,99,235,0.25)", tag: "Publishing" },
  { icon: Users, title: "Follow & Network", desc: "Connect with people who inspire you and grow your circle.", color: "from-indigo-500 to-purple-500", glow: "rgba(79,70,229,0.25)", tag: "Networking" },
  { icon: Bell, title: "Real-time Notifications", desc: "Get instant updates when someone likes, comments, or follows.", color: "from-purple-500 to-pink-500", glow: "rgba(147,51,234,0.25)", tag: "Real-time" },
  { icon: Search, title: "Smart Search", desc: "Find people and posts across the entire network in seconds.", color: "from-pink-500 to-rose-500", glow: "rgba(219,39,119,0.25)", tag: "Discovery" },
  { icon: Shield, title: "Moderation Tools", desc: "Built-in admin tools to keep your community safe and healthy.", color: "from-rose-500 to-amber-500", glow: "rgba(225,29,72,0.25)", tag: "Security" },
  { icon: Moon, title: "Dark Mode", desc: "Easy on the eyes - switch between light and dark any time.", color: "from-amber-500 to-teal-500", glow: "rgba(217,119,6,0.25)", tag: "Interface" },
];

const Features = () => (
  <Section className="py-20 sm:py-28 bg-[var(--surface)]/5 backdrop-blur-sm relative" id="features">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight mb-4 text-balance">
          Everything you need to
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent"> grow </span>
        </h2>
        <p className="text-base text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          A carefully crafted set of features to help you build and nurture meaningful professional relationships.
        </p>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="group relative p-8 rounded-3xl bg-[var(--surface)]/40 backdrop-blur-md border border-[var(--border)]/70
              hover:bg-[var(--surface-2)]/60 hover:border-brand-500/40 dark:hover:border-brand-400/40
              hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] hover:-translate-y-2.5
              transition-all duration-500 ease-out cursor-default overflow-hidden flex flex-col justify-between min-h-[260px]"
          >
            {/* Top Accent Color Bar */}
            <div className={`absolute top-0 left-8 h-[3px] w-12 rounded-b-full bg-gradient-to-r ${f.color} opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500`} />

            {/* Glowing Corner Bubble on Hover */}
            <div className={`absolute -right-12 -bottom-12 w-36 h-36 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-all duration-700 ease-out pointer-events-none`} />

            <div>
              {/* Category Pill Tag and Icon Row */}
              <div className="flex items-center justify-between mb-6">
                <div 
                  style={{ '--glow-color': f.glow }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600/10 to-violet-500/10 flex items-center justify-center
                    group-hover:scale-110 group-hover:from-brand-600 group-hover:to-violet-500 group-hover:text-white 
                    group-hover:shadow-[0_8px_25px_var(--glow-color)] transition-all duration-500 text-brand-600 dark:text-brand-400"
                >
                  <f.icon size={22} className="transition-transform duration-500 group-hover:rotate-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--surface-3)]/60 text-[var(--text-muted)] border border-[var(--border)]/30 group-hover:border-brand-500/20 group-hover:text-brand-500 transition-colors duration-500">
                  {f.tag}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-xl text-[var(--text)] mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text)] transition-colors duration-500">
                {f.desc}
              </p>
            </div>

            {/* Subtly animated arrow link indicator */}
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-500">
              <span>Learn more</span>
              <ArrowRight size={12} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </Section>
);

/* ─── How It Works ─── */
const steps = [
  { icon: Zap, title: "Create your account", desc: "Sign up in seconds - no credit card, no hassle." },
  { icon: Globe, title: "Build your profile", desc: "Add your bio, share your story, and let people find you." },
  { icon: TrendingUp, title: "Start connecting", desc: "Follow people, share posts, and grow your network organically." },
];

const HowItWorks = () => {
  const stepColors = [
    {
      hoverBg: "hover:bg-blue-500/[0.03] hover:border-blue-500/30 dark:hover:border-blue-500/20",
      accentGlow: "group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] dark:group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)]",
      iconHover: "group-hover:bg-blue-600 group-hover:shadow-[0_8px_25px_rgba(59,130,246,0.35)]",
      titleHover: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
      numGradient: "from-blue-500/10 to-indigo-500/10 dark:from-blue-400/15 dark:to-indigo-400/15 group-hover:from-blue-500/25 group-hover:to-indigo-500/25 dark:group-hover:from-blue-400/25 dark:group-hover:to-indigo-400/25",
      badgeClass: "text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-400/30 bg-blue-500/5",
      accentBar: "from-blue-500 to-indigo-500",
      iconColor: "text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 dark:border-blue-400/30"
    },
    {
      hoverBg: "hover:bg-indigo-500/[0.03] hover:border-indigo-500/30 dark:hover:border-indigo-500/20",
      accentGlow: "group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] dark:group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]",
      iconHover: "group-hover:bg-indigo-600 group-hover:shadow-[0_8px_25px_rgba(99,102,241,0.35)]",
      titleHover: "group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
      numGradient: "from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/15 dark:to-purple-400/15 group-hover:from-indigo-500/25 group-hover:to-purple-500/25 dark:group-hover:from-indigo-400/25 dark:group-hover:to-purple-400/25",
      badgeClass: "text-indigo-600 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-400/30 bg-indigo-500/5",
      accentBar: "from-indigo-500 to-purple-500",
      iconColor: "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/20 dark:border-indigo-400/30"
    },
    {
      hoverBg: "hover:bg-purple-500/[0.03] hover:border-purple-500/30 dark:hover:border-purple-500/20",
      accentGlow: "group-hover:shadow-[0_20px_50px_rgba(168,85,247,0.08)] dark:group-hover:shadow-[0_20px_50px_rgba(168,85,247,0.12)]",
      iconHover: "group-hover:bg-purple-600 group-hover:shadow-[0_8px_25px_rgba(168,85,247,0.35)]",
      titleHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
      numGradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-400/15 dark:to-pink-400/15 group-hover:from-purple-500/25 group-hover:to-pink-500/25 dark:group-hover:from-purple-400/25 dark:group-hover:to-purple-400/25",
      badgeClass: "text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-400/30 bg-purple-500/5",
      accentBar: "from-purple-500 to-pink-500",
      iconColor: "text-purple-500 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/20 dark:border-purple-400/30"
    }
  ];

  return (
    <Section className="py-20 sm:py-28 bg-[var(--surface)]/15 backdrop-blur-md border-t border-[var(--border)]/70 relative" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight mb-4 text-balance">
            Get started in minutes
          </h2>
          <p className="text-base text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            Three simple steps to launch your professional presence and begin networking.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, i) => {
            const colors = stepColors[i];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`group relative p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)]/75
                  ${colors.hoverBg} ${colors.accentGlow} hover:-translate-y-2.5
                  transition-all duration-500 ease-out cursor-default overflow-hidden flex flex-col justify-between min-h-[290px]`}
              >
                {/* Large Background Step Number */}
                <div className={`absolute top-4 right-6 text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br ${colors.numGradient} select-none pointer-events-none font-mono transition-transform duration-500 group-hover:scale-110`}>
                  0{i + 1}
                </div>

                {/* Top accent line matching step sequence */}
                <div className={`absolute top-0 left-8 h-[3px] w-12 rounded-b-full bg-gradient-to-r ${colors.accentBar} opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500`} />

                <div>
                  {/* Icon inside a glowing wrapper */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                    ${colors.iconColor} group-hover:scale-110 ${colors.iconHover} group-hover:text-white
                    transition-all duration-500`}>
                    <step.icon size={26} className="transition-transform duration-500 group-hover:rotate-6" />
                  </div>

                  {/* Title & Description */}
                  <h3 className={`font-bold text-xl text-[var(--text)] mb-3 ${colors.titleHover} transition-colors duration-300`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text)] transition-colors duration-500">
                    {step.desc}
                  </p>
                </div>

                {/* Step Badge */}
                <div className="mt-8 flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${colors.badgeClass}`}>
                    Step 0{i + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      </div>
    </Section>
  );
};

/* ─── Testimonials ─── */
const testimonials = [
  { 
    name: "Emily Zhang", 
    role: "UX Lead at Figma", 
    quote: "Connectify replaced three tools in our workflow. The real-time features are incredibly smooth.", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  },
  { 
    name: "Raj Patel", 
    role: "CTO at Startup", 
    quote: "Finally, a professional network that respects my time. Clean, fast, and beautifully designed.", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  { 
    name: "Maria Santos", 
    role: "Freelance Developer", 
    quote: "The dark mode alone is worth switching. My eyes thank me every evening coding session.", 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80"
  },
];

const Testimonials = () => (
  <Section className="py-20 sm:py-28 bg-[var(--surface)]/10 backdrop-blur-md border-t border-[var(--border)]/70 relative" id="testimonials">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-4">
          Loved by professionals
        </h2>
        <p className="text-[var(--text-muted)]">Don't just take our word for it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-[var(--surface)]/40 backdrop-blur-md border border-[var(--border)]/70
              hover:bg-[var(--surface-2)]/60 hover:border-brand-500/30 hover:shadow-[0_20px_40px_rgba(99,102,241,0.05)]
              hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Custom Background Quote Mark */}
            <div className="absolute top-4 right-6 text-transparent bg-clip-text bg-gradient-to-br from-brand-500/10 to-indigo-500/10 dark:from-brand-400/15 dark:to-indigo-400/15 text-8xl font-serif select-none pointer-events-none leading-none group-hover:scale-110 transition-transform duration-500">
              ”
            </div>

            <div>
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-6 italic relative z-10">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 border-t border-[var(--border)]/40 pt-4">
              <img 
                src={t.avatar} 
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-[var(--border)] shadow-[var(--shadow-sm)]"
              />
              <div>
                <div className="text-sm font-bold text-[var(--text)]">{t.name}</div>
                <div className="text-xs text-[var(--text-faint)] font-semibold">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

/* ─── Final CTA ─── */
const FinalCTA = () => (
  <Section className="py-20 sm:py-28 bg-[var(--surface)]/5 backdrop-blur-sm border-t border-[var(--border)]/70 relative overflow-hidden">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center border border-brand-500/20 shadow-[0_30px_60px_rgba(99,102,241,0.15)] group">
        {/* Deep rich gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-violet-750" />
        
        {/* Animated dynamic gradient blobs for depth */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-indigo-500/30 dark:bg-indigo-600/15 blur-3xl group-hover:scale-110 transition-transform duration-1000 ease-out" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-brand-400/25 dark:bg-brand-500/10 blur-3xl group-hover:scale-110 transition-transform duration-1000 ease-out" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Ready to grow your network?
          </h2>
          <p className="text-brand-100 max-w-lg mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Join thousands of professionals already on Connectify. It's free to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-brand-700
                font-bold text-base hover:bg-brand-50 transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              Get started free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white
                font-semibold text-base border border-white/20 hover:bg-white/20 transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

/* ─── Footer ─── */
/* ─── Footer ─── */
/* ─── Footer ─── */
/* ─── Footer ─── */
const Footer = () => (
  <footer className="border-t border-[var(--border)]/70 bg-[var(--surface)]/25 backdrop-blur-md relative z-10">
    <div className="w-full px-6 sm:px-12 md:px-16 lg:px-20 pt-16 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-10 md:gap-4 w-full">
        {/* Brand Block */}
        <div className="max-w-sm flex flex-col justify-between">
          <div>
            <Link to="/" className="inline-block mb-4">
              <Logo height={48} className="transform hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-xs mt-2">
              A next-generation professional network built to empower creators, developers, and leaders to share, collaborate, and grow their reach.
            </p>
          </div>
        </div>

        {/* Explore Links */}
        <div className="md:border-l md:border-blue-500/20 md:pl-10 lg:pl-16 flex-1 md:flex-initial">
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-5 flex items-center gap-1.5">
            <Compass size={16} className="text-blue-500 dark:text-blue-400" />
            Explore
          </h4>
          <ul className="space-y-3">
            {["Feed", "Profile", "Settings"].map((name) => (
              <li key={name}>
                <Link 
                  to={`/${name.toLowerCase()}`} 
                  className="group flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] opacity-85 hover:opacity-100 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1"
                >
                  <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-500" />
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account Links */}
        <div className="md:border-l md:border-indigo-500/20 md:pl-10 lg:pl-16 flex-1 md:flex-initial">
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-5 flex items-center gap-1.5">
            <User size={16} className="text-indigo-500 dark:text-indigo-400" />
            Account
          </h4>
          <ul className="space-y-3">
            {[
              { label: "Sign in", path: "/login" },
              { label: "Get started", path: "/register" }
            ].map((link) => (
              <li key={link.label}>
                <Link 
                  to={link.path} 
                  className="group flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] opacity-85 hover:opacity-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300 transform hover:translate-x-1"
                >
                  <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-indigo-500" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect Links */}
        <div className="md:border-l md:border-purple-500/20 md:pl-10 lg:pl-16 flex-1 md:flex-initial">
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-5 flex items-center gap-1.5">
            <Share2 size={16} className="text-purple-500 dark:text-purple-400" />
            Connect
          </h4>
          <ul className="space-y-3">
            {[
              { label: "GitHub", url: "https://github.com/Amarsah15/" },
              { label: "LinkedIn", url: "https://www.linkedin.com/in/amarnathkumar1/" },
              { label: "Portfolio", url: "https://amarnathkumar.dev" }
            ].map((link) => (
              <li key={link.label}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] opacity-85 hover:opacity-100 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-300 transform hover:translate-x-1"
                >
                  <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-purple-500" />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="border-t border-[var(--border)]/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold text-[var(--text)] opacity-85">
            Connectify © {new Date().getFullYear()}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500/40" />
          <span className="text-sm text-[var(--text-faint)]">
            All rights reserved.
          </span>
        </div>
        <div>
          <a 
            href="https://amarnathkumar.dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-400 hover:opacity-80 transition-opacity"
          >
            Built by Amarnath Kumar
          </a>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Landing Page (compose) ─── */
const LandingPage = () => {
  const [dbStats, setDbStats] = useState({
    totalUsers: 10,
    totalPosts: 50,
    totalLikes: 120,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/users/stats/public");
        if (res.data && res.data.success) {
          setDbStats({
            totalUsers: res.data.totalUsers,
            totalPosts: res.data.totalPosts,
            totalLikes: res.data.totalLikes,
            loading: false
          });
        }
      } catch (err) {
        console.error("Error fetching public stats", err);
        setDbStats((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-[var(--bg)] relative min-h-screen overflow-hidden">
      <GradientBlobs />
      {/* Elegant background grid pattern throughout the whole page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.06] dark:opacity-[0.025] pointer-events-none" />

      <LandingNav />
      <Hero />
      <SocialProof stats={dbStats} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
