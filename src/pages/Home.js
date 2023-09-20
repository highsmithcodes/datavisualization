import { Link } from 'react-router-dom';
import chart1 from '../images/chart-1.png';
import chart2 from '../images/chart-2.png';
import chart3 from '../images/chart-3.png';


function Home() {
    return (
        <>
             <div className='container'>
                <h1>Data Visualization</h1>
                <div className='sub-title'>With D3.js and React</div>
                <div className='row'>
                    <div className='col-3'>
                        <Link to="/chart-1">
                            <img src={chart1} width="100%" height="auto" />
                        </Link>
                        <div className="sub-title">Closing Value for Crops</div>
                        <div className='type'>Line Chart</div>
                    </div>
                    <div className='col-3'>
                        <Link to="/chart-2">
                            <img src={chart2} width="100%" height="auto" />
                        </Link>
                        <div className="sub-title">Top 20 Countries by Population 2020</div>
                        <div className='type'>Bar Chart</div>
                    </div>
                    <div className='col-3'>
                        <Link to="/chart-3">
                            <img src={chart3} width="100%" height="auto" />
                        </Link>
                        <div className="sub-title">Most Employees</div>
                        <div className='type'>Bubble Chart</div>
                    </div>
                </div>
                <div id='chart-container'></div>
            </div>
        </>
    )
}
export default Home;