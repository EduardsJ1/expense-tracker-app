import MainLayot from "../layouts/MainLayout";
import { TransactionDashboard } from "../features/transactions";
function TransactionsPage(){    
    
    return(
        <MainLayot>
            <TransactionDashboard/>
        </MainLayot>
    )
}

export default TransactionsPage;