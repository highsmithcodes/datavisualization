import { Link } from "react-router-dom";

function Nav(){
    return (
        <nav>
          <div>
            <Link to="/">Data Visualization</Link>
          </div>
        <ul>
          <li>
            <Link to="/chart-1">Chart 1</Link>
          </li>
          <li>
            <Link to="/chart-2">Chart 2</Link>
          </li>
          <li>
            <Link to="/chart-3">Chart 3</Link>
          </li>
        </ul>
      </nav>
    )
}
export default Nav;