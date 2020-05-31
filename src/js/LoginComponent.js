import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Link, Redirect} from 'react-router-dom'


class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            validated: false
        }
    }

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setState({ validated: true });
        }
        else {
            // this.setState((state) => {
            //     this.props.login(state.email);
            //     return {submitted: true}
            // });
            this.props.login(this.state.email, this.state.password);
        }
    }

    render() {
        if (this.state.submitted) return <Redirect to="/" />;
        return <Modal
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Login
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required minLength={5} type="email" name="email" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} placeholder="Enter Email" />
                        <Form.Control.Feedback type="invalid">
                            Please type a valid email.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Project</Form.Label>
                        <Form.Control required type="password" minLength={6} placeholder="Enter password" name="password" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please type a Password atleast 6 chars long.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Link to="/" className="btn btn-lg btn-primary">Close</Link>
            </Modal.Footer>
        </Modal>

    
    }
}

export { Login };