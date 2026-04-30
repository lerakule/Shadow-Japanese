import { AppProvider, useApp } from './context/AppContext';
import TabBar from './components/TabBar';
import Home from './pages/Home';
import Practice from './pages/Practice';
import GrammarPage from './pages/GrammarPage';
import MyProgress from './pages/MyProgress';
import './styles/global.css';

function AppContent() {
  const { state } = useApp();
  
  const renderPage = () => {
    switch (state.activeTab) {
      case 'home':
        return <Home />;
      case 'practice':
        return <Practice />;
      case 'grammar':
        return <GrammarPage />;
      case 'progress':
        return <MyProgress />;
      default:
        return <Home />;
    }
  };
  
  return (
    <>
      <main className="main-content">
        {renderPage()}
      </main>
      <TabBar />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
