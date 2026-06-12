import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { MasterDataProvider } from './hooks/MasterDataProvider'
import { CommoditiesPage } from './pages/CommoditiesPage'
import { FarmerFormPage } from './pages/FarmerFormPage'
import { FarmerViewPage } from './pages/FarmerViewPage'
import { FarmersPage } from './pages/FarmersPage'
import { GradesPage } from './pages/GradesPage'
import { HomePage } from './pages/HomePage'
import { ReportsPage } from './pages/ReportsPage'
import { SaleEntryPage } from './pages/SaleEntryPage'
import { StockInDetailPage } from './pages/StockInDetailPage'
import { StockInPage } from './pages/StockInPage'

export default function App() {
  return (
    <MasterDataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="farmers" element={<FarmersPage />} />
          <Route path="farmers/new" element={<FarmerFormPage />} />
          <Route path="farmers/:id" element={<FarmerViewPage />} />
          <Route path="farmers/:id/edit" element={<FarmerFormPage />} />
          <Route path="commodities" element={<CommoditiesPage />} />
          <Route path="grades" element={<GradesPage />} />
          <Route path="sales/new" element={<SaleEntryPage />} />
          <Route path="stock-in" element={<StockInPage />} />
          <Route path="stock-in/:id" element={<StockInDetailPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </MasterDataProvider>
  )
}
