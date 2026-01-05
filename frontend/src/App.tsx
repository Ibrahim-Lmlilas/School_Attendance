import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { appRoutes } from './routes'

function renderRoutes(routes: typeof appRoutes) {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element}>
      {route.children?.map((child) => (
        <Route
          key={child.path}
          path={child.path}
          index={child.path === ''}
          element={child.element}
        />
      ))}
    </Route>
  ))
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {renderRoutes(appRoutes)}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App