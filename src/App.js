import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AppTitle from "./js/AppTitle";
import { Navbar } from "./js/NavbarComponent";
import { TimeFilters, ProjectFilters } from "./js/SidebarComponents";
import { Tasks } from "./js/Tasks";
import { Login } from "./js/LoginComponent";
import { MyVerticallyCenteredModal } from "./js/Modal";
import { Task } from "./js/task.js";
import API from './js/API';

class App extends React.Component {
    state = {
        user: "",
        tasks: [],
        projects: [],
        mode: "view",
        data: {},
        modalShow: false,
        csrfToken: null
    }

    componentDidMount() {
        console.log("App component did mount");
        API.getTasks().then((tasks) => {
            this.setState((state) => {
                let projects = [];
                for (const task of tasks) {
                    projects.includes(task.project) ? console.log(null) : projects.push(task.project);
                };
                return { tasks, projects }
            })
        });
    }

    
    updateProjects = () => {
        let projects = [];
        for (const task of this.state.tasks) {
            projects.includes(task.project) ? console.log(null) : projects.push(task.project);
        };
        this.setState({ projects });
    }


    changeFilter = filter => {
        this.setState({ filter });
    }

    addOrEditTask = task => {
        if (this.state.mode === "add") {
            API.addTask(task,this.state.csrfToken)
                .then(data => {
                    this.setState((state) => {
                        const tasks = [...state.tasks];
                        const newTask = new Task(
                            data.id,
                            task.description,
                            task.important,
                            task.private,
                            task.date,
                            task.project,
                            0
                        );
                        tasks.push(newTask);
                        return { tasks: tasks, mode: "view" };
                    }, () => this.updateProjects())
                })
        } else if (this.state.mode === "edit") {
            API.updateTask(task, this.state.csrfToken)
                .then(() => {
                    this.setState(state => {
                        const tasks = state.tasks.map(t => {
                            if (t.id === task.id)
                                return new Task(
                                    task.id,
                                    task.description,
                                    task.important,
                                    task.private,
                                    task.date,
                                    task.project,
                                    task.completed
                                );
                            return t;
                        });

                        return { tasks: tasks, mode: "view" };

                    }, () => this.updateProjects())
                }).catch((err) => console.log(err.errors[0].msg));
        }
    }

    showEditTask = task => {
        this.setState({
            mode: "edit",
            data: task,
        });
    }

    deleteTask = id => {
        API.deleteTask(id, this.state.csrfToken)
            .then(this.setState(state => {
                const tasks = state.tasks.filter(t => t.id !== id);
                return { tasks: tasks, mode: "view" };
            }, () => this.updateProjects()))
    }

    markAsCompleted = task => {
        const newTask = {
            id: task.id,
            description: task.description,
            important: task.important,
            private: task.privateTask,
            date: task.deadline,
            project: task.project,
            completed: !task.completed
        };
        API.updateTask(newTask)
            .then(this.setState(state => {
                const tasks = state.tasks.map(t => {
                    if (t.id === task.id)
                        return new Task(
                            task.id,
                            task.description,
                            task.important,
                            task.privateTask,
                            task.deadline,
                            task.project,
                            !task.completed
                        );
                    return t;
                });
                return { tasks };
            }));
    }

    login = (email, password) => {
        // this.setState({email});
        API.login(email, password)
            .then((userObj) => {
                this.setState({ mode: 'loading', user: userObj.name });
                // this.loadInitialData();
                API.getCSRFToken().then((response) => this.setState({ csrfToken: response.csrfToken }));
            }
            ).catch(
                () => { this.setState({ mode: 'login', user: '' }) })
    }

    render() {
        return <Router>
            <div className="App">
                <Navbar />
                <AppTitle />
                <div className="container-fluid">
                    <div className="row vheight-100">
                        <aside className="collapse d-sm-block col-sm-4 col-12 bg-light below-nav" id="left-sidebar">
                            <TimeFilters />
                            <ProjectFilters projects={this.state.projects} />
                        </aside>
                        <main className="col-sm-8 col-12 below-nav">
                            {this.state.email ? <h1 id="welcome_msg">Welcome {this.state.email}!</h1> : null}
                            <h1 id="">My tasks</h1>
                            <Switch>
                                <Route exact path="/" component={props =>
                                    <Tasks showEditTask={this.showEditTask} deleteTask={this.deleteTask} markAsCompleted={this.markAsCompleted} filter={null} />
                                }></Route>
                                <Route path="/:filter" component={props => <Tasks
                                    showEditTask={this.showEditTask}
                                    deleteTask={this.deleteTask}
                                    markAsCompleted={this.markAsCompleted}
                                    filter={props.match.params.filter}
                                    key={props.match.params.filter} />}></Route>

                            </Switch>
                            <Link to="/newTask" type="button" id="addButton" className="btn btn-lg btn-success fixed-right-bottom" onClick={() => {
                                this.setState({ mode: "add" });
                            }}>&#43;</Link>
                        </main>
                    </div>
                </div>

                <Route path="/newTask" component={props => <MyVerticallyCenteredModal
                    addOrEditTask={this.addOrEditTask}
                    mode={"add"}
                    data={this.state.data}
                    show={true}
                />
                }></Route>

                <Route path="/login" component={props => <Login login={this.login} />}></Route>

                {this.state.mode === "edit" &&
                    <MyVerticallyCenteredModal
                        addOrEditTask={this.addOrEditTask}
                        mode={this.state.mode}
                        data={this.state.data}
                        show={true}
                        onHide={() => this.setState({ mode: "view" })} />
                }


            </div>
        </Router>
    }

}

export default App;