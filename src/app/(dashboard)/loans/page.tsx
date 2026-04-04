import EmployeeLoanDataTable from '@/components/loans/employee-loan-data-table'
import LoanRequestForm from '@/components/loans/loan-request.form'
import React from 'react'

const MyLoans = () => {
  return (
    <div className='w-[80%] mx-auto'>
        <EmployeeLoanDataTable/>
    </div>
  )
}

export default MyLoans