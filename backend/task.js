class Task{    
    constructor(id, description, important, privateTask, deadline, project, completed) {
        if(id)
            this.id = id;

        this.description = description;
        this.important = important;
        this.privateTask = privateTask;

        if(deadline)
            this.deadline = deadline;
        if(project)
            this.project = project;

        this.completed = completed || false;
    }
}

module.exports = Task;


