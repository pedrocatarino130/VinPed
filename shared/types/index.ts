// ============================================================================
// VinPed Bank - Shared Type Definitions
// ============================================================================

export type UUID = string;

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: UUID;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================================================
// Wallet Types
// ============================================================================

export interface Wallet {
  id: UUID;
  userId: UUID;
  name: string;
  initialBalance: number;
  currentBalance: number;
  creditLimit?: number;
  currentInvoice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletCreateInput {
  name: string;
  initialBalance?: number;
  creditLimit?: number;
}

export interface WalletUpdateInput {
  name?: string;
  creditLimit?: number;
  isActive?: boolean;
}

export interface WalletSummary {
  wallet: Wallet;
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  creditAvailable: number;
  currentInvoiceAmount: number;
  categoryBreakdown: CategorySpending[];
}

// ============================================================================
// Category Types
// ============================================================================

export interface Category {
  id: UUID;
  userId: UUID | null; // null for default categories
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreateInput {
  name: string;
  icon: string;
  color: string;
}

export interface CategoryUpdateInput {
  name?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface CategorySpending {
  category: Category;
  amount: number;
  percentage: number;
  transactionCount: number;
}

// ============================================================================
// Transaction Types
// ============================================================================

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

export enum PaymentMethod {
  DEBIT = 'debit',
  CREDIT = 'credit',
  CASH = 'cash',
  PIX = 'pix',
  BOLETO = 'boleto'
}

export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface Transaction {
  id: UUID;
  walletId: UUID;
  categoryId: UUID;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  paymentMethod?: PaymentMethod;
  installments?: number;
  installmentNumber?: number;
  parentTransactionId?: UUID | null;
  isScheduled: boolean;
  recurrenceRule?: RecurrenceRule | null;
  destinationWalletId?: UUID | null; // For transfers
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: Date;
  occurrences?: number;
}

export interface TransactionCreateInput {
  walletId: UUID;
  categoryId: UUID;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  paymentMethod?: PaymentMethod;
  installments?: number;
  destinationWalletId?: UUID;
  isScheduled?: boolean;
  recurrenceRule?: RecurrenceRule;
}

export interface TransactionUpdateInput {
  categoryId?: UUID;
  amount?: number;
  date?: Date;
  description?: string;
  paymentMethod?: PaymentMethod;
}

// ============================================================================
// Goal Types
// ============================================================================

export interface Goal {
  id: UUID;
  userId: UUID;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalCreateInput {
  name: string;
  targetAmount: number;
  deadline: Date;
}

export interface GoalUpdateInput {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: Date;
}

// ============================================================================
// Bill Types
// ============================================================================

export interface Bill {
  id: UUID;
  userId: UUID;
  walletId?: UUID;
  name: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  categoryId?: UUID;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillCreateInput {
  walletId?: UUID;
  name: string;
  amount: number;
  dueDate: Date;
  categoryId?: UUID;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
}

// ============================================================================
// Alert Types
// ============================================================================

export enum AlertType {
  INVOICE_LIMIT = 'invoice_limit',
  DUE_DATE = 'due_date',
  LOW_BALANCE = 'low_balance',
  GOAL_ACHIEVED = 'goal_achieved',
  SPENDING_PATTERN = 'spending_pattern'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export interface Alert {
  id: UUID;
  userId: UUID;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: UUID;
  createdAt: Date;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  creditAvailable: number;
  creditTotal: number;
  currentInvoice: number;
  categoryBreakdown: CategorySpending[];
  recentTransactions: Transaction[];
  alerts: Alert[];
  monthlyTrend: MonthlyTrendData[];
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Filter and Query Types
// ============================================================================

export interface TransactionFilters {
  walletId?: UUID;
  categoryId?: UUID;
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: PaymentMethod;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
