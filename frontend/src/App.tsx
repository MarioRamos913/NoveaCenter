import Dashboard from './views/Dashboard'
import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  )
}

export default App
