import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors'

const server=express();

import path from 'path';
import {fileURLToPath} from 'url';
const _dirname = path.dirname(fileURLToPath(import.meta.url));

server.set("port",3500);
server.listen(server.get("port"));
server.use(bodyParser.json());

// Configuración de la base de datos
export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Av_image'
});

//Configuracion del server
server.use(express.static(_dirname+"/public"))
server.use(express.static(_dirname+"/images"))
server.use(cors());

//Rutas
server.get("/",(req,res)=>res.sendFile(_dirname+"/Hompage/Index.html"))
server.get("/cop",(req,res)=>res.sendFile(_dirname+"/Hompage/Index copy.html"))
server.get("/copingles",(req,res)=>res.sendFile(_dirname+"/Hompage/Index inglesuser.html"))
server.get("/copinglesnotuser",(req,res)=>res.sendFile(_dirname+"/Hompage/Index notuser.html"))
server.get("/gal",(req,res)=>res.sendFile(_dirname+"/Layout/Pantalla-1.html"))
server.get("/casual",(req,res)=>res.sendFile(_dirname+"/Casualpantalla/Casual.html"))
server.get("/fav",(req,res)=>res.sendFile(_dirname+"/Favoritos/Fav.html"))
server.get("/sIn",(req,res)=>res.sendFile(_dirname+"/Login/Login.html"))
server.get("/sUp",(req,res)=>res.sendFile(_dirname+"/Registrarse/Registro.html"))
server.get("/us",(req,res)=>res.sendFile(_dirname+"/Usuarios-pag/users.html"))
server.get("/me",(req,res)=>res.sendFile(_dirname+"/Layout/Pantalla-1 copy.html"))

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
        res.json({ success: true, message: 'Registro exitoso', redirect:'/sIn'});
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
        res.send({status:"ok",message:"Usuario loggeado",redirect:"/us"})
    });
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

server.post('/upload', upload.single('imagenes'),(req, res) => {
    try {
        const nombre=req.file.originalname;
        const tipo=req.file.mimetype;
        const img=req.file.buffer;
        const gal=req.body.galeria[0];
        if(gal==1){
            const insert="insert into imagenes_Carros(nombre, tipo_dato, datos) values (?,?,?)";
            db.query(insert,[nombre,tipo,img], (err,data)=>{
                if(err){
                    return res.send({status:'400',message:'No se pudo insertar la imagen'})
                }else{
                    console.log('Archivos subidos exitosamente');
                    return res.status(200).redirect('/us')
                }
            })
        }
        if(gal==2){
            const insert="insert into imagenes_Casual(nombre, tipo_dato, datos) values (?,?,?)";
            db.query(insert,[nombre,tipo,img], (err,data)=>{
                if(err){
                    return res.send({status:'400',message:'No se pudo insertar la imagen'})
                }else{
                    console.log('Archivos subidos exitosamente');
                    return res.status(200).redirect('/us')
                }
            })
        }
    } catch (error) {
        console.error(error);
        res.send({message:'Error al subir la imagen',redirect:"/us"});
    }
});

server.post('/longCarr',(req,res)=>{
    const tabla=req.body.tabla
    //console.log(tabla)
    if(tabla==1){
        db.query('select count(id_image) as largo from imagenes_Carros',(err,data)=>{
            return res.send(data);
        })
    }
    if(tabla==2){
        db.query('select count(id_image) as largo from imagenes_Casual',(err,data)=>{
            return res.send(data);
        })
    }  
})

server.get("/getImgCarros",(req,res)=>{
    const id=req.query.id
    console.log(req.query.id)
    db.query('select * from imagenes_Carros where id_image='+id,(err,data)=>{
        if(err){
            console.log('No encontro nada o no se pudo');
            return res.status(400).send('No se pudo')
        }
        if(data.length>0){
            //console.log('negros')
            res.setHeader('Content-Type',data[0].tipo_dato);
            res.send(data[0].datos)
        }else{
            res.send('No hay imagenes')
        }
    })
})

