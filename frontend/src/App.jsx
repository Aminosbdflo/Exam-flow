import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Layout from './components/Layout'

// Lazy load pages for performance
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Exams = lazy(() => import('./pages/Exams'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminOverview = lazy(() => import('./pages/AdminOverview'))
const ExamManage = lazy(() => import('./pages/ExamManage'))
const UserManage = lazy(() => import('./pages/UserManage'))
const ExamTake = lazy(() => import('./pages/ExamTake'))
const Profile = lazy(() => import('./pages/Profile'))
const Pricing = lazy(() => import('./pages/Pricing'))
const SuccessPage = lazy(() => import('./pages/SuccessPage'))
const CancelPage = lazy(() => import('./pages/CancelPage'))
const AdminPayments = lazy(() => import('./pages/AdminPayments'))
const MyPayments = lazy(() => import('./pages/MyPayments'))

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-muted-foreground font-bold tracking-widest uppercase text-[10px]">Initializing Platform</p>
    </div>
  )
}

function App() {
  const { checkAuth, isAuthenticated, isLoading, user } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/exams" element={<Exams />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/user"
            element={isAuthenticated ? (user?.role?.toLowerCase() === 'admin' ? <Navigate to="/dashboard/admin" /> : <Dashboard />) : <Navigate to="/" />}
          />
          <Route
            path="/exam/:id"
            element={isAuthenticated ? <ExamTake /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard/admin"
            element={isAuthenticated && user?.role?.toLowerCase() === 'admin' ? <AdminOverview /> : <Navigate to="/dashboard/user" />}
          />
          <Route
            path="/dashboard/admin/exams"
            element={isAuthenticated && user?.role?.toLowerCase() === 'admin' ? <ExamManage /> : <Navigate to="/dashboard/user" />}
          />
          <Route
            path="/dashboard/admin/users"
            element={isAuthenticated && user?.role?.toLowerCase() === 'admin' ? <UserManage /> : <Navigate to="/dashboard/user" />}
          />
          <Route
            path="/dashboard/admin/payments"
            element={isAuthenticated && user?.role?.toLowerCase() === 'admin' ? <AdminPayments /> : <Navigate to="/dashboard/user" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
          />
          {/* Redirects & Catch-all */}
          <Route path="/dashboard" element={
            isAuthenticated ? (
              user?.role?.toLowerCase() === 'admin' ? <Navigate to="/dashboard/admin" /> : <Navigate to="/dashboard/user" />
            ) : <Navigate to="/login" />
          } />
          <Route
            path="/my-payments"
            element={isAuthenticated ? <MyPayments /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
