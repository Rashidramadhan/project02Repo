import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

    app.use(expressCspHeader({
        directives: {
            'default-src': [SELF],
            'img-src': ['data:', 'images.com'],
            'worker-src': [NONE],
            'block-all-mixed-content': false
        }
    }));

    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    /****************************************start of my assignment************************************ */
    //   our main endpoint
    app.get('/filteredimage', async(req, res) => {
        const image_link = req.query.image_url.toString;
        if (!image_link){
            res.status(400).send(`The Image link is required`);
        }
         console.log('..........test...........');
        const filteredpath = await filterImageFromURL(image_link);
        res.status(200).sendFile(filteredpath, ()=>
        {
            deleteLocalFiles([filteredpath]);
        });
    });

    /***************************************end of my script assignment************************************* */
    //! END @TODO1

    // Root Endpoint
    // Displays a simple message to the user
    app.get( "/", async ( req, res ) => {
        res.send("try GET /filteredimage?image_url={{}}")
    } );


    // Start the Server
    app.listen( port, () => {
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    } );
})();