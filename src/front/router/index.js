import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import Routes from './Routes';

class index extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
        <BrowserRouter>
            {renderRoutes(Routes)}
        </BrowserRouter>
        )
    }
}
export default  (index);