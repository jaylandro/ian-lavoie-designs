var cloudinary = require('cloudinary').v2;

module.exports = () => {
return cloudinary.search
    .expression('folder:ianlavoiedesigns')
    .sort_by('filename','asc')
    .execute()
    .then(result => {
        let filenames = result.resources.map(file => `${file.filename}.${file.format}`)

        console.log("Website photos", filenames);
        return filenames
    })
    .catch(err => console.error(err));
}
