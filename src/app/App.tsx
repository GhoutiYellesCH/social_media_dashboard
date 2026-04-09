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
import { TokenProvider } from "./components/token-context";
import { TokenDashboard } from "./components/token-dashboard";
import { AuthProvider, useAuth } from "./components/auth-context";
import { addDays, startOfWeek, format } from "date-fns";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster, toast } from "sonner";
import * as apiClient from "./components/api-client";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import {
  AppPage,
  DEFAULT_APP_ROUTE,
  DEFAULT_NAV,
  pushSafeRoute,
  resolveSecureRoute,
  safeRouteForNav,
} from "./secure-routing";

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 });

const initialPosts: ScheduledPost[] = [
  {
    id: "1",
    content: "Decouvrez notre nouvelle collection printemps ! Restez a l'ecoute pour la grande revelation ce vendredi",
    time: "9:00 AM",
    platforms: ["Facebook", "Instagram"],
    image: "https://images.unsplash.com/photo-1732310141503-32bdab8eca11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbGF1bmNoJTIwY29sb3JmdWx8ZW58MXx8fHwxNzc1MTM4MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "scheduled",
    date: addDays(weekStart, 0),
  },
  {
    id: "2",
    content: "Motivation du lundi : La meilleure facon de predire l'avenir est de le creer.",
    time: "12:00 PM",
    platforms: ["Facebook", "LinkedIn"],
    status: "scheduled",
    date: addDays(weekStart, 0),
  },
  {
    id: "3",
    content: "Dans les coulisses : Seance de brainstorming de notre equipe pour les campagnes Q3",
    time: "10:30 AM",
    platforms: ["Instagram", "Facebook"],
    image: "https://images.unsplash.com/photo-1630672790237-38eeb57cb60b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZXxlbnwxfHx8fDE3NzUwOTQyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "published",
    date: addDays(weekStart, 1),
  },
  {
    id: "4",
    content: "5 astuces pour ameliorer votre engagement sur les reseaux sociaux ce trimestre",
    time: "2:00 PM",
    platforms: ["Facebook"],
    status: "draft",
    date: addDays(weekStart, 2),
  },
  {
    id: "5",
    content: "Cafe + creativite = le combo parfait du mercredi",
    time: "8:00 AM",
    platforms: ["Instagram"],
    image: "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjB3b3Jrc3BhY2UlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzc1MTM4MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "scheduled",
    date: addDays(weekStart, 2),
  },
  {
    id: "6",
    content: "Nouveau article : Comment nous avons fait grandir notre audience de 300% en 6 mois. Lien en bio !",
    time: "11:00 AM",
    platforms: ["Facebook", "LinkedIn"],
    status: "scheduled",
    date: addDays(weekStart, 3),
  },
  {
    id: "7",
    content: "Ambiance weekend ! Quels sont vos plans ?",
    time: "5:00 PM",
    platforms: ["Instagram", "Facebook"],
    image: "https://images.unsplash.com/photo-1596905738125-a6b51b1bdbb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc1MTM4MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "scheduled",
    date: addDays(weekStart, 4),
  },
  {
    id: "8",
    content: "Souvenir de notre super dejeuner d'equipe la semaine derniere !",
    time: "1:00 PM",
    platforms: ["Instagram"],
    image: "https://images.unsplash.com/photo-1667118399331-c6d546acee11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudCUyMGJydW5jaHxlbnwxfHx8fDE3NzUxMzgzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "draft",
    date: addDays(weekStart, 5),
  },
  {
    id: "9",
    content: "Rejoignez-nous pour une session Q&R en direct ce samedi a 15h ! Posez vos questions ci-dessous",
    time: "3:00 PM",
    platforms: ["Facebook", "Instagram", "LinkedIn"],
    status: "scheduled",
    date: addDays(weekStart, 5),
  },
  {
    id: "10",
    content: "Liste de lecture du dimanche : Nos 10 meilleures ressources marketing pour 2026",
    time: "10:00 AM",
    platforms: ["LinkedIn", "Facebook"],
    status: "scheduled",
    date: addDays(weekStart, 6),
  },
];

