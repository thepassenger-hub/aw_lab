import React from 'react';
import moment from "moment";

import editIcon from "../svg/edit.svg";
import deleteIcon from "../svg/delete.svg";
import API from './API';

class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
        }
    }

    componentDidMount(){
        console.log("tasks component did mount");

        API.getTasks(this.props.filter)
            .then((tasks) => {
                this.setState({ tasks })
            });
    }

    render() {
        return <ul className="list-group list-group-flush" id="taskList">
            {this.state.tasks               
                .map(task => <TaskRow showEditTask={this.props.showEditTask} deleteTask={this.props.deleteTask} markAsCompleted={this.props.markAsCompleted} key={task.id} task={task} />)}
        </ul>
    }
}

class EditTask extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <img src={editIcon} onClick={() => { this.props.showEditTask(this.props.task) }} className="img-button" height="20" width="20" />
    }
}

class DeleteTask extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <img src={deleteIcon} onClick={() => { this.props.deleteTask(this.props.t_id) }} className="img-button" height="20" width="20" />
    }
}

class TaskRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <li id={`task${this.props.task.id}`} key={this.props.task.id} className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
                <div className="custom-control custom-checkbox" >
                    <input type="checkbox" id={`check-t${this.props.task.id}`} className={`custom-control-input ${this.props.task.important ? "important" : ""}`} onClick={() =>  this.props.markAsCompleted(this.props.task)} value={this.props.task.completed} defaultChecked={this.props.task.completed} />
                    <label className="description custom-control-label" htmlFor={`check-t${this.props.task.id}`} >{this.props.task.description}</label>
                    <span className="project badge badge-primary ml-4">{this.props.task.project}</span>
                </div>
                {!this.props.task.privateTask && (
                    <svg className="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clipRule="evenodd"></path>
                        <path fillRule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                    </svg>)}
                <small className={`date ${this.props.task.deadline.isBefore(moment()) ? "bg-danger text-white" : ""}`}>{this.props.task.deadline ? moment(this.props.task.deadline).format("dddd, MMMM Do YYYY, h:mm:ss a") : ""}</small>
                <EditTask showEditTask={this.props.showEditTask} task={this.props.task} />
                <DeleteTask t_id={this.props.task.id} deleteTask={this.props.deleteTask}/>
            </div>
        </li>
    }
}
export { Tasks };


