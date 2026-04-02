import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/sidebar";
import { WeeklyCalendar, ScheduledPost } from "./components/weekly-calendar";
import { NewPostModal } from "./components/new-post-modal";
import { DashboardOverview } from "./components/dashboard-overview";
import { AnalyticsView } from "./components/analytics-view";
import { PostComposer } from "./components/post-composer";
import { AccountsView } from "./components/accounts-view";
import { SettingsView } from "./components/settings-view";
import { HelpSupportView } from "./components/help-support-view";
import { LandingPage } from "./components/landing-page";
import { LoginPage } from "./components/login-page";
import { AdsManager } from "./components/ads-manager";
import { BlogManager } from "./components/blog-manager";
import { EmailManager } from "./components/email-manager";
import { SalesFunnels } from "./components/sales-funnels";
import { LinkInBio } from "./components/link-in-bio";
import { SocialListening } from "./components/social-listening";
import { TeamPermissions } from "./components/team-permissions";
import { HashtagResearch } from "./components/hashtag-research";
import { UtmBuilder } from "./components/utm-builder";
import { ContentLibrary } from "./components/content-library";
import { InboxManager } from "./components/inbox-manager";
import { addDays, startOfWeek, format } from "date-fns";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster, toast } from "sonner";

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 });

const initialPosts: ScheduledPost[] = [
  {
    id: "1",
    content: "Excited to announce our new product line! Stay tuned for the big reveal this Friday",
    time: "9:00 AM",
    platforms: ["Facebook", "Instagram"],
    image: "https://images.unsplash.com/photo-1732310141503-32bdab8eca11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbGF1bmNoJTIwY29sb3JmdWx8ZW58MXx8fHwxNzc1MTM4MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "scheduled",
    date: addDays(weekStart, 0),
  },
  {
    id: "2",
    content: "Monday motivation: The best way to predict the future is to create it.",
    time: "12:00 PM",
    platforms: ["X", "LinkedIn"],
    status: "scheduled",
    date: addDays(weekStart, 0),
  },
  {
    id: "3",
    content: "Behind the scenes: Our team brainstorming session for Q3 campaigns",
    time: "10:30 AM",
    platforms: ["Instagram", "Facebook"],
    image: "https://images.unsplash.com/photo-1630672790237-38eeb57cb60b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZXxlbnwxfHx8fDE3NzUwOTQyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "published",
    date: addDays(weekStart, 1),
  },
  {
    id: "4",
    content: "5 tips for improving your social media engagement this quarter. Thread",
    time: "2:00 PM",
    platforms: ["X"],
    status: "draft",
    date: addDays(weekStart, 2),
  },
  {
    id: "5",
    content: "Coffee + creativity = the perfect Wednesday combo",
    time: "8:00 AM",
    platforms: ["Instagram"],
    image: "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjB3b3Jrc3BhY2UlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzc1MTM4MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "scheduled",
    date: addDays(weekStart, 2),
  },
  {
    id: "6",
    content: "New blog post: How we grew our audience by 300% in 6 months. Link in bio!",
    time: "11:00 AM",
    platforms: ["Facebook", "LinkedIn", "X"],
    status: "scheduled",
    date: addDays(weekStart, 3),
  },
  {
    id: "7",
    content: "Weekend vibes! What are your plans?",
    time: "5:00 PM",
    platforms: ["Instagram", "Facebook"],
    image: "https://images.unsplash.com/photo-1596905738125-a6b51b1bdbb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc1MTM4MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "scheduled",
    date: addDays(weekStart, 4),
  },
  {
    id: "8",
    content: "Throwback to our amazing team lunch last week!",
    time: "1:00 PM",
    platforms: ["Instagram"],
    image: "https://images.unsplash.com/photo-1667118399331-c6d546acee11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudCUyMGJydW5jaHxlbnwxfHx8fDE3NzUxMzgzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "draft",
    date: addDays(weekStart, 5),
  },
  {
    id: "9",
    content: "Join us for a live Q&A session this Saturday at 3PM EST! Drop your questions below",
    time: "3:00 PM",
    platforms: ["Facebook", "Instagram", "LinkedIn", "X"],
    status: "scheduled",
    date: addDays(weekStart, 5),
  },
  {
    id: "10",
    content: "Sunday reading list: Our top 10 marketing resources for 2026",
    time: "10:00 AM",
    platforms: ["LinkedIn", "X"],
    status: "scheduled",
    date: addDays(weekStart, 6),
  },
];

type AppPage = "landing" | "login" | "dashboard";

