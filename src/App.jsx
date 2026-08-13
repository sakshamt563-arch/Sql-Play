import React from 'react';
import { useApp, AppProvider } from './context/AppContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { DashboardView } from './views/DashboardView.jsx';
import { ProblemsView } from './views/ProblemsView.jsx';
import { SolveProblemView } from './views/SolveProblemView.jsx';
import { LeaderboardView } from './views/LeaderboardView.jsx';
import { ProfileView } from './views/ProfileView.jsx';
import { LearnView } from './views/LearnView.jsx';
import { SuccessModal } from './components/SuccessModal.jsx';
import { DeploymentGuideModal } from './components/DeploymentGuideModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { AuthView } from './views/AuthView.jsx';
import { allProblems } from './data/problems/index.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught An Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-rose-300 p-8 font-mono space-y-4">
          <h1 className="text-2xl font-bold text-rose-500">SQL Play Runtime Error</h1>
          <p className="text-sm text-slate-300">An unexpected JavaScript error occurred while rendering the app:</p>
          <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 overflow-x-auto text-xs space-y-2">
            <div className="font-bold text-rose-400">{this.state.error && this.state.error.toString()}</div>
            <pre className="text-slate-400 text-[11px] whitespace-pre-wrap">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainAppContent() {
  const { 
    user,
    authToken,
    activeTab, 
    setActiveTab,
    successModalData, 
    setSuccessModalData, 
    deploymentModalOpen,
    setDeploymentModalOpen,
    authModalOpen,
    setAuthModalOpen,
    handleLoginSuccess
  } = useApp();

  const isAuthenticated = Boolean(authToken || (user && user.username && user.username !== 'Guest Explorer'));

  // Mandatory Authentication Gate: Must Sign In or Register before accessing anything
  if (!isAuthenticated) {
    return <AuthView />;
  }

  // Navigate directly back to question bank when question is completed & submitted
  const handleBackToQuestionBank = () => {
    setSuccessModalData(null);
    setActiveTab('problems');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8fe] text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'problems' && <ProblemsView />}
        {activeTab === 'solve' && <SolveProblemView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'learn' && <LearnView />}
      </main>

      {/* Auth Login / Register Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Celebratory Success Modal */}
      <SuccessModal
        data={successModalData}
        onClose={handleBackToQuestionBank}
        onNextProblem={handleBackToQuestionBank}
      />

      {/* Deployment Guidance Modal */}
      <DeploymentGuideModal
        isOpen={deploymentModalOpen}
        onClose={() => setDeploymentModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
