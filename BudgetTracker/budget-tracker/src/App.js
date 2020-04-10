import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Category from './Category.js'
import FileInput from 'react-file-input';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.url = 'http://localhost:4000';
    this.state = {data : [],
                monthlies: [{transactions: [], name: "Monthlies"}],
                sum : 0,
                newCategory: "",
                dirty: false
              };
    this.categorySet = new Set();
    this.months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
    this.fileName = "";
    this.getDataFromServer = this.getDataFromServer.bind(this);
    this.getDataFromServer();
    var now = new Date();
    var night = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    var msToMidnight = night.getTime() - now.getTime();
    setTimeout('document.location.refresh()', msToMidnight);
  }

  render() {
    var meh = (
      <div className="App">
        <div className="App-header">
          <h1> Budget Tracker </h1>
          <form>

            <input id="save" type="button" className="App-header-btn" onClick={this.sendDataToServer.bind(this)} />
            <label htmlFor="save" style={{background: (this.state.dirty ? "#F00" : "#047")}}> Save </label>

            <input id="upload" className="App-header-btn" type="file" accept=".csv" onChange={this.parseCSV.bind(this)} />
            <label htmlFor="upload"> Choose Budget</label>


          </form>
        </div>
        <div className="App-body">
          <label id="super-total">Super Total: {this.sumData()}</label>
          
          <div className="category-area"> 
            <div className="category-title">
              <h2> Categories </h2> 
                <input type="text" className="form-control"
                        placeholder="Add category" 
                        onChange={this.catNameChange.bind(this)} 
                        onKeyPress={this.handleKeyPress.bind(this)}
                        value={this.state.newCategory}/>
                <button className="add-button" onClick={this.addCategory.bind(this)}> + </button>
            </div>
            {this.renderData()}
          </div>

          <div className="monthly-area">
            <h2> Monthlies </h2>
            {this.renderMonthlies()}
          </div>
        </div>

      </div>
    );
    return meh;
  }

  notifyChange(){
    this.setState({dirty: true});
  }

  addTxn(){
    this.setState({data: this.state.data,
                  dirty: true});
  }

  deleteTxn(){
    this.setState({data: this.state.data,
                   dirty: true});
  }


  handleKeyPress(event){
    if(event.key === 'Enter'){
      this.addCategory();
    }
  }

  downloadCSV(){
    var csvContent = "data:text/csv;charset=utf-8,"
    var longestTxnLength = 0;
    console.log("downloadin");

    //first loop is add all the category headers and find largest txn array
    for(var i = 0; i < this.state.data.length; i++){
      var catName = this.state.data[i].name;
      var catLength = this.state.data[i].transactions.length;
      csvContent += catName + ",Cost" + ((i == this.state.data.length - 1) ? "" : ",");
      if(catLength > longestTxnLength){
        longestTxnLength = catLength;
      }

    }
    csvContent += "\n";
    //probably always going to be food

    //next loop over the length of the largest txn array over all categories,
    //adding transactions if they exist
    for(var i = 0; i < longestTxnLength; i++){
      for(var j = 0; j < this.state.data.length; j++){
        var txn = this.state.data[j].transactions[i];
        if(txn){
          csvContent += txn.title + "," + txn.cost + ((j == this.state.data.length - 1) ? "" : ",");
        }
        else{
          csvContent += ",,";
        }
      }
      csvContent += "\n";
    }
    var encodedURI = encodeURI(csvContent);
    window.open(encodedURI);
  }

  catNameChange(event){ //the input field, not an individual one
    this.setState({newCategory: event.target.value});
  }



  addCategory() {
    var newCatName = this.state.newCategory;
    if(newCatName && !this.categorySet.has(newCatName)){
      var newCategory = {name: newCatName, transactions: []};
      this.categorySet.add(newCatName);
      var data = this.state.data;
      data.unshift(newCategory);
      this.setState({data: data, newCategory: "", dirty: true});
      // console.log(this.state.data);
      // this.forceUpdate();
    }
  }

  deleteCategory(idx){
    var data = this.state.data;
    var cat = data.splice(idx, 1)[0];
    this.categorySet.delete(cat.name);
    this.setState({data: data, dirty: true});
  }

  moveCategoryUp(idx){
    var data = this.state.data;
    if(idx - 1 < 0){
      return;
    }
    var cat = data.splice(idx, 1)[0];
    data.splice(idx - 1, 0, cat);
    this.setState({data: data, dirty: true});
  }

  moveCategoryDown(idx){
    var data = this.state.data;
    if(idx + 1 > data.length){
      return;
    }
    var cat = data.splice(idx, 1)[0];
    data.splice(idx + 1, 0, cat);
    this.setState({data: data, dirty: true});
  }

  renderData(){
    var ret = this.state.data.map((category, index) => 
      <Category cat={category} 
                onAddTxn={this.addTxn.bind(this)} 
                key={category.name} 
                idx={index}
                deleteMe={this.deleteCategory.bind(this)}
                onDeleteTxn={this.deleteTxn.bind(this)} 
                moveUp={this.moveCategoryUp.bind(this)}
                moveDown={this.moveCategoryDown.bind(this)}
                notifyChange={this.notifyChange.bind(this)}
                setOpen={false}/>
      );


    this.categories = ret;
    return ret;
  }

  renderMonthlies(){
    var ret = this.state.monthlies.map((monthly, index) =>
      <Category cat={monthly} 
                onAddTxn={this.addMonthly.bind(this)}
                onDeleteTxn={this.deleteMonthly.bind(this)}
                key={monthly.name}
                idx={9999}
                notifyChange={this.notifyChange.bind(this)}
                setOpen={true}/>
        )
    return ret;
  }

  addMonthly(){
    this.setState({monthlies: this.state.monthlies,
                   dirty: true});
  }

  deleteMonthly(){
    this.setState({monthlies: this.state.monthlies,
                  dirty: true});
  }

  onDataLoaded(data){
    this.setState({data : data})
    // console.log(this.state.data);
    // this.updateDataValues();
  }


  sumData(){
    var sum = 0;
    for(var i = 0; i < this.state.data.length; i++){
      var category = this.state.data[i];
      var transactions = category.transactions;
      for(var j = 0; j < transactions.length; j++){
        sum += transactions[j].cost;
      }
    }

    var monthlies = this.state.monthlies[0].transactions;
    for(var i = 0; i < monthlies.length; i++){
      sum += monthlies[i].cost;
    }
    return sum
  }

  parseCSV(event){
    var file = event.target.files[0];
    console.log(file);
    this.fileName = file.name.split(".")[0];
    var reader = new FileReader();
    var self = this;
    reader.onload = function(progressEvent){
      var text = this.result;
      var lines = text.split('\n');
      //Parse first line
      var header = lines[0];
      var headings = header.split(',');
      var data = [];
      this.categorySet = new Set();
      for (var headingNum = 0; headingNum < headings.length; headingNum += 2){
        var heading = headings[headingNum];
        var categoryObj = {
          name: heading,
          transactions: []
        };
        this.categorySet.add(categoryObj.name);
        data.push(categoryObj);
      }
      //Parse rest
      for (var lineNum = 1; lineNum < lines.length; lineNum++){
        var line = lines[lineNum];
        var elements = line.split(',');
        for(var elNum = 0; elNum < elements.length; elNum += 2){
          var d = elements[elNum];
          if(!d){
            continue;
          }
          var c = elements[elNum + 1];
          var transaction = {
            title: d,
            cost: parseFloat(c)
          }
          data[elNum/2].transactions.push(transaction);
        }
      }
      //call reload page data
      self.onDataLoaded(data);
    }
    reader.readAsText(file);
  }

  sendDataToServer(){
    var now = new Date();
    var filename = this.fileName != "" ? this.fileName : this.months[now.getMonth()] + now.getFullYear();
    axios.post(`${this.url}/budget`,{
      filename: filename,
      data: this.state.data,
      monthlies: this.state.monthlies
    }).then(function (response){
      console.log(response);
      if(response.status == 200){
        this.setState({dirty: false});
      }
    }.bind(this));
  }

  getDataFromServer(){
    var now = new Date();
    var filename = this.months[now.getMonth()] + now.getFullYear();
    axios.get(`${this.url}/budget`,{
        params: {
          filename: filename
        }
    }).then(function (response){
        console.log(response);
        if(response.status == 200){
          var data = response.data.data;
          var monthlies = response.data.monthlies;
          this.setState({data: data, dirty: false, monthlies: monthlies});
        }

      }.bind(this));
  }

}

export default App;
