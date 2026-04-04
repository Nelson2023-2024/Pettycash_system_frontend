import AdminLoanDataTable from "@/components/loans/admin-loan-data-table";
import LoanDecisionForm from "@/components/loans/loan-decision-form";
import React from "react";

const AllLoans = () => {
  return (
    <div className="w-[80%] mx-auto">
      <AdminLoanDataTable/>
    </div>
  );
};

export default AllLoans;
