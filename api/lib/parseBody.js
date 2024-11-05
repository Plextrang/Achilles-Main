const getRequestBody = (req, res) => {
    console.log("THIS IS COMING FROM THE PARSEBODY FILE!")
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          // Parse the body string as JSON
          console.log("(parseBody) this is the unparsed body \n", body)
          const parsedBody = JSON.parse(body);
          resolve(parsedBody);
        } catch (error) {
            res.writeHead(500, { 'Content-Type' : 'application/json' });
          reject(error);
        }
      });
      req.on('error', (err) => {
        reject(err);
      });
    });
};

module.exports = { getRequestBody };