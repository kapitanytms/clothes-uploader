    var auth = firebase.auth();
    var storageRef = firebase.storage().ref();    


    new Vue({
        el: "#app",
        data: {
            gender: '',
            category: '',
            size: [],
            color: [], 
            imgPaths: [],
            price: 0,
            quantity: 0,
            gender: '',
            category: '',
            adult: false,
            name: ''
        },
        methods: {
            handleColorAddition: function(e) {
                this.color.push(e.target.value);
                console.log(this.color);
                e.target.value = '';
            },
            clearInputs: function() {
                this.size = [];
                this.color = [];
                this.imgPaths = [];
                this.price = 0;
                this.quantity = 0;
                this.adult = false;
                this.name = ''; 
                this.gender = '';
                this.category = '';                                  
            },
            handleFileSelect: function(e) {
                e.stopPropagation();
                e.preventDefault();
                var file = e.target.files[0];
                var metadata = {
                  'contentType': file.type
                };
                var app = this;
                storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
                  console.log('Uploaded', snapshot.totalBytes, 'bytes.');
                  console.log(snapshot.metadata);
                  var url = snapshot.downloadURL;
                  console.log('File available at', url);
                  app.imgPaths.push(url);
                }).catch(function(error) {
                  console.error('Upload failed:', error);
                })
                e.target.value = '';
              },
              handleNewCloth: function() { 
                var cloth = 
                {
                    gender: this.gender,
                    category: this.category,
                    size: this.size,
                    color: this.color, 
                    imgPaths: this.imgPaths,
                    price: this.price,
                    quantity: this.quantity,
                    gender: this.gender,
                    category: this.category,
                    adult: this.adult,
                    name: this.name
                }
                console.log(cloth);
                fetch('http://localhost:3000/product', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(cloth)
                    })
                    .then(function(res) {res.json();})
                    .then(function(temp) {console.log(temp)});       
                this.clearInputs();
            }
        },
        created: function() {
            auth.onAuthStateChanged(function(user) {
            if (user) {
                console.log('Anonymous user signed-in.', user);
                document.getElementById('file').disabled = false;
            } else {
                console.log('There was no anonymous session. Creating a new anonymous user.');
                // Sign the user in anonymously since accessing Storage requires the user to be authorized.
                auth.signInAnonymously();
            }
            });
        }
    });