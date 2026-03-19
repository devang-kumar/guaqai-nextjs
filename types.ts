// GuaqAI - Shared Types
// Mirrors the Prisma schema for client-side use

export enum ChatSender {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system',
}

export enum SimulationStage {
  IDLE = 'IDLE',
  PRE_ARRIVAL = 'PRE_ARRIVAL',
  CHECK_IN = 'CHECK_IN',
  PULSE_CHECK = 'PULSE_CHECK',
  POST_STAY = 'POST_STAY',
  SERVICE_RECOVERY = 'SERVICE_RECOVERY',
  BOOKING = 'BOOKING',
}

export enum View {
  DASHBOARD = 'dashboard',
  INBOX = 'inbox',
  SIMULATOR = 'simulator',
  TICKETS = 'tickets',
  STAFF = 'staff',
  REVIEWS = 'reviews',
  CAMPAIGNS = 'campaigns',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  HELP = 'help',
}

export const ViewLabels: Record<View, string> = {
  [View.DASHBOARD]: 'Dashboard',
  [View.INBOX]: 'Live Inbox',
  [View.SIMULATOR]: 'Bot Simulator',
  [View.TICKETS]: 'Tickets',
  [View.STAFF]: 'Staff',
  [View.REVIEWS]: 'Reviews',
  [View.CAMPAIGNS]: 'Campaigns',
  [View.ANALYTICS]: 'Analytics',
  [View.SETTINGS]: 'Settings',
  [View.HELP]: 'Help',
};

export type UserRole = 'admin' | 'staff';

export interface Message {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: Date;
  isMedia?: boolean;
  mediaUrl?: string;
  status?: 'sent' | 'delivered' | 'read';
  sentimentScore?: string;
}

export interface GuestProfile {
  id: number;
  name: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  phone: string;
  status: 'Checked In' | 'Checked Out' | 'Upcoming';
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  lastRating?: number;
  tags: string[];
  loyaltyScore: number;
  predictedNextVisit?: string;
}

export interface Ticket {
  id: string;
  roomId: string;
  guestName: string;
  category: string;
  description: string;
  status: 'New' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: Date;
  assignedTo?: string;
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  platform: 'google' | 'tripadvisor';
  comment: string;
  response?: string;
  status: 'Pending' | 'Replied';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  currentShift: 'Morning' | 'Evening' | 'Night';
  isOnDuty: boolean;
  avatarBg: string;
}

export interface Alert {
  id: number;
  userId: number;
  type: 'critical' | 'warning' | 'info';
  msg: string;
  time: string;
}

export interface ReviewConfig {
  platform: 'google' | 'tripadvisor';
  minRating: number;
  prefilledText: string;
  autoReplyEnabled: boolean;
  signature: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
  uploadDate: Date;
}

export interface AffiliateContact {
  id: string;
  label: string;
  number: string;
  category: 'Transport' | 'Medical' | 'Food' | 'Other';
}

export interface BrandingConfig {
  appName: string;
  hotelName: string;
  logoUrl?: string;
  primaryColor?: string;
}

export interface SystemAccount {
  id: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff';
  permissions: View[];
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Draft' | 'Sent' | 'Scheduled';
  audienceSize: number;
  content: string;
  sentDate?: string;
  readRate?: number;
  clickRate?: number;
  revenue?: number;
}

export interface DepartmentStat {
  name: string;
  complaints: number;
  compliments: number;
  resolutionTime: number;
}

// Dashboard-specific enums
export enum DashboardTab {
  OVERVIEW = 'overview',
  REVIEWS = 'reviews',
  PERFORMANCE = 'performance',
  BOOKINGS = 'bookings',
}

export type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

// Analytics types
export interface CompetitorData {
  name: string;
  rating: number;
  reviews: number;
  price: number;
}

export interface FloorPlanNode {
  id: string;
  name: string;
  type: string;
  floor: number;
  sentimentScore: number;
  issues: number;
}

// Campaign filter type
export interface CampaignFilter {
  ageRange: [number, number];
  minSpend: number;
  interests: string[];
  location: string;
}

// Staff enums
export type ShiftType = 'Morning' | 'Evening' | 'Night';
export type StaffRole = 'Front Desk' | 'Housekeeping' | 'Maintenance' | 'Chef' | 'Manager' | 'Security' | 'Bell Boy' | 'Valet';

// Ticket enums
export type TicketStatus = 'New' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Maintenance' | 'Housekeeping' | 'F&B' | 'Concierge' | 'Front Desk';
