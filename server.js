const express = require('express');
const app = express();
const fs = require('fs');
const random = require('random');

class Contenedor{
    constructor(archivo){
        this.archivo = archivo;
    }
    async save(producto){
        let productosObj = await this.getAll();
        productosObj.push(producto);
        await fs.promises.writeFile(this.archivo,JSON.stringify(productosObj));
    }
    async getAll(){
        let productos = await fs.promises.readFile(this.archivo);
        let productosObj = JSON.parse(productos);
        return productosObj;
        
    }

    async getById(id){
        let productos = await this.getAll();
        let productoRetornado = await productos.find((prod)=>prod.id==id);
        console.log(productoRetornado);
        return productoRetornado;
    }

    async deleteById(id){
        let productos = await this.getAll();
        let nuevaListaProductos = productos.filter((prod)=>prod.id!==id);
        console.log(nuevaListaProductos);
        await fs.promises.writeFile(this.archivo,JSON.stringify(nuevaListaProductos));
    }
    async deleteAll(){
        await fs.promises.writeFile(this.archivo,'[]');
    }

    async getLength(){
        let list = await this.getAll();
        return await list.length;
    }

}

let contenedor = new Contenedor('productos.txt');

const getProductos = async ()=>{
    listaProductos = JSON.stringify(await contenedor.getAll());
    return listaProductos;
}

const getProductoRandom = async (min,max)=>{
    let id = Math.floor( Math.random()*( max-min + 1) + min )
    let productoRandom = JSON.stringify(await contenedor.getById(id));
    return productoRandom;
}



app.get('/', (req, res) => {
    res.send(`Raíz`);
})

app.get('/productos',async (req, res) => {
    res.send(`La lista de productos es: ${await getProductos().catch("No se pudo obtener la lista")}`);
})

app.get('/productoRandom',async (req, res) => {
    res.send(`El Producto al Azar es: ${await getProductoRandom(1,await contenedor.getLength()).catch("No se pudo obtener el producto")}`);
})


const PORT = process.env.port || 8080;
const server = app.listen(PORT,()=>{console.log('server runing')});
server.on('error',error=>console.log(`Error ${error}`));
