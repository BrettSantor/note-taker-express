//todo require dependecies
const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const generate = require('meaningful-string');
const options = {
    'numberUpTo': 1000,
    'joinBy': '-'
};

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination} 👾`)
  );

  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// get / <=== returns landing page
app.get('', (req, res) =>
res.sendFile(path.join(__dirname, './public/index.html')
));

// 'get /notes' <=== returns note page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});


    // 'get /api/notes' <=== read db.json and return all saved notes as JSON
    app.get('/api/notes', (req, res) => {
        readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    })
    // post /api/notes recieves new note reads and appends to file with readAndAppend function
    app.post('/api/notes', (req, res) => {
        const { title, text} = req.body;

        if(req.body) {
            const newNote = {
                title,
                text,
                id: generate.meaningful(options)
            };
            readAndAppend(newNote, './db/db.json');
            res.send('Note added 👾');
        } else {
            res.error('Error in adding note ☠')
        }
    })

app.delete('/api/notes/:id', (req, res) =>{
    let deadNoteId = req.params.id
    fs.readFile('./db/db.json',  function(err, data) {
        if(err){
            console.log(err);
        }else{
            var noteArr = JSON.parse(data)
            var newArr = noteArr.filter(note => note.id !== deadNoteId);
        writeToFile('./db/db.json', newArr)
        }
        
});
   
    

res.send('DELETE request called ☠')
})

// 'get *' <=== returns landing page
app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, './public/index.html')
));

        app.listen(PORT, () =>
  console.info(`App listening at http://localhost:${PORT} 👾`)
);