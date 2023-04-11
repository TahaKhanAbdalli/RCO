import * as constants from '../../constants'
import { describe, it, beforeAll, afterEach } from '@jest/globals'
import { getDataProvider } from '.'
import { type DataProvider } from 'react-admin'

/**
 * @jest-environment jsdom
 */

interface BatchType {
  data: Batch[]
}

const batches: Record<string, BatchType> = {
  [constants.R_BATCHES]: { data: [] }
}
const year = '2025'
let id = 1

const mockProvider = {
  async getList(resource: string, filter: any) {
    const data = batches[resource].data.filter(
      (d) => d.yearOfReceipt === filter.filter.yearOfReceipt
    )
    return { data, total: data.length }
  },

  async create(resource: string, params: { data: Batch }) {
    batches[resource].data.push({ ...params.data })
    return batches
  }
}

jest.mock('.', () => ({
  async getDataProvider() {
    return mockProvider
  }
}))

const generateBatch = async (provider: DataProvider, year: string) => {
  const obj: Batch = {
    id,
    createdAt: Date.now().toString(),
    name: `batch-${year}`,
    batchNumber: `V${id}/${year}`,
    vault: id,
    yearOfReceipt: year,
    department: id,
    project: id,
    platform: id,
    organisation: id,
    protectiveMarkingAuthority: id,
    maximumProtectiveMarking: id,
    remarks: `remarks-batch-${year}`
  }

  await provider.create(constants.R_BATCHES, { data: { ...obj } })
  id++
}

describe('generateBatchId', () => {
  let provider: DataProvider

  beforeAll(async () => {
    provider = await getDataProvider()
  })

  afterEach(async () => {
    await generateBatch(provider, year)
  })

  const generateBatchId = async (year: string) => {
    const batches = await provider.getList(constants.R_BATCHES, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: { yearOfReceipt: year }
    })
    return batches.data.length.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })
  }

  describe('when there are no batches in the specified year', () => {
    it('should return 00', async () => {
      const result = await generateBatchId(year)
      expect(result).toBe('00')
    })
  })

  describe('when there is one batch in the specified year', () => {
    it('should return 01', async () => {
      const result = await generateBatchId(year)
      expect(result).toBe('01')
    })
  })

  describe('when there are multiple batches in the specified year', () => {
    it('should return 02', async () => {
      const result = await generateBatchId(year)
      expect(result).toBe('02')
    })
  })

  describe('when an invalid value is provided for year (non-integer)', () => {
    it('should throw a TypeError', async () => {
      const year = 'aaa'
      await expect(async () => await generateBatchId(year)).rejects.toThrow(
        TypeError
      )
    })
  })
})
