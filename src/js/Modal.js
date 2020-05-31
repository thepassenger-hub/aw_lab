import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import {Link} from 'react-router-dom'
class MyVerticallyCenteredModal extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.mode === "add")
            this.state = {
                validated: false,
                id: null,
                description: "",
                important: false,
                private: false,
                date: new moment(),
                project: ""
            }
        else if (this.props.mode === "edit")
            this.state = {
                validated: false,
                id: this.props.data.id,
                description: this.props.data.description,
                important: this.props.data.important,
                private: this.props.data.privateTask,
                date: this.props.data.deadline,
                project: this.props.data.project

            }
        // this.handleSubmit = this.handleSubmit.bind(this);
    }


    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    updateDate = (date) => this.setState({ date: moment(date) });

    handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setState({ validated: true });
        }
        else {
            this.props.addOrEditTask(this.state);
        }
    }

    render() {
        return <Modal
            show={this.props.show}
            onHide={this.props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a Task
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicDesc">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required minLength={3} type="text" name="description" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} placeholder="Enter description" defaultValue={this.props.mode === "edit" ? this.props.data.description : ""} />
                        <Form.Control.Feedback type="invalid">
                            Please type a description at least 3 chars long.
                        </Form.Control.Feedback>
                    </Form.Group>
                    

                    <Form.Group controlId="formBasicProject">
                        <Form.Label>Project</Form.Label>
                        <Form.Control required type="text" placeholder="Project" name="project" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} defaultValue={this.props.mode === "edit" ? this.props.data.project : ""} />
                        <Form.Control.Feedback type="invalid">
                            Please type a Project.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicImportant">
                        <Form.Check type="checkbox" label="Task is important" name="important" onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)} defaultChecked={this.props.mode === "edit" ? this.props.data.important : this.state.important} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPrivate">
                        <Form.Check type="checkbox" label="Task is private" name="private" onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)} defaultChecked={this.props.mode === "edit" ? this.props.data.privateTask : this.state.private} />
                    </Form.Group>
                    <Form.Group controlId="formBasicDeadline">
                        <DateTimePicker onChange={this.updateDate} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Link to="/" className="btn btn-lg btn-primary" onClick={this.props.onHide}>Close</Link>
            </Modal.Footer>
        </Modal>

    }
}
export { MyVerticallyCenteredModal };