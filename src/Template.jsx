import CanvasEditor from "./components/CanvasItem/CanvasEditor";
import { useLocation } from "react-router-dom";
import './Template.css'

function Template() {
  const location = useLocation();


  return (
    <div className="template-editor">
      <CanvasEditor />
    </div>
  );
}

export default Template;