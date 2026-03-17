export interface RecentActivity {
  event_type__name: string;
  event_type__code: string;
  event_type__status_code: string;
  event_type__description: string;
  event_message: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

export interface DashboardData {
  my_expenses: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    disbursed: number;
    completed: number;
    my_pending_reconciliations: number;
    my_recent_activities: RecentActivity[];
  };
  actions_required: {
    expenses_pending_review: number;
    reconciliation_pending_review: number;
    topup_pending_approvals: number;
  };
  petty_cash_balance: {
    total_balance: string;
  };
  total_disbursed_this_month: string;
}