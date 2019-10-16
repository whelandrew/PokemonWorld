import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./PokemonWorld.css";

import grass from "./assets/grasstile.png";
import block from "./assets/rocktile.png";
import start from "./assets/bulbasaur.png";
import end from "./assets/finishtile.png";

class PokemonWorld extends React.Component {	
	constructor(props) {
		super(props);	
		
		this.state={
			gridSize:4, //set size of display grid
			locations:[], //list of locations of all squares
			UIMode:0, //1 block 2 start 3 exit	
			start:{},
			end:{},
			blocks: [],
			path: []
		}
	}
	
	changeGridSize(e){
		this.setState({locations:[]})
		this.setState({gridSize:e.target.value})
	}
	
	setUIMode(val){		
		this.setState({UIMode:val});
	}
	
	checkUIMode(e){
		//selected ui button
		let val = this.state.UIMode;
		
		//selected map square
		let el = document.getElementById(e);
		let loc = el.id.match(/\d+/g).map(Number);
		
		
		if(val===1) { //convert to block						
			el.childNodes[0].src=block;		
			this.state.blocks.unshift({x:loc[0], y:loc[1]});
		}
		if(val===2) { //convert to start
			el.childNodes[0].src=start;			
			this.state.start["x"]=loc[0];
			this.state.start["y"]=loc[1];
			this.setState({UIMode:0});
		}
		if(val===3) { //convert to end
			el.childNodes[0].src=end;
			this.state.end["x"]=loc[0];
			this.state.end["y"]=loc[1];
			this.setState({UIMode:0});
		}
		
		//assign val to el
		el.value=val;
	}
	
	ShowPath(i){				
		//with an array of directions, display path direction
		this.setState({path:i});
		
		let next = this.state.start;
		let finish = this.state.end;
		this.state.path.moves.forEach((val)=>		
		{
			if(val=="D"){
				next.y--;
			}
			if(val=="U"){
				next.y++;
			}
			if(val=="L"){
				next.x--;
			}
			if(val=="R"){
				next.x++;				
			}
			
			//recolor all squares that are in path
			document.getElementById("(" + next.x + "," + next.y + ")").style.border = "1px solid white";
		})
	}
	
	GetPath()
	{	
		//fetch calculated path from server
		let input = {sideLength:this.state.gridSize, impassables:this.state.blocks, startingLoc:this.state.start, endingLoc:this.state.end};	
		
		if(input.impassables.length <= 0 || input.startingLoc.length <= 0 || input.endingLoc.length <= 0)
		{
			alert("Not enough information");
			return;
		}
		
		fetch(fetch("https://frozen-reef-96768.herokuapp.com/find-path", {
			method: 'POST',  
			body: JSON.stringify(input),  
			headers:{
				'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(response => this.ShowPath(response))
			.catch(error => console.error('Error:', error)));		
	}
	
	renderSquare(){		
	//render the squares in a grid form
		let grid =[];	  		
	  for(let i=0;i<this.state.gridSize;i++){		  
		  let children = [];
		  for(let j=0;j<this.state.gridSize;j++){	
				let _id="("+i+","+j+")";
				this.state.locations.push(_id[i,j]);
			  children.push(<td><button className="square" id={_id} onClick={()=>{this.checkUIMode(_id)}}><img src={grass} /></button></td>);
		  }
		grid.push(<tr>{children}</tr>);		
	}
	return grid;
  }	 
	
	render() {
		return (<div className="game">
			<div className="game-board">	
				<div>
					<div id="mapSize" onChange={this.changeGridSize.bind(this)}> Map Size <select>
						  <option value="4">4x4</option>
						  <option value="5">5x5</option>
						  <option value="6">6x6</option>
						  <option value="7">7x7</option>
						  <option value="8">8x8</option>
						</select>
					</div>
					<button id="blockButton" onClick={()=>{this.setUIMode(1)}}> <img src={block} /> Block</button>
					<button id="startButtion" onClick={()=>{this.setUIMode(2)}}> <img src={start} /> Start</button>
					<button id="endButtoin" onClick={()=>{this.setUIMode(3)}}> <img src={end} /> End</button>
					
				</div>
			
				<div className="grid">  
					{this.renderSquare()}		
				</div>
			</div>
			<button onClick={()=>this.GetPath()}>Calculate Path</button>
			<button onClick={()=>location.reload()}>Reset</button>
      </div>
	  );
	}
}

export default PokemonWorld;

const wrapper = document.getElementById("create-template");
wrapper ? ReactDOM.render(<PokemonWorld />, wrapper) : false;