import { AddStatusOrPriorityForm } from "../Components/AddStatusPriority";
import ShowPriorityOrStatus from "../Components/ShowStatusPriority";

const Priority: React.FC = () => {
  return (
    <div>
        <AddStatusOrPriorityForm type={"priorities"} />
        <ShowPriorityOrStatus type={"priorities"} />
    </div>
  );
}
export default Priority;