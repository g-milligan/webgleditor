# webgleditor
Another just for fun experiment; WebGL editor that leverages codemirror.js 

------


#For developers
here are some steps to get setup with a local development copy of this project:

- Pull the project files into a local "webgleditor" folder

In order to compile this project, for development, you must have Node.js and Gulp.
Run the following commands to get setup with **Node.js** and **Gulp**...

**1) Install HomeBrew:**

``ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"``

**2) Install Node.js:**

``brew install node``

**3) Install Gulp globally:**

``npm install -g gulp``

**4) Install the dependences** (specified in the project's package.json file).
Just navigate to the directory that contains package.json and run the command:

``npm install``

**5) Compile/Launch the application** in a browser. The "gulp" command will compile the project
and open it in your default browser. Run the command in the directory that contains gulpfile.js:

``gulp``
