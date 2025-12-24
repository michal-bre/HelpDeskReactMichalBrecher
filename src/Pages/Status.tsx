import { AddStatusOrPriorityForm } from "../Components/AddStatusPriority";
import ShowPriorityOrStatus from "../Components/ShowStatusPriority";

const Status: React.FC = () => {
  return (
    <div>
        <AddStatusOrPriorityForm type={"statuses"} />
        <ShowPriorityOrStatus type={"statuses"} />
    </div>
  );
}
export default Status;