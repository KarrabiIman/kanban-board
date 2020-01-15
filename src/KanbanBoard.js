import React, { Component } from 'react';
import List from './List';
import PropTypes from 'prop-types';


class KanbanBoard extends Component {
    render() {
        var todoCards = this.props.cards.filter(card => card.status === 'todo');
        var inProgressCards = this.props.cards.filter(card => card.status === 'in-progress');
        var doneCards = this.props.cards.filter(card => card.status === 'done');

        return (
            <div >
                <List id="todo" title="To Do" cards={todoCards} taskCallbacks={this.props.taskCallbacks} />

                <List id="in-progress" title="In Progress" cards={inProgressCards} taskCallbacks={this.props.taskCallbacks} />

                <List id="done" title="Done" cards={doneCards} taskCallbacks={this.props.taskCallbacks} />
            </div>
        );
    }
}
KanbanBoard.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object
};


export default KanbanBoard;