server.get("/getImgCasual",(req,res)=>{
    const id=req.query.id
    db.query('select * from imagenes_Casual where id_image='+id,(err,data)=>{
        res.setHeader('Content-Type',data[0].tipo_dato);
        res.send(data[0].datos)
    })
})

server.post('/addFav',(req,res)=>{
    const src=req.body.src;
    //console.log(req.body.src);
    const cookie=req.body.cookie;
    const deco=jsonwebtoken.verify(cookie,process.env.JWT_SECRET);
    let usuarioRevisar;
    db.query('select * from Usuario',(err,data)=>{
        usuarioRevisar=data.find(usuario=>usuario.email_usuario===deco.email);
        if(usuarioRevisar){
            //console.log(usuarioRevisar)
            const insert='insert into favoritos(fk_usuario, fk_imagen) values(?,?)'
            db.query(insert,[usuarioRevisar.id_usuario,src],(err,data)=>{
                if(err){
                    return console.log('No se pudo insertar',err)
                }else{
                    return res.status(200).redirect('/fav');
                }
            })
        }else{
            console.log('error')
        }
    })
})

server.post('/getFavorites',(req,res)=>{
    const cookie=req.body.cookie;
    //console.log(cookie)
    const deco=jsonwebtoken.verify(cookie,process.env.JWT_SECRET);
    //console.log(deco)
    let usuarioRevisar;
    db.query('select * from Usuario',(err,data)=>{
        usuarioRevisar=data.find(usuario=>usuario.email_usuario===deco.email);
        if(usuarioRevisar){
            db.query('select * from favoritos where fk_usuario='+usuarioRevisar.id_usuario,(error,datos)=>{
                if(error){
                    return res.status(400).send(error);
                }else{
                    //console.log(datos);
                    return res.status(200).send(datos);
                }
            })
        }else{
            return res.send('No se consulto')
        }
    })
})

server.post('/getUser',(req,res)=>{
    const cookie=req.body.cookie;
    const deco=jsonwebtoken.verify(cookie,process.env.JWT_SECRET);
    db.query('select * from Usuario',(err,data)=>{
        const usuarioRevisar=data.find(usuario=>usuario.email_usuario===deco.email);
        //console.log(usuarioRevisar)
        if(usuarioRevisar){
            return res.send(usuarioRevisar);
        }else{
            return console.log('error')
        }
    })
})

server.get('/downloadCarros',(req,res)=>{
    const srcImg=req.query.name;
    const idImg=srcImg.substring(17);
    //console.log(idImg);
    db.query('select * from imagenes_Carros where id_image='+idImg,(err,data)=>{
        if(err){
            console.log('Error en query');
            res.status(500).send('Error en el querry');
        }else if(data.length>0){
            const img=data[0];+
            res.setHeader('Content-Type', img.tipo_dato)
            res.setHeader('Content-Disposition','attachment; filename='+img.nombre);
            res.send(img.datos);         
        }else{
            res.status(404).send('Imagen no encontrada')
        }
    })
})

server.get('/downloadCasual',(req,res)=>{
    const srcImg=req.query.name;
    const idImg=srcImg.substring(17);
    //console.log(idImg);
    db.query('select * from imagenes_Casual where id_image='+idImg,(err,data)=>{
        if(err){
            console.log('Error en query');
            res.status(500).send('Error en el querry');
        }else if(data.length>0){
            const img=data[0];+
            res.setHeader('Content-Type', img.tipo_dato)
            res.setHeader('Content-Disposition','attachment; filename='+img.nombre);
            res.send(img.datos);         
        }else{
            res.status(404).send('Imagen no encontrada')
        }
    })
})

server.post('/delFav',(req,res)=>{
    const idUsr=req.body.id;
    const src=req.body.img;
    db.query('delete from favoritos where fk_usuario='+idUsr+' AND fk_imagen="'+src+'";',(err,data)=>{
        if(err){
            console.log(err);
            return res.status(400).send(err);
        }else{
            return res.status(200).send({message:'Se borro bien',redirect:'/fav'})
        }
    })
})