import { DATA_PROVIDER } from '../config'
import { ApiCommodityRepository } from '../repositories/api/ApiCommodityRepository'
import { ApiFarmerRepository } from '../repositories/api/ApiFarmerRepository'
import { ApiGradeRepository } from '../repositories/api/ApiGradeRepository'
import { ApiSaleRepository } from '../repositories/api/ApiSaleRepository'
import { ApiStockInRepository } from '../repositories/api/ApiStockInRepository'
import { ApiTraderRepository } from '../repositories/api/ApiTraderRepository'
import { MockCommodityRepository } from '../repositories/mock/MockCommodityRepository'
import { MockFarmerRepository } from '../repositories/mock/MockFarmerRepository'
import { MockGradeRepository } from '../repositories/mock/MockGradeRepository'
import { MockSaleRepository } from '../repositories/mock/MockSaleRepository'
import { MockStockInRepository } from '../repositories/mock/MockStockInRepository'
import { MockTraderRepository } from '../repositories/mock/MockTraderRepository'
import type {
  CommodityRepository,
  FarmerRepository,
  GradeRepository,
  SaleRepository,
  StockInRepository,
  TraderRepository,
} from '../repositories/types'

/**
 * Decides which repository implementation the rest of the app uses.
 *
 * Pages and services NEVER instantiate repositories directly — they ask the
 * factory. Switching DATA_PROVIDER from "mock" to "api" rewires the whole app.
 */
class RepositoryFactoryImpl {
  private farmer?: FarmerRepository
  private commodity?: CommodityRepository
  private grade?: GradeRepository
  private trader?: TraderRepository
  private sale?: SaleRepository
  private stockIn?: StockInRepository

  private get isApi(): boolean {
    return DATA_PROVIDER === 'api'
  }

  getFarmerRepository(): FarmerRepository {
    if (!this.farmer) {
      this.farmer = this.isApi
        ? new ApiFarmerRepository()
        : new MockFarmerRepository()
    }
    return this.farmer
  }

  getCommodityRepository(): CommodityRepository {
    if (!this.commodity) {
      this.commodity = this.isApi
        ? new ApiCommodityRepository()
        : new MockCommodityRepository()
    }
    return this.commodity
  }

  getGradeRepository(): GradeRepository {
    if (!this.grade) {
      this.grade = this.isApi
        ? new ApiGradeRepository()
        : new MockGradeRepository()
    }
    return this.grade
  }

  getTraderRepository(): TraderRepository {
    if (!this.trader) {
      this.trader = this.isApi
        ? new ApiTraderRepository()
        : new MockTraderRepository()
    }
    return this.trader
  }

  getSaleRepository(): SaleRepository {
    if (!this.sale) {
      this.sale = this.isApi
        ? new ApiSaleRepository()
        : new MockSaleRepository()
    }
    return this.sale
  }

  getStockInRepository(): StockInRepository {
    if (!this.stockIn) {
      this.stockIn = this.isApi
        ? new ApiStockInRepository()
        : new MockStockInRepository()
    }
    return this.stockIn
  }
}

export const RepositoryFactory = new RepositoryFactoryImpl()
