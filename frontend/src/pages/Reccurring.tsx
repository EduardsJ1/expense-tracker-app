import MainLayot from "../layouts/MainLayout";
import { RecurringDashboard } from "../features/reccurring";
function RecurringPage(){
    return(
        <>
        <MainLayot>
            <RecurringDashboard/>
        </MainLayot>
        </>
    )
}

export default RecurringPage;