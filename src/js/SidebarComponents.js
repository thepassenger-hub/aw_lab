import React from 'react';
import {NavLink} from 'react-router-dom';

class TimeFilters extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="list-group list-group-flush">
            <NavLink exact to="/" data-id="filter-all" className={`list-group-item list-group-item-action`} activeClassName="active">All</NavLink>
            <NavLink to="/important" data-id="filter-important" className={`list-group-item list-group-item-action `} activeClassName="active" >Important</NavLink>
            <NavLink to="/today" data-id="filter-today" className={`list-group-item list-group-item-action `} activeClassName="active" >Today</NavLink>
            <NavLink to="/week" data-id="filter-week" className={`list-group-item list-group-item-action `} activeClassName="active" >Next 7 Days</NavLink>
            <NavLink to="/private" data-id="filter-private" className={`list-group-item list-group-item-action `} activeClassName="active" >Private</NavLink>
            <NavLink to="/shared" data-id="filter-shared" className={`list-group-item list-group-item-action `} activeClassName="active" >Shared With...</NavLink>
            <NavLink to="/completed" data-id="filter-completed" className={`list-group-item list-group-item-action `} activeClassName="active" >Completed</NavLink>
        </div>
    }
}

class ProjectFilters extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="my-5">
            <h6 className="border-bottom border-gray p-3 mb-0">Projects</h6>

            <div className="list-group list-group-flush" id="projects">
                {this.props.projects.map(e => <ProjectRow filter={this.props.filter} changeFilter={this.props.changeFilter} key={e} project={e} />)}
            </div>

        </div>
    }
}

class ProjectRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <NavLink to={`/${this.props.project}`} className={`list-group-item list-group-item-action `} activeClassName="active" >{this.props.project}</NavLink>
    }
}
export { TimeFilters, ProjectFilters };