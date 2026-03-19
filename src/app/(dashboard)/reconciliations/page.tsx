import EmployeeReconciliationDataTable from '@/components/reconciliations/employee-reconciliation-data-table'
import ReconciliationSubmitForm from '@/components/reconciliations/reconciliation-sumbit-form'
import React from 'react'

const Reconciliations = () => {
  return (
    <div className='w-[80%] mx-auto'>
      <EmployeeReconciliationDataTable/>
    </div>
  )
}

export default Reconciliations