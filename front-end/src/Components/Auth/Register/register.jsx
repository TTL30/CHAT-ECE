import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from './registerStyle.module.css';
import { useForm } from 'react-hook-form';
//import { registerUser } from '../../../utils/api_auth'
import { Link, useHistory } from 'react-router-dom'
//import {useContextValue} from "../../../state/StateProvider";
//import {PRE_HOST} from "../../../utils/constant";
import { signIn } from '../../../utils/api_users'

const Register = (props) => {
    //const [_, dispatch] = useContextValue()
    const { register, getValues, handleSubmit, errors } = useForm();
    const [myerrors, setErrors] = useState('');

    //const role = 'user';
    let history = useHistory();

    const onSubmit = (data) => {
        signIn(data.username,data.email, data.password,
            (onSuccessMessage) => {
                console.log(onSuccessMessage)
                history.push("/login")
            },
            (onErrorMessage) => {
                console.error(onErrorMessage)
                setErrors(onErrorMessage)
            })
    };

    const passwordChecked = async (value) => {
        if (value === getValues().password) {
            return true;
        }
        return false;
    }

    return (
        <div className={styles.wrapper}>

            <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                <div className="mb-5 text-center">
                    <h2>Create ECECHAT account: </h2>
                </div>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>E-mail address : </Form.Label>
                    <Form.Control type="email" placeholder="Type e-mail" name="email" ref={register({ required: true, maxLength: 50 })} />
                    {errors.email && errors.email.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                </Form.Group>

                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username : </Form.Label>
                    <Form.Control type="text" placeholder="Type username" name="username" ref={register({ required: true, maxLength: 50 })} />
                    {errors.username && errors.username.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password : </Form.Label>
                    <Form.Control type="password" placeholder="Type password" name="password" ref={register({ required: true, maxLength: 80 })} />
                    {errors.password && errors.password.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                </Form.Group>

                <Form.Group controlId="formBasicCheckPassword">
                    <Form.Label>Confirm password : </Form.Label>
                    <Form.Control type="password" placeholder="Type password" name="passwordcheck" ref={register({ required: true, validate: passwordChecked })} />
                    {errors.passwordcheck && errors.passwordcheck.type === "required" && <p className={styles.error}> <span>&#9888;</span> Merci de bien renseigner ce champ</p>}
                    {errors.passwordcheck && errors.passwordcheck.type === "validate" && <p className={styles.error}> <span>&#9888;</span> Merci de verifier vos mots de passe</p>}
                </Form.Group>

                <div className="text-center">

                    <Button variant="outline-success" type="submit">
                        Submit
                    </Button>

                    <Link to={'/login'}>
                        <Button className={styles.boutConex} variant="outline-primary" type="submit">
                            Log In
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

export default Register;