export default function App() {
  const [page, setPage] = useState<AppPage>("landing");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNewPost = (data: any) => {
    const platforms = Object.entries(data.networks || {})
      .filter(([, v]) => v)
      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

    const isPublishNow = data.scheduleType === "now";
    const isQueued = data.scheduleType === "queue";

    const newPost: ScheduledPost = {
      id: String(Date.now()),
      content: data.content || "New post",
      time: data.time || "9:00 AM",
      platforms,
      status: isPublishNow ? "published" : isQueued ? "draft" : "scheduled",
      date: data.date ? new Date(data.date) : new Date(),
    };
    setPosts((prev) => [...prev, newPost]);

    if (isPublishNow) {
      toast.success("Post published!", {
        description: `Your post has been published to ${platforms.join(", ")}.`,
      });
    } else if (isQueued) {
      toast.success("Added to queue", {
        description: `Your post has been added to the queue for ${platforms.join(", ")}.`,
      });
    } else {
      toast.success("Post scheduled!", {
        description: `Scheduled for ${data.date ? format(new Date(data.date), "MMM d, yyyy") : "today"} at ${data.time || "9:00 AM"} on ${platforms.join(", ")}.`,
      });
    }
  };

  const handleMovePost = useCallback(
    (postId: string, newDate: Date) => {
      setPosts((prev) => {
        const post = prev.find((p) => p.id === postId);
        if (!post) return prev;

        const isSame =
          post.date.getFullYear() === newDate.getFullYear() &&
          post.date.getMonth() === newDate.getMonth() &&
          post.date.getDate() === newDate.getDate();
        if (isSame) return prev;

        setTimeout(() => {
          toast.success("Post rescheduled!", {
            description: `"${post.content.substring(0, 40)}..." moved to ${format(newDate, "EEEE, MMM d")}.`,
          });
        }, 0);

        return prev.map((p) =>
          p.id === postId ? { ...p, date: newDate } : p
        );
      });
    },
    []
  );

  const handleLogout = () => {
    setPage("landing");
    setActiveNav("Dashboard");
    toast.success("Logged out successfully!");
  };

  // Landing page
  if (page === "landing") {
    return (
      <>
        <LandingPage
          onGetStarted={() => setPage("login")}
          onLogin={() => setPage("login")}
        />
        <Toaster position="bottom-right" richColors closeButton />
      </>
    );
  }

  // Login page
  if (page === "login") {
    return (
      <>
        <LoginPage
          onLogin={() => {
            setPage("dashboard");
            toast.success("Welcome back!", { description: "You've successfully signed in to SocialQ." });
          }}
          onBack={() => setPage("landing")}
          onSignUp={() => {
            setPage("dashboard");
            toast.success("Account created!", { description: "Welcome to SocialQ! Your free trial has started." });
          }}
        />
        <Toaster position="bottom-right" richColors closeButton />
      </>
    );
  }

  const renderView = () => {
    switch (activeNav) {
      case "Dashboard":
        return <DashboardOverview onNewPost={() => setShowModal(true)} />;
      case "Content Calendar":
        return (
          <WeeklyCalendar
            posts={posts}
            onNewPost={() => setShowModal(true)}
            onMovePost={handleMovePost}
          />
        );
      case "Post Composer":
        return <PostComposer onSubmit={handleNewPost} />;
      case "Analytics":
        return <AnalyticsView />;
      case "Accounts":
        return <AccountsView />;
      case "Settings":
        return <SettingsView />;
      case "Help & Support":
        return <HelpSupportView />;
      case "Ads Manager":
        return <AdsManager />;
      case "Blog Manager":
        return <BlogManager />;
      case "Email Marketing":
        return <EmailManager />;
      case "Sales Funnels":
        return <SalesFunnels />;
      case "Link-in-Bio":
        return <LinkInBio />;
      case "UTM Builder":
        return <UtmBuilder />;
      case "Hashtag Research":
        return <HashtagResearch />;
      case "Inbox":
        return <InboxManager />;
      case "Social Listening":
        return <SocialListening />;
      case "Team":
        return <TeamPermissions />;
      case "Content Library":
        return <ContentLibrary />;
      default:
        return <DashboardOverview onNewPost={() => setShowModal(true)} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onLogout={handleLogout}
        />
        {renderView()}
        {showModal && (
          <NewPostModal onClose={() => setShowModal(false)} onSubmit={handleNewPost} />
        )}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
          theme={darkMode ? "dark" : "light"}
          richColors
          closeButton
        />
      </div>
    </DndProvider>
  );
}