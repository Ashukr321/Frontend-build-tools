
## what is the build tool and what it does 
1. 
build tool take our raw source code and transform into runnable application that understand by the browser 
there are several modern build tool available in the market 
1. vite 
2. webpack 
3. esbuild


## process of build tool :
1. transpilation : converting the row es6 or typescript code or jsx code into html css javascript that older version can
also understand 
2. bundling : combining hundres of small code files into one or two large file to reduce the number of http 
request 
3. minification : removing the white space and comments from the code to reduce the file size 
4. assets optimization :  compressing the images and converting sass/less into standard css code 
5. tree shaking ( remove the dead code ( unused code)) : removing the unused code from the final bundle so it reduce the line of code
6. HMR : hot module Replacement : Automatically update the browser when we make any changes in the code : >


## working of the HMR : 
1. file modification : when the developer make any changes in the code then the build tool detect  that changes 
3. delta calcalation : build tool ( bundler ) calculate the delta ( changes ) between the old and new code 
3. code replacement : build tool replace the old code with the new code in the memory  ( code running )
3. refresh the browser : build tool refresh the browser to show the updated code  : without page reload  the web pages 

it means our react applications is server from the memory whene we run the build tool  bundle it and send to the browser  


## Serving from Memory:
when we run the cmd : npm run dev  what it does 
the bundler does not create the dist build file instead 

the bundler create the bundle and keep it in the ram 
and create a local developement server it may run on port 5173 and 3000 
and when browser ask for index.html file browser read from the ram and serve it to the browser  

