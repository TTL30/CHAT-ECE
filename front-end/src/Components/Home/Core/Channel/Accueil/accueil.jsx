import React, { useState, useEffect, useContext } from "react";
import { socket } from '../../../../../utils/socket';
import { useCookies } from "react-cookie";
import styles from './accueilStyle.module.css';
import { RoomContext } from "../../../../../Context/RoomContext";
import { deleteMessageChannel, getMessagesChannel } from "../../../../../utils/api_messages";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addUsToChan } from "../../../../../utils/api_users";
import { FaUserAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

const Accueil = () => {


  return (
    <div className={styles.wrapper}>
      <div>
        <center>
        <br/>
          <h1 style={{color: "#7289da"}}>
            ~ Welcome ~ <br/>
          </h1>
        </center>
        <div >
          <center>
            <h3 style={{color: "#7289da"}}>
              You are on the home page <br/> <br/>  
            </h3>
            <p >
              On ECE CHAT you will be able to create channels in order to talk with other users
            </p>
            <p style={{color: "#7289da"}}>⁂</p>
            <p > 
            To create a channel, you can click on the <b>"+"</b> button on your left. Then choose a name for this channel and it will be created
            </p>
            <p style={{color: "#7289da"}}>⁂</p>
            <p > 
            Once your channel is created, you can add users on it with the "adduser" button on the top of you conversation page
            <p style={{color: "#7289da"}}>⁂</p>

            <p > 
            If you are the admin of the channel you can remove the channel
            </p>
            </p>
            
            <p style={{color: "#7289da"}}>⁂</p>
            <p > 
            On the right, you will see all the users that are connected on the chat 
            </p>
            <p style={{color: "#7289da"}}>⁂</p>
            <p > 
            When you are a guest in someone else chat, you can't add users or remove the channel
            </p>
            <p style={{color: "#7289da"}}>⁂</p>
            <p > 
              You can see your informations by clicking on <FiSettings /> at the bottom left of your page, you will be able to update your avatar !
            </p>
            <p style={{color: "#7289da"}}>⁂</p>
            <p > 
              You can send messages, delete or update your own messages ! 
            </p>
           
            <p style={{color: "#7289da"}}>⁂</p>
            <p >
              To create this web site, we used the React programming language
            </p>
            <p style={{color: "#7289da"}}>⁂</p>
            <p>
            For this chat, we used the Level DB database. Moreover, you'll see that we choose to do a Real-time notification website with the library Socket.io
            </p>
          </center>
        </div>
      </div>
    </div>
  );
}

export default Accueil;