what you have to do to react app to make it make work:
- add ./budget_app/build in front of all links in the index.html
- in service-worker.js, add dots before the /static
- in the main.js, change the service-worker.js to have a dot in front of it

stuff to get angular to work:
- change the base href to the project path (eg kitchen_app/dist/)