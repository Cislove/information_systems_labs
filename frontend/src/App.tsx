import * as React from 'react';
import './App.css';
import {CoordinatesTable} from "./components/tables/CoordinatesTable";
import {CoordinatesDto, type PageDtoCoordinatesDto} from "./api/model";
import * as api from "./api/backend"
import {TablesSwitcher} from "./components/TableSwitcher";
import './App.css';


function App() {
    return (
        <div>
            <TablesSwitcher/>
        </div>
    );
}


export default App;