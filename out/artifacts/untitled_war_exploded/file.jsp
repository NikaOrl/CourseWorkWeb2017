
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>

<script>


    //get access to files on pc
    window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, errorHandler);

    function errorHandler(e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        }
        ;

        console.log('Error: ' + msg);
    }

    function onInitFs(fs) {

        fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.seek(fileWriter.length); // Start write position at EOF.

                // Create a new Blob and write it to log.txt.
                var blob = new Blob([prompt("enter name","Nika")], {type: 'text/plain'});

                fileWriter.write(blob);

            }, errorHandler);

        }, errorHandler);

        fs.root.getFile('log.txt', {}, function(fileEntry) {

            // Get a File object representing the file,
            // then use FileReader to read its contents.
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    var txtArea = document.createElement('textarea');
                    txtArea.value = this.result;
                    document.body.appendChild(txtArea);
                };

                reader.readAsText(file);
            }, errorHandler);

        }, errorHandler);

/*        fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

            fileEntry.remove(function() {
                console.log('File removed.');
            }, errorHandler);

        }, errorHandler);*/

    }


</script>

</body>
</html>
