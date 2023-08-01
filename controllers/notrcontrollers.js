const Note = require('../models/noteModel')

const allnotes = (req, res) => {
    Note.find().sort({ createdAt: -1})
    .then((result) => {
        
        res.render('dashboard/dashboard', { user: "John", title: 'All notes', notes: result, isSearch: false })
    }).catch((err) => {
        console.log(err)
    })
 
}

const getsingle_note = (req, res) => {
    const id = req.params.id
    Note.findById(id)
    .then((result) => {
        res.render('dashboard/details', { title: result.title, notes: result })
    }).catch((err) => {
        console.log(err)
    })
}

const addnew_note = (req, res) => {
    
    res.render('dashboard/addNew', { title: "new note", result: {title: '', body: '', id: ''}, type: 'post'})
}
const post_note = (req, res) => {
    const deets = {
        author: "michael",
        pin: false
       
    };

    const newNote = {
        ...req.body,
        ...deets
    }

    const note = new Note(newNote)
    note.save().then((result) => {
        res.redirect('/')
    }).catch((err) => {
        console.log(err)
    })
    
}

const delete_note = (req, res) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect: '/notes'})
        
    }).catch((err) => {
        console.log(err)
    })
    
}

const pin_note = (req, res) => {
    const id = req.params.id

    Note.findByIdAndUpdate(id, {pin: true})
    .then((result) => {
        res.json({redirect: '/notes'})
    })
    .catch((err) => console.log(err))
}

const unpin_note = (req, res) => {
    const id = req.params.id

    Note.findByIdAndUpdate(id, {pin: false})
    .then((result) => {
        res.json({redirect: '/notes'})
    })
    .catch((err) => console.log(err))
}

const edit_note = async (req, res) => {
    const id = req.params.id

    try {
        const re = await Note.findById(id)
        res.render('dashboard/addNew', {result: re, title: 'Edit Note', type: 'update'})
    }catch(err) {
        res.status(404).send(err)
    }

}

const update_note = async (req, res) => {

    const id = req.params.id

    try {
        await Note.findByIdAndUpdate(id, {title: req.body.title, body: req.body.body})
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}

const handle_search = async (req, res) => {
    const searchchQuery = req.query.term

    try {
        const search = await Note.find()

        const searchresult = search.filter((sres) => {
             return sres.body.includes(searchchQuery) || sres.title.includes(searchchQuery)
        })
        
        
        res.render('dashboard/dashboard', {notes: searchresult, isSearch: true, title: "Search result", user: "Eniola"})
        
    }catch(error) {
        console.log(error.message)
    }

}


module.exports = {
    allnotes,
    getsingle_note,
    addnew_note,
    post_note,
    delete_note,
    pin_note,
    handle_search,
    unpin_note,
    edit_note,
    update_note,
    
}

