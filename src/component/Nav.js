import { Link } from "react-router-dom";

function Nav(){
    return (
        <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page1">Page 1</Link>
          </li>
          <li>
            <Link to="/page2">Page 2</Link>
          </li>
          <li>
            <Link to="/page3">Page 3</Link>
          </li>
        </ul>
      </nav>
    )
}
export default Nav;