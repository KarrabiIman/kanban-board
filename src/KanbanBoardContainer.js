import React, { Component } from 'react';
import KanbanBoard from './KanbanBoard';
import update from 'react-addons-update';

// If you're running the server locally, the URL will be, by default, localhost:3000
// Also, the local server doesn't need an authorization header.
const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'imanrobocup@yahoo.com'
};


class KanbanBoardContainer extends Component {
    constructor() {
        super();
        this.state = {
            cards: []
        };
    };

    componentDidMount() {
        fetch(process.env.PUBLIC_URL + '/assets/json/cards.json')
        // fetch(API_URL + '/cards', { headers: API_HEADERS })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({ cards: responseData });
            })
            // windows.state = this.state
            .catch((error) => {
                console.log('Error fetching and parsing data from remote ', error);
            });
    }

    addTask(cardId, taskName) {
        let prevState = this.state;
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let newTask = { id: Date.now(), name: taskName, done: false };
        let nextState = update(this.state.cards, { [cardIndex]: { tasks: { $push: [newTask] } } });
        this.setState({ cards: nextState });

        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            headers: API_HEADERS,
            method: 'post',
            body: JSON.stringify(newTask)
        })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error("Server response was not OK - adding-task")
            }
        })
        .then((responseData) => {
            newTask.id = responseData.id
            this.setState({ cards: nextState })
        })
        .catch((error) => {
            console.error('Error fetching - adding task', error)
            this.setState(prevState)
        });
    }


    deleteTask(cardId, taskId, taskIndex) {
        let prevState = this.state;
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let nextState = update(this.state.cards, { [cardIndex]: { tasks: { $splice: [[taskIndex, 1]] } } });
        this.setState({ cards: nextState });
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            headers: API_HEADERS,
            method: 'delete'
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Server response was not OK - deleting-task")
            }
        })
        .catch((error) => {
            console.error('Error fetching - deleting task', error)
            this.setState(prevState)
        });
    }

    
    toggleTask(cardId, taskId, taskIndex) {
        let prevState = this.state;
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let newDoneValue;
        let nextState = update(
            this.state.cards, {
                [cardIndex]: {
                    tasks: {
                        [taskIndex]: {
                            done: {
                                $apply: (value) => {
                                    newDoneValue = !value;
                                    return newDoneValue;
                                }
                            }
                        }
                    }
                }
            });
        this.setState({ cards: nextState });
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            headers: API_HEADERS,
            method: 'put',
            body: JSON.stringify({ done: newDoneValue })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Server response was not OK - toggling-task")
            }
        })
        .catch((error) => {
            console.error("Error fetching - toggling-task", error)
            this.setState(prevState)
        });
    }

    render() {
        return (
            <KanbanBoard cards={this.state.cards}
                taskCallbacks={{
                    add: this.addTask.bind(this),
                    delete: this.deleteTask.bind(this),
                    toggle: this.toggleTask.bind(this)
                }} />
        );
    }
}

export default KanbanBoardContainer;
