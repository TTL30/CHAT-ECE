import React, { useState, useEffect, useContext } from "react";
import { socket } from '../../../../../utils/socket';
import { useCookies } from "react-cookie";
import styles from '../Messages/messagesStyle.module.css';
import { RoomContext } from "../../../../../Context/RoomContext";
import { deleteMessageChannel, getMessagesChannel } from "../../../../../utils/api_messages";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addUsToChan } from "../../../../../utils/api_users";
import { FaUserAlt } from 'react-icons/fa';
const Accueil = () => {


  return (
    <div className={styles.wrapper}>
        ACCCUEIL
    </div>
  );
}

export default Accueil;