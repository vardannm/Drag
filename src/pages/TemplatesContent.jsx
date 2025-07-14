import { Link } from "react-router-dom";
import "./TemplatesContent.css";

const templateFiles = [
  { id: 1, name: "Coffee Menu", path: "/templates/menu-design-1741177484759.json" },
  { id: 2, name: "Fast Food Combo", path: "/templates/fast-food-combo.json" },
];

function TemplatesContent() {
  return (
    <div className="templates-content">
      <h1>Templates</h1>
      <Link to="/templates/new" target="_blank" rel="noopener noreferrer">
        <button className="templateButton">Create New Template</button>
      </Link>
      <div className="template-list">
        {templateFiles.map((template) => (
          <div key={template.id} className="template-item">
            <Link
              to={`/templates/${template.id}`}
              target="_blank"
              rel="noopener noreferrer"
              state={{ templatePath: template.path }}
            >
              {template.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplatesContent;