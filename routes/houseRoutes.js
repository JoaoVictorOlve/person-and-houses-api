const router = require('express').Router()
const Person = require('../models/Person')
const House = require('../models/House')

router.post('/', async (req, res)=>{

    const {street, city, state, cep, owner} = req.body

    if(!street || !city || !state || !cep || !owner){
        res.status(422).json({message: 'Parâmetro está faltando!'})
        return
    }
    if(typeof street !== "string" ||
       typeof city !== "string" ||
       typeof state !== "string" ||
       typeof cep !== "string" ||
       typeof owner !== "string"){

        res.status(422).json({message: 'Parâmetro possui tipagem errada!'})
        return
    }
    if(street.length > 50 ||
       city.length > 50 ||
       state.length > 20 ||
       cep.length > 20){
        res.status(422).json({message: 'Parâmetro com tamanho acima do permitido!'})
        return
    }

    const house = {
        street,
        city,
        state,
        cep,
        owner
    }

    try {
        let createdHouse = await House.create(house)
        let selectedOwner = await Person.findOne({_id: house.owner})
        selectedOwner.houses.push(createdHouse);
        selectedOwner.save();
        res.status(201).json({message: 'Casa inserida no sistema com sucesso!'})
    } catch(error){
        res.status(500).json({error: 'Erro interno no servidor!'})
    }
})

router.get('/', async(req, res)=>{

    try{
        const house = await House.find()
        res.status(200).json(house)
    }
    catch(error) {
        res.status(500).json({error:'Erro interno no servidor!'})
    }
})

router.get('/:id', async (req, res)=>{

    const id = req.params.id
    
    try {
        try {
            const house = await House.findOne({_id: id})
            if(house == null){
                res.status(404).json({error: "A casa não foi encontrado!"})
                return
            }
            res.status(200).json(house)
        } catch (error){
            res.status(404).json({error: "A casa não foi encontrado!"})
            return
        }
    } catch(error){
        res.status(500).json({error: 'Erro interno no servidor!'})
    }

})

router.patch('/:id', async(req, res)=>{
    
    const id = req.params.id
    const {street, city, state, cep, owner} = req.body
    const house = {
        street,
        city,
        state,
        cep,
        owner
    }
    try {
        try{
            await House.findOne({_id: id})
        } catch(error){
            res.status(404).json({ error: 'O usuário não foi encontrado!' });
            return
        }
        await House.updateOne({ _id: id }, house);
        res.status(200).json(house);
      } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor!' });
      }
})

router.delete('/:id', async(req, res)=>{

    const id = req.params.id

    try {
        try{
            let house = await House.findOne({_id: id})
        } catch(error){
            res.status(404).json({ error: 'O usuário não foi encontrado!' });
            return
        }
        let house = await House.findOne({_id: id})
        await House.deleteOne({_id: id})
        res.status(204).json({message : 'A casa foi removida com sucesso!'})
        
    } catch(error){
        res.status(500).json({error: 'Erro interno no servidor!'})
    }
})

module.exports = router