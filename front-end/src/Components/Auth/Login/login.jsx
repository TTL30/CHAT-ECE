import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './loginStyle.module.css';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { login } from '../../../utils/api_users'

const Login = () => {

    const { register, handleSubmit, errors } = useForm();
    const [myerrors, setErrors] = useState('');
    let history = useHistory();

    const onSubmit = (data) => {
        login(data.pseudo, data.password,
            (onSuccessMessage) => {
                localStorage.clear();
                history.push("/");
            },
            (onErrorMessage) => {
                localStorage.clear();
                setErrors(onErrorMessage);
            });
    }

    return (
        <div className={styles.wrapper}>
            <Form className={styles.form} onSubmit={handleSubmit(e => onSubmit(e))}>
                <h2>Connect to ECE CHAT : </h2>
                <Form.Group>
                    <Form.Label>Pseudo : </Form.Label>
                    <Form.Control type="text" placeholder="Type pseudo" name="pseudo" ref={register({ required: true, maxLength: 50 })} />
                    {errors.pseudo && errors.pseudo.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password : </Form.Label>
                    <Form.Control type="password" placeholder="Type password" name="password" ref={register({ required: true, maxLength: 80 })} />
                    {errors.password && errors.password.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                </Form.Group>
                <div className="text-center">
                    <Button variant="outline-success" type="submit">
                        Submit
                    </Button>
                    <Link to={'/register'}>
                        <Button className={styles.boutConex} variant="outline-primary" type="submit">
                            Register
                        </Button>
                    </Link>
                    {myerrors &&
                        <div className="alert alert-danger mt-3" role="alert">
                            {myerrors}
                        </div>
                    }
                </div>

            </Form>
        </div>
    );
}

export default Login;