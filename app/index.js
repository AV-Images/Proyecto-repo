import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
const server=express();

import path from 'path';
import {fileURLToPath} from 'url';
const _dirname = path.dirname(fileURLToPath(import.meta.url));

server.set("port",3500);
server.listen(server.get("port"));
server.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Av_image'
});

//Configuracion del server
server.use(express.static(_dirname+"/public"))
server.use(express.static(_dirname+"/images"))

//Rutas
server.get("/",(req,res)=>res.sendFile(_dirname+"/Hompage/Index.html"))
server.get("/gal",(req,res)=>res.sendFile(_dirname+"/Layout/Pantalla-1.html"))
server.get("/casual",(req,res)=>res.sendFile(_dirname+"/Casualpantalla/Casual.html"))
server.get("/fav",(req,res)=>res.sendFile(_dirname+"/Favoritos/Fav.html"))
server.get("/sIn",(req,res)=>res.sendFile(_dirname+"/Login/Login.html"))
server.get("/sUp",(req,res)=>res.sendFile(_dirname+"/Registrarse/Registro.html"))


db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

//Metodos
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

server.post('/register', async (req, res) => {
    const { name, phone, email, password } = req.body;
    
    if (!email || !password || !name || !phone) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const salt= await bcryptjs.genSalt(5);
    const hashPassword= await bcryptjs.hash(password,salt);
    const query = 'INSERT INTO Usuario (nombre_user, telefono_user, email_usuario, password_usuario) VALUES (?, ?, ?, ?)';
    db.query(query, [name, phone, email, hashPassword], (err, result) => {
        if (err) {
            console.error('Error insertando en la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
        res.json({ success: true, message: 'Registro exitoso' });
    });
});

server.post('/login', (req, res)=>{
    const email=req.body.email;
    const password=req.body.password;
    if(!email || !password){
        return res.status(400).send({status:"Error", message:"Llena todo pa"})
    }
    db.query("select * from Usuario",async (err,datos)=>{
        if(err){
            return res.status(400).send({status:"Error",message:"Error la obtener los usuarios"})
        }
        const usuarioRevisar=datos.find(usuario=>usuario.email_usuario===email);
        if(!usuarioRevisar){
            return res.status(400).send({status:"Error", message:"Hubo un errror pa"})
        }
        const loginCorrecto= await bcryptjs.compare(password,usuarioRevisar.password_usuario)
        if(!loginCorrecto){
            return res.status(400).send({status:"Error", message:"Hubo un errror pa"})
        }
        const token=jsonwebtoken.sign(
            {email:usuarioRevisar.email_usuario},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRATION});
        
        const cookieOption={
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
            path:"/"
        }
        console.log("login exitoso")
        res.cookie("jwt",token,cookieOption);
        res.send({status:"ok",message:"Usuario loggeado",redirect:"/"})
    });
})