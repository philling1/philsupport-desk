const asyncHandler = require('express-async-handler')
//const User = require('../models/userModels')
const Ticket = require('../models/ticketModels')

//@desc   Get user ticket
//@route  Get /api/tickets
//@access Private
const getTickets =  asyncHandler(async (req, res) => {
  //NOTE: no need to get the user, we already have them on req object from protect middleware. 
  //The protect middleware already checks for valid user.

  //Get User of th ticket using the id in the jwt
  // const user = await User.findById(req.user.id)

  // if(!user){
  //   res.status(401)
  //   throw new Error('User not found')
  // }

  const tickets = await Ticket.find({user: req.user.id})

  res.status(200).json(tickets)
})

//@desc   Get single ticket
//@route  Get /api/tickets/: id
//@access Private
const getTicket =  asyncHandler(async (req, res) => {
  //And the se=ame goes here as there is no need of getting the user also

  //Get User of th ticket using the id in the jwt
  // const user = await User.findById(req.user.id)

  // if(!user){
  //   res.status(401)
  //   throw new Error('User not found')
  // }

  const ticket = await Ticket.findById(req.params.id)

  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  if(ticket.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('Not Authorized')
  }

  res.status(200).json(ticket)
})


//@desc   create new ticket
//@route  POST /api/tickets
//@access Private
const createTicket =  asyncHandler(async (req, res) => {
  const {product, description} = req.body

  if(!product || !description){
    res.status(400)
    throw new Error('Please add a product and description')
  }

  //then getting the User of th ticket using the id in the jwt
  // const user = await User.findById(req.user.id)

  // if(!user){
  //   res.status(401)
  //   throw new Error('User not found')
  // }

  //Then creating the ticket 
  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: 'new'
  })

  res.status(201).json(ticket)
})

//@desc   Delete a ticket
//@route  DELETE /api/tickets/:id
//@access Private
const deleteTicket =  asyncHandler(async (req, res) => {
  //Get User of th ticket using the id in the jwt
  // const user = await User.findById(req.user.id)

  // if(!user){
  //   res.status(401)
  //   throw new Error('User not found')
  // }

  const ticket = await Ticket.findById(req.params.id)

  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  if(ticket.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('Not Authorized')
  }

  await ticket.remove()

  res.status(200).json({ success: true})
})

//@desc   Update single ticket
//@route  PUT /api/tickets/:id
//@access Private
const updateTicket =  asyncHandler(async (req, res) => {
  //Get User of th ticket using the id in the jwt
  // const user = await User.findById(req.user.id)

  // if(!user){
  //   res.status(401)
  //   throw new Error('User not found')
  // }

  const ticket = await Ticket.findById(req.params.id)

  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  if(ticket.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('Not Authorized')
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true})

  res.status(200).json(updatedTicket)
})

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket, 
}