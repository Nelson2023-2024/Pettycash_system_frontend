import PettyCashCardDetail from '@/components/pettycash/pettycash-card-page'
import PettyCashDataTable from '@/components/pettycash/pettycash-data-table'


const PettyCashAccount = () => {
  return (
    <div className='w-[80%] mx-auto'>
      <PettyCashCardDetail/>
      <PettyCashDataTable/>
    </div>
  )
}

export default PettyCashAccount