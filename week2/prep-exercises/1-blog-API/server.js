const express = require('express')
const fs = require('fs');
const app = express();
 

app.use(express.json());
// YOUR CODE GOES IN HERE
app.get('/', function (req, res) {
  res.send('Hello World')
})


app.post('/blogs', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).end('Title and content are required');
    return;
  }

  // save the blog to a file
  fs.writeFileSync(`blog ${title}.txt`,  content );
  res.end('ok')

});

// get all blogs
app.get('/blogs', (req, res) => {
  const files = fs.readdirSync(__dirname);
  const blogs = files.filter(file => file.startsWith('blog')).map(file => {
    return {
      title: file,
      content: fs.readFileSync(file, 'utf-8')
    }
  });
  res.json(blogs);
});

// update a blog
app.put('/blogs/:title', (req, res) => {
  const { title } = req.params;
  const { content } = req.body;
  if (fs.existsSync(title)) {
    if (!content) {
      res.status(400).end('Content is required');
      return;
    }
    fs.writeFileSync(title, content);
    res.end('ok');
  } else {

    res.status(404).end('Blog not found');
    return;
  }
});

// delete a blog
app.delete('/blogs/:title', (req, res) => {
  const { title } = req.params;
  if (fs.existsSync(title)) {
    fs.unlinkSync(title);
    res.end('ok');
  }
  else {
    res.status(404).end('Blog not found');
  }
});

// get a blog
app.get('/blogs/:title', (req, res) => {
  const { title } = req.params;
  if (fs.existsSync(title)) {
    res.json({
      title,
      content: fs.readFileSync(title, 'utf-8')
    });
  } else {
    res.status(404).end('Blog not found');
  }
});

 
app.listen(3000)