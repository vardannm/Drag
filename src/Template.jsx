import CanvasEditor from "./components/CanvasItem/CanvasEditor";
import { useLocation } from "react-router-dom";
import './Template.css'
import coffeeMenu from "../../../Downloads/menu-design-1741177484759.json";
import fastFoodCombo from "../../../Downloads/menu-design-1741177538337.json";
const templateData = {
  1: coffeeMenu, 
  2: fastFoodCombo,
};
function Template() {
  const location = useLocation();


  return (
    <div className="template-editor">
      <CanvasEditor />
    </div>
  );
}

export default Template;