function AppInner() {
  const { user, isAuthenticated, isLoading: authLoading, login, signup, resetPassword, logout } = useAuth();
  const [page, setPage] = useState<AppPage>("landing");
  const [activeNav, setActiveNav] = useState(DEFAULT_NAV);
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts);
  const [darkMode, setDarkMode] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Sync app state from URL and browser navigation
  useEffect(() => {
    if (authLoading) return;

    const syncFromLocation = () => {
      const route = resolveSecureRoute(window.location.pathname, isAuthenticated);
      setPage(route.page);
      setActiveNav(route.nav);
      setPostLoginRedirect(route.postLoginRedirect || null);
    };

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [authLoading, isAuthenticated]);

  // Keep URL aligned when auth state changes
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      const path = safeRouteForNav(activeNav);
      pushSafeRoute(path, true);
      setPage("dashboard");
      return;
    }

    if (page === "dashboard") {
      setPage("login");
      pushSafeRoute("/login", true);
    }
  }, [authLoading, isAuthenticated, activeNav, page]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load posts from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      apiClient.getPosts().then((serverPosts) => {
        if (serverPosts && Array.isArray(serverPosts) && serverPosts.length > 0) {
          const parsed = serverPosts.map((p: any) => ({
            ...p,
            date: new Date(p.date),
          }));
          setPosts(parsed);
        }
      }).catch((e) => console.error("Failed to load posts:", e));

      // Enable Real-Time Notifications
      const channel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user?.id}` },
          (payload) => {
            console.log("Change received!", payload);
            if (payload.eventType === "INSERT") {
              toast.info("Nouvelle Notification", {
                description: payload.new.message || "Vous avez une nouvelle notification.",
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated, user?.id]);

  const handleNewPost = async (data: any) => {
    const platforms = Object.entries(data.networks || {})
      .filter(([, v]) => v)
      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

    const isPublishNow = data.scheduleType === "now";
    const isQueued = data.scheduleType === "queue";

    const newPost: ScheduledPost = {
      id: String(Date.now()),
      content: data.content || "Nouvelle publication",
      time: data.time || "9:00 AM",
      platforms,
      status: isPublishNow ? "published" : isQueued ? "draft" : "scheduled",
      date: data.date ? new Date(data.date) : new Date(),
    };
    setPosts((prev) => [...prev, newPost]);

    // Save to backend
    if (isAuthenticated) {
      apiClient.createPost({
        ...newPost,
        date: newPost.date.toISOString(),
      }).catch((e) => console.error("Failed to save post:", e));
    }

    if (isPublishNow) {
      toast.success("Publication publiee !", {
        description: `Votre publication a ete publiee sur ${platforms.join(", ")}.`,
      });
    } else if (isQueued) {
      toast.success("Ajoutee a la file d'attente", {
        description: `Votre publication a ete ajoutee pour ${platforms.join(", ")}.`,
      });
    } else {
      toast.success("Publication programmee !", {
        description: `Programmee pour le ${data.date ? format(new Date(data.date), "d MMM yyyy") : "aujourd'hui"} a ${data.time || "9:00 AM"} sur ${platforms.join(", ")}.`,
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

        // Update backend
        if (isAuthenticated) {
          apiClient.updatePost(postId, { date: newDate.toISOString() })
            .catch((e) => console.error("Failed to update post:", e));
        }

        setTimeout(() => {
          toast.success("Publication reprogrammee !", {
            description: `"${post.content.substring(0, 40)}..." deplacee au ${format(newDate, "EEEE d MMM")}.`,
          });
        }, 0);

        return prev.map((p) =>
          p.id === postId ? { ...p, date: newDate } : p
        );
      });
    },
    [isAuthenticated]
  );

  const handleLogin = async (email: string, password: string) => {
    setLoginError("");
    const result = await login(email, password);
    if (result.success) {
      const targetRoute = postLoginRedirect || DEFAULT_APP_ROUTE;
      const targetRouteState = resolveSecureRoute(targetRoute, true);
      setActiveNav(targetRouteState.nav);
      setPage("dashboard");
      pushSafeRoute(safeRouteForNav(targetRouteState.nav));
      setPostLoginRedirect(null);
      toast.success("Bon retour !", { description: "Vous etes connecte a SocialdZ." });
    } else {
      setLoginError(result.error || "Erreur de connexion");
      toast.error("Echec de connexion", { description: result.error });
    }
    return result;
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    setLoginError("");
    const result = await signup(email, password, name);
    if (result.success) {
      const targetRoute = postLoginRedirect || DEFAULT_APP_ROUTE;
      const targetRouteState = resolveSecureRoute(targetRoute, true);
      setActiveNav(targetRouteState.nav);
      setPage("dashboard");
      pushSafeRoute(safeRouteForNav(targetRouteState.nav));
      setPostLoginRedirect(null);
      toast.success("Compte cree !", { description: "Bienvenue sur SocialdZ ! 500 tokens IA offerts." });
    } else {
      setLoginError(result.error || "Erreur d'inscription");
      toast.error("Echec d'inscription", { description: result.error });
    }
    return result;
  };

  const handleResetPassword = async (email: string) => {
    setLoginError("");
    const result = await resetPassword(email);
    if (result.success) {
      toast.success("Email envoyé", { description: "Veuillez vérifier votre boîte de réception pour réinitialiser le mot de passe." });
    } else {
      toast.error("Échec", { description: result.error });
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setPage("landing");
    setActiveNav(DEFAULT_NAV);
    setPostLoginRedirect(null);
    pushSafeRoute("/");
    toast.success("Deconnexion reussie !");
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center mx-auto mb-4">
            <span className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>dZ</span>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: 14 }}>Chargement...</p>
        </div>
      </div>
    );
  }

  // Landing page
  if (page === "landing" && !isAuthenticated) {
    return (
      <>
        <LandingPage
          onGetStarted={() => {
            setPage("login");
            pushSafeRoute("/login");
          }}
          onLogin={() => {
            setPage("login");
            pushSafeRoute("/login");
          }}
        />
        <Toaster position="bottom-right" richColors closeButton />
      </>
    );
  }

  // Login page
  if (page === "login" && !isAuthenticated) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onBack={() => {
            setPage("landing");
            pushSafeRoute("/");
          }}
          onSignUp={handleSignup}
          onResetPassword={handleResetPassword}
          error={loginError}
        />
        <Toaster position="bottom-right" richColors closeButton />
      </>
    );
  }

  const viewRenderers: Record<string, () => JSX.Element> = {
    "Tableau de Bord": () => <DashboardOverview onNewPost={() => setShowModal(true)} />,
    Calendrier: () => (
      <WeeklyCalendar
        posts={posts}
        onNewPost={() => setShowModal(true)}
        onMovePost={handleMovePost}
      />
    ),
    Composer: () => <PostComposer onSubmit={handleNewPost} />,
    Analytiques: () => <AnalyticsView />,
    Comptes: () => <AccountsView />,
    Parametres: () => <SettingsView />,
    Aide: () => <HelpSupportView />,
    "Ads Manager": () => <AdsManager />,
    Blog: () => <BlogManager />,
    "Email Marketing": () => <EmailManager />,
    Funnels: () => <SalesFunnels />,
    "Link-in-Bio": () => <LinkInBio />,
    "UTM Builder": () => <UtmBuilder />,
    Hashtags: () => <HashtagResearch />,
    Inbox: () => <InboxManager />,
    "Social Listening": () => <SocialListening />,
    Equipe: () => <TeamPermissions />,
    Mediatheque: () => <ContentLibrary />,
    Tokens: () => <TokenDashboard />,
  };

  const renderView = () => {
    const renderer = viewRenderers[activeNav] || viewRenderers[DEFAULT_NAV];
    return renderer();
  };

  return (
    <TokenProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <Sidebar
            activeNav={activeNav}
            onNavChange={(label) => {
              setActiveNav(label);
              const targetPath = safeRouteForNav(label);
              pushSafeRoute(targetPath);
            }}
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
    </TokenProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
