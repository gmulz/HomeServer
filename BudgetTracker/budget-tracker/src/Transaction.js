import React, { Component } from 'react';
import './Transaction.css';

class Transaction extends Component{
	constructor(props){
		super(props);
		this.state = {
				editing: false
			};
		this.darkBlue = "#468";
		this.lightBlue = "#8AC";
		this.makeEditable = this.makeEditable.bind(this);
		this.unMakeEditable = this.unMakeEditable.bind(this);
		this.txnNameChange = this.txnNameChange.bind(this);
		this.txnCostChange = this.txnCostChange.bind(this);
		this.removeTxn = this.removeTxn.bind(this);
		this.handleKeyPressEdit = this.handleKeyPressEdit.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		
	}

	render(){
		return (
			<li className="Transaction" 
				style={{backgroundColor: (this.props.parity) ? this.darkBlue : this.lightBlue}}
				ref={(node) => {this.node = node}}>
				<div className="Transaction-title" > 
					<span style={{display: (this.state.editing ? "none" : "")}}> {this.props.txn.title} </span>
					<button className="edit-button" onClick={this.makeEditable}
						style={{display: (this.state.editing ? "none" : "")}}> edit </button>
					<div className="Transaction-edit-area" style={{display: (this.state.editing ? "" : "none")}}>
						<input type="text" className="form-control"
							value={this.props.txn.title}
							ref={ (input) => {this.txnNameInput = input}}
							onChange={this.txnNameChange}
							onKeyPress={this.handleKeyPressEdit}
							placeholder="Enter title" />
						<button className="delete-button" onClick={this.removeTxn}> delete </button>
					</div>
				</div>
				<div className="Transaction-cost" > 
					<span style={{display: (this.state.editing ? "none" : "")}}> {this.props.txn.cost} </span>
					{/*<button className="edit-button" onClick={this.makeEditable}
						style={{display: (this.state.editing ? "none" : "")}}> edit </button>*/}

					<div className="Transaction-edit-area" style={{display: (this.state.editing ? "" : "none")}}>
						<input type="text" className="form-control"
							value={this.props.txn.cost}
							ref={ (input) => {this.txnCostInput = input}}
							onChange={this.txnCostChange}
							onKeyPress={this.handleKeyPressEdit}
							placeholder="Enter title" />
					</div>
				</div>

			</li>

			);
	}

	removeTxn(){
		this.unMakeEditable();
		this.props.deleteMe(this.props.idx);
	}

	makeEditable(){
		document.addEventListener('click', this.handleOutsideClick, false);
		this.setState({editing: true});
	}

	unMakeEditable(){
		document.removeEventListener('click', this.handleOutsideClick, false);
		this.setState({editing: false});
		this.props.triggerUpdate();
	}

	txnNameChange(){
		var title = this.txnNameInput.value;
		if(title){
			this.props.txn.title = title;
			this.forceUpdate();
		}
	}

	txnCostChange(){
		var strval = this.txnCostInput.value;
		var cost = parseFloat(this.txnCostInput.value);
		console.log(cost);
		if(cost || strval === ''){
			if(cost){
				this.props.txn.cost = cost;
			} else {
				this.props.txn.cost = '';
			}
			this.forceUpdate();
			// this.props.triggerUpdate();
		}
	}

	handleKeyPressEdit(event){
		if(event.key === 'Enter'){
			var cost = parseFloat(this.txnCostInput.value);
			var title = this.txnNameInput.value;

			if(cost && title){
				this.unMakeEditable();
	
			}

		}
	}

	handleOutsideClick(event){
		if(!this.node.contains(event.target)){
			// this.unMakeEditable();
			this.handleKeyPressEdit({key: 'Enter'});
		}
	}
}

export default Transaction;