export interface DashboardData {
  my_expenses: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    disbursed: number;
    completed: number;
    total_amount_this_month: string;
  };
  my_reconciliations: {
    total: number;
    pending: number;
    under_review: number;
    completed: number;
    rejected: number;
  };
  all_expenses: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    disbursed: number;
    completed: number;
    total_disbursed_this_month: string;
    total_disbursed_all_time: string;
    approval_rate_this_month: number;
    type_breakdown: {
      disbursement: number;
      reimbursement: number;
    };
  };
  all_reconciliations: {
    total: number;
    pending: number;
    under_review: number;
    completed: number;
    rejected: number;
  };
  actions_required: {
    expenses_pending_review: number;
    reconciliations_pending_review: number;
    topups_pending_approval: number;
    topups_approved_pending_disburse: number;
  };
  petty_cash: {
    id: string;
    name: string;
    current_balance: string;
    minimum_threshold: string;
    is_low: boolean;
    account_type: string;
    mpesa_phone_number: string;
  } | null;
  topup_summary: {
    total: number;
    pending: number;
    approved: number;
    completed: number;
    total_disbursed_this_month: string;
  };
  charts: {
    monthly_expense_trend: {
      month: string;
      total: number;
      total_amount: string;
    }[];
    daily_spend_last_30_days: {
      day: string;
      total_amount: string;
    }[];
  };
  recent_activity: {
    event_type__name: string;
    event_type__code: string;
    event_message: string;
    entity_type: string;
    entity_id: string;
    created_at: string;
  }[];
}