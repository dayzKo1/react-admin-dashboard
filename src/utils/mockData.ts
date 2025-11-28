import { Customer, CustomerActivity, CustomerFormValues, CustomerSource, CustomerStatus } from '../views/customers/types'

const sleep = (delay = 320) => new Promise(resolve => setTimeout(resolve, delay))

const randomId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

const seededCustomers: Customer[] = [
  {
    id: 'CUS-1001',
    name: 'Acme Corp',
    email: 'ops@acme.com',
    phone: '+1 415-555-1010',
    company: 'Acme Corp',
    position: 'Operations Lead',
    source: CustomerSource.Website,
    status: CustomerStatus.Active,
    owner: 'Jamie Lee',
    lifetimeValue: 48000,
    monthlyRecurringRevenue: 4000,
    notes: 'Enterprise plan. Weekly sync on Mondays.',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-11-02T08:10:00Z',
  },
  {
    id: 'CUS-1002',
    name: 'Nova Retail',
    email: 'cto@novaretail.io',
    phone: '+44 20 7946 0890',
    company: 'Nova Retail',
    position: 'CTO',
    source: CustomerSource.Referral,
    status: CustomerStatus.InProgress,
    owner: 'Iris Chen',
    lifetimeValue: 18000,
    monthlyRecurringRevenue: 1500,
    notes: 'Evaluating automation workflow add-on.',
    createdAt: '2024-08-01T15:30:00Z',
  },
  {
    id: 'CUS-1003',
    name: 'BrightPath Health',
    email: 'product@brightpath.health',
    phone: '+1 312-555-9823',
    company: 'BrightPath Health',
    position: 'Product Manager',
    source: CustomerSource.Ads,
    status: CustomerStatus.Prospect,
    owner: 'Jamie Lee',
    notes: 'Needs HIPAA appendix. Follow-up scheduled next week.',
    createdAt: '2024-10-05T12:20:00Z',
  },
  {
    id: 'CUS-1004',
    name: 'Atlas Logistics',
    email: 'finance@atlaslogi.st',
    phone: '+61 2 9374 4000',
    company: 'Atlas Logistics',
    position: 'Finance Lead',
    source: CustomerSource.Partner,
    status: CustomerStatus.Active,
    owner: 'Marco Díaz',
    lifetimeValue: 6200,
    monthlyRecurringRevenue: 520,
    notes: 'Regional rollout underway, upsell alert for Q1.',
    createdAt: '2023-12-19T09:45:00Z',
    updatedAt: '2024-10-28T11:15:00Z',
  },
]

let customers = [...seededCustomers]

let activities: CustomerActivity[] = [
  {
    id: 'ACT-1',
    customerId: 'CUS-1002',
    actor: 'Iris Chen',
    type: 'call',
    summary: 'Discovery call about automation workflow needs.',
    timestamp: '2024-11-20T16:00:00Z',
    statusAfter: CustomerStatus.InProgress,
  },
  {
    id: 'ACT-2',
    customerId: 'CUS-1001',
    actor: 'Jamie Lee',
    type: 'deal',
    summary: 'Renewed enterprise contract for another 12 months.',
    timestamp: '2024-11-10T09:00:00Z',
    statusAfter: CustomerStatus.Active,
  },
]

export interface DashboardStats {
  totalCustomers: number
  newCustomers: number
  monthlyRecurringRevenue: number
  activeDeals: number
  revenueTrend: { month: string; revenue: number }[]
  sourceDistribution: { type: string; value: number }[]
  recentActivities: CustomerActivity[]
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await sleep()
  const now = new Date()
  const newCustomers = customers.filter(customer => {
    const created = new Date(customer.createdAt)
    return created.getUTCFullYear() === now.getUTCFullYear() && created.getUTCMonth() === now.getUTCMonth()
  })

  const revenueTrend = Array.from({ length: 6 }).map((_, idx) => {
    const date = new Date()
    date.setUTCMonth(date.getUTCMonth() - (5 - idx))
    const monthLabel = date.toLocaleString('default', { month: 'short' })
    const revenue = customers.reduce((sum, customer) => {
      if (customer.monthlyRecurringRevenue) {
        return sum + customer.monthlyRecurringRevenue * (0.8 + Math.random() * 0.4)
      }
      return sum
    }, 0)
    return { month: monthLabel, revenue: Number(revenue.toFixed(0)) }
  })

  const sourceCounts = customers.reduce<Record<string, number>>((acc, customer) => {
    acc[customer.source] = (acc[customer.source] ?? 0) + 1
    return acc
  }, {})

  return {
    totalCustomers: customers.length,
    newCustomers: newCustomers.length,
    monthlyRecurringRevenue: customers.reduce((sum, customer) => sum + (customer.monthlyRecurringRevenue ?? 0), 0),
    activeDeals: customers.filter(customer => customer.status === CustomerStatus.InProgress).length,
    revenueTrend,
    sourceDistribution: Object.entries(sourceCounts).map(([type, value]) => ({ type, value })),
    recentActivities: activities.slice(0, 5),
  }
}

export const getCustomers = async (): Promise<Customer[]> => {
  await sleep()
  return customers
}

export const getCustomer = async (id: string): Promise<Customer | undefined> => {
  await sleep()
  return customers.find(customer => customer.id === id)
}

export const createCustomer = async (payload: CustomerFormValues): Promise<Customer> => {
  await sleep()
  const newCustomer: Customer = {
    id: `CUS-${randomId()}`,
    createdAt: new Date().toISOString(),
    ...payload,
  }
  customers = [newCustomer, ...customers]
  activities = [
    {
      id: `ACT-${randomId()}`,
      customerId: newCustomer.id,
      actor: payload.owner ?? 'System',
      type: 'note',
      summary: 'Created a new customer record',
      timestamp: newCustomer.createdAt,
      statusAfter: payload.status,
    },
    ...activities,
  ]
  return newCustomer
}

export const updateCustomer = async (id: string, payload: Partial<CustomerFormValues>): Promise<Customer> => {
  await sleep()
  const index = customers.findIndex(customer => customer.id === id)
  if (index === -1) {
    throw new Error('Customer not found')
  }
  const existing = customers[index]
  const updated: Customer = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  customers[index] = updated
  if (payload.status && payload.status !== existing.status) {
    activities = [
      {
        id: `ACT-${randomId()}`,
        customerId: updated.id,
        actor: payload.owner ?? 'System',
        type: 'deal',
        summary: `Status updated from ${existing.status} to ${payload.status}`,
        timestamp: updated.updatedAt as string,
        statusAfter: payload.status,
      },
      ...activities,
    ]
  }
  return updated
}

export const deleteCustomer = async (id: string): Promise<void> => {
  await sleep()
  customers = customers.filter(customer => customer.id !== id)
  activities = activities.filter(activity => activity.customerId !== id)
}

export const getCustomerActivities = async (customerId: string): Promise<CustomerActivity[]> => {
  await sleep()
  return activities.filter(activity => activity.customerId === customerId)
}

