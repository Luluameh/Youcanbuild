import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router";
import { RedirectIfAuthenticated, RequireAuth } from "@/components/auth/RequireAuth.tsx";
import { AppLayout } from "@/components/layout/AppLayout.tsx";
import { PublicLayout } from "@/components/layout/PublicLayout.tsx";
import { AuthProvider } from "@/context/AuthContext.tsx";
import { MentorshipProvider } from "@/context/MentorshipContext.tsx";
import { ExplorePage, HowItWorksRedirect, PathDetailPage } from "@/pages/ExplorePage.tsx";
import { HomePage } from "@/pages/HomePage.tsx";
import { LegacyAuthRedirect } from "@/pages/LegacyAuthRedirect.tsx";
import { AchievementDetailPage } from "@/pages/AchievementDetailPage.tsx";
import { LearnerAchievementsPage } from "@/pages/LearnerAchievementsPage.tsx";
import { LearnerDashboardPage } from "@/pages/LearnerDashboardPage.tsx";
import { LearnerOnboardingPage } from "@/pages/LearnerOnboardingPage.tsx";
import { LearnerRoadmapPage } from "@/pages/LearnerRoadmapPage.tsx";
import { ModulePage } from "@/pages/ModulePage.tsx";
import { MentorDashboardPage } from "@/pages/MentorDashboardPage.tsx";
import { MentorOnboardingPage } from "@/pages/MentorOnboardingPage.tsx";
import { AboutPage, MentorsPage } from "@/pages/PublicInfoPages.tsx";
import { SignInPage } from "@/pages/SignInPage.tsx";
import { SignUpPage } from "@/pages/SignUpPage.tsx";
import { LearnerMentorDirectoryPage } from "@/pages/LearnerMentorDirectoryPage.tsx";
import { LearnerMentorProfilePage } from "@/pages/LearnerMentorProfilePage.tsx";
import { LearnerMentorshipDetailPage } from "@/pages/LearnerMentorshipDetailPage.tsx";
import { LearnerMentorshipListPage } from "@/pages/LearnerMentorshipListPage.tsx";
import { MentorshipRequestFormPage } from "@/pages/MentorshipRequestFormPage.tsx";
import { MentorRequestDetailPage } from "@/pages/MentorRequestDetailPage.tsx";
import { MentorRequestsPage } from "@/pages/MentorRequestsPage.tsx";
import { FoundationPage } from "@/pages/FoundationPage.tsx";

function ModuleLegacyRedirect() {
  const { moduleId } = useParams();
  if (!moduleId) {
    return <Navigate to="/learn/roadmap" replace />;
  }
  return <Navigate to={`/learn/modules/${moduleId}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <MentorshipProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="explore/:pathId" element={<PathDetailPage />} />
            <Route path="how-it-works" element={<HowItWorksRedirect />} />
            <Route path="mentors" element={<MentorsPage />} />
            <Route path="about" element={<AboutPage />} />

            <Route element={<RedirectIfAuthenticated />}>
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
            </Route>
            <Route path="sign-in" element={<LegacyAuthRedirect to="/signin" />} />
            <Route path="sign-up" element={<LegacyAuthRedirect to="/signup" />} />

            <Route element={<RequireAuth role="learner" allowOnboardingOnly />}>
              <Route path="onboarding" element={<LearnerOnboardingPage />} />
            </Route>
            <Route element={<RequireAuth role="mentor" allowOnboardingOnly />}>
              <Route path="onboarding/mentor" element={<MentorOnboardingPage />} />
            </Route>

            <Route
              path="*"
              element={
                <FoundationPage
                  title="That page is not on the map"
                  description="Head back to the start and pick a path from the navigation."
                  phase="Missing page"
                  empty
                />
              }
            />
          </Route>

          <Route element={<RequireAuth role="learner" requireOnboarding />}>
            <Route element={<AppLayout role="learner" />}>
              <Route path="learn" element={<LearnerDashboardPage />} />
              <Route path="learn/roadmap" element={<LearnerRoadmapPage />} />
              <Route path="learn/modules/:moduleId" element={<ModulePage />} />
              <Route path="learn/module/:moduleId" element={<ModuleLegacyRedirect />} />
              <Route path="learn/achievements" element={<LearnerAchievementsPage />} />
              <Route path="learn/achievements/:achievementId" element={<AchievementDetailPage />} />
              <Route path="learn/mentors" element={<LearnerMentorDirectoryPage />} />
              <Route path="learn/mentors/:mentorId" element={<LearnerMentorProfilePage />} />
              <Route path="learn/mentors/:mentorId/request" element={<MentorshipRequestFormPage />} />
              <Route path="learn/mentorship" element={<LearnerMentorshipListPage />} />
              <Route path="learn/mentorship/:requestId" element={<LearnerMentorshipDetailPage />} />
            </Route>
          </Route>

          <Route element={<RequireAuth role="mentor" requireOnboarding />}>
            <Route element={<AppLayout role="mentor" />}>
              <Route path="mentor" element={<MentorDashboardPage />} />
              <Route path="mentor/requests" element={<MentorRequestsPage />} />
              <Route path="mentor/requests/:requestId" element={<MentorRequestDetailPage />} />
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </MentorshipProvider>
    </AuthProvider>
  );
}
