const router = require('express').Router()
const Person = require('../models/Person')
const House = require('../models/House')

router.post('/', async (req, res, next)=>{

    try{
        const {name, age} = req.body;

        if(!name || !age){
            res.status(422).json({message: 'Parâmetro está faltando!'})
            return
        }
        if(typeof name !== "string" || typeof age !== "number"){
            res.status(422).json({message: 'Parâmetro possui tipagem errada!'})
            return
        }
        if(name.length > 50 || age.length > 3){
            res.status(422).json({message: 'Parâmetro com tamanho acima do permitido!'})
            return
        }

        const person = {
            name,
            age
        }
      
        try {
            await Person.create(person)
            res.status(201).json({message: 'Pessoa inserida no sistema com sucesso!'})
        } catch(error){
            throw new Error('Algo deu errado');
        }
    }
    catch(error){
        res.status(500).json({error: "Erro no servidor"})
    }
})

router.get('/', async(req, res)=>{

    try{
        const people = await Person.find().populate('houses')
        res.status(200).json(people)
    }
    catch(error) {
        res.status(500).json({error:'Erro interno no servidor!'})
    }
})

router.get('/:id', async (req, res)=>{

    const id = req.params.id
    
    try {
        try {
            const person = await Person.findOne({_id: id}).populate('houses')
            if (person == null){
                res.status(404).json({error: "O usuário não foi encontrado!"})
                return
            }
            res.status(200).json(person)
        } catch (error){
            res.status(404).json({error: "O usuário não foi encontrado!"})
            return
        }
    } catch(error){
        res.status(500).json({error: 'Erro interno no servidor!'})
    }

})

router.patch('/:id', async(req, res)=>{
    
    const id = req.params.id
    const {name, salary, approved} = req.body
    const person = {
        name,
        salary,
        approved,
    }

    try {
        try{
            await Person.findOne({_id: id})
            if (person == null){
                res.status(404).json({error: "O usuário não foi encontrado!"})
                return
            }
        } catch(error){
            res.status(404).json({ error: 'O usuário não foi encontrado!' });
            return
        }
        await Person.updateOne({ _id: id }, person);
        res.status(200).json(person);
      } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor!' });
      }
})

router.delete('/:id', async(req, res)=>{

    const id = req.params.id

    try {
        try{
            await Person.findOne({_id: id})
            if (person == null){
                res.status(404).json({error: "O usuário não foi encontrado!"})
                return
            }
        } catch(error){
            res.status(404).json({ error: 'O usuário não foi encontrado!' });
            return
        }
        await Person.deleteOne({_id: id})

        try{
        const houses = await House.find({ owner: id });
        for(house of houses){
            await House.deleteOne({ _id: house._id})
        }
        }catch(error){
        }

        res.status(204).json({message : 'O usuário foi removido com sucesso!'})

    } catch(error){
        res.status(500).json({error: 'Erro interno no servidor!'})
    }
})

module.exports = router