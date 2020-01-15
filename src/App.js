import React from 'react';
import './App.css';
import KanbanBoardContainer from './KanbanBoardContainer';
import EditCard from './EditCard';
import NewCard from './NewCard';
import KanbanBoard from './KanbanBoard';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';


// var App = () => <KanbanBoardContainer />
var App = () =>
    (
        <Router history={createBrowserHistory()}>
            <Route exact path="/" component={KanbanBoardContainer} />
            <Route path="/new" component={NewCard} />
            {/* <Route path="edit/:card_id" component={EditCard} /> */}
        </Router>
    )


export default App;